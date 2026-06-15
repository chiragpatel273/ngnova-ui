import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-docs-preview-canvas',
  standalone: true,
  template: `
    <div
      class="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
      >
        <div>
          <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">{{ title() }}</p>
          @if (description()) {
            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {{ description() }}
            </p>
          }
        </div>
        @if (status()) {
          <span
            class="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            {{ status() }}
          </span>
        }
      </div>
      <div class="p-5 sm:p-6">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsPreviewCanvasComponent {
  readonly title = input('Preview canvas');
  readonly description = input('');
  readonly status = input('');
}
