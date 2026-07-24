import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { componentDocs, getComponentImportPath } from './docs-data';

interface ApiEntry {
  readonly name: string;
  readonly kind: ApiKind;
  readonly packageName: string;
  readonly description: string;
  readonly signatures: readonly string[];
}

type ApiKind = 'All' | 'Components' | 'Slots' | 'Services' | 'Types' | 'Interfaces';

const API_FILTERS: readonly ApiKind[] = [
  'All',
  'Components',
  'Slots',
  'Services',
  'Types',
  'Interfaces',
];

const API_ENTRIES: readonly ApiEntry[] = [
  ...componentDocs.map(
    (doc): ApiEntry => ({
      name: doc.importName.split(',')[0].trim(),
      kind: 'Components',
      packageName: getComponentImportPath(doc.slug),
      description: doc.summary,
      signatures: [doc.selector, `${doc.inputs.length} inputs`, `${doc.outputs.length} outputs`],
    }),
  ),
  {
    name: 'UiToastService',
    kind: 'Services',
    packageName: '@ngnova/ui/toast',
    description:
      'Service to trigger toast messages, snackbars, and application-level feedback through a shared viewport.',
    signatures: ['success()', 'warning()', 'dismiss()'],
  },
  {
    name: 'uiCardHeader / uiCardFooter',
    kind: 'Slots',
    packageName: '@ngnova/ui/card',
    description:
      'Projection marker attributes for placing card header and footer content without adding extra wrapper APIs.',
    signatures: ['selector: [uiCardHeader]', 'selector: [uiCardFooter]'],
  },
  {
    name: 'uiInputPrefix',
    kind: 'Slots',
    packageName: '@ngnova/ui/input',
    description:
      'Projection marker that places contextual content before the native input while preserving field semantics.',
    signatures: ['selector: [uiInputPrefix]'],
  },
  {
    name: 'uiInputSuffix',
    kind: 'Slots',
    packageName: '@ngnova/ui/input',
    description:
      'Projection marker that places actions, badges, or supporting content after the native input.',
    signatures: ['selector: [uiInputSuffix]'],
  },
  {
    name: 'uiModalHeader / uiModalFooter',
    kind: 'Slots',
    packageName: '@ngnova/ui/modal',
    description:
      'Projection markers for dialog title and action regions while preserving the modal accessibility contract.',
    signatures: ['selector: [uiModalHeader]', 'selector: [uiModalFooter]'],
  },
  {
    name: 'UiButtonVariant',
    kind: 'Types',
    packageName: '@ngnova/ui/button',
    description:
      'Literal union type defining the supported button visual treatments for product actions.',
    signatures: ["'primary'", "'secondary'", "'danger'"],
  },
  {
    name: 'UiInputAppearance',
    kind: 'Types',
    packageName: '@ngnova/ui/input',
    description: 'Literal union for outline and filled input appearances.',
    signatures: ["'outline'", "'filled'"],
  },
  {
    name: 'UiTableSortDirection',
    kind: 'Types',
    packageName: '@ngnova/ui/table',
    description: 'Literal union for table sort state emitted by sortable column headers.',
    signatures: ["'asc'", "'desc'"],
  },
  {
    name: 'UiSelectOption',
    kind: 'Interfaces',
    packageName: '@ngnova/ui/select',
    description:
      'Configuration object for select and radio style choices with labels, values, helper text, and disabled state.',
    signatures: ['label: string', 'value: string', 'disabled?: boolean'],
  },
  {
    name: 'UiTableColumn',
    kind: 'Interfaces',
    packageName: '@ngnova/ui/table',
    description:
      'Column configuration object for header labels, alignment, and sortable table fields.',
    signatures: ['key: string', 'header: string', 'sortable?: boolean'],
  },
];

