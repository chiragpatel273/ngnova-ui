import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  Input,
  output,
  signal,
} from '@angular/core';
import type { OnChanges, SimpleChanges } from '@angular/core';

import { uiClassNames } from '../../shared/class-names';

export type UiAlertVariant = 'info' | 'success' | 'warning' | 'danger';

const BASE_CLASSES = 'rounded-md border p-4 text-sm';

const VARIANT_CLASSES: Record<UiAlertVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
  danger:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100',
};

@Component({
  selector: 'ui-alert',
  standalone: true,
  template: `
    @if (isVisible()) {
      <div [class]="classes" [attr.role]="ariaRole || defaultRole">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            @if (title) {
              <h3 class="font-semibold">{{ title }}</h3>
            }
            <div class="mt-1 leading-6">
              <ng-content />
            </div>
          </div>

          @if (dismissible) {
            <button
              type="button"
              class="-m-1 inline-flex size-7 items-center justify-center rounded-md text-current opacity-70 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              aria-label="Dismiss alert"
              (click)="dismiss()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAlertComponent implements OnChanges {
  @Input() variant: UiAlertVariant = 'info';
  @Input() title = '';
  @Input() ariaRole = '';
  @Input({ transform: booleanAttribute }) open = true;
  @Input({ transform: booleanAttribute }) dismissible = false;
  readonly openChange = output<boolean>();
  readonly dismissed = output<void>();

  private readonly dismissedInternally = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.dismissedInternally.set(false);
    }
  }

  protected get defaultRole(): string {
    return this.variant === 'danger' ? 'alert' : 'status';
  }

  protected get classes(): string {
    return uiClassNames(BASE_CLASSES, VARIANT_CLASSES[this.variant]);
  }

  protected isVisible(): boolean {
    return this.open && !this.dismissedInternally();
  }

  protected dismiss(): void {
    this.dismissedInternally.set(true);
    this.openChange.emit(false);
    this.dismissed.emit();
  }
}
