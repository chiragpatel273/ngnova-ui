import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UiButtonComponent } from '@ngnova/ui';

@Component({
  selector: 'app-docs-code-block',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <figure
      class="overflow-hidden rounded border border-[#3c3c3c] bg-[#1e1e1e] shadow-xl shadow-zinc-300/40 dark:shadow-black/30"
    >
      <figcaption
        class="flex flex-wrap items-center justify-between gap-3 border-b border-[#3c3c3c] bg-[#252526] px-4 py-3 text-xs text-[#cccccc]"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-2.5">
          <span class="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true"></span>
          <span class="size-3 rounded-full bg-[#ffbd2e]" aria-hidden="true"></span>
          <span class="size-3 rounded-full bg-[#28c840]" aria-hidden="true"></span>
          <span class="ml-2 truncate font-mono font-semibold text-[#d4d4d4]">{{ filename() }}</span>
          <span class="rounded bg-[#333333] px-2 py-1 font-mono text-[#9cdcfe]">
            {{ language() }}
          </span>
        </div>
        <ui-button variant="secondary" size="sm" (click)="copy()">
          {{ copiedLabel() }}
        </ui-button>
      </figcaption>
      <div class="grid max-h-96 grid-cols-[3.25rem_minmax(0,1fr)] overflow-y-auto">
        <pre
          class="select-none border-r border-[#3c3c3c] bg-[#1b1b1b] px-4 py-5 text-right font-mono text-sm leading-7 text-[#858585]"
          >{{ lineNumbers() }}</pre
        >
        <pre
          class="min-w-0 whitespace-pre-wrap break-words bg-[#1e1e1e] px-5 py-5 font-mono text-sm leading-7 text-[#d4d4d4] [overflow-wrap:anywhere]"
        ><code [innerHTML]="highlightedCode()"></code></pre>
      </div>
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
  protected readonly lineNumbers = computed(() =>
    Array.from({ length: this.code().split('\n').length }, (_, index) => index + 1).join('\n'),
  );
  protected readonly highlightedCode = computed(() =>
    this.code()
      .split('\n')
      .map((line) => this.highlightLine(line))
      .join('\n'),
  );

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1500);
  }

  private highlightLine(line: string): string {
    const tokenPattern = /(<\/?)([\w-]+)|([\w-]+)(=)("[^"]*")|(\[[^\]]+\]|\([^)]+\)|@\w+|\*\w+)/g;
    let highlighted = '';
    let lastIndex = 0;

    for (const match of line.matchAll(tokenPattern)) {
      highlighted += this.escapeHtml(line.slice(lastIndex, match.index));

      if (match[1] && match[2]) {
        highlighted += `<span class="text-[#808080]">${this.escapeHtml(match[1])}</span><span class="text-[#4ec9b0]">${this.escapeHtml(match[2])}</span>`;
      } else if (match[3] && match[4] && match[5]) {
        highlighted += `<span class="text-[#9cdcfe]">${this.escapeHtml(match[3])}</span><span class="text-[#d4d4d4]">${this.escapeHtml(match[4])}</span><span class="text-[#ce9178]">${this.escapeHtml(match[5])}</span>`;
      } else if (match[6]) {
        highlighted += `<span class="text-[#c586c0]">${this.escapeHtml(match[6])}</span>`;
      }

      lastIndex = (match.index ?? 0) + match[0].length;
    }

    return highlighted + this.escapeHtml(line.slice(lastIndex));
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
