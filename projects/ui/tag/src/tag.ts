import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiTagVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type UiTagSize = 'sm' | 'md';

const BASE_CLASSES =
  'inline-flex max-w-full items-center gap-1.5 rounded-md font-medium ring-1 ring-inset';

const VARIANT_CLASSES: Record<UiTagVariant, string> = {
  default:
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800',
  warning:
    'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800',
  danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800',
  info: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800',
};

const SIZE_CLASSES: Record<UiTagSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
};

@Directive({
  selector: '[uiTagIcon]',
  standalone: true,
  host: {
    class: 'size-4 shrink-0',
    'aria-hidden': 'true',
  },
})
export class UiTagIconDirective {}

@Component({
  selector: 'ui-tag',
  standalone: true,
  template: `
    <span
      [attr.role]="ariaLabel() ? 'group' : null"
      [attr.aria-label]="ariaLabel() || null"
      [class]="classes()"
    >
      <ng-content select="[uiTagIcon]" />
      @if (icon()) {
        <span class="shrink-0" aria-hidden="true">{{ icon() }}</span>
      }
      <span class="min-w-0 truncate"><ng-content /></span>
      @if (removable()) {
        <button
          type="button"
          class="rounded-sm px-1 text-current opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
          [attr.aria-label]="removeLabel()"
          (click)="removed.emit()"
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
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTagComponent {
  readonly variant = input<UiTagVariant>('default');
  readonly size = input<UiTagSize>('md');
  readonly icon = input('');
  readonly ariaLabel = input('');
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removeLabel = input('Remove tag');
  readonly removed = output<void>();

  protected readonly classes = computed(() =>
    uiClassNames(BASE_CLASSES, VARIANT_CLASSES[this.variant()], SIZE_CLASSES[this.size()]),
  );
}
