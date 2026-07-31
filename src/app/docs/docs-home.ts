import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NGNOVA_UI_VERSION } from '@ngnova/ui';
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

interface HomeUpdate {
  readonly version: string;
  readonly title: string;
  readonly description: string;
  readonly meta: string;
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
        <div class="grid gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_27rem] lg:px-5 lg:py-7">
          <div class="min-w-0 self-center">
            <div class="flex flex-wrap items-center gap-2">
              <ui-badge variant="danger" size="sm"> Package version {{ libraryVersion }} </ui-badge>
              <ui-badge variant="info" size="sm">Angular 22 ready</ui-badge>
            </div>

            <h1
              class="mt-3 max-w-3xl text-2xl font-bold leading-8 tracking-normal text-slate-950 dark:text-slate-50"
            >
              Build faster with NgNova UI Docs
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-300">
              An Angular 22 standalone component library with focused package entry points, Tailwind
              v4 styling, API-aligned documentation, and a release pipeline that builds a real
              consumer application.
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
              Current release evidence:
              <span class="font-semibold text-slate-950 dark:text-slate-100">
                {{ componentCount }} documented components
              </span>
              with library, documentation, package, and consumer checks.
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
        class="border-b border-blue-100 bg-white px-4 py-5 dark:border-blue-950 dark:bg-slate-950 lg:px-5"
      >
        <div
          class="grid items-center gap-5 rounded bg-slate-100 p-5 dark:bg-slate-900 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)]"
        >
          <div>
            <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-50">Quick Start</h2>
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
        class="border-b border-blue-100 bg-white px-4 py-6 text-center dark:border-blue-950 dark:bg-slate-950 lg:px-5"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Repository-backed release facts
        </p>
        <div class="mt-5 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          @for (metric of metrics; track metric.label) {
            <section class="rounded border border-blue-100 p-4 dark:border-blue-950">
              <p class="text-xl font-bold text-blue-700 dark:text-blue-300">{{ metric.value }}</p>
              <h2 class="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-50">
                {{ metric.label }}
              </h2>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {{ metric.description }}
              </p>
            </section>
          }
        </div>
      </section>

      <section class="bg-slate-100 px-4 py-6 dark:bg-slate-950 lg:px-5">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-50">
            Built around verifiable contracts
          </h2>
          <p class="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
            Each claim below maps to source code, generated package output, or the release pipeline.
          </p>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          @for (principle of principles; track principle.title) {
            <section
              class="rounded border border-blue-100 bg-white p-4 dark:border-blue-950 dark:bg-slate-950"
            >
              <span
                class="inline-flex rounded bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
              >
                {{ principle.short }}
              </span>
              <h3 class="mt-4 text-base font-semibold text-slate-950 dark:text-slate-50">
                {{ principle.title }}
              </h3>
              <p class="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {{ principle.description }}
              </p>
            </section>
          }
        </div>
      </section>

      <section
        class="grid gap-5 bg-slate-50 px-4 py-6 dark:bg-slate-950 lg:grid-cols-[minmax(0,1fr)_25rem] lg:px-5"
      >
        <div>
          <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-50">
            Package and consumer verification
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
                <p class="text-xs font-semibold uppercase text-slate-500">Release pipeline</p>
                <p class="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">
                  Source to consumer
                </p>
              </div>
              <ui-tag variant="success">Passing</ui-tag>
            </div>
            <div class="mt-6 grid gap-3">
              @for (check of releaseChecks; track check) {
                <p class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <span class="size-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
                  {{ check }}
                </p>
              }
            </div>
          </div>
        </div>

        <div class="grid content-start gap-5">
          <app-docs-code-block
            [code]="quickStartCode"
            filename="app.component.ts"
            language="Angular template"
          />
          <app-docs-code-block
            [code]="packageSetupCode"
            filename="styles.css and template.html"
            language="CSS and Angular template"
          />
        </div>
      </section>

      <section
        class="border-y border-blue-100 bg-slate-200/60 px-4 py-6 dark:border-blue-950 dark:bg-slate-900 lg:px-5"
      >
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-50">What's New</h2>
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
                <h3 class="text-base font-semibold text-slate-950 dark:text-slate-50">
                  {{ update.title }}
                </h3>
                <p class="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  {{ update.description }}
                </p>
                <p class="mt-3 text-xs text-slate-500">{{ update.meta }}</p>
              </div>
            </section>
          }
        </div>
      </section>

      <section class="bg-slate-900 px-4 py-8 text-center text-white lg:px-5">
        <h2 class="text-lg font-bold tracking-normal">Ready to inspect the implementation?</h2>
        <p class="mx-auto mt-5 max-w-2xl text-sm leading-5 text-slate-300">
          Start with the guide, inspect each public API, and use the same package paths exercised by
          the consumer smoke build.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
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
  protected readonly libraryVersion = NGNOVA_UI_VERSION;
  protected readonly componentCount = componentDocs.length;
  protected readonly heroCode = `import { Component } from '@angular/core';
import { UiCardComponent } from '@ngnova/ui/card';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [UiCardComponent],
  template: '<ui-card variant="elevated" padding="lg">...</ui-card>',
})
export class HeroCardComponent {
  title = 'Hello World';
}`;

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

  protected readonly analyticsHighlights: readonly string[] = [
    'ng-packagr emits the root package and isolated component entry points',
    'Package audit and npm dry run inspect the generated dist/ui output',
    'Consumer smoke installs the tarball and builds a separate Angular application',
  ];

  protected readonly releaseChecks: readonly string[] = [
    'Format, lint, and documentation API consistency',
    'Library and documentation application tests',
    'Library and production documentation builds',
    'Package audit, npm dry run, and consumer smoke build',
  ];

  protected readonly updates: readonly HomeUpdate[] = [
    {
      version: '0.1',
      title: 'Standalone Component Entrypoints',
      description:
        'Focused package paths for every public component, matching how Angular teams scale imports.',
      meta: 'Verified in generated package output',
    },
    {
      version: 'Fix',
      title: 'Docs Example Alignment',
      description:
        'Preview examples, code snippets, and API tables now follow the same documented component contracts.',
      meta: 'Verified by docs API and application tests',
    },
  ];

  protected readonly metrics: readonly HomeMetric[] = [
    {
      label: 'Components',
      value: String(componentDocs.length),
      description: 'Public components with API-aligned docs pages',
    },
    {
      label: 'Compatibility',
      value: 'Angular 22',
      description: 'Standalone components built with Angular 22 tooling',
    },
    {
      label: 'Test suites',
      value: 'Library + docs',
      description: '100+ library tests and 10 documentation tests in the current release run',
    },
    {
      label: 'Package checks',
      value: 'Audit + smoke',
      description: 'Generated tarball is audited and built in a separate consumer app',
    },
  ];

  protected readonly principles: readonly HomePrinciple[] = [
    {
      short: 'API',
      title: 'Standalone by default',
      description:
        'All public components use standalone Angular entry points with focused package imports.',
    },
    {
      short: 'Theme',
      title: 'Tailwind v4 contract',
      description:
        'Static utility classes, documented package scanning, and class-based dark mode define the current theme surface.',
    },
    {
      short: 'A11y',
      title: 'Release-gated changes',
      description:
        'Format, lint, tests, builds, package inspection, and consumer compilation run through one release command.',
    },
  ];
}
