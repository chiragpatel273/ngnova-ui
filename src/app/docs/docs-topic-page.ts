import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { UiButtonComponent } from '@ngnova/ui';

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
    ctaPath: '/get-started',
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
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTopicPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.data.pipe(map((data) => String(data['topic'] ?? 'components'))),
    { initialValue: String(this.route.snapshot.data['topic'] ?? 'components') },
  );
  protected readonly topic = computed(() => TOPICS[this.slug()] ?? TOPICS['components']);
}
