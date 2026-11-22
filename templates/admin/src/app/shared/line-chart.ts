import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface ChartPoint {
  /** ISO date (yyyy-mm-dd). */
  readonly date: string;
  readonly value: number;
}

let nextChartId = 0;

/**
 * Dependency-free SVG line chart comparing two periods. Colors come from Tailwind classes, so it
 * follows dark mode without JavaScript. Swap in a charting library if you need zoom or many series.
 */
@Component({
  selector: 'app-line-chart',
  imports: [DatePipe],
  template: `
    <figure class="relative" dir="ltr">
      <figcaption class="sr-only">{{ label() }}</figcaption>
      <div class="flex gap-3">
        <div
          class="flex h-64 shrink-0 flex-col justify-between py-1 text-end text-[11px] text-slate-400 tabular-nums dark:text-slate-500"
          aria-hidden="true"
        >
          @for (tick of ticks(); track tick) {
            <span>{{ format(tick) }}</span>
          }
        </div>
        <div
          class="relative h-64 min-w-0 flex-1"
          (pointermove)="track($event)"
          (pointerleave)="hovered.set(null)"
        >
          <svg
            class="absolute inset-0 size-full overflow-visible text-blue-600 dark:text-blue-400"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient [attr.id]="gradientId" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
                <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
              </linearGradient>
            </defs>
            @for (tick of ticks(); track tick; let index = $index) {
              <line
                x1="0"
                x2="100"
                [attr.y1]="(index / (ticks().length - 1)) * 100"
                [attr.y2]="(index / (ticks().length - 1)) * 100"
                class="stroke-slate-200 dark:stroke-slate-800"
                stroke-width="1"
                vector-effect="non-scaling-stroke"
              />
            }
            @if (comparison().length) {
              <path
                [attr.d]="path(comparison())"
                fill="none"
                class="stroke-slate-300 dark:stroke-slate-600"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                vector-effect="non-scaling-stroke"
              />
            }
            <path [attr.d]="area()" [attr.fill]="'url(#' + gradientId + ')'" />
            <path
              [attr.d]="path(series())"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
            />
            @if (active(); as point) {
              <line
                [attr.x1]="point.x"
                [attr.x2]="point.x"
                y1="0"
                y2="100"
                class="stroke-slate-300 dark:stroke-slate-600"
                stroke-width="1"
                vector-effect="non-scaling-stroke"
              />
            }
          </svg>
          @if (active(); as point) {
            <span
              class="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow dark:border-slate-900 dark:bg-blue-400"
              [style.left.%]="point.x"
              [style.top.%]="point.y"
            ></span>
            <div
              class="pointer-events-none absolute top-2 z-10 w-44 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900"
              [style.left.%]="clamp(point.x)"
              role="status"
            >
              <p class="font-medium text-slate-500 dark:text-slate-400">
                {{ point.date | date: 'EEE, MMM d' }}
              </p>
              <p class="mt-1 flex justify-between gap-2 text-slate-900 dark:text-white">
                <span>{{ seriesLabel() }}</span>
                <span class="font-semibold tabular-nums">{{ format(point.value) }}</span>
              </p>
              @if (point.previous !== null) {
                <p class="mt-0.5 flex justify-between gap-2 text-slate-500 dark:text-slate-400">
                  <span>{{ comparisonLabel() }}</span>
                  <span class="tabular-nums">{{ format(point.previous) }}</span>
                </p>
              }
            </div>
          }
        </div>
      </div>
      <div
        class="mt-2 flex justify-between ps-14 text-[11px] text-slate-400 dark:text-slate-500"
        aria-hidden="true"
      >
        @for (tick of dateTicks(); track tick) {
          <span>{{ tick | date: 'MMM d' }}</span>
        }
      </div>
      <!-- Tables ignore the height and overflow of sr-only, so clip a wrapper instead. -->
      <div class="sr-only">
        <table>
          <caption>
            {{
              label()
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">{{ seriesLabel() }}</th>
            </tr>
          </thead>
          <tbody>
            @for (point of series(); track point.date) {
              <tr>
                <td>{{ point.date | date: 'mediumDate' }}</td>
                <td>{{ format(point.value) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart {
  readonly series = input.required<readonly ChartPoint[]>();
  readonly comparison = input<readonly ChartPoint[]>([]);
  readonly label = input('Line chart');
  readonly seriesLabel = input('This period');
  readonly comparisonLabel = input('Previous period');
  /** How values are written on the axis, in the tooltip, and in the data table. */
  readonly valueFormat = input<'currency' | 'number'>('currency');

  protected readonly gradientId = `chart-fill-${++nextChartId}`;
  protected readonly hovered = signal<number | null>(null);

  /** Rounded axis maximum and four evenly spaced ticks, highest first. */
  protected readonly ticks = computed(() => {
    const values = [...this.series(), ...this.comparison()].map((point) => point.value);
    const max = Math.max(1, ...values);
    const magnitude = 10 ** Math.floor(Math.log10(max));
    const top = Math.ceil(max / magnitude) * magnitude;
    return [top, (top * 3) / 4, top / 2, top / 4, 0];
  });

  protected readonly dateTicks = computed(() => {
    const points = this.series();
    if (points.length < 2) return points.map((point) => point.date);
    const count = Math.min(6, points.length);
    return Array.from(
      { length: count },
      (_, index) => points[Math.round((index * (points.length - 1)) / (count - 1))].date,
    );
  });

  protected readonly area = computed(() => {
    const line = this.path(this.series());
    return line ? `${line} L100,100 L0,100 Z` : '';
  });

  protected readonly active = computed(() => {
    const index = this.hovered();
    const points = this.series();
    if (index === null || !points[index]) return null;
    const point = points[index];
    return {
      x: this.x(index, points.length),
      y: this.y(point.value),
      date: point.date,
      value: point.value,
      previous: this.comparison()[index]?.value ?? null,
    };
  });

  protected path(points: readonly ChartPoint[]): string {
    return points
      .map(
        (point, index) =>
          `${index ? 'L' : 'M'}${this.x(index, points.length).toFixed(2)},${this.y(point.value).toFixed(2)}`,
      )
      .join(' ');
  }

  protected track(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    this.hovered.set(Math.round(ratio * (this.series().length - 1)));
  }

  protected format(value: number): string {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      ...(this.valueFormat() === 'currency' ? { style: 'currency', currency: 'USD' } : {}),
    }).format(value);
  }

  /** Keeps the tooltip inside the plot area. */
  protected clamp(x: number): number {
    return Math.min(84, Math.max(16, x));
  }

  private x(index: number, length: number): number {
    return length > 1 ? (index / (length - 1)) * 100 : 50;
  }

  private y(value: number): number {
    return 100 - (value / this.ticks()[0]) * 100;
  }
}
