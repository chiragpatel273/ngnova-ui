import {
  Injectable,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { signal } from '@angular/core';

import { uiClassNames } from '../../shared/class-names';

export type UiToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface UiToastMessage {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant?: UiToastVariant;
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
  readonly messages = this.messagesState.asReadonly();

  show(message: UiToastInput): string {
    const id = message.id ?? `ui-toast-${++nextToastId}`;
    this.messagesState.update((messages) => [...messages, { ...message, id }]);
    return id;
  }

  success(title: string, description?: string): string {
    return this.show({ title, description, variant: 'success' });
  }

  dismiss(id: string): void {
    this.messagesState.update((messages) => messages.filter((message) => message.id !== id));
  }

  clear(): void {
    this.messagesState.set([]);
  }
}

@Component({
  selector: 'ui-toast',
  standalone: true,
  template: `
    <div [class]="viewportClasses()" aria-live="polite" aria-relevant="additions">
      @for (message of service.messages(); track message.id) {
        <section [class]="toastClasses(message.variant ?? 'info')" role="status">
          <div class="min-w-0">
            <p class="font-semibold">{{ message.title }}</p>
            @if (message.description) {
              <p class="mt-1 text-sm opacity-80">{{ message.description }}</p>
            }
          </div>
          <button
            type="button"
            class="rounded px-1.5 text-current opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Dismiss notification"
            (click)="service.dismiss(message.id)"
          >
            <span aria-hidden="true">x</span>
          </button>
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToastComponent {
  readonly position = input<'top-right' | 'bottom-right'>('top-right');
  protected readonly service = inject(UiToastService);

  protected readonly viewportClasses = computed(() =>
    uiClassNames(
      'pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-3 p-4',
      this.position() === 'top-right' && 'right-0 top-0',
      this.position() === 'bottom-right' && 'bottom-0 right-0',
    ),
  );

  protected toastClasses(variant: UiToastVariant): string {
    return uiClassNames(
      'pointer-events-auto flex items-start justify-between gap-4 rounded-lg border p-4 shadow-lg',
      TOAST_CLASSES[variant],
    );
  }
}
