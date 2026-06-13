import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { uiClassNames } from '../../shared/class-names';

export type UiSkeletonShape = 'text' | 'rect' | 'circle';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  template: `<span [class]="classes()" [style.width]="width()" [style.height]="height()"></span>`,
  host: {
    'aria-hidden': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSkeletonComponent {
  readonly shape = input<UiSkeletonShape>('rect');
  readonly width = input('100%');
  readonly height = input('1rem');

  protected readonly classes = computed(() =>
    uiClassNames(
      'block animate-pulse bg-slate-200 dark:bg-slate-800',
      this.shape() === 'circle' && 'rounded-full',
      this.shape() === 'rect' && 'rounded-md',
      this.shape() === 'text' && 'rounded',
    ),
  );
}
