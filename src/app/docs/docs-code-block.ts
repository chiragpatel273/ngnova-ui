import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UiButtonComponent } from '@ngnova/ui';

@Component({
  selector: 'app-docs-code-block',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <figure
      class="overflow-hidden rounded border border-red-200 bg-zinc-950 shadow-sm dark:border-red-950"
    >
      <figcaption
        class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs text-zinc-300"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-2.5">
          <span class="rounded bg-red-700 px-2 py-1 font-semibold text-white">Code</span>
          <span class="truncate font-semibold text-zinc-100">{{ filename() }}</span>
          <span class="rounded bg-zinc-800 px-2 py-1 text-zinc-300">
            {{ language() }}
          </span>
        </div>
        <ui-button variant="secondary" size="sm" (pressed)="copy()">
          {{ copiedLabel() }}
        </ui-button>
      </figcaption>
      <pre
        class="max-h-80 overflow-auto border-l-4 border-red-700 bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 shadow-inner"
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
