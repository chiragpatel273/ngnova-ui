import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef, OnDestroy } from '@angular/core';

export type UiConfirmationIntent = 'primary' | 'warning' | 'danger';
export type UiConfirmationReason = 'confirm' | 'cancel' | 'escape' | 'backdrop' | 'destroyed';

export interface UiConfirmationOptions {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly intent?: UiConfirmationIntent;
  readonly requireText?: string;
  readonly requireTextLabel?: string;
  readonly closeOnEscape?: boolean;
  readonly closeOnBackdrop?: boolean;
}

export interface UiConfirmationRequest extends UiConfirmationOptions {
  readonly id: number;
}

export interface UiConfirmationResult {
  readonly confirmed: boolean;
  readonly reason: UiConfirmationReason;
  readonly request: UiConfirmationRequest;
}

interface PendingConfirmation {
  readonly request: UiConfirmationRequest;
  readonly resolve: (result: UiConfirmationResult) => void;
}

let nextConfirmationId = 0;

@Injectable({ providedIn: 'root' })
export class UiConfirmationService {
  private readonly active = signal<PendingConfirmation | null>(null);
  private readonly queue = signal<readonly PendingConfirmation[]>([]);

  readonly current = computed<UiConfirmationRequest | null>(() => this.active()?.request ?? null);
  readonly pendingCount = computed(() => this.queue().length);

  confirm(options: UiConfirmationOptions): Promise<UiConfirmationResult> {
    const request = Object.freeze({ ...options, id: ++nextConfirmationId });
    return new Promise<UiConfirmationResult>((resolve) => {
      const pending: PendingConfirmation = { request, resolve };
      if (this.active()) this.queue.update((queue) => Object.freeze([...queue, pending]));
      else this.active.set(pending);
    });
  }

  respond(reason: UiConfirmationReason): boolean {
    const pending = this.active();
    if (!pending) return false;
    const result = Object.freeze({
      confirmed: reason === 'confirm',
      reason,
      request: pending.request,
    });
    pending.resolve(result);
    const [next, ...remaining] = this.queue();
    this.queue.set(Object.freeze(remaining));
    this.active.set(next ?? null);
    return true;
  }

  cancelAll(reason: Extract<UiConfirmationReason, 'cancel' | 'destroyed'> = 'cancel'): void {
    const pending = [this.active(), ...this.queue()].filter(
      (item): item is PendingConfirmation => item !== null,
    );
    this.active.set(null);
    this.queue.set(Object.freeze([]));
    for (const item of pending) {
      item.resolve(
        Object.freeze({
          confirmed: false,
          reason,
          request: item.request,
        }),
      );
    }
  }
}

