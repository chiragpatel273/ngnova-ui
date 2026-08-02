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
import { heroBars3, heroChevronDown, heroXMark } from '@ng-icons/heroicons/outline';
import { NGNOVA_UI_VERSION } from '@ngnova/ui';
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
  { label: 'Style Guide', path: '/theming' },
  { label: 'Contributing', path: '/contributing' },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [CdkTrapFocus, NgIcon, NgTemplateOutlet, RouterLink, RouterLinkActive, RouterOutlet],
  providers: [provideIcons({ heroBars3, heroChevronDown, heroXMark })],
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

          <a routerLink="/" class="shrink-0 text-base font-bold text-blue-800 dark:text-blue-300">
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
        <div class="px-4 py-5">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p
                  class="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300"
                >
                  NgNova UI
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                  Documentation
                </p>
              </div>
              <span class="pt-0.5 font-mono text-[0.6875rem] text-slate-500 dark:text-slate-400">
                v{{ libraryVersion }}
              </span>
            </div>
          </div>

          <label class="mt-4 block lg:hidden">
            <span class="sr-only">Search documentation</span>
            <input
              type="search"
              placeholder="Search documentation..."
              [value]="query()"
              (input)="updateQuery($event)"
              class="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus-visible:border-blue-400"
            />
          </label>

          <nav class="mt-4" aria-label="Documentation start">
            <p
              class="mb-1.5 px-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500"
            >
              Overview
            </p>
            <a
              routerLink="/guide"
              routerLinkActive="bg-blue-50 font-semibold text-blue-800 shadow-[inset_3px_0_0_#2563eb] dark:bg-blue-950/50 dark:text-blue-200 dark:shadow-[inset_3px_0_0_#60a5fa]"
              class="flex min-h-9 items-center rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              (click)="handleSidebarNavigation()"
            >
              Getting Started
            </a>
          </nav>

          <nav class="mt-5 grid gap-3" aria-label="Component documentation">
            @for (group of componentGroups(); track group.label) {
              <section class="min-w-0">
                <button
                  type="button"
                  class="group flex min-h-8 w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                  [attr.aria-expanded]="groupExpanded(group.label)"
                  [attr.aria-controls]="sidebarGroupId(group.label)"
                  (click)="toggleGroup(group.label)"
                >
                  <span class="min-w-0 flex-1 truncate">{{ group.label }}</span>
                  <ng-icon
                    name="heroChevronDown"
                    class="size-3.5 shrink-0 text-slate-400 transition-transform group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    [class.-rotate-90]="!groupExpanded(group.label)"
                    aria-hidden="true"
                  />
                </button>
                <div
                  class="ml-3 mt-1 grid gap-0.5 border-l border-slate-200 pl-2 dark:border-slate-800"
                  [id]="sidebarGroupId(group.label)"
                  [class.hidden]="!groupExpanded(group.label)"
                >
                  @for (item of group.docs; track item.slug) {
                    <a
                      [routerLink]="['/components', item.slug]"
                      routerLinkActive="bg-blue-50 font-semibold text-blue-800 shadow-[inset_3px_0_0_#2563eb] dark:bg-blue-950/50 dark:text-blue-200 dark:shadow-[inset_3px_0_0_#60a5fa]"
                      class="flex min-h-8 items-center rounded-md px-3 py-1.5 text-[0.8125rem] text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
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
                class="flex min-h-9 items-center rounded-md px-3 py-1.5 text-[0.8125rem] text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                (click)="handleSidebarNavigation()"
              >
                No matching components
              </a>
            }
          </nav>

          <nav
            class="mt-5 grid gap-0.5 border-t border-slate-200 pt-4 dark:border-slate-800"
            aria-label="Reference navigation"
          >
            <p
              class="mb-1 px-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500"
            >
              Reference
            </p>
            @for (item of referenceItems; track item.label) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-blue-50 font-semibold text-blue-800 shadow-[inset_3px_0_0_#2563eb] dark:bg-blue-950/50 dark:text-blue-200 dark:shadow-[inset_3px_0_0_#60a5fa]"
                class="flex min-h-8 items-center rounded-md px-3 py-1.5 text-[0.8125rem] text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
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
            class="relative h-dvh w-[min(20rem,calc(100vw-2.5rem))] overflow-y-auto border-r border-slate-200 bg-white shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-950"
            (keydown.escape)="closeMobileNavigation()"
          >
            <div
              class="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
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

      <div class="mx-auto grid max-w-[100rem] lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside
          class="sticky top-12 hidden h-[calc(100dvh-3rem)] overflow-y-auto border-r border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950 lg:block"
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
  protected readonly expandedGroups = signal<ReadonlySet<string>>(
    new Set(COMPONENT_GROUPS.map((group) => group.label)),
  );
  protected readonly libraryVersion = NGNOVA_UI_VERSION;
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

  protected groupExpanded(label: string): boolean {
    return !!this.query().trim() || this.expandedGroups().has(label);
  }

  protected toggleGroup(label: string): void {
    this.expandedGroups.update((expanded) => {
      const next = new Set(expanded);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  protected sidebarGroupId(label: string): string {
    return `docs-group-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;
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
    this.expandGroupForUrl(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.closeMobileNavigation(false);
        this.expandGroupForUrl(event.urlAfterRedirects);
      });
  }

  private expandGroupForUrl(url: string): void {
    const slug = /^\/components\/([^/?#]+)/.exec(url)?.[1];
    if (!slug) {
      return;
    }

    const group = COMPONENT_GROUPS.find((candidate) => candidate.slugs.includes(slug));
    if (!group || this.expandedGroups().has(group.label)) {
      return;
    }

    this.expandedGroups.update((expanded) => new Set([...expanded, group.label]));
  }
}
