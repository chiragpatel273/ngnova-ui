import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  Input,
  output,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import type { AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

export type UiMenuAlign = 'start' | 'end';

export interface UiMenuItem {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly href?: string;
  readonly danger?: boolean;
  readonly separatorBefore?: boolean;
}

export interface UiMenuSelection {
  readonly item: UiMenuItem;
  readonly index: number;
}

let nextMenuId = 0;

@Component({
  selector: 'ui-menu',
  standalone: true,
  template: `
    <ng-content select="[uiMenuTrigger]" />
    @if (isOpen()) {
      <div
        #panel
        [id]="menuId"
        role="menu"
        tabindex="-1"
        [attr.aria-label]="ariaLabel"
        [class]="panelClasses"
        (keydown)="handleMenuKeydown($event)"
      >
        @for (item of items; track item.value; let index = $index) {
          @if (item.separatorBefore) {
            <div
              role="separator"
              class="my-1 border-t border-slate-200 dark:border-slate-800"
            ></div>
          }
          @if (item.href && !item.disabled) {
            <a
              role="menuitem"
              tabindex="-1"
              [attr.href]="item.href"
              [attr.data-menu-index]="index"
              [class]="itemClasses(item)"
              (click)="select(item, index, $event)"
            >
              {{ item.label }}
            </a>
          } @else {
            <button
              type="button"
              role="menuitem"
              tabindex="-1"
              [disabled]="item.disabled"
              [attr.aria-disabled]="item.disabled ? 'true' : null"
              [attr.data-menu-index]="index"
              [class]="itemClasses(item)"
              (click)="select(item, index, $event)"
            >
              {{ item.label }}
            </button>
          }
        }
      </div>
    }
  `,
  host: {
    class: 'relative inline-block',
    '(click)': 'handleHostClick($event)',
    '(keydown)': 'handleTriggerKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMenuComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() items: readonly UiMenuItem[] = [];
  @Input({ transform: booleanAttribute }) open = false;
  @Input() align: UiMenuAlign = 'start';
  @Input() ariaLabel = 'Actions';
  @Input() menuId = `ui-menu-${++nextMenuId}`;
  @Input({ transform: booleanAttribute }) closeOnSelect = true;
  readonly openChange = output<boolean>();
  readonly itemSelected = output<UiMenuSelection>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  @ViewChild('panel') private readonly panelRef?: ElementRef<HTMLElement>;
  protected readonly isOpen = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly cleanups: (() => void)[] = [];
  private viewReady = false;
  private pendingFocus: 'first' | 'last' | null = null;
  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  protected get panelClasses(): string {
    return `absolute top-[calc(100%+0.5rem)] z-[950] min-w-48 overflow-hidden rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 bg-white p-1 shadow-xl outline-none dark:border-slate-700 dark:bg-slate-950 ${this.align === 'end' ? 'right-0' : 'left-0'}`;
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.isOpen.set(this.open);
    this.syncState();
    if (this.open) this.opened.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewReady || !changes['open']) return;
    const changed = this.isOpen() !== this.open;
    this.isOpen.set(this.open);
    this.syncState();
    if (changed) {
      if (this.open) this.opened.emit();
      else this.closed.emit();
    }
  }

  ngOnDestroy(): void {
    this.removeListeners();
    if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
  }

  protected handleHostClick(event: MouseEvent): void {
    if ((event.target as Element | null)?.closest('[uiMenuTrigger]')) this.setOpen(!this.isOpen());
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (!(event.target as Element | null)?.closest('[uiMenuTrigger]')) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.pendingFocus = event.key === 'ArrowDown' ? 'first' : 'last';
      if (!this.isOpen()) this.setOpen(true);
      else this.focusPending();
    }
  }

  protected handleMenuKeydown(event: KeyboardEvent): void {
    const enabled = this.enabledItems();
    if (!enabled.length) return;
    const current = enabled.indexOf(this.document.activeElement as HTMLElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      enabled[(current + direction + enabled.length) % enabled.length].focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      enabled[event.key === 'Home' ? 0 : enabled.length - 1].focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.setOpen(false, true);
    } else if (event.key === 'Tab') {
      this.setOpen(false);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.handleTypeahead(event.key, enabled);
    }
  }

  protected select(item: UiMenuItem, index: number, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    this.itemSelected.emit({ item, index });
    if (this.closeOnSelect) this.setOpen(false, true);
  }

  protected itemClasses(item: UiMenuItem): string {
    const state = item.disabled
      ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
      : item.danger
        ? 'text-red-700 hover:bg-red-50 focus:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/60 dark:focus:bg-red-950/60'
        : 'text-slate-700 hover:bg-slate-100 focus:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800';
    return `flex w-full items-center rounded-[var(--ui-control-radius,0.625rem)] px-3 py-2 text-left text-sm font-medium outline-none ${state}`;
  }

  private setOpen(open: boolean, restoreFocus = false): void {
    if (this.isOpen() === open) return;
    this.isOpen.set(open);
    this.syncState();
    this.openChange.emit(open);
    if (open) this.opened.emit();
    else {
      this.closed.emit();
      if (restoreFocus) this.trigger()?.focus();
    }
  }

  private syncState(): void {
    this.updateTrigger();
    if (this.isOpen()) {
      this.installListeners();
      queueMicrotask(() => this.focusPending());
    } else this.removeListeners();
  }

  private updateTrigger(): void {
    const trigger = this.trigger();
    if (!trigger) return;
    this.renderer.setAttribute(trigger, 'aria-haspopup', 'menu');
    this.renderer.setAttribute(trigger, 'aria-expanded', String(this.isOpen()));
    this.renderer.setAttribute(trigger, 'aria-controls', this.menuId);
  }

  private installListeners(): void {
    if (this.cleanups.length) return;
    this.cleanups.push(
      this.renderer.listen(this.document, 'pointerdown', (event: PointerEvent) => {
        if (this.isOpen() && !this.host.contains(event.target as Node)) this.setOpen(false);
      }),
    );
  }

  private removeListeners(): void {
    for (const cleanup of this.cleanups.splice(0)) cleanup();
  }

  private focusPending(): void {
    if (!this.pendingFocus) return;
    const items = this.enabledItems();
    items[this.pendingFocus === 'first' ? 0 : items.length - 1]?.focus();
    this.pendingFocus = null;
  }

  private enabledItems(): HTMLElement[] {
    return Array.from(
      this.panelRef?.nativeElement.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])',
      ) ?? [],
    ).filter((item) => item.getAttribute('aria-disabled') !== 'true');
  }

  private handleTypeahead(key: string, enabled: HTMLElement[]): void {
    this.typeahead += key.toLocaleLowerCase();
    if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ''), 500);
    enabled
      .find((item) => item.textContent?.trim().toLocaleLowerCase().startsWith(this.typeahead))
      ?.focus();
  }

  private trigger(): HTMLElement | null {
    return this.host.querySelector<HTMLElement>('[uiMenuTrigger]');
  }
}

@Directive({ selector: '[uiMenuTrigger]', standalone: true })
export class UiMenuTriggerDirective {}