@Component({
  selector: 'app-docs-api-reference',
  standalone: true,
  template: `
    <article class="mx-auto max-w-[76rem] pb-14">
      <header class="pt-2">
        <p
          class="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300"
        >
          Reference
        </p>
        <h1 class="mt-1.5 text-2xl font-bold leading-8 text-slate-950 dark:text-slate-50">
          API Reference
        </h1>
        <p class="mt-2 max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-300">
          Comprehensive documentation for all NgNova UI modules. Browse and filter through
          components, projection slots, services, and core types used across the library.
        </p>
      </header>

      <section
        class="mt-6 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        aria-label="API filters"
      >
        <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <label class="block">
            <span class="sr-only">Search API by name or description</span>
            <input
              type="search"
              placeholder="Search APIs..."
              [value]="query()"
              (input)="updateQuery($event)"
              class="h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-blue-400 dark:focus:bg-slate-950"
            />
          </label>

          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
            {{ filteredEntries().length }} of {{ apiEntries.length }} entries
          </p>
        </div>

        <div class="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <label class="block sm:hidden">
            <span class="sr-only">Module filter</span>
            <select
              class="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-blue-400"
              [value]="activeFilter()"
              (change)="updateFilter($event)"
            >
              @for (filter of filters; track filter) {
                <option [value]="filter">{{ filter === 'All' ? 'All Modules' : filter }}</option>
              }
            </select>
          </label>

          <div class="hidden flex-wrap gap-1.5 sm:flex">
            @for (filter of filters; track filter) {
              <button
                type="button"
                [class]="filterButtonClasses(filter)"
                [attr.aria-pressed]="activeFilter() === filter"
                (click)="activeFilter.set(filter)"
              >
                {{ filter === 'All' ? 'All' : filter }}
              </button>
            }
          </div>
        </div>
      </section>

      <section class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="API entries">
        @for (entry of filteredEntries(); track entry.name) {
          <article
            class="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"
          >
            <div class="flex items-start justify-between gap-3">
              <span [class]="kindBadgeClasses(entry.kind)">{{
                entry.kind.slice(0, -1) || entry.kind
              }}</span>
              <span
                class="max-w-[62%] break-all text-right font-mono text-xs leading-4 text-slate-500 dark:text-slate-400"
              >
                {{ entry.packageName }}
              </span>
            </div>
            <h2 class="mt-3 text-base font-semibold leading-5 text-slate-950 dark:text-slate-50">
              {{ entry.name }}
            </h2>
            <p class="mt-1.5 min-h-15 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {{ entry.description }}
            </p>
            <div class="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div class="flex flex-wrap gap-1.5">
                @for (signature of entry.signatures; track signature) {
                  <code
                    class="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs leading-4 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"
                  >
                    {{ signature }}
                  </code>
                }
              </div>
            </div>
          </article>
        } @empty {
          <p
            class="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 md:col-span-2 xl:col-span-3 dark:border-slate-700 dark:text-slate-300"
          >
            No APIs match the current filters.
          </p>
        }
      </section>

      <footer class="mt-8 border-t border-slate-200 pt-4 dark:border-slate-800">
        <p class="text-center text-xs text-slate-500 dark:text-slate-400">
          Showing {{ filteredEntries().length }} of {{ apiEntries.length }} public API entries.
        </p>
      </footer>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsApiReferenceComponent {
  protected readonly filters = API_FILTERS;
  protected readonly apiEntries = API_ENTRIES;
  protected readonly query = signal('');
  protected readonly activeFilter = signal<ApiKind>('All');
  protected readonly filteredEntries = computed<readonly ApiEntry[]>(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.apiEntries
      .filter((entry) => filter === 'All' || entry.kind === filter)
      .filter(
        (entry) =>
          !normalizedQuery ||
          [entry.name, entry.description, entry.packageName, ...entry.signatures].some((value) =>
            value.toLowerCase().includes(normalizedQuery),
          ),
      );
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected updateFilter(event: Event): void {
    this.activeFilter.set((event.target as HTMLSelectElement).value as ApiKind);
  }

  protected filterButtonClasses(filter: ApiKind): string {
    const base =
      'min-h-8 cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30';
    const active =
      'border-blue-700 bg-blue-700 text-white shadow-sm dark:border-blue-500 dark:bg-blue-600';
    const inactive =
      'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-200';

    return `${base} ${this.activeFilter() === filter ? active : inactive}`;
  }

  protected kindBadgeClasses(kind: ApiKind): string {
    const base = 'rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-[0.04em]';
    const colors: Record<ApiKind, string> = {
      All: 'bg-slate-200 text-slate-800',
      Components: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
      Slots: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      Services: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
      Types: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
      Interfaces: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    };

    return `${base} ${colors[kind]}`;
  }
}
