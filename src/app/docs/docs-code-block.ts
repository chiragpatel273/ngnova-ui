import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UiButtonComponent } from '@ngnova/ui';

@Component({
  selector: 'app-docs-code-block',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <figure
      class="overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm ring-1 ring-blue-100 dark:border-blue-900 dark:bg-slate-950 dark:ring-blue-950"
    >
      <figcaption
        class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-700 bg-blue-600 px-4 py-2.5 text-xs text-blue-50 dark:border-blue-800 dark:bg-blue-700"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-2.5">
          <span class="rounded bg-white/15 px-2 py-1 font-semibold text-white">Code</span>
          <span class="truncate font-semibold text-white">{{ filename() }}</span>
          <span class="rounded bg-blue-500/60 px-2 py-1 text-blue-50 dark:bg-blue-600">
            {{ language() }}
          </span>
        </div>
        <ui-button variant="secondary" size="sm" (pressed)="copy()">
          {{ copiedLabel() }}
        </ui-button>
      </figcaption>
      <pre
        class="max-h-80 overflow-auto border-l-4 border-blue-500 bg-blue-50/70 p-4 font-mono text-sm leading-6 text-slate-900 shadow-inner dark:bg-slate-900 dark:text-slate-100"
      ><code>{{ code() }}</code></pre>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsCodeBlockComponent {
  readonly code = input.required<string>();
  readonly filename = input('example.html');
  readonly language = input('Angular template');

  private readonly copied = signal(false);
  protected readonly copiedLabel = computed(() => (this.copied() ? 'Copied' : 'Copy'));

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1500);
  }
}
