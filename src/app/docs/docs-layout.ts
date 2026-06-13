import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiBadgeComponent } from '@ngnova/ui';

import { componentDocs } from './docs-data';
import type { ComponentDoc } from './docs-data';

interface ComponentDocGroup {
  readonly label: string;
  readonly description: string;
  readonly docs: readonly ComponentDoc[];
}

interface PrimaryNavItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
}

const COMPONENT_GROUPS: readonly {
  readonly label: string;
  readonly description: string;
  readonly slugs: readonly string[];
}[] = [
  {
    label: 'Foundations',
    description: 'Core display and feedback primitives.',
    slugs: ['button', 'badge', 'tag', 'avatar', 'skeleton', 'progress-bar', 'spinner', 'alert'],
  },
  {
    label: 'Forms',
    description: 'Accessible controls with Angular forms support.',
    slugs: ['input', 'textarea', 'checkbox', 'radio', 'switch', 'select'],
  },
  {
    label: 'Overlays',
    description: 'Layered interaction patterns.',
    slugs: ['modal', 'toast'],
  },
  {
    label: 'Navigation And Data',
    description: 'Page structure and product data surfaces.',
    slugs: ['tabs', 'accordion', 'table', 'card'],
  },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UiBadgeComponent],
  template: `
    <main class="min-h-dvh bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div class="mx-auto grid min-h-dvh max-w-[92rem] lg:grid-cols-[20rem_1fr]">
        <aside
          class="border-b border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r"
        >
          <a
            routerLink="/"
            class="block rounded-lg p-2 transition hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/20"
              aria-hidden="true"
            >
              NN
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <ui-badge variant="info" size="sm">Angular 22</ui-badge>
              <ui-badge variant="success" size="sm">Tailwind 4</ui-badge>
            </div>
            <h1 class="mt-4 text-2xl font-semibold">NgNova UI</h1>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Production-ready standalone components with polished docs, typed APIs, and
              accessibility guidance.
            </p>
          </a>

          <div
            class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Documentation Surface
            </p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="font-semibold text-slate-950 dark:text-slate-50">{{ docs.length }}</p>
                <p class="text-slate-500 dark:text-slate-400">Components</p>
              </div>
              <div>
                <p class="font-semibold text-slate-950 dark:text-slate-50">100%</p>
                <p class="text-slate-500 dark:text-slate-400">API pages</p>
              </div>
            </div>
          </div>

          <nav class="mt-6 grid gap-1" aria-label="Documentation start">
            @for (item of primaryNav; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 dark:bg-blue-950/70 dark:text-blue-200 dark:ring-blue-900"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <label class="mt-6 block">
            <span class="sr-only">Search components</span>
            <input
              type="search"
              placeholder="Search components"
              [value]="query()"
              (input)="updateQuery($event)"
              class="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
            />
          </label>

          <nav
            class="mt-8 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            aria-label="Component documentation"
          >
            @for (group of groups(); track group.label) {
              <section class="min-w-56 lg:min-w-0">
                <div class="mb-2 px-2">
                  <h2 class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {{ group.label }}
                  </h2>
                  <p
                    class="mt-1 hidden text-xs leading-5 text-slate-500 dark:text-slate-500 lg:block"
                  >
                    {{ group.description }}
                  </p>
                </div>
                <div class="grid gap-1">
                  @for (doc of group.docs; track doc.slug) {
                    <a
                      class="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                      [routerLink]="['/components', doc.slug]"
                      routerLinkActive="bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 dark:bg-blue-950/70 dark:text-blue-200 dark:ring-blue-900"
                    >
                      <span>{{ doc.name }}</span>
                      <span
                        class="text-xs text-slate-300 transition group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-400"
                        aria-hidden="true"
                      >
                        /
                      </span>
                    </a>
                  }
                </div>
              </section>
            } @empty {
              <div
                class="rounded-md border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                No components match "{{ query() }}".
              </div>
            }
          </nav>
        </aside>

        <section class="min-w-0 px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
          <router-outlet />
        </section>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutComponent {
  protected readonly docs = componentDocs;
  protected readonly query = signal('');
  protected readonly primaryNav: readonly PrimaryNavItem[] = [
    { label: 'Overview', path: '/', exact: true },
    { label: 'Get Started', path: '/get-started' },
    { label: 'Components', path: '/components' },
    { label: 'Accessibility', path: '/accessibility' },
    { label: 'Theming', path: '/theming' },
    { label: 'Roadmap', path: '/roadmap' },
  ];
  protected readonly groups = computed<readonly ComponentDocGroup[]>(() => {
    const normalizedQuery = this.query().trim().toLowerCase();

    return COMPONENT_GROUPS.map((group) => ({
      label: group.label,
      description: group.description,
      docs: group.slugs
        .map((slug) => componentDocs.find((doc) => doc.slug === slug))
        .filter((doc): doc is ComponentDoc => !!doc)
        .filter((doc) => this.matchesQuery(doc, normalizedQuery)),
    })).filter((group) => group.docs.length > 0);
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  private matchesQuery(doc: ComponentDoc, query: string): boolean {
    if (!query) {
      return true;
    }

    return [doc.name, doc.selector, doc.summary, doc.importName].some((value) =>
      value.toLowerCase().includes(query),
    );
  }
}
