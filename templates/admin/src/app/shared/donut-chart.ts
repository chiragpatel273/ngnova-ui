import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface DonutSegment {
  readonly label: string;
  readonly value: number;
  /** Tailwind text color classes; the ring and legend dot use `currentColor`. */
  readonly color: string;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Dependency-free SVG donut chart with a legend that doubles as its accessible description. */
@Component({
  selector: 'app-donut-chart',
  imports: [DecimalPipe, PercentPipe],
  template: `
    <div class="flex flex-col items-center gap-6 sm:flex-row lg:flex-col 2xl:flex-row">
      <div class="relative size-40 shrink-0">
        <svg class="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            [attr.r]="radius"
            fill="none"
            stroke-width="12"
            class="stroke-slate-100 dark:stroke-slate-800"
          />
          @for (arc of arcs(); track arc.label) {
            <circle
              cx="50"
              cy="50"
              [attr.r]="radius"
              fill="none"
              stroke="currentColor"
              stroke-width="12"
              [attr.stroke-dasharray]="arc.length + ' ' + circumference"
              [attr.stroke-dashoffset]="-arc.offset"
              [class]="arc.color"
            />
          }
        </svg>
        <div class="absolute inset-0 grid place-content-center text-center">
          <span class="text-2xl font-semibold tabular-nums text-slate-950 dark:text-white">{{
            total() | number
          }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">{{ totalLabel() }}</span>
        </div>
      </div>
      <ul class="grid w-full gap-2.5 text-sm">
        @for (arc of arcs(); track arc.label) {
          <li class="flex items-center gap-2">
            <span
              class="size-2.5 shrink-0 rounded-full bg-current"
              [class]="arc.color"
              aria-hidden="true"
            ></span>
            <span class="flex-1 text-slate-600 dark:text-slate-300">{{ arc.label }}</span>
            <span class="font-medium tabular-nums text-slate-900 dark:text-white">{{
              arc.value | number
            }}</span>
            <span class="w-10 text-end text-xs tabular-nums text-slate-500 dark:text-slate-400">{{
              arc.share | percent
            }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChart {
  readonly segments = input.required<readonly DonutSegment[]>();
  readonly totalLabel = input('Total');

  protected readonly radius = RADIUS;
  protected readonly circumference = CIRCUMFERENCE;
  protected readonly total = computed(() =>
    this.segments().reduce((sum, segment) => sum + segment.value, 0),
  );
  protected readonly arcs = computed(() => {
    const total = this.total() || 1;
    // A small gap between arcs keeps neighbouring colors distinct.
    const gap = this.segments().filter((segment) => segment.value > 0).length > 1 ? 1.5 : 0;
    let offset = 0;
    return this.segments().map((segment) => {
      const share = segment.value / total;
      const length = Math.max(0, share * CIRCUMFERENCE - gap);
      const arc = { ...segment, share, length, offset };
      offset += share * CIRCUMFERENCE;
      return arc;
    });
  });
}
