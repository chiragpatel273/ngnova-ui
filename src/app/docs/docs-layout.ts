import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DOCUMENT, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBars3, heroXMark } from '@ng-icons/heroicons/outline';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { componentDocs, getComponentImportPath } from './docs-data';
import type { ComponentDoc } from './docs-data';

interface SidebarItem {
  readonly label: string;
  readonly path: string;
}

interface ComponentDocGroup {
  readonly label: string;
  readonly slugs: readonly string[];
}

interface PrimaryNavItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
}

const COMPONENT_GROUPS: readonly ComponentDocGroup[] = [
  {
    label: 'Actions & status',
    slugs: [
      'button',
      'badge',
      'tag',
      'chip',
      'avatar',
      'alert',
      'spinner',
      'skeleton',
      'progress-bar',
    ],
  },
  {
    label: 'Forms',
    slugs: [
      'form-field',
      'input',
      'textarea',
      'checkbox',
      'radio',
      'switch',
      'select',
      'combobox',
      'date-picker',
      'file-upload',
    ],
  },
  {
    label: 'Layout & data',
    slugs: [
      'card',
      'divider',
      'table',
      'table-virtual-scroll',
      'data-view',
      'tree',
      'tree-table',
      'paginator',
    ],
  },
  {
    label: 'Navigation & workflow',
    slugs: ['breadcrumb', 'tabs', 'accordion', 'stepper'],
  },
  {
    label: 'Overlays & feedback',
    slugs: [
      'modal',
      'drawer',
      'menu',
      'popover',
      'tooltip',
      'toast',
      'command-palette',
      'overlay',
      'confirmation',
    ],
  },
];

const GROUPED_COMPONENT_SLUGS = new Set(COMPONENT_GROUPS.flatMap((group) => group.slugs));

