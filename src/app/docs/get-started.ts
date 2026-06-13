import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiBadgeComponent, UiButtonComponent, UiCardComponent } from '@ngnova/ui';

interface SetupStep {
  readonly title: string;
  readonly description: string;
  readonly code: string;
}

interface ChecklistItem {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [RouterLink, UiBadgeComponent, UiButtonComponent, UiCardComponent],
  template: `
    <article class="mx-auto max-w-6xl">
      <header
        class="rounded-lg border border-slate-200 bg-white px-6 py-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:px-8"
      >
        <div class="flex flex-wrap gap-2">
          <ui-badge variant="info" size="sm">Setup</ui-badge>
          <ui-badge variant="success" size="sm">Angular 22</ui-badge>
        </div>
        <h1
          class="mt-5 max-w-3xl text-4xl font-semibold text-slate-950 dark:text-slate-50 lg:text-5xl"
        >
          Get Started With NgNova UI
        </h1>
        <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Install the package, configure Tailwind source scanning, import standalone components, and
          verify the library the same way it will be published.
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <a routerLink="/components/button">
            <ui-button>Open Button Docs</ui-button>
          </a>
          <a routerLink="/">
            <ui-button variant="outline">Back To Overview</ui-button>
          </a>
        </div>
      </header>

      <section class="mt-8 grid gap-5">
        @for (step of setupSteps; track step.title; let index = $index) {
          <ui-card>
            <div uiCardHeader>
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold uppercase text-blue-700 dark:text-blue-300">
                    Step {{ index + 1 }}
                  </p>
                  <h2 class="mt-1 text-xl font-semibold text-slate-950 dark:text-slate-50">
                    {{ step.title }}
                  </h2>
                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            </div>
            <pre
              class="overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-6 text-slate-100"
            ><code>{{ step.code }}</code></pre>
          </ui-card>
        }
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-2">
        <ui-card>
          <div uiCardHeader>
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">
              Consumer App Checklist
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Use this before adopting NgNova in an Angular product.
            </p>
          </div>
          <ul class="grid gap-4">
            @for (item of consumerChecklist; track item.title) {
              <li class="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h3 class="font-semibold text-slate-950 dark:text-slate-50">{{ item.title }}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {{ item.description }}
                </p>
              </li>
            }
          </ul>
        </ui-card>

        <ui-card>
          <div uiCardHeader>
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">
              Library Maintainer Checklist
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Use this before shipping public component changes.
            </p>
          </div>
          <ul class="grid gap-4">
            @for (item of maintainerChecklist; track item.title) {
              <li class="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h3 class="font-semibold text-slate-950 dark:text-slate-50">{{ item.title }}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {{ item.description }}
                </p>
              </li>
            }
          </ul>
        </ui-card>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetStartedComponent {
  protected readonly setupSteps: readonly SetupStep[] = [
    {
      title: 'Install the package',
      description: 'Install NgNova UI into an Angular 22 application.',
      code: `npm install @ngnova/ui`,
    },
    {
      title: 'Configure Tailwind source scanning',
      description: 'Tailwind v4 ignores node_modules by default, so include NgNova UI as a source.',
      code: `@import 'tailwindcss';
@source "../node_modules/@ngnova/ui";`,
    },
    {
      title: 'Import standalone components',
      description: 'Import only the components used by the feature or page.',
      code: `import { Component } from '@angular/core';
import { UiButtonComponent, UiInputComponent } from '@ngnova/ui';

@Component({
  standalone: true,
  imports: [UiButtonComponent, UiInputComponent],
  template: \`
    <ui-input label="Email" autocomplete="email" />
    <ui-button (pressed)="save()">Save</ui-button>
  \`,
})
export class SettingsFormComponent {
  save(): void {}
}`,
    },
    {
      title: 'Verify before publishing',
      description: 'Build and pack from dist/ui so the published artifact matches npm consumers.',
      code: `npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:demo
cd dist/ui
npm.cmd pack --dry-run`,
    },
  ];

  protected readonly consumerChecklist: readonly ChecklistItem[] = [
    {
      title: 'Use semantic labels',
      description:
        'Provide visible labels or ariaLabel values for icon-only and label-less controls.',
    },
    {
      title: 'Keep state parent-owned',
      description:
        'Use valueChange, openChange, and activeChange outputs to update application state.',
    },
    {
      title: 'Test real workflows',
      description:
        'Validate keyboard interaction, disabled states, validation, and dark mode in product screens.',
    },
  ];

  protected readonly maintainerChecklist: readonly ChecklistItem[] = [
    {
      title: 'Treat API as semver-sensitive',
      description:
        'Selectors, inputs, outputs, exported types, and package entry points are public contracts.',
    },
    {
      title: 'Document every public feature',
      description:
        'Update live preview, usage snippets, accessibility notes, API tables, and testing notes together.',
    },
    {
      title: 'Publish only package output',
      description:
        'Build with ng-packagr and publish from dist/ui, never from projects/ui source files.',
    },
  ];
}
