import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '@ngnova/ui/button';

interface GuideCard {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly tone: 'default' | 'muted' | 'solid';
  readonly size: 'wide' | 'normal' | 'tall';
  readonly actions?: readonly string[];
  readonly code?: string;
}

interface GuidePageLink {
  readonly label: string;
  readonly fragment: string;
}

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [RouterLink, UiButtonComponent],
  template: `
    <div class="mx-auto grid max-w-[76rem] gap-6 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <article class="pb-16">
        <header class="pt-5">
          <span
            class="inline-flex rounded bg-blue-100 px-3 py-2 text-sm font-medium uppercase tracking-wide text-blue-800 dark:bg-blue-950 dark:text-blue-200"
          >
            Comprehensive Guides
          </span>
          <h1
            class="mt-4 text-2xl font-bold leading-8 tracking-normal text-slate-950 dark:text-slate-50"
          >
            Documentation Guides
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-300">
            Everything you need to build high-quality Angular applications. From initial setup to
            advanced theme customization and accessibility standards.
          </p>
        </header>

        <section class="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (card of guideCards; track card.title) {
            <article [id]="card.id" [class]="cardClasses(card)">
              <div>
                <p class="text-sm font-semibold uppercase text-blue-800 dark:text-blue-300">
                  {{ card.eyebrow }}
                </p>
                <h2 class="mt-3 text-base font-semibold text-slate-950 dark:text-slate-50">
                  {{ card.title }}
                </h2>
                <p class="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  {{ card.description }}
                </p>
              </div>

              @if (card.code) {
                <pre
                  class="mt-5 overflow-x-auto whitespace-nowrap rounded bg-slate-950 p-4 font-mono text-sm leading-5 text-slate-50 shadow-sm dark:bg-black"
                ><code>{{ card.code }}</code></pre>
              }

              @if (card.actions?.length) {
                <div class="mt-6 flex flex-wrap gap-3">
                  @for (action of card.actions; track action) {
                    <button
                      type="button"
                      class="rounded border border-blue-200 bg-white px-3 py-2.5 text-sm text-slate-950 transition hover:bg-blue-50 dark:border-blue-950 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-blue-950/30"
                    >
                      {{ action }}
                    </button>
                  }
                </div>
              }

              @if (card.title === 'Getting Started') {
                <a routerLink="/components/button" class="mt-6 inline-block">
                  <ui-button>Start Journey</ui-button>
                </a>
              }
            </article>
          }
        </section>

        <footer
          class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-blue-200 pt-6 text-sm text-slate-600 dark:border-blue-950 dark:text-slate-300"
        >
          <p>&copy; 2024 NgNova UI. Built for developers by developers.</p>
          <nav class="flex flex-wrap gap-6" aria-label="Guide footer">
            <a routerLink="/components">GitHub</a>
            <a routerLink="/apis">API Reference</a>
            <a routerLink="/guide">NPM</a>
          </nav>
        </footer>
      </article>

      <aside class="hidden border-l border-blue-200 pl-6 dark:border-blue-950 xl:block">
        <div class="sticky top-24">
          <p class="text-sm font-bold uppercase tracking-wide text-slate-950 dark:text-slate-50">
            On This Page
          </p>
          <nav
            class="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400"
            aria-label="On this page"
          >
            @for (item of onThisPage; track item.fragment) {
              <a
                [routerLink]="[]"
                [fragment]="item.fragment"
                class="transition hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <div class="mt-8 rounded bg-slate-200 p-4 dark:bg-slate-900">
            <p class="text-sm text-slate-600 dark:text-slate-300">Need help?</p>
            <a
              routerLink="/apis"
              class="mt-2.5 block border border-blue-200 bg-white px-3 py-2.5 text-center text-sm text-slate-950 transition hover:bg-blue-50 dark:border-blue-950 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-blue-950/30"
            >
              Contact Support
            </a>
          </div>
        </div>
      </aside>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetStartedComponent {
  protected readonly onThisPage: readonly GuidePageLink[] = [
    { label: 'Getting Started', fragment: 'getting-started' },
    { label: 'Installation', fragment: 'installation' },
    { label: 'Accessibility', fragment: 'accessibility' },
    { label: 'Customization', fragment: 'customization' },
    { label: 'Best Practices', fragment: 'best-practices' },
  ];

  protected readonly guideCards: readonly GuideCard[] = [
    {
      id: 'getting-started',
      eyebrow: 'Start',
      title: 'Getting Started',
      description:
        'Learn the fundamental concepts of NgNova UI and how to integrate it into your existing Angular projects. Covers workspace setup and basic component usage.',
      tone: 'default',
      size: 'normal',
    },
    {
      id: 'installation',
      eyebrow: 'Install',
      title: 'Installation',
      description:
        'Install the package, configure Tailwind scanning, and import only the component entry points your app uses.',
      tone: 'default',
      size: 'normal',
      code: `npm install @ngnova/ui`,
    },
    {
      id: 'accessibility',
      eyebrow: 'A11y',
      title: 'Accessibility',
      description:
        'Our commitment to accessibility. Learn how components follow ARIA patterns and keyboard navigation standards out of the box.',
      tone: 'default',
      size: 'tall',
    },
    {
      id: 'customization',
      eyebrow: 'Theme',
      title: 'Customizing Themes',
      description:
        'Dive deep into design tokens. Learn how to configure Tailwind, adapt CSS variables, and create beautiful dark mode variants.',
      tone: 'muted',
      size: 'wide',
      actions: ['Tailwind CSS', 'SCSS'],
    },
    {
      id: 'release-workflow',
      eyebrow: 'Tools',
      title: 'Release Workflow',
      description:
        'Use build, test, lint, and package dry-run checks before publishing or adopting a new component version.',
      tone: 'default',
      size: 'normal',
    },
    {
      id: 'best-practices',
      eyebrow: 'Quality',
      title: 'Best Practices',
      description:
        'Performance optimization, lazy loading techniques, and change detection strategies for large-scale enterprise apps.',
      tone: 'default',
      size: 'normal',
    },
    {
      id: 'community-support',
      eyebrow: 'Support',
      title: 'Community & Support',
      description:
        'Use the component docs, API reference, and issue tracker notes to solve integration and architecture challenges.',
      tone: 'solid',
      size: 'normal',
    },
  ];

  protected cardClasses(card: GuideCard): string {
    const base =
      'flex min-h-64 scroll-mt-24 flex-col justify-between rounded border border-blue-200 p-4 dark:border-blue-950';
    const size: Record<GuideCard['size'], string> = {
      normal: '',
      tall: '',
      wide: 'md:col-span-2',
    };
    const tone: Record<GuideCard['tone'], string> = {
      default: 'bg-white dark:bg-slate-950',
      muted: 'bg-slate-200 dark:bg-slate-900',
      solid: 'bg-blue-800 text-white dark:bg-blue-900 [&_*]:text-white',
    };

    return `${base} ${size[card.size]} ${tone[card.tone]}`;
  }
}
