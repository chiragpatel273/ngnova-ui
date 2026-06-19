import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { UiButtonComponent } from '@ngnova/ui';

import { componentDocs } from './docs-data';

interface TopicSection {
  readonly title: string;
  readonly description: string;
  readonly items: readonly string[];
}

interface DocsTopic {
  readonly badge: string;
  readonly title: string;
  readonly summary: string;
  readonly ctaLabel: string;
  readonly ctaPath: string;
  readonly sections: readonly TopicSection[];
}

const TOPICS: Readonly<Record<string, DocsTopic>> = {
  components: {
    badge: 'Component Catalog',
    title: 'Explore Core Components',
    summary:
      'Browse the production component surface and use each page as the source of truth for imports, usage, accessibility, API, and testing guidance.',
    ctaLabel: 'Open Button Docs',
    ctaPath: '/components/button',
    sections: [
      {
        title: 'Layout',
        description:
          'Composition surfaces for dashboards, pages, cards, and structured product data.',
        items: ['Card', 'Table', 'Progress Bar'],
      },
      {
        title: 'Buttons',
        description:
          'Action controls with semantic outputs, loading states, and accessible labels.',
        items: ['Button', 'Tag', 'Badge'],
      },
      {
        title: 'Forms',
        description:
          'Angular forms-ready controls with labels, validation, helper text, and keyboard behavior.',
        items: ['Input', 'Textarea', 'Checkbox', 'Radio', 'Switch', 'Select'],
      },
      {
        title: 'Navigation',
        description: 'Page and panel navigation primitives for dense application experiences.',
        items: ['Tabs', 'Accordion'],
      },
    ],
  },
  accessibility: {
    badge: 'Accessibility',
    title: 'Accessible Angular Components',
    summary:
      'NgNova UI docs explain the semantic contract behind each component, including keyboard paths, screen reader behavior, focus handling, and validation states.',
    ctaLabel: 'Review Modal Accessibility',
    ctaPath: '/components/modal',
    sections: [
      {
        title: 'Baseline expectations',
        description:
          'Components preserve native semantics first, then add ARIA only where the pattern needs it.',
        items: [
          'Keyboard activation and visible focus states',
          'Associated labels, helper text, and errors',
          'Documented focus handling for overlays',
        ],
      },
    ],
  },
  theming: {
    badge: 'Style Guide',
    title: 'Theme With Tailwind And Dark Mode',
    summary:
      'NgNova UI uses static Tailwind classes and dark-mode variants so consumers get predictable styling and no hidden theme runtime.',
    ctaLabel: 'Open Guide',
    ctaPath: '/guide',
    sections: [
      {
        title: 'Tailwind setup',
        description:
          'Consumer apps need Tailwind to scan the package so utility classes are generated.',
        items: [
          'Add @source "../node_modules/@ngnova/ui"',
          'Use dark mode at the app shell',
          'Avoid undocumented internal class hooks',
        ],
      },
    ],
  },
  roadmap: {
    badge: 'Roadmap',
    title: 'NgNova UI Roadmap',
    summary:
      'The roadmap keeps the component library honest: finish quality before breadth, then expand toward harnesses, theming tokens, and enterprise patterns.',
    ctaLabel: 'Browse Components',
    ctaPath: '/components/button',
    sections: [
      {
        title: 'Current milestone',
        description:
          'The first milestone focuses on a dependable component foundation and production-ready docs.',
        items: [
          'Finalize prioritized components',
          'Polish responsive documentation',
          'Keep release checks green',
        ],
      },
    ],
  },
  playground: {
    badge: 'Playground',
    title: 'Experiment With Components',
    summary:
      'Use the playground as a focused space for trying combinations before they become documented recipes.',
    ctaLabel: 'Start With Button',
    ctaPath: '/components/button',
    sections: [
      {
        title: 'Try interactions',
        description:
          'Validate component states, dark mode, forms behavior, and density before production use.',
        items: ['Variant experiments', 'Form states', 'Overlay workflows'],
      },
      {
        title: 'Promote recipes',
        description:
          'When a pattern proves useful, move it into the component docs as a real product example.',
        items: ['Usage snippet', 'Accessibility note', 'API alignment'],
      },
    ],
  },
};

