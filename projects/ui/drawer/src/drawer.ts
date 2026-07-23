import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  Input,
  output,
  ViewChild,
} from '@angular/core';
import type {
  AfterViewChecked,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

export type UiDrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type UiDrawerSize = 'sm' | 'md' | 'lg';

let nextDrawerId = 0;
const drawerStacks = new WeakMap<Document, UiDrawerComponent[]>();
const scrollLocks = new WeakMap<Document, { count: number; readonly previousOverflow: string }>();

const POSITION_CLASSES: Record<UiDrawerPosition, string> = {
  left: 'inset-y-0 left-0 h-full border-r',
  right: 'inset-y-0 right-0 h-full border-l',
  top: 'inset-x-0 top-0 w-full border-b',
  bottom: 'inset-x-0 bottom-0 w-full border-t',
};

const SIDE_SIZE_CLASSES: Record<UiDrawerSize, string> = {
  sm: 'w-[min(var(--ui-drawer-width-sm,20rem),calc(100vw-2rem))]',
  md: 'w-[min(var(--ui-drawer-width-md,28rem),calc(100vw-2rem))]',
  lg: 'w-[min(var(--ui-drawer-width-lg,36rem),calc(100vw-2rem))]',
};

const VERTICAL_SIZE_CLASSES: Record<UiDrawerSize, string> = {
  sm: 'h-[min(var(--ui-drawer-height-sm,16rem),calc(100dvh-2rem))]',
  md: 'h-[min(var(--ui-drawer-height-md,24rem),calc(100dvh-2rem))]',
  lg: 'h-[min(var(--ui-drawer-height-lg,32rem),calc(100dvh-2rem))]',
};

@Component({
  selector: 'ui-drawer',
  standalone: true,
  template: `
    @if (open) {
      <div class="fixed inset-0 z-[900]">
        <div
          class="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
          aria-hidden="true"
          (click)="handleBackdropClick($event)"
        ></div>
        <section
          #panel
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          [id]="drawerId"
          [attr.aria-label]="ariaLabel || null"
          [attr.aria-labelledby]="ariaLabel ? null : titleId || null"
          [attr.aria-describedby]="descriptionId || null"
          [class]="panelClasses"
        >
          <header
            class="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800"
          >
            <div
              [id]="titleId"
              class="min-w-0 text-base font-semibold text-slate-950 dark:text-slate-50"
            >
              <ng-content select="[uiDrawerHeader]" />
            </div>
            <button
              type="button"
              class="-mr-1 rounded-[var(--ui-control-radius,0.625rem)] p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              [attr.aria-label]="closeAriaLabel"
              (click)="close()"
            >
              <svg
                class="size-5 fill-none stroke-current"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>
          <div
            class="min-h-0 flex-1 overflow-auto px-5 py-4 text-sm text-slate-700 dark:text-slate-200"
          >
            <ng-content />
          </div>
          <footer
            class="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800"
          >
            <ng-content select="[uiDrawerFooter]" />
          </footer>
        </section>
      </div>
    }
  `,
  host: { '(document:keydown)': 'handleKeydown($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDrawerComponent implements AfterViewChecked, OnChanges, OnDestroy {
  @Input({ transform: booleanAttribute }) open = false;
  @Input() position: UiDrawerPosition = 'right';
  @Input() size: UiDrawerSize = 'md';
  @Input() drawerId = `ui-drawer-${++nextDrawerId}`;
  @Input() titleId = `${this.drawerId}-title`;
  @Input() descriptionId = '';
  @Input() ariaLabel = '';
  @Input() closeAriaLabel = 'Close drawer';
  @Input() initialFocus = '';
  @Input({ transform: booleanAttribute }) closeOnBackdrop = true;
  @Input({ transform: booleanAttribute }) closeOnEscape = true;
  @Input({ transform: booleanAttribute }) restoreFocus = true;
  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropClick = output<MouseEvent>();
  readonly escapeKeyDown = output<KeyboardEvent>();

  @ViewChild('panel') private readonly panelRef?: ElementRef<HTMLElement>;
  private readonly document = inject(DOCUMENT);
  private previouslyFocused: HTMLElement | null = null;
  private shouldFocus = false;
  private registered = false;
  private scrollLocked = false;

  protected get panelClasses(): string {
    const sizing =
      this.position === 'left' || this.position === 'right'
        ? SIDE_SIZE_CLASSES[this.size]
        : VERTICAL_SIZE_CLASSES[this.size];
    return `absolute flex flex-col overflow-hidden border-slate-200 bg-white shadow-2xl shadow-slate-950/20 outline-none dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/50 ${POSITION_CLASSES[this.position]} ${sizing}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.previouslyFocused = this.document.activeElement as HTMLElement | null;
      this.register();
      this.lockScroll();
      this.shouldFocus = true;
      this.opened.emit();
    } else if (changes['open']?.previousValue === true && changes['open']?.currentValue === false) {
      const wasTopmost = this.isTopmost();
      this.unregister();
      this.unlockScroll();
      this.closed.emit();
      if (wasTopmost && this.restoreFocus) this.previouslyFocused?.focus();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.open || !this.shouldFocus) return;
    this.shouldFocus = false;
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const requested = this.initialFocus ? this.safeQuery(panel, this.initialFocus) : null;
    (requested ?? this.focusable(panel)[0] ?? panel).focus();
  }

  ngOnDestroy(): void {
    if (!this.registered) return;
    const wasTopmost = this.isTopmost();
    this.unregister();
    this.unlockScroll();
    if (wasTopmost && this.restoreFocus) this.previouslyFocused?.focus();
  }

  protected handleBackdropClick(event: MouseEvent): void {
    this.backdropClick.emit(event);
    if (this.closeOnBackdrop) this.close();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!this.open || !this.isTopmost()) return;
    if (event.key === 'Escape' && this.closeOnEscape) {
      event.preventDefault();
      this.escapeKeyDown.emit(event);
      this.close();
    } else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  protected close(): void {
    if (this.open) this.openChange.emit(false);
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const items = this.focusable(panel);
    if (!items.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = this.document.activeElement;
    if (!(active instanceof HTMLElement) || !panel.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusable(panel: HTMLElement): HTMLElement[] {
    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((item) => item.tabIndex !== -1 && !item.hasAttribute('disabled'));
  }

  private safeQuery(panel: HTMLElement, selector: string): HTMLElement | null {
    try {
      return panel.querySelector<HTMLElement>(selector);
    } catch {
      return null;
    }
  }

  private register(): void {
    const stack = drawerStacks.get(this.document) ?? [];
    const previousIndex = stack.indexOf(this);
    if (previousIndex >= 0) stack.splice(previousIndex, 1);
    stack.push(this);
    drawerStacks.set(this.document, stack);
    this.registered = true;
  }

  private unregister(): void {
    const stack = drawerStacks.get(this.document);
    const index = stack?.indexOf(this) ?? -1;
    if (stack && index >= 0) stack.splice(index, 1);
    if (stack?.length === 0) drawerStacks.delete(this.document);
    this.registered = false;
  }

  private isTopmost(): boolean {
    const stack = drawerStacks.get(this.document);
    return stack?.[stack.length - 1] === this;
  }

  private lockScroll(): void {
    if (this.scrollLocked) return;
    const lock = scrollLocks.get(this.document);
    if (lock) lock.count += 1;
    else
      scrollLocks.set(this.document, {
        count: 1,
        previousOverflow: this.document.body.style.overflow,
      });
    this.document.body.style.overflow = 'hidden';
    this.scrollLocked = true;
  }

  private unlockScroll(): void {
    if (!this.scrollLocked) return;
    const lock = scrollLocks.get(this.document);
    if (lock) {
      lock.count -= 1;
      if (lock.count === 0) {
        this.document.body.style.overflow = lock.previousOverflow;
        scrollLocks.delete(this.document);
      }
    }
    this.scrollLocked = false;
  }
}

@Directive({ selector: '[uiDrawerHeader]', standalone: true })
export class UiDrawerHeaderDirective {}

@Directive({ selector: '[uiDrawerFooter]', standalone: true })
export class UiDrawerFooterDirective {}
