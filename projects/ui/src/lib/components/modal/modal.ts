import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
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

export type UiModalSize = 'sm' | 'md' | 'lg' | 'xl';

let nextModalId = 0;

@Component({
  selector: 'ui-modal',
  standalone: true,
  host: {
    '(document:keydown)': 'handleKeydown($event)',
  },
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          aria-hidden="true"
          (click)="handleBackdropClick($event)"
        ></div>
        <section
          #dialogPanel
          class="relative max-h-[90dvh] w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-950/20 outline-none dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/40"
          [class.max-w-sm]="size === 'sm'"
          [class.max-w-lg]="size === 'md'"
          [class.max-w-2xl]="size === 'lg'"
          [class.max-w-4xl]="size === 'xl'"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="ariaLabel || null"
          [attr.aria-labelledby]="ariaLabel ? null : titleId"
          [attr.aria-describedby]="descriptionId || null"
          tabindex="-1"
        >
          <header
            class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800"
          >
            <div [id]="titleId" class="text-base font-semibold text-slate-950 dark:text-slate-50">
              <ng-content select="[uiModalHeader]" />
            </div>
            <button
              type="button"
              class="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Close dialog"
              (click)="close()"
            >
              <span aria-hidden="true">x</span>
            </button>
          </header>

          <div class="max-h-[60dvh] overflow-auto px-5 py-4 text-slate-700 dark:text-slate-200">
            <ng-content />
          </div>

          <footer
            class="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800"
          >
            <ng-content select="[uiModalFooter]" />
          </footer>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModalComponent implements AfterViewChecked, OnChanges, OnDestroy {
  @Input({ transform: booleanAttribute }) open = false;
  @Input({ transform: booleanAttribute }) closeOnBackdrop = true;
  @Input({ transform: booleanAttribute }) closeOnEscape = true;
  @Input() size: UiModalSize = 'md';
  @Input() titleId = `ui-modal-title-${++nextModalId}`;
  @Input() descriptionId = '';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) restoreFocus = true;
  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropClick = output<MouseEvent>();
  readonly escapeKeyDown = output<KeyboardEvent>();

  @ViewChild('dialogPanel') private readonly dialogPanel?: ElementRef<HTMLElement>;

  private readonly document = inject(DOCUMENT);
  private previouslyFocusedElement: HTMLElement | null = null;
  private previousBodyOverflow = '';
  private shouldFocusDialog = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.previouslyFocusedElement = this.document.activeElement as HTMLElement | null;
      this.lockDocumentScroll();
      this.shouldFocusDialog = true;
      this.opened.emit();
    } else if (changes['open']?.previousValue === true && changes['open']?.currentValue === false) {
      this.closed.emit();
      this.unlockDocumentScroll();
      this.restorePreviouslyFocusedElement();
    }
  }

  ngOnDestroy(): void {
    if (this.open) {
      this.unlockDocumentScroll();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.open || !this.shouldFocusDialog) {
      return;
    }

    this.shouldFocusDialog = false;
    this.focusInitialElement();
  }

  handleKeydown(event: Event): void {
    if (!this.open) {
      return;
    }

    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Escape' && this.closeOnEscape) {
      keyboardEvent.preventDefault();
      this.escapeKeyDown.emit(keyboardEvent);
      this.close();
      return;
    }

    if (keyboardEvent.key === 'Tab') {
      this.trapFocus(keyboardEvent);
    }
  }

  handleBackdropClick(event?: MouseEvent): void {
    if (event) {
      this.backdropClick.emit(event);
    }

    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  close(): void {
    if (!this.open) {
      return;
    }

    this.openChange.emit(false);
  }

  private restorePreviouslyFocusedElement(): void {
    if (this.restoreFocus) {
      this.previouslyFocusedElement?.focus();
    }
  }

  private focusInitialElement(): void {
    const panel = this.dialogPanel?.nativeElement;
    if (!panel) {
      return;
    }

    const firstFocusable = this.getFocusableElements(panel)[0];
    (firstFocusable ?? panel).focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.dialogPanel?.nativeElement;
    if (!panel) {
      return;
    }

    const focusableElements = this.getFocusableElements(panel);
    if (!focusableElements.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;

    if (
      !(activeElement instanceof HTMLElement) ||
      activeElement === panel ||
      !panel.contains(activeElement)
    ) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1);
  }

  private lockDocumentScroll(): void {
    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
  }

  private unlockDocumentScroll(): void {
    this.document.body.style.overflow = this.previousBodyOverflow;
  }
}
