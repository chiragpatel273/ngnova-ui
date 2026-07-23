import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { DocsCodeBlockComponent } from './docs-code-block';

type DocsExampleView = 'preview' | 'code';

let nextExampleId = 0;

@Component({
  selector: 'app-docs-preview-canvas',
  standalone: true,
  imports: [DocsCodeBlockComponent],
  host: {
    class: 'block min-w-0',
  },
  template: `
    <section
      class="overflow-hidden rounded border border-blue-200 bg-white shadow-sm dark:border-blue-950 dark:bg-slate-950"
      [attr.aria-labelledby]="titleId"
      [attr.data-visual-example]="visualId() || null"
    >
      <div
        class="grid gap-4 border-b border-blue-200 p-4 dark:border-blue-950 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-5"
      >
        <div class="min-w-0">
          <h3 [id]="titleId" class="text-lg font-bold text-slate-950 dark:text-slate-50">
            {{ title() }}
          </h3>
          @if (description()) {
            <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {{ description() }}
            </p>
          }
        </div>

        <div
          class="grid grid-cols-2 rounded bg-slate-100 p-1 dark:bg-slate-900"
          role="tablist"
          [attr.aria-label]="title() + ' example view'"
        >
          @for (view of views; track view.value) {
            <button
              type="button"
              role="tab"
              class="min-h-9 rounded px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
              [class.bg-white]="activeView() === view.value"
              [class.text-blue-800]="activeView() === view.value"
              [class.shadow-sm]="activeView() === view.value"
              [class.text-slate-600]="activeView() !== view.value"
              [class.dark:bg-slate-800]="activeView() === view.value"
              [class.dark:text-blue-200]="activeView() === view.value"
              [class.dark:text-slate-400]="activeView() !== view.value"
              [id]="tabId(view.value)"
              [attr.aria-controls]="panelId(view.value)"
              [attr.aria-selected]="activeView() === view.value"
              [tabIndex]="activeView() === view.value ? 0 : -1"
              (click)="activeView.set(view.value)"
              (keydown)="handleTabKeydown($event)"
            >
              {{ view.label }}
            </button>
          }
        </div>
      </div>

      @if (activeView() === 'preview') {
        <div
          role="tabpanel"
          [id]="panelId('preview')"
          [attr.aria-labelledby]="tabId('preview')"
          tabindex="0"
          class="p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 sm:p-6"
        >
          <div
            class="flex min-h-48 min-w-0 items-center justify-center overflow-x-auto rounded bg-slate-50 p-4 dark:bg-slate-900 sm:p-6"
          >
            <ng-content />
          </div>
        </div>
      } @else {
        <div
          role="tabpanel"
          [id]="panelId('code')"
          [attr.aria-labelledby]="tabId('code')"
          tabindex="0"
          class="min-w-0 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 sm:p-4"
        >
          <app-docs-code-block
            class="block min-w-0"
            [code]="code()"
            [filename]="filename()"
            [language]="language()"
          />
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsPreviewCanvasComponent {
  readonly title = input('Interactive example');
  readonly description = input('');
  readonly code = input.required<string>();
  readonly filename = input('example.html');
  readonly language = input('Angular template');
  readonly visualId = input('');

  protected readonly activeView = signal<DocsExampleView>('preview');
  protected readonly views: readonly { readonly label: string; readonly value: DocsExampleView }[] =
    [
      { label: 'Preview', value: 'preview' },
      { label: 'Code', value: 'code' },
    ];
  protected readonly exampleId = `docs-example-${++nextExampleId}`;
  protected readonly titleId = `${this.exampleId}-title`;

  protected tabId(view: DocsExampleView): string {
    return `${this.exampleId}-${view}-tab`;
  }

  protected panelId(view: DocsExampleView): string {
    return `${this.exampleId}-${view}-panel`;
  }

  protected handleTabKeydown(event: KeyboardEvent): void {
    const requestedView: DocsExampleView | undefined =
      event.key === 'ArrowLeft' || event.key === 'Home'
        ? 'preview'
        : event.key === 'ArrowRight' || event.key === 'End'
          ? 'code'
          : undefined;

    if (!requestedView) {
      return;
    }

    event.preventDefault();
    this.activeView.set(requestedView);
    const requestedTab = (event.currentTarget as HTMLElement)
      .closest('[role="tablist"]')
      ?.querySelector<HTMLElement>(`#${this.tabId(requestedView)}`);
    queueMicrotask(() => requestedTab?.focus());
  }
}
