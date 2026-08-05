import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ContributionStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly command?: string;
}

const CONTRIBUTION_STEPS: readonly ContributionStep[] = [
  {
    number: '01',
    title: 'Choose a focused change',
    description:
      'Start with an existing issue when possible. For larger ideas, open an issue before implementation so maintainers can confirm the direction.',
  },
  {
    number: '02',
    title: 'Fork and create a branch',
    description:
      'Fork the repository, clone your fork, and create a descriptive branch from the latest main branch.',
    command: 'git switch -c feat/your-change',
  },
  {
    number: '03',
    title: 'Install and develop',
    description:
      'Install dependencies and run the documentation application while implementing the smallest complete change.',
    command: 'npm.cmd install\nnpm.cmd start',
  },
  {
    number: '04',
    title: 'Add evidence',
    description:
      'Update behavior tests, documentation, accessibility guidance, API details, and visual baselines whenever the change affects them.',
  },
  {
    number: '05',
    title: 'Run the release gate',
    description:
      'Validate formatting, lint, contracts, tests, production builds, package contents, and clean consumer applications.',
    command: 'npm.cmd run release:check',
  },
  {
    number: '06',
    title: 'Open a pull request',
    description:
      'Describe the consumer impact, link the issue, include the checks you ran, and respond to review feedback.',
  },
];

@Component({
  selector: 'app-docs-contributing',
  standalone: true,
  template: `
    <article class="mx-auto max-w-[76rem] pb-16">
      <header class="pt-2">
        <span
          class="rounded bg-blue-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-blue-800 dark:bg-blue-950 dark:text-blue-200"
        >
          Open source
        </span>
        <h1 class="mt-4 text-2xl font-bold leading-8 text-slate-950 dark:text-slate-50">
          Contribute to NgNova UI
        </h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Help improve Angular components, accessibility, documentation, tests, and developer
          tooling. Contributions are reviewed against the same standards used for every NgNova UI
          release.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <a
            href="https://github.com/chiragpatel273/ngnova-ui"
            target="_blank"
            rel="noreferrer"
            class="inline-flex min-h-10 items-center rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
          >
            View repository
          </a>
          <a
            href="https://github.com/chiragpatel273/ngnova-ui/issues"
            target="_blank"
            rel="noreferrer"
            class="inline-flex min-h-10 items-center rounded border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-blue-950 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-blue-950/40 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
          >
            Browse issues
          </a>
        </div>
      </header>

      <section class="mt-8 grid gap-4 md:grid-cols-2" aria-label="Before contributing">
        <article
          class="rounded border border-blue-200 bg-white p-5 dark:border-blue-950 dark:bg-slate-950"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Community
          </p>
          <h2 class="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">
            Respectful collaboration
          </h2>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Participation is governed by the Code of Conduct. Be constructive, inclusive, and
            specific when opening issues or reviewing changes.
          </p>
          <a
            href="https://github.com/chiragpatel273/ngnova-ui/blob/main/CODE_OF_CONDUCT.md"
            target="_blank"
            rel="noreferrer"
            class="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
          >
            Read the Code of Conduct
          </a>
        </article>

        <article
          class="rounded border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <p
            class="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300"
          >
            Security
          </p>
          <h2 class="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">
            Report vulnerabilities privately
          </h2>
          <p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            Do not disclose a suspected vulnerability in a public issue or pull request. Use the
            repository's private security-advisory channel.
          </p>
          <a
            href="https://github.com/chiragpatel273/ngnova-ui/security/advisories/new"
            target="_blank"
            rel="noreferrer"
            class="mt-4 inline-flex text-sm font-semibold text-amber-900 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-100"
          >
            Report a vulnerability
          </a>
        </article>
      </section>

      <section class="mt-10" aria-labelledby="workflow-title">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          Contribution workflow
        </p>
        <h2 id="workflow-title" class="mt-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          From idea to pull request
        </h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (step of contributionSteps; track step.number) {
            <article
              class="rounded border border-blue-200 bg-white p-5 dark:border-blue-950 dark:bg-slate-950"
            >
              <span class="font-mono text-xs font-semibold text-blue-700 dark:text-blue-300">
                {{ step.number }}
              </span>
              <h3 class="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">
                {{ step.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {{ step.description }}
              </p>
              @if (step.command) {
                <pre
                  class="mt-4 overflow-x-auto rounded bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100 dark:bg-black"
                ><code>{{ step.command }}</code></pre>
              }
            </article>
          }
        </div>
      </section>

      <section class="mt-10 grid gap-4 lg:grid-cols-2">
        <article
          class="rounded border border-blue-200 bg-white p-6 dark:border-blue-950 dark:bg-slate-950"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Engineering standard
          </p>
          <h2 class="mt-2 text-lg font-bold text-slate-950 dark:text-slate-50">
            What a complete contribution includes
          </h2>
          <ul class="mt-4 grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <li>Angular 22 standalone architecture with OnPush change detection.</li>
            <li>Typed, semver-aware public APIs and focused package entry points.</li>
            <li>Keyboard, ARIA, forms, disabled-state, and regression tests where relevant.</li>
            <li>Matching live documentation, code examples, API details, and testing guidance.</li>
            <li>A Changeset for user-facing package changes.</li>
          </ul>
        </article>

        <article
          class="rounded border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-950 dark:bg-blue-950/20"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Contribution license
          </p>
          <h2 class="mt-2 text-lg font-bold text-slate-950 dark:text-slate-50">
            Contributions remain open source
          </h2>
          <p class="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
            By submitting a contribution, you agree that it will be licensed under the project's MIT
            License and confirm that you have the right to submit it. No contributor license
            agreement is currently required.
          </p>
          <a
            href="https://github.com/chiragpatel273/ngnova-ui/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            class="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
          >
            Read the complete repository policy
          </a>
        </article>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsContributingComponent {
  protected readonly contributionSteps = CONTRIBUTION_STEPS;
}
