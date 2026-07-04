import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiBadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type UiBadgeSize = 'sm' | 'md';

const BASE_CLASSES = 'inline-flex items-center rounded-full font-medium ring-1 ring-inset';

const VARIANT_CLASSES: Record<UiBadgeVariant, string> = {
  default:
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800',
  warning:
    'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800',
  danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800',
  info: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800',
};

const SIZE_CLASSES: Record<UiBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

@Component({
  selector: 'ui-badge',
  standalone: true,
  template: `<span
    [attr.role]="ariaRole || null"
    [attr.aria-label]="ariaLabel || null"
    [class]="classes"
    ><ng-content
  /></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBadgeComponent {
  @Input() variant: UiBadgeVariant = 'default';
  @Input() size: UiBadgeSize = 'md';
  @Input() ariaRole = '';
  @Input() ariaLabel = '';

  protected get classes(): string {
    return uiClassNames(BASE_CLASSES, VARIANT_CLASSES[this.variant], SIZE_CLASSES[this.size]);
  }
}
