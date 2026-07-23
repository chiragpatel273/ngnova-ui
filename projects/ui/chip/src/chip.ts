import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, Input, output } from '@angular/core';

export type UiChipVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type UiChipSize = 'sm' | 'md';

const VARIANTS: Record<UiChipVariant, string> = {
  neutral:
    'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
  primary:
    'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  success:
    'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  warning:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  danger:
    'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
};
const SIZES: Record<UiChipSize, string> = { sm: 'min-h-7 text-xs', md: 'min-h-8 text-sm' };

@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<span [class]="containerClasses">
      @if (selectable) {
        <button
          type="button"
          class="min-w-0 truncate rounded-full px-3 py-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
          [disabled]="disabled"
          [attr.aria-pressed]="selected"
          (click)="toggle()"
        >
          <ng-container [ngTemplateOutlet]="chipContent" />
        </button>
      } @else {
        <span class="min-w-0 truncate px-3 py-1 font-medium">
          <ng-container [ngTemplateOutlet]="chipContent" />
        </span>
      }
      @if (removable) {
        <button
          type="button"
          class="mr-1 rounded-full p-1 outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
          [disabled]="disabled"
          [attr.aria-label]="removeAriaLabel"
          (click)="remove()"
        >
          <svg
            class="size-3.5 fill-none stroke-current"
            viewBox="0 0 16 16"
            stroke-width="1.75"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="m4 4 8 8m0-8-8 8" />
          </svg>
        </button>
      }
    </span>
    <ng-template #chipContent><ng-content /></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiChipComponent {
  @Input() variant: UiChipVariant = 'neutral';
  @Input() size: UiChipSize = 'md';
  @Input({ transform: booleanAttribute }) selectable = false;
  @Input({ transform: booleanAttribute }) selected = false;
  @Input({ transform: booleanAttribute }) removable = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() removeAriaLabel = 'Remove';
  readonly selectedChange = output<boolean>();
  readonly removed = output<void>();

  protected get containerClasses(): string {
    const state = this.disabled
      ? 'opacity-50'
      : this.selected
        ? 'ring-2 ring-blue-600 ring-offset-1 dark:ring-blue-400 dark:ring-offset-slate-950'
        : '';
    return `inline-flex max-w-full items-center overflow-hidden rounded-full border align-middle ${VARIANTS[this.variant]} ${SIZES[this.size]} ${state}`;
  }
  protected toggle(): void {
    if (!this.disabled && this.selectable) this.selectedChange.emit(!this.selected);
  }
  protected remove(): void {
    if (!this.disabled && this.removable) this.removed.emit();
  }
}
