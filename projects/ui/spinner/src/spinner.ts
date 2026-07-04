import { ChangeDetectionStrategy, booleanAttribute, Component, Input } from '@angular/core';

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
      [class]="classes"
      [attr.role]="decorative ? null : 'status'"
      [attr.aria-label]="decorative ? null : label"
      [attr.aria-hidden]="decorative ? 'true' : null"
    >
      @if (!decorative) {
        <span class="sr-only">{{ label }}</span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSpinnerComponent {
  @Input() size: UiSpinnerSize = 'md';
  @Input() label = 'Loading';
  @Input({ transform: booleanAttribute }) decorative = false;

  protected get classes(): string {
    return uiClassNames(
      'inline-block animate-spin rounded-full border-current border-t-transparent text-blue-600 dark:text-blue-400',
      SIZE_CLASSES[this.size],
    );
  }
}
