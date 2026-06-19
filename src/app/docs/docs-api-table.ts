import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { ApiInput, ApiOutput } from './docs-data';

@Component({
  selector: 'app-docs-api-table',
  standalone: true,
  template: `
    <div class="grid gap-6">
      @if (apiInputs().length) {
        <section>
          <h3 class="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
            Inputs
          </h3>
          <div
            class="overflow-hidden rounded border border-red-200 bg-white dark:border-red-950 dark:bg-zinc-950"
          >
            <div class="grid divide-y divide-red-100 dark:divide-red-950/70 md:hidden">
              @for (apiInput of apiInputs(); track apiInput.name) {
                <article class="grid gap-3 p-4">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <code
                      class="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-red-800 dark:bg-red-950/70 dark:text-red-200"
                    >
                      {{ apiInput.name }}
                    </code>
                    <code
                      class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {{ apiInput.defaultValue }}
                    </code>
                  </div>
                  <code
                    class="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-zinc-700 dark:text-zinc-300 [overflow-wrap:anywhere]"
                  >
                    {{ apiInput.type }}
                  </code>
                  <p class="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {{ apiInput.description }}
                  </p>
                </article>
              }
            </div>
            <div class="hidden md:block">
              <table class="w-full table-fixed text-left text-sm">
                <thead
                  class="sticky top-0 z-10 border-b border-red-200 bg-zinc-200 text-zinc-900 dark:border-red-950 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <tr>
                    <th class="w-1/5 px-3 py-2.5 font-medium">Name</th>
                    <th class="w-1/4 px-3 py-2.5 font-medium">Type</th>
                    <th class="w-1/6 px-3 py-2.5 font-medium">Default</th>
                    <th class="px-3 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-red-100 dark:divide-red-950/70">
                  @for (apiInput of apiInputs(); track apiInput.name) {
                    <tr>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-red-800 dark:bg-red-950/70 dark:text-red-200"
                        >
                          {{ apiInput.name }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-zinc-700 dark:text-zinc-300 [overflow-wrap:anywhere]"
                        >
                          {{ apiInput.type }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                          {{ apiInput.defaultValue }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top leading-6 text-zinc-700 dark:text-zinc-300">
                        {{ apiInput.description }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>
      } @else {
        <p class="text-sm text-slate-500 dark:text-slate-400">
          This component uses content projection and has no inputs.
        </p>
      }

      @if (apiOutputs().length) {
        <section>
          <h3 class="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
            Outputs
          </h3>
          <div
            class="overflow-hidden rounded border border-red-200 bg-white dark:border-red-950 dark:bg-zinc-950"
          >
            <div class="grid divide-y divide-red-100 dark:divide-red-950/70 md:hidden">
              @for (apiOutput of apiOutputs(); track apiOutput.name) {
                <article class="grid gap-3 p-4">
                  <code
                    class="w-max rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-red-800 dark:bg-red-950/70 dark:text-red-200"
                  >
                    {{ apiOutput.name }}
                  </code>
                  <code
                    class="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-zinc-700 dark:text-zinc-300 [overflow-wrap:anywhere]"
                  >
                    {{ apiOutput.type }}
                  </code>
                  <p class="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {{ apiOutput.description }}
                  </p>
                </article>
              }
            </div>
            <div class="hidden md:block">
              <table class="w-full table-fixed text-left text-sm">
                <thead
                  class="sticky top-0 z-10 border-b border-red-200 bg-zinc-200 text-zinc-900 dark:border-red-950 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <tr>
                    <th class="w-1/4 px-3 py-2.5 font-medium">Name</th>
                    <th class="w-1/3 px-3 py-2.5 font-medium">Type</th>
                    <th class="px-3 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-red-100 dark:divide-red-950/70">
                  @for (apiOutput of apiOutputs(); track apiOutput.name) {
                    <tr>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-red-800 dark:bg-red-950/70 dark:text-red-200"
                        >
                          {{ apiOutput.name }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-zinc-700 dark:text-zinc-300 [overflow-wrap:anywhere]"
                        >
                          {{ apiOutput.type }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top leading-6 text-zinc-700 dark:text-zinc-300">
                        {{ apiOutput.description }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsApiTableComponent {
  readonly apiInputs = input<readonly ApiInput[]>([]);
  readonly apiOutputs = input<readonly ApiOutput[]>([]);
}