const REFERENCE_ITEMS: readonly SidebarItem[] = [
  { label: 'API Reference', path: '/apis' },
  { label: 'Templates', path: '/templates' },
  { label: 'CLI Reference', path: '/guide' },
  { label: 'Style Guide', path: '/theming' },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [CdkTrapFocus, NgIcon, NgTemplateOutlet, RouterLink, RouterLinkActive, RouterOutlet],
  providers: [provideIcons({ heroBars3, heroXMark })],
  template: `
    <main
      class="min-h-dvh bg-slate-100 text-sm text-slate-950 dark:bg-slate-950 dark:text-slate-50"
    >
      <header
        class="sticky top-0 z-40 border-b border-blue-200 bg-slate-50/95 backdrop-blur dark:border-blue-950 dark:bg-slate-950/95"
      >
        <div class="mx-auto flex h-12 max-w-[100rem] items-center gap-3 px-4 sm:px-5 lg:gap-6">
          <button
            #mobileNavigationTrigger
            type="button"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:hidden dark:text-slate-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            aria-label="Open component navigation"
            aria-controls="docs-mobile-navigation"
            [attr.aria-expanded]="mobileNavigationOpen()"
            (click)="openMobileNavigation()"
          >
            <ng-icon name="heroBars3" class="size-5" aria-hidden="true" />
          </button>

          <a
            routerLink="/guide"
            class="shrink-0 text-base font-bold text-blue-800 dark:text-blue-300"
          >
            <span class="sm:hidden">NgNova UI</span>
            <span class="hidden sm:inline">NgNova UI Docs</span>
          </a>

          <nav
            class="hidden items-center gap-6 text-sm font-medium md:flex"
            aria-label="Primary documentation"
          >
            @for (item of primaryNav; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="border-blue-800 text-blue-800 dark:border-blue-300 dark:text-blue-200"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="border-b-2 border-transparent py-[1.125rem] text-slate-700 transition hover:text-blue-800 dark:text-slate-300 dark:hover:text-blue-200"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <div class="ml-auto flex items-center gap-3">
            <label class="hidden lg:block">
              <span class="sr-only">Search documentation</span>
              <input
                type="search"
                placeholder="Search documentation..."
                [value]="query()"
                (input)="updateQuery($event)"
                class="h-8 w-56 rounded border border-transparent bg-slate-200 px-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-500/15 dark:bg-slate-900 dark:text-slate-50"
              />
            </label>
            <button
              type="button"
              class="h-8 rounded px-2 text-xs font-medium text-slate-800 transition hover:bg-blue-50 hover:text-blue-800 dark:text-slate-200 dark:hover:bg-blue-950/40"
              [attr.aria-label]="themeToggleLabel()"
              [attr.aria-pressed]="darkMode()"
              (click)="toggleTheme()"
            >
              {{ themeLabel() }}
            </button>
            <a
              routerLink="/apis"
              class="hidden h-8 items-center rounded px-2 py-1.5 font-mono text-xs text-slate-800 transition hover:bg-blue-50 hover:text-blue-800 sm:inline-flex dark:text-slate-200 dark:hover:bg-blue-950/40"
              aria-label="Open API reference"
            >
              CLI
            </a>
          </div>
        </div>
      </header>

      <ng-template #navigationContent>
        <div class="px-3 py-4">
          <div
            class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                Components
              </p>
              <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                NgNova UI library
              </p>
            </div>
            <span
              class="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-950/50 dark:text-blue-200 dark:ring-blue-900"
            >
              v0.1.0
            </span>
          </div>

          <label class="mt-3 block lg:hidden">
            <span class="sr-only">Search documentation</span>
            <input
              type="search"
              placeholder="Search documentation..."
              [value]="query()"
              (input)="updateQuery($event)"
              class="h-8 w-full rounded-md border border-blue-200 bg-white px-2.5 text-xs outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-blue-950 dark:bg-slate-900 dark:focus-visible:border-blue-400"
            />
          </label>

          <nav class="mt-3 grid gap-1" aria-label="Documentation start">
            <a
              routerLink="/guide"
              routerLinkActive="bg-blue-50 font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:ring-blue-900"
              class="flex min-h-8 items-center rounded-md px-2.5 py-1.5 text-[0.8125rem] text-slate-700 transition hover:bg-white hover:text-blue-700 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-200"
              (click)="handleSidebarNavigation()"
            >
              Getting Started
            </a>
          </nav>

          <nav class="mt-4 grid gap-3.5" aria-label="Component documentation">
            @for (group of componentGroups(); track group.label) {
              <section>
                <div
                  class="mb-1.5 flex min-h-7 items-center rounded-md bg-slate-200/70 px-2.5 dark:bg-slate-900"
                >
                  <p
                    class="text-xs font-bold uppercase tracking-[0.06em] text-slate-700 dark:text-slate-300"
                  >
                    {{ group.label }}
                  </p>
                </div>
                <div class="ml-2 grid gap-1 border-l border-slate-200 pl-2 dark:border-slate-800">
                  @for (item of group.docs; track item.slug) {
                    <a
                      [routerLink]="['/components', item.slug]"
                      routerLinkActive="border-blue-200 bg-blue-50 font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200"
                      class="flex min-h-8 items-center rounded-md border border-transparent px-2.5 py-1.5 text-[0.8125rem] text-slate-700 transition hover:bg-white hover:text-blue-700 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-200"
                      (click)="handleSidebarNavigation()"
                    >
                      {{ item.name }}
                    </a>
                  }
                </div>
              </section>
            } @empty {
              <a
                routerLink="/components"
                class="flex min-h-8 items-center rounded-md px-2.5 py-1.5 text-[0.8125rem] text-slate-700 transition hover:bg-white hover:text-blue-700 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-200"
                (click)="handleSidebarNavigation()"
              >
                No matching components
              </a>
            }
          </nav>

          <nav
            class="mt-5 grid gap-1 border-t border-slate-200 pt-4 dark:border-slate-800"
            aria-label="Reference navigation"
          >
            <p
              class="px-2.5 pb-1 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-500"
            >
              Reference
            </p>
            @for (item of referenceItems; track item.label) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-blue-50 font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:ring-blue-900"
                class="flex min-h-8 items-center rounded-md px-2.5 py-1.5 text-[0.8125rem] text-slate-700 transition hover:bg-white hover:text-blue-700 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-200"
                (click)="handleSidebarNavigation()"
              >
                {{ item.label }}
              </a>
            }
          </nav>
        </div>
      </ng-template>

      @if (mobileNavigationOpen()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            class="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"
            aria-label="Close component navigation"
            (click)="closeMobileNavigation()"
          ></button>

          <aside
            id="docs-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Component navigation"
            tabindex="-1"
            cdkTrapFocus
            [cdkTrapFocusAutoCapture]="true"
            class="relative h-dvh w-[min(22rem,calc(100vw-3rem))] overflow-y-auto border-r border-slate-200 bg-slate-50 shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-950"
            (keydown.escape)="closeMobileNavigation()"
          >
            <div
              class="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
            >
              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Browse documentation
              </p>
              <button
                type="button"
                class="inline-flex size-9 items-center justify-center rounded-md text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-slate-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                aria-label="Close component navigation"
                (click)="closeMobileNavigation()"
              >
                <ng-icon name="heroXMark" class="size-5" aria-hidden="true" />
              </button>
            </div>
            <ng-container [ngTemplateOutlet]="navigationContent" />
          </aside>
        </div>
      }

      <div class="mx-auto grid max-w-[100rem] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <aside
          class="sticky top-12 hidden h-[calc(100dvh-3rem)] overflow-y-auto border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 lg:block"
        >
          <ng-container [ngTemplateOutlet]="navigationContent" />
        </aside>

        <section class="min-w-0 px-4 py-4 sm:px-5 lg:px-6">
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
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mobileNavigationTrigger =
    viewChild<ElementRef<HTMLButtonElement>>('mobileNavigationTrigger');

  protected readonly query = signal('');
  protected readonly darkMode = signal(false);
  protected readonly mobileNavigationOpen = signal(false);
  protected readonly themeLabel = computed(() => (this.darkMode() ? 'Light mode' : 'Dark mode'));
  protected readonly themeToggleLabel = computed(() =>
    this.darkMode() ? 'Switch to light mode' : 'Switch to dark mode',
  );
  protected readonly primaryNav: readonly PrimaryNavItem[] = [
    { label: 'Guide', path: '/guide', exact: true },
    { label: 'Components', path: '/components' },
    { label: 'Templates', path: '/templates', exact: true },
    { label: 'APIs', path: '/apis', exact: true },
    { label: 'Playground', path: '/playground', exact: true },
  ];
  protected readonly referenceItems = REFERENCE_ITEMS;
  private readonly bodyScrollLock = effect((onCleanup) => {
    if (!this.mobileNavigationOpen()) {
      return;
    }

    const previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    onCleanup(() => {
      this.document.body.style.overflow = previousOverflow;
    });
  });
  protected readonly componentGroups = computed<
    readonly {
      readonly label: string;
      readonly docs: readonly ComponentDoc[];
    }[]
  >(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    const matchesQuery = (doc: ComponentDoc): boolean =>
      !normalizedQuery || this.matchesQuery(doc, normalizedQuery);
    const groups = COMPONENT_GROUPS.map((group) => ({
      label: group.label,
      docs: group.slugs
        .map((slug) => componentDocs.find((doc) => doc.slug === slug))
        .filter((doc): doc is ComponentDoc => !!doc)
        .filter(matchesQuery),
    })).filter((group) => group.docs.length > 0);
    const uncategorizedDocs = componentDocs.filter(
      (doc) => !GROUPED_COMPONENT_SLUGS.has(doc.slug) && matchesQuery(doc),
    );

    return uncategorizedDocs.length > 0
      ? [...groups, { label: 'More components', docs: uncategorizedDocs }]
      : groups;
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggleTheme(): void {
    this.darkMode.update((enabled) => !enabled);
  }

  protected openMobileNavigation(): void {
    this.mobileNavigationOpen.set(true);
  }

  protected closeMobileNavigation(restoreFocus = true): void {
    if (!this.mobileNavigationOpen()) {
      return;
    }

    this.mobileNavigationOpen.set(false);
    if (restoreFocus) {
      this.mobileNavigationTrigger()?.nativeElement.focus();
    }
  }

  protected handleSidebarNavigation(): void {
    this.closeMobileNavigation(false);
    this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  private matchesQuery(doc: ComponentDoc, query: string): boolean {
    return [
      doc.name,
      doc.selector,
      doc.summary,
      doc.importName,
      getComponentImportPath(doc.slug),
    ].some((value) => value.toLowerCase().includes(query));
  }

  constructor() {
    this.viewportScroller.setOffset([0, 64]);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeMobileNavigation(false));
  }
}
