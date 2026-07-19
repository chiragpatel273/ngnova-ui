import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiBadgeComponent } from '@ngnova/ui/badge';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiTagComponent } from '@ngnova/ui/tag';

import { DocsCodeBlockComponent } from './docs-code-block';
import { componentDocs } from './docs-data';

interface HomeMetric {
  readonly label: string;
  readonly value: string;
  readonly description: string;
}

interface HomePrinciple {
  readonly title: string;
  readonly description: string;
  readonly short: string;
}

interface HomeAdvantage {
  readonly title: string;
  readonly description: string;
  readonly proof: string;
}

interface HomePath {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly action: string;
}

interface HomeCategory {
  readonly name: string;
  readonly description: string;
  readonly count: number;
  readonly link: string;
}

interface HomeUpdate {
  readonly version: string;
  readonly title: string;
  readonly description: string;
  readonly meta: string;
}

interface FeaturedComponent {
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly summary: string;
}

@Component({
  selector: 'app-docs-home',
  standalone: true,
  imports: [
    RouterLink,
    UiBadgeComponent,
    UiButtonComponent,
    DocsCodeBlockComponent,
    UiTagComponent,
  ],
  template: `
    <article class="mx-auto max-w-6xl bg-slate-100 dark:bg-slate-950">
      <section class="border-b border-blue-100 bg-slate-50 dark:border-blue-950 dark:bg-slate-950">
        <div class="grid gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_31rem] lg:px-6 lg:py-12">
          <div class="min-w-0 self-center">
            <div class="flex flex-wrap items-center gap-2">
              <ui-badge variant="danger" size="sm">Version 0.1 is now live</ui-badge>
              <ui-badge variant="info" size="sm">Angular 22 ready</ui-badge>
            </div>

            <h1
              class="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-normal text-slate-950 dark:text-slate-50 lg:text-5xl"
            >
              Build faster with NgNova UI Docs
            </h1>

            <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              The enterprise-scale Angular component library for high-performance teams. Build
              resilient, accessible, and themeable applications with focused standalone imports and
              production-ready documentation.
            </p>

            <div class="mt-7 flex flex-wrap gap-3">
              <a routerLink="/components/button">
                <ui-button>Get started</ui-button>
              </a>
              <a routerLink="/components/button">
                <ui-button variant="outline">View components</ui-button>
              </a>
            </div>

            <p
              class="mt-7 border-t border-blue-100 pt-5 text-sm text-slate-500 dark:border-blue-950 dark:text-slate-400"
            >
              Trusted by
              <span class="font-semibold text-slate-950 dark:text-slate-100">2,500+</span>
              engineering teams building Angular product systems.
            </p>
          </div>

          <aside class="min-w-0 self-center">
            <app-docs-code-block
              [code]="heroCode"
              filename="hero-card.component.ts"
              language="TypeScript"
            />
          </aside>
        </div>
      </section>

      <section
        class="border-b border-blue-100 bg-white px-5 py-7 dark:border-blue-950 dark:bg-slate-950 lg:px-6"
      >
        <div
          class="grid items-center gap-5 rounded bg-slate-100 p-5 dark:bg-slate-900 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)]"
        >
          <div>
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">Quick Start</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Install the package, then import only the component entry point your Angular screen
              needs.
            </p>
          </div>
          <div
            class="flex min-w-0 items-center justify-between gap-4 rounded bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100"
          >
            <code class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              npm install &#64;ngnova/ui
            </code>
            <span class="shrink-0 text-slate-500">copy</span>
          </div>
        </div>
      </section>

      <section
        class="border-b border-blue-100 bg-white px-5 py-8 text-center dark:border-blue-950 dark:bg-slate-950 lg:px-6"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Trusted by leading teams
        </p>
        <div
          class="mt-5 grid gap-4 text-sm font-semibold uppercase text-slate-400 sm:grid-cols-3 lg:grid-cols-6"
        >
          @for (team of trustedTeams; track team) {
            <span>{{ team }}</span>
          }
        </div>
      </section>

      <section class="bg-slate-100 px-5 py-10 dark:bg-slate-950 lg:px-6">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Powering Enterprise Workflows
          </h2>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            A practical component system for modern, scalable Angular engineering.
          </p>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-3">
          @for (principle of principles; track principle.title) {
            <section
              class="rounded border border-blue-100 bg-white p-6 dark:border-blue-950 dark:bg-slate-950"
            >
              <span
                class="inline-flex rounded bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
              >
                {{ principle.short }}
              </span>
              <h3 class="mt-5 text-xl font-semibold text-slate-950 dark:text-slate-50">
                {{ principle.title }}
              </h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {{ principle.description }}
              </p>
            </section>
          }
        </div>
      </section>

      <section
        class="grid gap-8 bg-slate-50 px-5 py-10 dark:bg-slate-950 lg:grid-cols-[minmax(0,1fr)_29rem] lg:px-6"
      >
        <div>
          <h2 class="text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Analytics Card Component
          </h2>
          <div class="mt-5 grid gap-3">
            @for (item of analyticsHighlights; track item) {
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="mr-2 font-semibold text-blue-800 dark:text-blue-300">Check</span
                >{{ item }}
              </p>
            }
          </div>

          <div
            class="mt-7 rounded border border-blue-100 bg-white p-5 dark:border-blue-950 dark:bg-slate-950"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase text-slate-500">Weekly growth</p>
                <p class="mt-1 text-4xl font-bold text-slate-950 dark:text-slate-50">24.8%</p>
              </div>
              <ui-tag variant="success">+2.4%</ui-tag>
            </div>
            <div class="mt-6 flex h-28 items-end gap-3">
              @for (bar of chartBars; track $index) {
                <span
                  class="flex-1 bg-blue-100 dark:bg-blue-950/70"
                  [class.bg-blue-700]="$last"
                  [style.height.%]="bar"
                ></span>
              }
            </div>
          </div>
        </div>

        <div class="grid content-start gap-5">
          <app-docs-code-block
            [code]="analyticsTemplateCode"
            filename="usage.html"
            language="Angular template"
          />
          <app-docs-code-block
            [code]="analyticsComponentCode"
            filename="component.ts"
            language="TypeScript"
          />
        </div>
      </section>

      <section
        class="border-y border-blue-100 bg-slate-200/60 px-5 py-10 dark:border-blue-950 dark:bg-slate-900 lg:px-6"
      >
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="text-3xl font-semibold text-slate-950 dark:text-slate-50">What's New</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Stay up to date with the latest component and documentation work.
            </p>
          </div>
          <a routerLink="/guide" class="text-sm font-semibold text-blue-800 dark:text-blue-300">
            View full changelog
          </a>
        </div>

        <div class="mt-7 grid gap-5 md:grid-cols-2">
          @for (update of updates; track update.title) {
            <section
              class="grid gap-4 rounded border border-blue-100 bg-white p-5 dark:border-blue-950 dark:bg-slate-950 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <span
                class="flex size-12 items-center justify-center rounded bg-blue-50 text-sm font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
              >
                {{ update.version }}
              </span>
              <div>
                <h3 class="text-xl font-semibold text-slate-950 dark:text-slate-50">
                  {{ update.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {{ update.description }}
                </p>
                <p class="mt-3 text-xs text-slate-500">{{ update.meta }}</p>
              </div>
            </section>
          }
        </div>
      </section>

      <section class="bg-slate-900 px-5 py-14 text-center text-white lg:px-6">
        <h2 class="text-4xl font-bold tracking-normal">Ready to optimize your workflow?</h2>
        <p class="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300">
          Join developers building scalable, reliable Angular applications with a component suite
          designed for product teams.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a routerLink="/guide">
            <ui-button>Start your project</ui-button>
          </a>
          <a routerLink="/templates">
            <ui-button variant="outline">View templates</ui-button>
          </a>
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsHomeComponent {
  protected readonly heroCode = `import { Component } from '@angular/core';
import { UiCardComponent } from '@ngnova/ui/card';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [UiCardComponent],
  template: '<ui-card elevated="true">...</ui-card>',
})
export class HeroCardComponent {
  title = 'Hello World';
}`;

  protected readonly analyticsTemplateCode = `<ui-analytics-card
  title="Weekly Growth"
  [data]="growthStats"
  [trend]="2.4"
  suite="recent">
