import {
  Injectable,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { signal } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiToastVariant = 'info' | 'success' | 'warning' | 'danger';
export type UiToastPosition = 'top-right' | 'bottom-right';

export interface UiToastMessage {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant?: UiToastVariant;
  readonly duration?: number;
}

export type UiToastInput = Omit<UiToastMessage, 'id'> & {
  readonly id?: string;
};

const TOAST_CLASSES: Record<UiToastVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
  danger:
    'border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-100',
};

let nextToastId = 0;

@Injectable({ providedIn: 'root' })
export class UiToastService {
  private readonly messagesState = signal<readonly UiToastMessage[]>([]);
  private readonly dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
  readonly messages = this.messagesState.asReadonly();

  show(message: UiToastInput): string {
    const id = message.id ?? `ui-toast-${++nextToastId}`;
    this.cancelDismissTimer(id);
    this.messagesState.update((messages) => [
      ...messages.filter((currentMessage) => currentMessage.id !== id),
      { ...message, id },
    ]);

    const duration = message.duration ?? 0;
    if (Number.isFinite(duration) && duration > 0) {
      this.dismissTimers.set(
        id,
        setTimeout(() => {
          this.dismissTimers.delete(id);
          this.removeMessage(id);
        }, duration),
      );
    }
    return id;
  }

  info(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, duration, variant: 'info' });
  }

  success(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, duration, variant: 'success' });
  }

  warning(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, duration, variant: 'warning' });
  }

  danger(title: string, description?: string, duration?: number): string {
    return this.show({ title, description, duration, variant: 'danger' });
  }

  dismiss(id: string): void {
    this.cancelDismissTimer(id);
    this.removeMessage(id);
  }

  clear(): void {
    for (const timer of this.dismissTimers.values()) {
      clearTimeout(timer);
    }
    this.dismissTimers.clear();
    this.messagesState.set([]);
  }

  private cancelDismissTimer(id: string): void {
    const timer = this.dismissTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.dismissTimers.delete(id);
    }
  }

  private removeMessage(id: string): void {
    this.messagesState.update((messages) => messages.filter((message) => message.id !== id));
  }
}

@Component({
  selector: 'ui-toast',
  standalone: true,
  template: `
    <div
      [class]="viewportClasses()"
      [style.--ui-toast-viewport-offset]="viewportOffset()"
      aria-live="polite"
      aria-relevant="additions"
    >
      @for (message of visibleMessages(); track message.id) {
        <section
          [class]="toastClasses(message.variant ?? 'info')"
          [attr.role]="message.variant === 'danger' ? 'alert' : 'status'"
          aria-atomic="true"
        >
          <div class="min-w-0">
            <p class="font-semibold">{{ message.title }}</p>
            @if (message.description) {
              <p class="mt-1 text-sm opacity-80">{{ message.description }}</p>
            }
          </div>
          <button
            type="button"
            class="rounded px-1.5 text-current opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            [attr.aria-label]="dismissAriaLabel()"
            (click)="service.dismiss(message.id)"
          >
            <svg
              class="size-4 shrink-0 fill-none stroke-current"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToastComponent {
  readonly position = input<UiToastPosition>('top-right');
  readonly viewportOffset = input('var(--ui-toast-offset, 1rem)');
  readonly maxMessages = input(5, { transform: numberAttribute });
  readonly dismissAriaLabel = input('Dismiss notification');
  protected readonly service = inject(UiToastService);
  protected readonly visibleMessages = computed(() => {
    const maximum = Math.max(1, Math.trunc(this.maxMessages()) || 1);
    return this.service.messages().slice(-maximum);
  });

  protected readonly viewportClasses = computed(() =>
    uiClassNames(
      'pointer-events-none fixed right-0 z-50 flex w-full max-w-sm flex-col gap-3 p-[var(--ui-toast-viewport-offset)] pl-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-left))] pr-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-right))]',
      this.position() === 'top-right' &&
        'top-0 pt-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-top))]',
      this.position() === 'bottom-right' &&
        'bottom-0 pb-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-bottom))]',
    ),
  );

  protected toastClasses(variant: UiToastVariant): string {
    return uiClassNames(
      'pointer-events-auto flex items-start justify-between gap-4 rounded-[var(--ui-surface-radius,0.75rem)] border p-4 shadow-lg',
      TOAST_CLASSES[variant],
    );
  }
}
