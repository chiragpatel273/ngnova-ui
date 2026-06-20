import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '@ngnova/ui';

interface GuideCard {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly tone: 'default' | 'muted' | 'solid';
  readonly size: 'wide' | 'normal' | 'tall';
  readonly actions?: readonly string[];
  readonly code?: string;
}

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [RouterLink, UiButtonComponent],
  template: `
    <div class="mx-auto grid max-w-[73rem] gap-8 xl:grid-cols-[minmax(0,1fr)_14rem]">
      <article class="pb-16">
        <header class="pt-5">
          <span
            class="inline-flex rounded bg-red-100 px-3 py-2 text-sm font-medium uppercase tracking-wide text-red-800 dark:bg-red-950 dark:text-red-200"
          >
            Comprehensive Guides
          </span>
          <h1 class="mt-6 text-4xl font-bold tracking-normal text-zinc-950 dark:text-zinc-50">
            Documentation Guides
          </h1>
          <p class="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Everything you need to build high-quality Angular applications. From initial setup to
            advanced theme customization and accessibility standards.
          </p>
        </header>

        <section class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          @for (card of guideCards; track card.title) {
            <article [class]="cardClasses(card)">
              <div>
                <p class="text-sm font-semibold uppercase text-red-800 dark:text-red-300">
                  {{ card.eyebrow }}
                </p>
                <h2 class="mt-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {{ card.title }}
                </h2>
                <p class="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                  {{ card.description }}
                </p>
              </div>

              @if (card.code) {
                <pre
                  class="mt-5 overflow-x-auto whitespace-nowrap rounded bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-50 shadow-sm dark:bg-black"
                ><code>{{ card.code }}</code></pre>
              }

              @if (card.actions?.length) {
                <div class="mt-6 flex flex-wrap gap-3">
                  @for (action of card.actions; track action) {
                    <button
                      type="button"
                      class="rounded border border-red-200 bg-white px-4 py-3 text-base text-zinc-950 transition hover:bg-red-50 dark:border-red-950 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-red-950/30"
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
          class="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-red-200 pt-8 text-base text-zinc-600 dark:border-red-950 dark:text-zinc-300"
        >
          <p>&copy; 2024 NgNova UI. Built for developers by developers.</p>
          <nav class="flex flex-wrap gap-8" aria-label="Guide footer">
            <a routerLink="/components">GitHub</a>
            <a routerLink="/apis">API Reference</a>
            <a routerLink="/guide">NPM</a>
          </nav>
        </footer>
      </article>

      <aside class="hidden border-l border-red-200 pl-6 dark:border-red-950 xl:block">
        <div class="sticky top-24">
          <p class="text-sm font-bold uppercase tracking-wide text-zinc-950 dark:text-zinc-50">
            On This Page
          </p>
          <nav
            class="mt-5 grid gap-4 text-base text-zinc-600 dark:text-zinc-400"
            aria-label="On this page"
          >
            @for (item of onThisPage; track item) {
              <a
                href="#"
                [class]="
                  item === 'Getting Started'
                    ? 'font-medium text-red-800 dark:text-red-200'
                    : 'hover:text-red-800 dark:hover:text-red-200'
                "
              >
                {{ item }}
              </a>
            }
          </nav>

          <div class="mt-12 rounded bg-zinc-200 p-5 dark:bg-zinc-900">
            <p class="text-base text-zinc-600 dark:text-zinc-300">Need help?</p>
            <a
              routerLink="/apis"
              class="mt-3 block border border-red-200 bg-white px-4 py-3 text-center text-base text-zinc-950 transition hover:bg-red-50 dark:border-red-950 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-red-950/30"
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
  protected readonly onThisPage: readonly string[] = [
    'Getting Started',
    'Installation',
    'Accessibility',
    'Customization',
    'Best Practices',
  ];

  protected readonly guideCards: readonly GuideCard[] = [
    {
      eyebrow: 'Start',
      title: 'Getting Started',
      description:
        'Learn the fundamental concepts of NgNova UI and how to integrate it into your existing Angular projects. Covers workspace setup and basic component usage.',
      tone: 'default',
      size: 'normal',
    },
    {
      eyebrow: 'Install',
      title: 'Installation',
      description:
        'Install the package, configure Tailwind scanning, and import only the component entry points your app uses.',
      tone: 'default',
      size: 'normal',
      code: `npm install @ngnova/ui`,
    },
    {
      eyebrow: 'A11y',
      title: 'Accessibility',
      description:
        'Our commitment to accessibility. Learn how components follow ARIA patterns and keyboard navigation standards out of the box.',
      tone: 'default',
      size: 'tall',
    },
    {
      eyebrow: 'Theme',
      title: 'Customizing Themes',
      description:
        'Dive deep into design tokens. Learn how to configure Tailwind, adapt CSS variables, and create beautiful dark mode variants.',
      tone: 'muted',
      size: 'wide',
      actions: ['Tailwind CSS', 'SCSS'],
    },
    {
      eyebrow: 'Tools',
      title: 'Release Workflow',
      description:
        'Use build, test, lint, and package dry-run checks before publishing or adopting a new component version.',
      tone: 'default',
      size: 'normal',
    },
    {
      eyebrow: 'Quality',
      title: 'Best Practices',
      description:
        'Performance optimization, lazy loading techniques, and change detection strategies for large-scale enterprise apps.',
      tone: 'default',
      size: 'normal',
    },
    {
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
      'flex min-h-72 flex-col justify-between rounded border border-red-200 p-6 dark:border-red-950';
    const size: Record<GuideCard['size'], string> = {
      normal: '',
      tall: '',
      wide: 'md:col-span-2',
    };
    const tone: Record<GuideCard['tone'], string> = {
      default: 'bg-white dark:bg-zinc-950',
      muted: 'bg-zinc-200 dark:bg-zinc-900',
      solid: 'bg-red-800 text-white dark:bg-red-900 [&_*]:text-white',
    };

    return `${base} ${size[card.size]} ${tone[card.tone]}`;
  }
}
