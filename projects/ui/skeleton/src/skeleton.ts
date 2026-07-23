import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

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
  readonly animated = input(true, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    uiClassNames(
      'block bg-slate-200 dark:bg-slate-800',
      this.animated() && 'animate-pulse motion-reduce:animate-none',
      this.shape() === 'circle' && 'rounded-full',
      this.shape() === 'rect' && 'rounded-md',
      this.shape() === 'text' && 'rounded',
    ),
  );
}