@Component({
  selector: 'app-docs-topic-page',
  standalone: true,
  imports: [RouterLink, UiButtonComponent],
  template: `
    @if (topic(); as page) {
      <article class="mx-auto max-w-[73rem] pb-20">
        <header class="pt-5">
          <span
            class="rounded bg-red-100 px-3 py-2 text-sm font-medium uppercase tracking-wide text-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {{ page.badge }}
          </span>
          <h1 class="mt-7 text-5xl font-bold leading-tight text-zinc-950 dark:text-zinc-50">
            {{ page.title }}
          </h1>
          <p class="mt-5 max-w-4xl text-xl leading-9 text-zinc-600 dark:text-zinc-300">
            {{ page.summary }}
          </p>
          <a [routerLink]="page.ctaPath" class="mt-8 inline-block">
            <ui-button>{{ page.ctaLabel }}</ui-button>
          </a>
        </header>

        @if (slug() === 'components') {
          <section
            class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            aria-label="All component docs"
          >
            @for (component of allComponents; track component.slug) {
              <a
                [routerLink]="['/components', component.slug]"
                class="group rounded border border-red-200 bg-white p-6 transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md dark:border-red-950 dark:bg-zinc-950 dark:hover:bg-red-950/30"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <span
                      class="rounded bg-red-100 px-2 py-1 text-xs font-semibold uppercase text-red-800 dark:bg-red-950 dark:text-red-200"
                    >
                      {{ categoryFor(component.slug) }}
                    </span>
                    <h2 class="mt-5 text-2xl font-medium text-zinc-950 dark:text-zinc-50">
                      {{ component.name }}
                    </h2>
                  </div>
                  <span
                    class="font-mono text-sm text-zinc-400 transition group-hover:text-red-800 dark:group-hover:text-red-200"
                  >
                    {{ component.selector }}
                  </span>
                </div>
                <p class="mt-4 min-h-20 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                  {{ component.summary }}
                </p>
                <dl
                  class="mt-6 grid grid-cols-2 gap-3 border-t border-red-100 pt-4 text-sm dark:border-red-950/70"
                >
                  <div>
                    <dt class="text-zinc-500">Inputs</dt>
                    <dd class="font-semibold text-zinc-950 dark:text-zinc-50">
                      {{ component.inputs.length }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-zinc-500">Outputs</dt>
                    <dd class="font-semibold text-zinc-950 dark:text-zinc-50">
                      {{ component.outputs.length }}
                    </dd>
                  </div>
                </dl>
              </a>
            }
          </section>
        } @else {
          <section class="mt-10 grid gap-6 md:grid-cols-2">
            @for (section of page.sections; track section.title) {
              <article
                class="rounded border border-red-200 bg-white p-8 dark:border-red-950 dark:bg-zinc-950"
              >
                <h2 class="text-2xl font-medium text-zinc-950 dark:text-zinc-50">
                  {{ section.title }}
                </h2>
                <p class="mt-4 text-lg leading-7 text-zinc-600 dark:text-zinc-300">
                  {{ section.description }}
                </p>
                <div class="mt-7 flex flex-wrap gap-3">
                  @for (item of section.items; track item) {
                    <span
                      class="rounded bg-zinc-100 px-3 py-2 text-base text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      {{ item }}
                    </span>
                  }
                </div>
              </article>
            }
          </section>
        }
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTopicPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly allComponents = componentDocs;
  protected readonly slug = toSignal(
    this.route.data.pipe(map((data) => String(data['topic'] ?? 'components'))),
    { initialValue: String(this.route.snapshot.data['topic'] ?? 'components') },
  );
  protected readonly topic = computed(() => TOPICS[this.slug()] ?? TOPICS['components']);

  protected categoryFor(slug: string): string {
    if (['input', 'textarea', 'checkbox', 'radio', 'switch', 'select'].includes(slug)) {
      return 'Forms';
    }

    if (['card', 'table'].includes(slug)) {
      return 'Layout';
    }

    if (['tabs', 'accordion'].includes(slug)) {
      return 'Navigation';
    }

    if (['modal', 'toast'].includes(slug)) {
      return 'Overlays';
    }

    return 'Foundations';
  }
}
