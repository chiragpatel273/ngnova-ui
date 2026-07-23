import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  computed,
  input,
} from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiSpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<UiSpinnerSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
};

@Component({
  selector: 'ui-spinner',
  standalone: true,
  template: `
    <span
      [class]="classes()"
      [attr.role]="decorative() ? null : 'status'"
      [attr.aria-label]="decorative() ? null : accessibleLabel()"
      [attr.aria-hidden]="decorative() ? 'true' : null"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSpinnerComponent {
  readonly size = input<UiSpinnerSize>('md');
  readonly label = input('Loading');
  readonly decorative = input(false, { transform: booleanAttribute });

  protected readonly accessibleLabel = computed(() => this.label().trim() || 'Loading');
  protected readonly classes = computed(() =>
    uiClassNames(
      'inline-block animate-spin rounded-full border-current border-t-transparent text-blue-600 motion-reduce:animate-none dark:text-blue-400',
      SIZE_CLASSES[this.size()],
    ),
  );
}