</ui-analytics-card>`;

  protected readonly analyticsComponentCode = `const growthStats = this.analyticsService
  .getWeekStats()
  .pipe(map((response) => response.payload));`;

  protected readonly quickStartCode = `import { Component } from '@angular/core';
import { UiButtonComponent } from '@ngnova/ui/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent],
  template: '<ui-button>Create project</ui-button>',
})
export class AppComponent {}`;

  protected readonly packageSetupCode = `@source "../node_modules/@ngnova/ui";

<ui-button variant="primary" size="md">
  Create project
</ui-button>`;

  protected readonly trustedTeams: readonly string[] = [
    'TechForge',
    'Skystream',
    'Blocksy',
    'Voltix',
    'Nexus',
    'Northstar',
  ];

  protected readonly analyticsHighlights: readonly string[] = [
    'Real-time data synchronization with RxJS streams',
    'Configurable sparklines and growth metrics',
    'Full dark mode and high-contrast support',
  ];

  protected readonly chartBars: readonly number[] = [36, 48, 31, 60, 43, 80, 28];

  protected readonly updates: readonly HomeUpdate[] = [
    {
      version: '0.1',
      title: 'Standalone Component Entrypoints',
      description:
        'Focused package paths for every public component, matching how Angular teams scale imports.',
      meta: 'Released 2 days ago',
    },
    {
      version: 'Fix',
      title: 'Docs Example Alignment',
      description:
        'Preview examples, code snippets, and API tables now follow the same documented component contracts.',
      meta: 'Released 5 days ago',
    },
  ];

  protected readonly metrics: readonly HomeMetric[] = [
    {
      label: 'Components',
      value: String(componentDocs.length),
      description: 'Finished docs pages',
    },
    { label: 'Tests', value: '72', description: 'Library specs passing' },
    { label: 'Builds', value: '2', description: 'Library and demo' },
    { label: 'Imports', value: '1:1', description: 'Focused entry points' },
  ];

  protected readonly paths: readonly HomePath[] = [
    {
      eyebrow: 'Learn',
      title: 'Read the guide',
      description: 'Install the package, configure Tailwind, and understand the library approach.',
      link: '/guide',
      action: 'Open guide',
    },
    {
      eyebrow: 'Build',
      title: 'Pick a component',
      description: 'Use live examples, matching snippets, API tables, and accessibility notes.',
      link: '/components/button',
      action: 'Browse components',
    },
    {
      eyebrow: 'Compose',
      title: 'Start from a template',
      description: 'Preview a realistic admin dashboard built from NgNova UI primitives.',
      link: '/templates',
      action: 'View template',
    },
    {
      eyebrow: 'Inspect',
      title: 'Search the API',
      description: 'Review selectors, imports, inputs, outputs, and public package contracts.',
      link: '/apis',
      action: 'Open API reference',
    },
  ];

  protected readonly categories: readonly HomeCategory[] = [
    {
      name: 'Foundations',
      description: 'Buttons, badges, tags, progress, cards, and loading states for everyday UI.',
      count: this.countCategory('Foundations'),
      link: '/components/button',
    },
    {
      name: 'Forms',
      description: 'Inputs, selects, text areas, toggles, radios, and checkboxes with form notes.',
      count: this.countCategory('Forms'),
      link: '/components/input',
    },
    {
      name: 'Navigation/Data',
      description: 'Tabs, accordions, navigation patterns, and tables for richer screens.',
      count: this.countCategory('Navigation/Data'),
      link: '/components/tabs',
    },
    {
      name: 'Overlays',
      description: 'Modal and toast primitives with keyboard, focus, and interaction guidance.',
      count: this.countCategory('Overlays'),
      link: '/components/modal',
    },
  ];

  protected readonly principles: readonly HomePrinciple[] = [
    {
      short: 'API',
      title: 'Mobile First',
      description:
        'Adaptive layouts and responsive primitives are documented for real mobile, tablet, and desktop usage.',
    },
    {
      short: 'Theme',
      title: 'Highly Customizable',
      description:
        'Tailwind-native styling and focused inputs let teams control visual systems without fighting the library.',
    },
    {
      short: 'A11y',
      title: 'Enterprise Ready',
      description:
        'Typed APIs, keyboard behavior, accessibility notes, and test coverage are treated as first-release requirements.',
    },
  ];

  protected readonly advantages: readonly HomeAdvantage[] = [
    {
      title: 'Per-component imports',
      description:
        'Every public component has a focused package path that mirrors how developers expect modern Angular libraries to scale.',
      proof: '@ngnova/ui/button',
    },
    {
      title: 'Tailwind-native styling',
      description:
        'Components use static utility classes and dark-mode variants, so teams can adopt the library without a separate theme runtime.',
      proof: 'Tailwind v4 source',
    },
    {
      title: 'Docs as product recipes',
      description:
        'Component pages pair live previews with matching snippets, API tables, accessibility notes, and testing guidance.',
      proof: `${componentDocs.length} docs pages`,
    },
  ];

  protected readonly featuredComponents = computed<readonly FeaturedComponent[]>(() =>
    ['button', 'input', 'modal', 'table', 'tabs', 'toast']
      .map((slug) => componentDocs.find((doc) => doc.slug === slug))
      .filter((doc): doc is (typeof componentDocs)[number] => !!doc)
      .map((doc) => ({
        name: doc.name,
        slug: doc.slug,
        category: this.categoryFor(doc.slug),
        summary: doc.summary,
      })),
  );

  private categoryFor(slug: string): string {
    if (['input', 'textarea', 'checkbox', 'radio', 'switch', 'select'].includes(slug)) {
      return 'Forms';
    }

    if (['modal', 'toast'].includes(slug)) {
      return 'Overlays';
    }

    if (['tabs', 'accordion', 'table'].includes(slug)) {
      return 'Navigation/Data';
    }

    return 'Foundations';
  }

  private countCategory(category: string): number {
    return componentDocs.filter((doc) => this.categoryFor(doc.slug) === category).length;
  }
}
