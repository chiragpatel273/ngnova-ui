import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowTrendingDown, heroArrowTrendingUp } from '@ng-icons/heroicons/outline';
import { UiSkeletonComponent } from '@ngnova/ui/skeleton';

/** Metric card with a period-over-period change and a sparkline. */
@Component({
  selector: 'app-kpi-card',
  imports: [DecimalPipe, NgIcon, PercentPipe, UiSkeletonComponent],
  viewProviders: [provideIcons({ heroArrowTrendingDown, heroArrowTrendingUp })],
  template: `
    <article
      class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ label() }}</h2>
        @if (!loading()) {
          <span
            class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
            [class]="
              positive()
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            "
          >
            <ng-icon
              [name]="change() >= 0 ? 'heroArrowTrendingUp' : 'heroArrowTrendingDown'"
              size="14"
              aria-hidden="true"
            />
            <span class="sr-only">{{ change() >= 0 ? 'Up' : 'Down' }}</span>
            {{ (change() < 0 ? -change() : change()) | percent: '1.1-1' }}
          </span>
        }
      </div>
      @if (loading()) {
        <ui-skeleton class="mt-3 block" shape="text" width="60%" height="2rem" />
        <ui-skeleton class="mt-4 block" shape="rect" height="2.5rem" />
      } @else {
        <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {{ prefix() }}{{ display() | number: digits() }}{{ suffix() }}
        </p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ caption() }}</p>
        <svg
          class="mt-4 h-10 w-full overflow-visible"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          [class]="
            positive()
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-rose-500 dark:text-rose-400'
          "
        >
          <polyline
            [attr.points]="sparkline()"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input(0);
  readonly change = input(0);
  readonly caption = input('');
  readonly series = input<readonly number[]>([]);
  readonly prefix = input('');
  readonly suffix = input('');
  readonly digits = input('1.0-0');
  /** Multiplier applied before display, e.g. 100 to show a ratio as a percentage. */
  readonly scale = input(1);
  /** Set when a decrease is good news, such as refund rate. */
  readonly invert = input(false);
  readonly loading = input(false);

  protected readonly display = computed(() => this.value() * this.scale());
  protected readonly positive = computed(() => this.change() >= 0 !== this.invert());
  protected readonly sparkline = computed(() => {
    const values = this.series();
    if (values.length < 2) return '';
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 36 - ((value - min) / range) * 32;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  });
}
