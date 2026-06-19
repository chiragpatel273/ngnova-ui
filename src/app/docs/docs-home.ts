import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  UiBadgeComponent,
  UiButtonComponent,
  UiCardComponent,
  UiProgressBarComponent,
  UiTagComponent,
} from '@ngnova/ui';

import { componentDocs } from './docs-data';

interface HomeMetric {
  readonly label: string;
  readonly value: string;
  readonly description: string;
}

interface HomePrinciple {
  readonly title: string;
  readonly description: string;
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
    UiCardComponent,
    UiProgressBarComponent,
    UiTagComponent,
  ],
  template: `
    <article class="mx-auto max-w-7xl">
      <section
        class="overflow-hidden rounded border border-red-200 bg-white shadow-sm dark:border-red-950 dark:bg-zinc-950"
      >
        <div class="grid gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:px-10 lg:py-14">
          <div>
            <div class="flex flex-wrap gap-2">
              <ui-badge variant="info" size="sm">Angular 22</ui-badge>
              <ui-badge variant="success" size="sm">Standalone</ui-badge>
              <ui-badge size="sm">Tailwind CSS</ui-badge>
            </div>
            <h1
              class="mt-6 max-w-4xl text-5xl font-bold text-zinc-950 dark:text-zinc-50 lg:text-6xl"
            >
              Build Angular products with a library that feels intentional.
            </h1>
            <p class="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              NgNova UI is a modern Angular component library focused on clean public APIs,
              accessibility, dark mode, forms support, and documentation that teaches production
              usage instead of only listing props.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a routerLink="/guide">
                <ui-button>Get Started</ui-button>
              </a>
              <a routerLink="/components/button">
                <ui-button variant="outline">Browse Components</ui-button>
              </a>
            </div>
          </div>

          <div
            class="rounded border border-red-200 bg-zinc-100 p-5 dark:border-red-950 dark:bg-zinc-900"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  Component Readiness
                </p>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Current first milestone surface.
                </p>
              </div>
              <ui-tag variant="success">Verified</ui-tag>
            </div>

            <div class="mt-6 grid gap-4">
              <div>
                <div class="mb-2 flex justify-between text-sm">
                  <span class="text-slate-600 dark:text-slate-300">Docs coverage</span>
                  <span class="font-medium text-slate-950 dark:text-slate-50">100%</span>
                </div>
                <ui-progress-bar [value]="100" variant="success" label="Documentation coverage" />
              </div>
              <div>
                <div class="mb-2 flex justify-between text-sm">
                  <span class="text-slate-600 dark:text-slate-300">Library tests</span>
                  <span class="font-medium text-slate-950 dark:text-slate-50">71 passing</span>
                </div>
                <ui-progress-bar [value]="100" label="Library test status" />
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              @for (metric of metrics; track metric.label) {
                <div class="rounded-md bg-white p-3 dark:bg-slate-950">
                  <p class="text-2xl font-semibold text-slate-950 dark:text-slate-50">
                    {{ metric.value }}
                  </p>
                  <p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {{ metric.label }}
                  </p>
                  <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {{ metric.description }}
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-3">
        @for (principle of principles; track principle.title) {
          <ui-card>
            <div uiCardHeader>
              <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-50">
                {{ principle.title }}
              </h2>
            </div>
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {{ principle.description }}
            </p>
          </ui-card>
        }
      </section>

      <section class="mt-8">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase text-red-800 dark:text-red-300">
              Component System
            </p>
            <h2 class="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Featured Components
            </h2>
          </div>
          <a
            routerLink="/components/button"
            class="text-sm font-medium text-red-800 hover:text-red-900 dark:text-red-300"
          >
            Explore all components
          </a>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (component of featuredComponents(); track component.slug) {
            <a
              [routerLink]="['/components', component.slug]"
              class="group rounded border border-red-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md dark:border-red-950 dark:bg-zinc-950 dark:hover:bg-red-950/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <ui-badge size="sm">{{ component.category }}</ui-badge>
                  <h3 class="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">
                    {{ component.name }}
                  </h3>
                </div>
                <span
                  class="text-slate-300 transition group-hover:text-red-700 dark:text-slate-700 dark:group-hover:text-red-300"
                  >/</span
                >
              </div>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {{ component.summary }}
              </p>
            </a>
          }
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsHomeComponent {
  protected readonly metrics: readonly HomeMetric[] = [
    {
      label: 'Components',
      value: String(componentDocs.length),
      description: 'Finished docs pages',
    },
    { label: 'Tests', value: '71', description: 'Library specs passing' },
    { label: 'Builds', value: '2', description: 'Library and demo' },
    { label: 'Modes', value: '2', description: 'Light and dark' },
  ];

  protected readonly principles: readonly HomePrinciple[] = [
    {
      title: 'Angular-native APIs',
      description:
        'Standalone imports, typed inputs and outputs, semantic event names, and Angular forms integration where controls need it.',
    },
    {
      title: 'Accessible by default',
      description:
        'Docs explain screen reader behavior, keyboard interaction, focus handling, native semantics, and edge cases for each component.',
    },
    {
      title: 'Production documentation',
      description:
        'Every finished component includes live previews, realistic snippets, API tables, forms notes, testing notes, and usage guidance.',
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
}
