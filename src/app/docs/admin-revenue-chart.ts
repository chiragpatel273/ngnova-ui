import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';

interface RevenueSeries {
  readonly color: string;
  readonly values: readonly number[];
}

const REVENUE_SERIES: readonly RevenueSeries[] = [
  { color: '#2563eb', values: [42, 34, 46, 52, 71, 68, 59] },
  { color: '#cbd5e1', values: [31, 45, 41, 38, 51, 54, 47] },
];

const REVENUE_LABELS = ['Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24'];

@Component({
  selector: 'app-admin-revenue-chart',
  standalone: true,
  template: `
    <canvas
      #chart
      class="block h-44 w-full"
      role="img"
      aria-label="Revenue trend from July 18 through July 24, comparing current and previous periods"
    ></canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRevenueChartComponent {
  private readonly chart = viewChild.required<ElementRef<HTMLCanvasElement>>('chart');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (typeof globalThis.CanvasRenderingContext2D === 'undefined') {
        return;
      }

      const canvas = this.chart().nativeElement;
      if (typeof globalThis.ResizeObserver === 'function') {
        const observer = new ResizeObserver(() => this.drawChart(canvas));
        observer.observe(canvas);
        this.destroyRef.onDestroy(() => observer.disconnect());
      }
      this.drawChart(canvas);
    });
  }

  private drawChart(canvas: HTMLCanvasElement): void {
    const width = Math.max(canvas.clientWidth, 280);
    const height = 176;
    const density = globalThis.devicePixelRatio || 1;
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.resetTransform();
    context.scale(density, density);
    context.clearRect(0, 0, width, height);

    const plot = { left: 38, right: width - 24, top: 10, bottom: height - 24 };
    const yTicks = [80, 60, 40, 20, 0] as const;

    context.font = '10px Inter, ui-sans-serif, system-ui, sans-serif';
    context.textBaseline = 'middle';
    context.lineWidth = 1;

    for (const tick of yTicks) {
      const y = plot.top + ((80 - tick) / 80) * (plot.bottom - plot.top);
      context.strokeStyle = '#e2e8f0';
      context.beginPath();
      context.moveTo(plot.left, y);
      context.lineTo(plot.right, y);
      context.stroke();
      context.fillStyle = '#64748b';
      context.textAlign = 'right';
      context.fillText(tick === 0 ? '$0' : `$${tick}k`, plot.left - 7, y);
    }

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    REVENUE_LABELS.forEach((label, index) => {
      const x = plot.left + (index / (REVENUE_LABELS.length - 1)) * (plot.right - plot.left);
      context.fillStyle = '#64748b';
      context.fillText(label, x, height - 4);
    });

    for (const series of REVENUE_SERIES) {
      context.strokeStyle = series.color;
      context.fillStyle = '#ffffff';
      context.lineWidth = series.color === '#2563eb' ? 2 : 1.5;
      context.beginPath();

      series.values.forEach((value, index) => {
        const x = plot.left + (index / (series.values.length - 1)) * (plot.right - plot.left);
        const y = plot.top + ((80 - value) / 80) * (plot.bottom - plot.top);
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();

      series.values.forEach((value, index) => {
        const x = plot.left + (index / (series.values.length - 1)) * (plot.right - plot.left);
        const y = plot.top + ((80 - value) / 80) * (plot.bottom - plot.top);
        context.beginPath();
        context.arc(x, y, 2.75, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = series.color;
        context.lineWidth = 1.5;
        context.stroke();
      });
    }
  }
}
