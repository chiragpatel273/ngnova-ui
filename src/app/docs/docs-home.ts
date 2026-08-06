import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import type { OnDestroy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowRight,
  heroChatBubbleLeftRight,
  heroCheckCircle,
  heroClipboardDocument,
  heroClipboardDocumentList,
  heroRectangleStack,
  heroTableCells,
} from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiBadgeComponent } from '@ngnova/ui/badge';
import { UiButtonComponent, UiButtonIconDirective } from '@ngnova/ui/button';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiTagComponent } from '@ngnova/ui/tag';

interface QuickStartSnippet {
  readonly id: 'install' | 'import' | 'showcase';
  readonly label: string;
  readonly code: string;
}

interface HomeAssurance {
  readonly title: string;
  readonly description: string;
}

interface HomeBenefit {
  readonly title: string;
  readonly description: string;
}

interface HomeTaskLink {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly path: string;
}

@Component({
  selector: 'app-docs-home',
  standalone: true,
  imports: [
    NgIcon,
    RouterLink,
    UiAvatarComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiButtonIconDirective,
    UiInputComponent,
    UiProgressBarComponent,
    UiTagComponent,
  ],
  providers: [
    provideIcons({
      heroArrowRight,
      heroChatBubbleLeftRight,
      heroCheckCircle,
      heroClipboardDocument,
      heroClipboardDocumentList,
      heroRectangleStack,
      heroTableCells,
    }),
  ],
  template: `
    <article class="mx-auto max-w-[76rem] pb-16">
      <section class="pt-5">
        <div
          data-home-hero
          class="overflow-hidden rounded border border-blue-200 bg-white dark:border-blue-950 dark:bg-slate-950"
        >
          <div
            class="grid min-w-0 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)] lg:items-stretch"
          >
            <header class="min-w-0 p-5 sm:p-6 lg:p-8">
              <div class="flex flex-wrap items-center gap-2">
                <ui-badge variant="info" size="sm">Angular 22 ready</ui-badge>
              </div>

              <h1
                class="mt-4 max-w-3xl text-2xl font-bold leading-8 tracking-normal text-slate-950 dark:text-slate-50"
              >
                Build production-ready Angular interfaces faster
              </h1>

              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Accessible standalone components, focused imports, and package-aligned documentation
                help Angular teams ship with confidence.
              </p>

              <div class="mt-6 flex flex-wrap gap-3">
                <a routerLink="/guide">
                  <ui-button>Get started</ui-button>
                </a>
                <a routerLink="/components/button">
                  <ui-button variant="outline">Explore components</ui-button>
                </a>
              </div>
            </header>

            <aside
              class="min-w-0 border-t border-blue-200 bg-slate-50/70 p-5 dark:border-blue-950 dark:bg-slate-900/50 sm:p-6 lg:border-l lg:border-t-0"
              aria-labelledby="quick-start-heading"
            >
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300"
              >
                Quick start
              </p>
              <h2
                id="quick-start-heading"
                class="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50"
              >
                Start in minutes
              </h2>

              <div class="mt-5 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
                @for (snippet of quickStartSnippets; track snippet.id) {
                  <section class="min-w-0">
                    <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {{ snippet.label }}
                    </h3>

                    <div
                      class="relative mt-2 min-w-0 overflow-hidden rounded bg-slate-950 shadow-sm"
                    >
                      <pre
                        class="max-w-full overflow-x-auto whitespace-pre py-3 pl-4 pr-13 font-mono text-xs leading-5 text-slate-100"
                        [title]="snippet.code"
                      ><code>{{ snippet.code }}</code></pre>
                      <ui-button
                        class="absolute right-2 top-2"
                        appearance="solid"
                        intent="neutral"
                        size="sm"
                        [iconOnly]="true"
                        [ariaLabel]="copyButtonLabel(snippet)"
                        [title]="copyButtonLabel(snippet)"
                        (click)="copySnippet(snippet)"
                      >
                        <ng-icon
                          uiButtonIcon
                          [name]="
                            copiedSnippet() === snippet.id
                              ? 'heroCheckCircle'
                              : 'heroClipboardDocument'
                          "
                        />
                      </ui-button>
                    </div>
                  </section>
                }
              </div>

              <p class="mt-5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Import only the component entry points your Angular screen needs.
              </p>
              <p class="sr-only" aria-live="polite">{{ copyAnnouncement() }}</p>
            </aside>
          </div>

          <section
            class="grid border-t border-blue-200 dark:border-blue-950 md:grid-cols-3"
            aria-label="Library assurances"
          >
            @for (assurance of assurances; track assurance.title) {
              <div
                class="flex gap-3 border-b border-blue-100 p-4 last:border-b-0 dark:border-blue-950/70 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <ng-icon
                  class="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  name="heroCheckCircle"
                  size="18"
                  aria-hidden="true"
                />
                <div>
                  <h2 class="text-sm font-semibold text-slate-950 dark:text-slate-100">
                    {{ assurance.title }}
                  </h2>
                  <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {{ assurance.description }}
                  </p>
                </div>
              </div>
            }
          </section>
        </div>
      </section>

      <section class="mt-8" data-home-showcase aria-labelledby="showcase-heading">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300"
            >
              Built with NgNova
            </p>
            <h2
              id="showcase-heading"
              class="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-50"
            >
              Start from a product workflow, not a blank screen.
            </h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Explore realistic Angular compositions, see the focused package entry points behind
              them, and copy a starter directly into your project.
            </p>
          </div>
          <a
            routerLink="/templates"
            class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Explore templates
            <ng-icon name="heroArrowRight" size="16" aria-hidden="true" />
          </a>
        </div>

        <div
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-12"
          aria-label="Example product interfaces built with NgNova UI"
        >
          <article
            id="showcase-payment"
            class="min-w-0 rounded border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-950 dark:text-slate-100">
                  Payment method
                </h3>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Transactions are secure and encrypted.
                </p>
              </div>
              <ui-tag size="sm" variant="success">Secure</ui-tag>
            </div>
            <div class="mt-4 grid gap-3">
              <ui-input
                label="Name on card"
                placeholder="Maya Chen"
                size="sm"
                autocomplete="cc-name"
              />
              <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6rem]">
                <ui-input
                  label="Card number"
                  placeholder="4242 4242 4242 4242"
                  size="sm"
                  autocomplete="cc-number"
                />
                <ui-input label="CVV" placeholder="123" size="sm" autocomplete="cc-csc" />
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <a routerLink="/components/input">
                <ui-button variant="outline" size="sm">Review fields</ui-button>
              </a>
              <a routerLink="/components/form-field">
                <ui-button size="sm">Continue</ui-button>
              </a>
            </div>
          </article>

          <article
            class="flex min-h-64 flex-col items-center justify-center rounded border border-slate-200 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-3"
          >
            <div class="flex -space-x-2" aria-hidden="true">
              <ui-avatar label="Maya Chen" size="sm" />
              <ui-avatar label="Alex Morgan" size="sm" />
              <ui-avatar label="Sam Rivera" size="sm" />
            </div>
            <h3 class="mt-4 text-sm font-semibold text-slate-950 dark:text-slate-100">
              Bring your team together
            </h3>
            <p class="mt-1 max-w-52 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Invite collaborators and give every project a clear owner.
            </p>
            <a routerLink="/components/avatar" class="mt-4">
              <ui-button size="sm">Invite members</ui-button>
            </a>
          </article>

          <article
            class="min-w-0 rounded border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-950 dark:text-slate-100">
                  Account security
                </h3>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Protect access without adding friction.
                </p>
              </div>
              <ui-tag size="sm" variant="success">Verified</ui-tag>
            </div>
            <div
              class="mt-4 rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Two-factor authentication
                  </p>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Verify via email or authenticator.
                  </p>
                </div>
                <a routerLink="/components/switch">
                  <ui-button size="sm">Enable</ui-button>
                </a>
              </div>
            </div>
            <div
              class="mt-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300"
            >
              <ng-icon name="heroCheckCircle" size="16" aria-hidden="true" />
              Recovery methods are up to date.
            </div>
          </article>

          <article
            class="min-w-0 rounded border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-950 dark:text-slate-100">
                  Release readiness
                </h3>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Version 1.0.0 · Production
                </p>
              </div>
              <ui-tag size="sm" variant="info">Running</ui-tag>
            </div>
            <ui-progress-bar
              class="mt-5"
              [value]="76"
              label="Release checks"
              ariaValueText="76 percent complete"
            />
            <div class="mt-4 grid grid-cols-3 gap-2 text-center">
              <div class="rounded bg-slate-50 p-2 dark:bg-slate-900">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Passed</p>
                <p class="mt-0.5 text-xs text-slate-500">Tests</p>
              </div>
              <div class="rounded bg-slate-50 p-2 dark:bg-slate-900">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Valid</p>
                <p class="mt-0.5 text-xs text-slate-500">Package</p>
              </div>
              <div class="rounded bg-slate-50 p-2 dark:bg-slate-900">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Synced</p>
                <p class="mt-0.5 text-xs text-slate-500">Docs</p>
              </div>
            </div>
          </article>

          <article
            class="min-w-0 rounded border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-5"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-950 dark:text-slate-100">
                  Customer reply
                </h3>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Ticket #1842 · Billing question
                </p>
              </div>
              <ui-tag size="sm" variant="warning">Waiting</ui-tag>
            </div>
            <div
              class="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              Could you help me update the billing contact before our next renewal?
            </div>
            <div class="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <ui-input label="Reply" placeholder="Write a helpful response..." size="sm" />
              <a routerLink="/components/input">
                <ui-button size="sm">Send reply</ui-button>
              </a>
            </div>
          </article>

          <article
            class="min-w-0 rounded border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-950 dark:text-slate-100">
                  Workspace usage
                </h3>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Growth plan</p>
              </div>
              <ui-badge size="sm" variant="info">68%</ui-badge>
            </div>
            <ui-progress-bar
              class="mt-5"
              [value]="68"
              label="Workspace usage"
              ariaValueText="68 percent used"
            />
            <p class="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              6.8 GB of 10 GB used. Upgrade before the next reporting cycle.
            </p>
            <a routerLink="/components/progress-bar" class="mt-4 inline-block">
              <ui-button variant="outline" size="sm">View usage</ui-button>
            </a>
          </article>
        </div>

        <div
          class="mt-4 grid gap-5 rounded border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(24rem,1.2fr)] lg:items-center"
        >
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <ui-badge size="sm" variant="info">Angular starter</ui-badge>
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                Focused entry points
              </span>
            </div>
            <h3 class="mt-3 text-base font-semibold text-slate-950 dark:text-slate-100">
              Use only the primitives your workflow needs
            </h3>
            <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
              This starter covers the examples above without importing the entire library. Continue
              with each component page for live behavior, accessibility guidance, and complete
              templates.
            </p>
            <div class="mt-4 flex flex-wrap gap-2" aria-label="Components used in the starter">
              @for (component of showcaseComponents; track component) {
                <ui-tag size="sm">{{ component }}</ui-tag>
              }
            </div>
          </div>

          <div class="min-w-0">
            <div class="relative overflow-hidden rounded bg-slate-950 shadow-sm">
              <div class="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
                <span class="text-xs font-medium text-slate-400">workflow.component.ts</span>
                <ui-button
                  appearance="solid"
                  intent="neutral"
                  size="sm"
                  [iconOnly]="true"
                  [ariaLabel]="copyButtonLabel(showcaseSnippet)"
                  [title]="copyButtonLabel(showcaseSnippet)"
                  (click)="copySnippet(showcaseSnippet)"
                >
                  <ng-icon
                    uiButtonIcon
                    [name]="
                      copiedSnippet() === showcaseSnippet.id
                        ? 'heroCheckCircle'
                        : 'heroClipboardDocument'
                    "
                  />
                </ui-button>
              </div>
              <pre
                class="max-w-full overflow-x-auto whitespace-pre p-4 font-mono text-xs leading-5 text-slate-100"
              ><code>{{ showcaseSnippet.code }}</code></pre>
            </div>
            <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span class="text-xs text-slate-500 dark:text-slate-400">
                Standalone · Tailwind v4 · Tree-shakeable
              </span>
              <a
                routerLink="/components/form-field"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300"
              >
                Open implementation recipes
                <ng-icon name="heroArrowRight" size="14" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        class="mt-6 grid gap-6 rounded border border-blue-200 bg-white p-5 dark:border-blue-950 dark:bg-slate-950 sm:p-6 lg:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.14fr)]"
      >
        <div class="self-center">
          <p
            class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300"
          >
            Made for production
          </p>
          <h2
            class="mt-2 text-xl font-bold leading-7 tracking-normal text-slate-950 dark:text-slate-50"
          >
            Built for real Angular teams
          </h2>
          <p class="mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Move from a first import to a consistent product UI with typed APIs, deliberate
            defaults, and release checks that exercise the package as a consumer would.
          </p>
          <a
            routerLink="/guide"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Read the architecture guide
            <ng-icon name="heroArrowRight" size="16" aria-hidden="true" />
          </a>
        </div>

        <div
          class="border-t border-blue-200 dark:border-blue-950 lg:border-l lg:border-t-0 lg:pl-6"
        >
          @for (benefit of benefits; track benefit.title) {
            <section
              class="border-b border-blue-200 py-4 first:pt-0 last:border-b-0 last:pb-0 dark:border-blue-950 lg:first:pt-4"
            >
              <h3 class="text-base font-semibold text-slate-950 dark:text-slate-100">
                {{ benefit.title }}
              </h3>
              <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {{ benefit.description }}
              </p>
            </section>
          }
        </div>
      </section>

      <section class="mt-7">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300"
            >
              Explore by task
            </p>
            <h2 class="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-50">
              Start with what you need
            </h2>
          </div>
          <a
            routerLink="/components/button"
            class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Browse every component
            <ng-icon name="heroArrowRight" size="16" aria-hidden="true" />
          </a>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          @for (task of taskLinks; track task.label) {
            <a
              [routerLink]="task.path"
              class="group flex min-h-24 gap-3 rounded border border-blue-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-blue-950 dark:bg-slate-950 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            >
              <span
                class="flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700 group-hover:bg-white dark:bg-blue-950 dark:text-blue-300 dark:group-hover:bg-slate-900"
              >
                <ng-icon [name]="task.icon" size="20" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span
                  class="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-100"
                >
                  {{ task.label }}
                  <ng-icon
                    class="text-blue-600 transition-transform group-hover:translate-x-0.5 dark:text-blue-400"
                    name="heroArrowRight"
                    size="15"
                    aria-hidden="true"
                  />
                </span>
                <span class="mt-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {{ task.description }}
                </span>
              </span>
            </a>
          }
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsHomeComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private copyResetTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

  protected readonly copiedSnippet = signal<QuickStartSnippet['id'] | null>(null);
  protected readonly copyAnnouncement = signal('');

  protected readonly quickStartSnippets: readonly QuickStartSnippet[] = [
    {
      id: 'install',
      label: 'Install',
      code: 'npm install @ngnova/ui',
    },
    {
      id: 'import',
      label: 'Import',
      code: "import { UiButtonComponent } from '@ngnova/ui/button';",
    },
  ];

  protected readonly showcaseSnippet: QuickStartSnippet = {
    id: 'showcase',
    label: 'Workflow starter imports',
    code: `import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiTagComponent } from '@ngnova/ui/tag';`,
  };

  protected readonly showcaseComponents = [
    'Avatar',
    'Button',
    'Input',
    'Progress Bar',
    'Tag',
  ] as const;

  protected readonly assurances: readonly HomeAssurance[] = [
    {
      title: 'Angular-native',
      description: 'Standalone, typed, and tree-shakeable by design.',
    },
    {
      title: 'Accessible by default',
      description: 'Semantics, keyboard behavior, and focus management built in.',
    },
    {
      title: 'Release checked',
      description: 'Tests, builds, package audits, and consumer verification on every release.',
    },
  ];

  protected readonly benefits: readonly HomeBenefit[] = [
    {
      title: 'Focused package entry points',
      description:
        'Import only what a screen needs for smaller bundles, clearer ownership, and faster builds.',
    },
    {
      title: 'Tailwind v4 theming',
      description:
        'Use documented theme contracts and sensible defaults without giving up product-level customization.',
    },
    {
      title: 'API-aligned documentation',
      description:
        'Examples, code snippets, and API tables follow the same public contracts shipped by the library.',
    },
  ];

  protected readonly taskLinks: readonly HomeTaskLink[] = [
    {
      label: 'Build forms',
      description: 'Inputs, selection, validation, and upload patterns.',
      icon: 'heroClipboardDocumentList',
      path: '/components/form-field',
    },
    {
      label: 'Present data',
      description: 'Tables, pagination, and scalable data states.',
      icon: 'heroTableCells',
      path: '/components/table',
    },
    {
      label: 'Guide workflows',
      description: 'Steppers, tabs, navigation, and progressive disclosure.',
      icon: 'heroRectangleStack',
      path: '/components/stepper',
    },
    {
      label: 'Show feedback',
      description: 'Alerts, toasts, progress, and loading states.',
      icon: 'heroChatBubbleLeftRight',
      path: '/components/alert',
    },
  ];

  protected copySnippet(snippet: QuickStartSnippet): void {
    this.copiedSnippet.set(snippet.id);
    this.copyAnnouncement.set(`Copying the ${snippet.label.toLowerCase()} command.`);
    this.changeDetectorRef.detectChanges();
    void this.completeCopy(snippet);
  }

  private async completeCopy(snippet: QuickStartSnippet): Promise<void> {
    const copied = await this.writeToClipboard(snippet.code);

    if (!copied) {
      this.copiedSnippet.set(null);
      this.copyAnnouncement.set(
        `Could not copy the ${snippet.label.toLowerCase()} command. Select the code and copy it manually.`,
      );
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.copyAnnouncement.set(`${snippet.label} command copied to clipboard.`);
    this.changeDetectorRef.markForCheck();

    if (this.copyResetTimer !== null) {
      globalThis.clearTimeout(this.copyResetTimer);
    }

    this.copyResetTimer = globalThis.setTimeout(() => {
      this.copiedSnippet.set(null);
      this.copyResetTimer = null;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  protected copyButtonLabel(snippet: QuickStartSnippet): string {
    return this.copiedSnippet() === snippet.id
      ? `${snippet.label} command copied`
      : `Copy ${snippet.label.toLowerCase()} command`;
  }

  ngOnDestroy(): void {
    if (this.copyResetTimer !== null) {
      globalThis.clearTimeout(this.copyResetTimer);
    }
  }

  private async writeToClipboard(value: string): Promise<boolean> {
    const clipboard = this.document.defaultView?.navigator.clipboard;

    if (clipboard?.writeText) {
      try {
        await clipboard.writeText(value);
        return true;
      } catch {
        // Continue with the selection-based fallback for restricted browser contexts.
      }
    }

    return this.copyWithSelection(value);
  }

  private copyWithSelection(value: string): boolean {
    if (!this.document.body) {
      return false;
    }

    const textarea = this.document.createElement('textarea');
    textarea.value = value;
    textarea.readOnly = true;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    this.document.body.append(textarea);
    textarea.select();

    try {
      return this.document.execCommand('copy');
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
}
