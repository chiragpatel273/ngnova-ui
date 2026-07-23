import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type UiDividerOrientation = 'horizontal' | 'vertical';
export type UiDividerInset = 'none' | 'start' | 'end' | 'both';

const HORIZONTAL_INSET: Record<UiDividerInset, string> = {
  none: 'mx-0',
  start: 'ml-4',
  end: 'mr-4',
  both: 'mx-4',
};

const VERTICAL_INSET: Record<UiDividerInset, string> = {
  none: 'my-0',
  start: 'mt-2',
  end: 'mb-2',
  both: 'my-2',
};

@Component({
  selector: 'ui-divider',
  standalone: true,
  template: `
    <div
      [attr.role]="decorative ? 'presentation' : 'separator'"
      [attr.aria-hidden]="decorative ? 'true' : null"
      [attr.aria-orientation]="decorative ? null : orientation"
      [attr.aria-label]="!decorative && label ? label : null"
      [class]="dividerClasses"
    >
      @if (label && orientation === 'horizontal') {
        <span class="shrink-0 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">{{
          label
        }}</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDividerComponent {
  @Input() orientation: UiDividerOrientation = 'horizontal';
  @Input() inset: UiDividerInset = 'none';
  @Input() label = '';
  @Input({ transform: booleanAttribute }) decorative = true;

  protected get dividerClasses(): string {
    if (this.orientation === 'vertical') {
      return `inline-block min-h-6 self-stretch border-l border-slate-200 dark:border-slate-800 ${VERTICAL_INSET[this.inset]}`;
    }
    const line = this.label
      ? 'flex w-full items-center before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200 dark:before:bg-slate-800 dark:after:bg-slate-800'
      : 'block w-full border-t border-slate-200 dark:border-slate-800';
    return `${line} ${HORIZONTAL_INSET[this.inset]}`;
  }
}
