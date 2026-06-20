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
    <article class="mx-auto max-w-[73rem] pb-20">
      <header class="pt-5">
        <h1 class="text-6xl font-bold leading-tight text-zinc-950 dark:text-zinc-50">
          API Reference
        </h1>
        <p class="mt-7 max-w-4xl text-2xl leading-10 text-zinc-600 dark:text-zinc-300">
          Comprehensive documentation for all NgNova UI modules. Browse and filter through
          components, projection slots, services, and core types used across the library.
        </p>
      </header>

      <section class="mt-10 grid gap-5">
        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <label class="block">
            <span class="sr-only">Search API by name or description</span>
            <input
              type="search"
              placeholder="Search API by name or description..."
              [value]="query()"
              (input)="updateQuery($event)"
              class="h-16 w-full rounded border border-red-200 bg-white px-7 text-xl text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-red-950 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>

          <label>
            <span class="sr-only">Module filter</span>
            <select
              class="h-16 w-full rounded border border-red-200 bg-white px-5 text-lg text-zinc-950 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/20 dark:border-red-950 dark:bg-zinc-950 dark:text-zinc-50"
              [value]="activeFilter()"
              (change)="updateFilter($event)"
            >
              @for (filter of filters; track filter) {
                <option [value]="filter">{{ filter === 'All' ? 'All Modules' : filter }}</option>
              }
            </select>
          </label>
        </div>

        <div class="flex flex-wrap gap-3">
          @for (filter of filters; track filter) {
            <button
              type="button"
              [class]="filterButtonClasses(filter)"
              (click)="activeFilter.set(filter)"
            >
              {{ filter === 'All' ? 'All' : filter }}
            </button>
          }
        </div>
      </section>

      <section class="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3" aria-label="API entries">
        @for (entry of filteredEntries(); track entry.name) {
          <article
            class="rounded border border-red-200 bg-white p-8 dark:border-red-950 dark:bg-zinc-950"
          >
            <div class="flex items-start justify-between gap-4">
              <span [class]="kindBadgeClasses(entry.kind)">{{
                entry.kind.slice(0, -1) || entry.kind
              }}</span>
              <span class="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                {{ entry.packageName }}
              </span>
            </div>
            <h2 class="mt-7 text-2xl font-medium text-zinc-950 dark:text-zinc-50">
              {{ entry.name }}
            </h2>
            <p class="mt-4 min-h-20 text-lg leading-7 text-zinc-600 dark:text-zinc-300">
              {{ entry.description }}
            </p>
            <div class="mt-8 border-t border-red-100 pt-6 dark:border-red-950/70">
              <div class="flex flex-wrap gap-3">
                @for (signature of entry.signatures; track signature) {
                  <code
                    class="rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    {{ signature }}
                  </code>
                }
              </div>
            </div>
          </article>
        } @empty {
          <p
            class="rounded border border-dashed border-red-200 p-8 text-zinc-600 dark:border-red-950 dark:text-zinc-300"
          >
            No APIs match the current filters.
          </p>
        }
      </section>

      <div class="mt-20 border-t border-red-200 pt-10 text-center dark:border-red-950">
        <p class="text-lg text-zinc-600 dark:text-zinc-300">
          Showing {{ filteredEntries().length }} of {{ apiEntries.length }} public API entries.
        </p>
      </div>
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
      'rounded-full px-6 py-3 text-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700';
    const active = 'bg-red-800 text-white';
    const inactive =
      'bg-zinc-200 text-zinc-800 hover:bg-red-100 hover:text-red-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-red-950/50';

    return `${base} ${this.activeFilter() === filter ? active : inactive}`;
  }

  protected kindBadgeClasses(kind: ApiKind): string {
    const base = 'rounded px-3 py-1 text-sm font-bold uppercase';
    const colors: Record<ApiKind, string> = {
      All: 'bg-zinc-200 text-zinc-800',
      Components: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
      Slots: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      Services: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
      Types: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
      Interfaces: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    };

    return `${base} ${colors[kind]}`;
  }
}
