import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger';

const BAR_CLASSES: Record<UiProgressBarVariant, string> = {
  primary: 'bg-blue-600 dark:bg-blue-500',
  success: 'bg-emerald-600 dark:bg-emerald-500',
  warning: 'bg-amber-500 dark:bg-amber-400',
  danger: 'bg-red-600 dark:bg-red-500',
};

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  template: `
    <div
      class="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      role="progressbar"
      [attr.aria-label]="label()"
      [attr.aria-valuemin]="indeterminate() ? null : 0"
      [attr.aria-valuemax]="indeterminate() ? null : max()"
      [attr.aria-valuenow]="indeterminate() ? null : normalizedValue()"
    >
      <div [class]="barClasses()" [style.width.%]="indeterminate() ? 45 : percentage()"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProgressBarComponent {
  readonly value = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly label = input('Progress');
  readonly variant = input<UiProgressBarVariant>('primary');
  readonly indeterminate = input(false, { transform: booleanAttribute });

  protected readonly normalizedValue = computed(() =>
    Math.min(Math.max(this.value(), 0), Math.max(this.max(), 1)),
  );

  protected readonly percentage = computed(
    () => (this.normalizedValue() / Math.max(this.max(), 1)) * 100,
  );
  protected readonly barClasses = computed(() =>
    uiClassNames(
      'h-full rounded-full transition-all duration-300',
      this.indeterminate() && 'animate-pulse',
      BAR_CLASSES[this.variant()],
    ),
  );
}
