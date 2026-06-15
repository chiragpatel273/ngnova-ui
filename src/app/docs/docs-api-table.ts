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
          <div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[48rem] table-fixed text-left text-sm">
                <thead
                  class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  <tr>
                    <th class="w-1/5 px-3 py-2.5 font-medium">Name</th>
                    <th class="w-1/4 px-3 py-2.5 font-medium">Type</th>
                    <th class="w-1/6 px-3 py-2.5 font-medium">Default</th>
                    <th class="px-3 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                  @for (apiInput of apiInputs(); track apiInput.name) {
                    <tr>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs text-blue-700 dark:bg-blue-950/70 dark:text-blue-200"
                        >
                          {{ apiInput.name }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="font-mono text-xs leading-5 text-slate-700 dark:text-slate-300"
                        >
                          {{ apiInput.type }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {{ apiInput.defaultValue }}
                        </code>
                      </td>
                      <td
                        class="px-3 py-2.5 align-top leading-6 text-slate-600 dark:text-slate-300"
                      >
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
          <div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[42rem] table-fixed text-left text-sm">
                <thead
                  class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  <tr>
                    <th class="w-1/4 px-3 py-2.5 font-medium">Name</th>
                    <th class="w-1/3 px-3 py-2.5 font-medium">Type</th>
                    <th class="px-3 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                  @for (apiOutput of apiOutputs(); track apiOutput.name) {
                    <tr>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs text-blue-700 dark:bg-blue-950/70 dark:text-blue-200"
                        >
                          {{ apiOutput.name }}
                        </code>
                      </td>
                      <td class="px-3 py-2.5 align-top">
                        <code
                          class="font-mono text-xs leading-5 text-slate-700 dark:text-slate-300"
                        >
                          {{ apiOutput.type }}
                        </code>
                      </td>
                      <td
                        class="px-3 py-2.5 align-top leading-6 text-slate-600 dark:text-slate-300"
                      >
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
