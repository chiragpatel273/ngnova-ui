import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { UiBadgeComponent, UiButtonComponent, UiCardComponent } from '@ngnova/ui';

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
    title: 'Explore NgNova UI Components',
    summary:
      'Browse the current production component surface and use each page as the source of truth for imports, usage, accessibility, API, and testing guidance.',
    ctaLabel: 'Open Button Docs',
    ctaPath: '/components/button',
    sections: [
      {
        title: 'How component pages are structured',
        description:
          'Each finished component page follows the same pattern so teams can scan quickly and compare APIs with confidence.',
        items: [
          'Hero metadata: selector, import name, category, maturity, inputs, and outputs.',
          'Preview and usage snippets rendered from the public @ngnova/ui package.',
          'Guidance, examples, accessibility, keyboard behavior, API reference, and testing notes.',
        ],
      },
      {
        title: 'Documentation quality bar',
        description:
          'A component is considered documentation-ready only when the page helps consumers ship it in a real product.',
        items: [
          'Examples cover realistic application states instead of isolated prop toggles only.',
          'API tables include stable public names, types, defaults, and practical descriptions.',
          'Forms components document ControlValueAccessor behavior and validation wiring.',
        ],
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
          'Interactive controls support keyboard activation, focus-visible states, and disabled semantics.',
          'Form controls connect labels, helper text, errors, aria-invalid, and aria-describedby.',
          'Dialog and overlay patterns document Escape, backdrop behavior, focus management, and restore rules.',
        ],
      },
      {
        title: 'Author responsibilities',
        description:
          'The library provides accessible primitives, but product teams still own meaningful content and workflow validation.',
        items: [
          'Use visible labels or ariaLabel for label-less controls.',
          'Keep status text specific enough for screen reader users.',
          'Test keyboard-only flows before shipping complex forms, tables, and overlays.',
        ],
      },
    ],
  },
  theming: {
    badge: 'Theming',
    title: 'Theme With Tailwind And Dark Mode',
    summary:
      'NgNova UI uses static Tailwind classes and dark-mode variants so consumers get predictable styling, tree-shakable templates, and no hidden global theme runtime.',
    ctaLabel: 'Open Get Started',
    ctaPath: '/get-started',
    sections: [
      {
        title: 'Tailwind setup',
        description:
          'Consumer apps need Tailwind to scan the package so utility classes used by NgNova UI are generated.',
        items: [
          'Add @source "../node_modules/@ngnova/ui" beside the Tailwind import.',
          'Use dark mode at the app shell level so component dark: classes activate consistently.',
          'Avoid depending on internal class names as public API.',
        ],
      },
      {
        title: 'Design tokens direction',
        description:
          'The current milestone favors stable component APIs and static utilities before introducing a broader token system.',
        items: [
          'Keep semantic variants small and literal-union typed.',
          'Prefer component inputs for documented variants instead of undocumented CSS hooks.',
          'Document any future CSS entry point as a semver-sensitive public surface.',
        ],
      },
    ],
  },
  roadmap: {
    badge: 'Roadmap',
    title: 'NgNova UI Roadmap',
    summary:
      'The roadmap keeps the component library honest: finish quality before breadth, then expand toward harnesses, theming tokens, and richer enterprise patterns.',
    ctaLabel: 'Browse Components',
    ctaPath: '/components/button',
    sections: [
      {
        title: 'Current milestone',
        description:
          'The first milestone focuses on a dependable component foundation and documentation that feels production-ready.',
        items: [
          'Finalize the prioritized components with complete docs and verification.',
          'Polish responsive documentation layout, previews, API tables, and navigation.',
          'Keep build, test, demo, and package dry-run checks green before release.',
        ],
      },
      {
        title: 'Next quality investments',
        description:
          'After the initial docs surface is stable, the library can add deeper testing and system-level capabilities.',
        items: [
          'Add CDK component harnesses through the @ngnova/ui/testing entry point.',
          'Document design tokens or CSS entry points if the theming model expands.',
          'Add more data, overlay, and navigation patterns once existing APIs are settled.',
        ],
      },
    ],
  },
};

@Component({
  selector: 'app-docs-topic-page',
  standalone: true,
  imports: [RouterLink, UiBadgeComponent, UiButtonComponent, UiCardComponent],
  template: `
    @if (topic(); as page) {
      <article class="mx-auto max-w-6xl">
        <header
          class="border-b border-slate-200 pb-8 dark:border-slate-800 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-8"
        >
          <div>
            <div class="flex flex-wrap gap-2">
              <ui-badge variant="info" size="sm">{{ page.badge }}</ui-badge>
              <ui-badge variant="success" size="sm">Production Docs</ui-badge>
            </div>
            <h1
              class="mt-5 max-w-4xl text-4xl font-semibold text-slate-950 dark:text-slate-50 lg:text-5xl"
            >
              {{ page.title }}
            </h1>
            <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {{ page.summary }}
            </p>
          </div>
          <div class="mt-6 lg:mt-0 lg:self-end">
            <a [routerLink]="page.ctaPath">
              <ui-button>{{ page.ctaLabel }}</ui-button>
            </a>
          </div>
        </header>

        <section class="mt-8 grid gap-5">
          @for (section of page.sections; track section.title) {
            <ui-card>
              <div uiCardHeader>
                <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">
                  {{ section.title }}
                </h2>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {{ section.description }}
                </p>
              </div>
              <ul class="grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                @for (item of section.items; track item) {
                  <li class="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                    {{ item }}
                  </li>
                }
              </ul>
            </ui-card>
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