@Component({
  selector: 'ui-confirmation-dialog',
  standalone: true,
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
  template: `
    @if (request(); as confirmation) {
      <div
        class="fixed inset-0 z-[1100] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
        role="presentation"
        (mousedown)="onBackdropMouseDown($event)"
      >
        <section
          #panel
          class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/25 outline-none dark:border-slate-800 dark:bg-slate-950"
          role="alertdialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId(confirmation)"
          [attr.aria-describedby]="messageId(confirmation)"
        >
          <div class="flex items-start gap-4">
            <span [class]="iconClasses(confirmation.intent ?? 'primary')" aria-hidden="true">
              <svg
                class="size-5 fill-none stroke-current"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
              >
                <path d="M12 8v5m0 3.25v.01" />
                <path
                  d="M10.3 3.7 2.8 17a2 2 0 0 0 1.74 3h14.92A2 2 0 0 0 21.2 17L13.7 3.7a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </span>
            <div class="min-w-0 flex-1">
              <h2
                [id]="titleId(confirmation)"
                class="text-lg font-bold text-slate-950 dark:text-slate-50"
              >
                {{ confirmation.title }}
              </h2>
              <p
                [id]="messageId(confirmation)"
                class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300"
              >
                {{ confirmation.message }}
              </p>
            </div>
          </div>

          @if (confirmation.requireText) {
            <label
              [for]="inputId(confirmation)"
              class="mt-5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {{ confirmation.requireTextLabel || promptLabel() }}
            </label>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {{ promptHint() }} <strong>{{ confirmation.requireText }}</strong>
            </p>
            <input
              #promptInput
              [id]="inputId(confirmation)"
              type="text"
              autocomplete="off"
              class="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
              [value]="typedValue()"
              (input)="typedValue.set(inputValue($event))"
            />
          }

          @if (pendingCount()) {
            <p class="mt-4 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
              {{ pendingCount() }} {{ queueLabel() }}
            </p>
          }

          <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              #cancelButton
              type="button"
              class="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              (click)="respond('cancel')"
            >
              {{ confirmation.cancelLabel || cancelLabel() }}
            </button>
            <button
              type="button"
              [class]="confirmButtonClasses(confirmation.intent ?? 'primary')"
              [disabled]="!canConfirm()"
              (click)="respond('confirm')"
            >
              {{ confirmation.confirmLabel || confirmLabel() }}
            </button>
          </div>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiConfirmationDialogComponent implements OnDestroy {
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly promptLabel = input('Confirmation text');
  readonly promptHint = input('Type exactly:');
  readonly queueLabel = input('more confirmations pending');
  readonly restoreFocus = input(true, { transform: booleanAttribute });

  readonly responded = output<UiConfirmationResult>();
  readonly opened = output<UiConfirmationRequest>();
  readonly closed = output<UiConfirmationRequest>();
  readonly escapeKeyDown = output<void>();
  readonly backdropClick = output<MouseEvent>();

  private readonly service = inject(UiConfirmationService);
  private readonly document = inject(DOCUMENT);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly promptInput = viewChild<ElementRef<HTMLInputElement>>('promptInput');
  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton');
  private restoreFocusTo: HTMLElement | null = null;
  private previousBodyOverflow = '';
  private scrollLocked = false;
  private activeRequest: UiConfirmationRequest | null = null;

  protected readonly request = this.service.current;
  protected readonly pendingCount = this.service.pendingCount;
  protected readonly typedValue = signal('');
  protected readonly canConfirm = computed(() => {
    const required = this.request()?.requireText;
    return !required || this.typedValue() === required;
  });

  constructor() {
    effect(() => {
      const request = this.request();
      if (request?.id === this.activeRequest?.id) return;
      if (this.activeRequest) this.closed.emit(this.activeRequest);
      if (request) {
        if (!this.activeRequest) {
          this.restoreFocusTo =
            this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
          this.previousBodyOverflow = this.document.body.style.overflow;
          this.document.body.style.overflow = 'hidden';
          this.scrollLocked = true;
        }
        this.activeRequest = request;
        this.typedValue.set('');
        this.opened.emit(request);
        queueMicrotask(() => {
          if (request.requireText) this.promptInput()?.nativeElement.focus();
          else this.cancelButton()?.nativeElement.focus();
        });
      } else {
        this.activeRequest = null;
        this.releaseScrollLock();
        if (this.restoreFocus()) {
          queueMicrotask(() => {
            if (this.restoreFocusTo?.isConnected) this.restoreFocusTo.focus();
            this.restoreFocusTo = null;
          });
        } else {
          this.restoreFocusTo = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.releaseScrollLock();
    this.service.cancelAll('destroyed');
  }

  protected respond(reason: UiConfirmationReason): void {
    if (reason === 'confirm' && !this.canConfirm()) return;
    const request = this.request();
    if (!request) return;
    const result = Object.freeze({
      confirmed: reason === 'confirm',
      reason,
      request,
    });
    this.responded.emit(result);
    this.service.respond(reason);
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    const request = this.request();
    if (!request) return;
    if (event.key === 'Escape') {
      this.escapeKeyDown.emit();
      if (request.closeOnEscape !== false) this.respond('escape');
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === 'Tab') this.trapFocus(event);
  }

  protected onBackdropMouseDown(event: MouseEvent): void {
    const request = this.request();
    if (!request || event.currentTarget !== event.target) return;
    this.backdropClick.emit(event);
    if (request.closeOnBackdrop === true) this.respond('backdrop');
  }

  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected titleId(request: UiConfirmationRequest): string {
    return `ui-confirmation-title-${request.id}`;
  }

  protected messageId(request: UiConfirmationRequest): string {
    return `ui-confirmation-message-${request.id}`;
  }

  protected inputId(request: UiConfirmationRequest): string {
    return `ui-confirmation-input-${request.id}`;
  }

  protected iconClasses(intent: UiConfirmationIntent): string {
    const base = 'inline-flex size-10 shrink-0 items-center justify-center rounded-full';
    const styles: Record<UiConfirmationIntent, string> = {
      primary: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      danger: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    };
    return `${base} ${styles[intent]}`;
  }

  protected confirmButtonClasses(intent: UiConfirmationIntent): string {
    const base =
      'min-h-11 rounded-lg px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950';
    const styles: Record<UiConfirmationIntent, string> = {
      primary:
        'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400',
      warning:
        'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 dark:focus-visible:ring-amber-400',
      danger:
        'bg-red-600 hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:ring-red-400',
    };
    return `${base} ${styles[intent]}`;
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    const active = this.document.activeElement;
    if (event.shiftKey && active === first) {
      last?.focus();
      event.preventDefault();
    } else if (!event.shiftKey && active === last) {
      first?.focus();
      event.preventDefault();
    }
  }

  private releaseScrollLock(): void {
    if (!this.scrollLocked) return;
    this.document.body.style.overflow = this.previousBodyOverflow;
    this.scrollLocked = false;
  }
}
