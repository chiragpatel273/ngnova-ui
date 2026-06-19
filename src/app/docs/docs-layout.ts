import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { componentDocs } from './docs-data';
import type { ComponentDoc } from './docs-data';

interface SidebarItem {
  readonly label: string;
  readonly path: string;
  readonly category?: string;
}

interface PrimaryNavItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
}

const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { label: 'Getting Started', path: '/get-started' },
  { label: 'Layout', path: '/components/card', category: 'Layout' },
  { label: 'Buttons', path: '/components/button', category: 'Buttons' },
  { label: 'Forms', path: '/components/input', category: 'Forms' },
  { label: 'Navigation', path: '/components/tabs', category: 'Navigation' },
];

const REFERENCE_ITEMS: readonly SidebarItem[] = [
  { label: 'API Reference', path: '/apis' },
  { label: 'CLI Reference', path: '/get-started' },
  { label: 'Style Guide', path: '/theming' },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <main class="min-h-dvh bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header
        class="sticky top-0 z-40 border-b border-red-200 bg-zinc-50/95 backdrop-blur dark:border-red-950 dark:bg-zinc-950/95"
      >
        <div class="mx-auto flex h-16 max-w-[100rem] items-center gap-8 px-6">
          <a
            routerLink="/get-started"
            class="shrink-0 text-xl font-bold text-red-800 dark:text-red-300"
          >
            NgNova UI Docs
          </a>

          <nav class="hidden items-center gap-8 text-lg md:flex" aria-label="Primary documentation">
            @for (item of primaryNav; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="border-red-800 text-red-800 dark:border-red-300 dark:text-red-200"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="border-b-2 border-transparent py-5 text-zinc-700 transition hover:text-red-800 dark:text-zinc-300 dark:hover:text-red-200"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <div class="ml-auto flex items-center gap-4">
            <label class="hidden lg:block">
              <span class="sr-only">Search documentation</span>
              <input
                type="search"
                placeholder="Search documentation..."
                [value]="query()"
                (input)="updateQuery($event)"
                class="h-10 w-72 rounded border border-transparent bg-zinc-200 px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500/15 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>
            <button
              type="button"
              class="h-10 rounded px-3 text-base font-medium text-zinc-800 transition hover:bg-red-50 hover:text-red-800 dark:text-zinc-200 dark:hover:bg-red-950/40"
              aria-label="Toggle theme"
              (click)="darkMode.set(!darkMode())"
            >
              Theme
            </button>
            <a
              routerLink="/apis"
              class="h-10 rounded px-3 py-2 font-mono text-sm text-zinc-800 transition hover:bg-red-50 hover:text-red-800 dark:text-zinc-200 dark:hover:bg-red-950/40"
              aria-label="Open API reference"
            >
              CLI
            </a>
          </div>
        </div>
      </header>

      <div class="mx-auto grid max-w-[100rem] lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <aside
          class="border-b border-red-200 bg-zinc-100 dark:border-red-950 dark:bg-zinc-950 lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r"
        >
          <div class="px-5 py-7">
            <div class="px-1">
              <p class="text-xl font-bold text-zinc-950 dark:text-zinc-50">Core Components</p>
              <p class="mt-1 text-base text-zinc-600 dark:text-zinc-400">v0.1.0</p>
            </div>

            <label class="mt-6 block lg:hidden">
              <span class="sr-only">Search documentation</span>
              <input
                type="search"
                placeholder="Search documentation..."
                [value]="query()"
                (input)="updateQuery($event)"
                class="h-10 w-full rounded border border-red-200 bg-white px-3 text-sm outline-none dark:border-red-950 dark:bg-zinc-900"
              />
            </label>

            <nav class="mt-8 grid gap-2" aria-label="Core navigation">
              @for (item of sidebarItems(); track item.label) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="border-l-red-800 bg-red-50 font-semibold text-red-800 dark:bg-red-950/40 dark:text-red-200"
                  class="border-l-4 border-transparent px-4 py-2.5 text-base text-zinc-800 transition hover:bg-red-50 hover:text-red-800 dark:text-zinc-200 dark:hover:bg-red-950/30"
                >
                  {{ item.label }}
                </a>
              }
            </nav>

            <nav class="mt-10 grid gap-1" aria-label="Reference navigation">
              <p class="px-4 pb-2 text-xs font-bold uppercase text-zinc-500 dark:text-zinc-500">
                Reference
              </p>
              @for (item of referenceItems; track item.label) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="border-l-red-800 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                  class="border-l-4 border-transparent px-4 py-2 text-base text-zinc-700 transition hover:bg-red-50 hover:text-red-800 dark:text-zinc-300 dark:hover:bg-red-950/30"
                >
                  {{ item.label }}
                </a>
              }
            </nav>
          </div>
        </aside>

        <section class="min-w-0 px-6 py-8 sm:px-8 lg:px-10">
          <router-outlet />
        </section>
      </div>
    </main>
  `,
  host: {
    '[class.dark]': 'darkMode()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutComponent {
  protected readonly query = signal('');
  protected readonly darkMode = signal(false);
  protected readonly primaryNav: readonly PrimaryNavItem[] = [
    { label: 'Guide', path: '/get-started' },
    { label: 'Components', path: '/components' },
    { label: 'APIs', path: '/apis' },
    { label: 'Playground', path: '/playground' },
  ];
  protected readonly referenceItems = REFERENCE_ITEMS;
  protected readonly sidebarItems = computed<readonly SidebarItem[]>(() => {
    const normalizedQuery = this.query().trim().toLowerCase();

    if (!normalizedQuery) {
      return SIDEBAR_ITEMS;
    }

    const matchingComponents = componentDocs
      .filter((doc) => this.matchesQuery(doc, normalizedQuery))
      .slice(0, 6)
      .map((doc) => ({
        label: doc.name,
        path: `/components/${doc.slug}`,
      }));

    return matchingComponents.length ? matchingComponents : SIDEBAR_ITEMS;
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  private matchesQuery(doc: ComponentDoc, query: string): boolean {
    return [doc.name, doc.selector, doc.summary, doc.importName].some((value) =>
      value.toLowerCase().includes(query),
    );
  }
}
