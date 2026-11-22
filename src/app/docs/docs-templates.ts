import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowTopRightOnSquare,
  heroBolt,
  heroCodeBracket,
  heroCommandLine,
  heroLanguage,
  heroMoon,
  heroShieldCheck,
} from '@ng-icons/heroicons/outline';

import { DocsCodeBlockComponent } from './docs-code-block';

export const ADMIN_TEMPLATE_REPOSITORY_URL =
  'https://github.com/chiragpatel273/ngnova-ui/tree/main/templates/admin';
export const ADMIN_TEMPLATE_STACKBLITZ_URL =
  'https://stackblitz.com/github/chiragpatel273/ngnova-ui/tree/main/templates/admin';

interface TemplatePage {
  readonly name: string;
  readonly description: string;
  readonly path: string;
}

interface TemplateComponent {
  readonly label: string;
  readonly slug: string;
}

const PAGES: readonly TemplatePage[] = [
  {
    name: 'Overview',
    description:
      'KPI sparklines, a revenue, orders, and visitors chart, plan mix, top products, and recent orders.',
    path: '',
  },
  {
    name: 'Customers',
    description:
      'Search, filter chips, sorting, pagination, bulk actions, a detail drawer, and a validated form.',
    path: 'customers',
  },
  {
    name: 'Orders',
    description:
      'Status tabs with counts, a date filter, bulk fulfillment, and a mobile card list.',
    path: 'orders',
  },
  {
    name: 'Order details',
    description: 'Fulfillment stepper, line items, timeline, and refund with typed confirmation.',
    path: 'orders/NS-4117',
  },
  {
    name: 'Sign in',
    description: 'Split-screen sign-in with validation, password reveal, and social buttons.',
    path: 'sign-in',
  },
  {
    name: 'Settings',
    description: 'Profile with photo upload, team invites, notification switches, and appearance.',
    path: 'settings',
  },
];

const FEATURES = [
  {
    icon: 'heroBolt',
    title: 'Real Angular 22 app',
    text: 'Standalone, zoneless, OnPush, signals, lazy routes, and Signal Forms.',
  },
  {
    icon: 'heroCommandLine',
    title: 'Command palette',
    text: 'Press Ctrl K or ⌘K to jump to any page, customer, order, or action.',
  },
  {
    icon: 'heroMoon',
    title: 'Dark mode',
    text: 'Light, dark, or system, applied before first paint and saved per browser.',
  },
  {
    icon: 'heroLanguage',
    title: 'Right-to-left ready',
    text: 'Switch the whole layout to RTL from the header or the Appearance settings.',
  },
  {
    icon: 'heroShieldCheck',
    title: 'Accessible by default',
    text: 'Skip link, landmarks, labelled controls, focus management, and chart data tables.',
  },
  {
    icon: 'heroCodeBracket',
    title: 'Ready for your API',
    text: 'Async services over mock data, with unit tests, so swapping in HttpClient is local.',
  },
] as const;

const COMPONENTS: readonly TemplateComponent[] = [
  ['Alert', 'alert'],
  ['Avatar', 'avatar'],
  ['Button', 'button'],
  ['Checkbox', 'checkbox'],
  ['Chip', 'chip'],
  ['Combobox', 'combobox'],
  ['Command Palette', 'command-palette'],
  ['Confirmation', 'confirmation'],
  ['Date Picker', 'date-picker'],
  ['Divider', 'divider'],
  ['Drawer', 'drawer'],
  ['File Upload', 'file-upload'],
  ['Input', 'input'],
  ['Menu', 'menu'],
  ['Modal', 'modal'],
  ['Paginator', 'paginator'],
  ['Popover', 'popover'],
  ['Progress Bar', 'progress-bar'],
  ['Radio', 'radio'],
  ['Select', 'select'],
  ['Skeleton', 'skeleton'],
  ['Stepper', 'stepper'],
  ['Switch', 'switch'],
  ['Table', 'table'],
  ['Table State', 'table-state'],
  ['Tabs', 'tabs'],
  ['Tag', 'tag'],
  ['Textarea', 'textarea'],
  ['Toast', 'toast'],
  ['Tooltip', 'tooltip'],
].map(([label, slug]) => ({ label, slug }));

const linkButton =
  'inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

@Component({
  selector: 'app-docs-templates',
  standalone: true,
  imports: [DocsCodeBlockComponent, NgIcon, RouterLink],
  providers: [
    provideIcons({
      heroArrowTopRightOnSquare,
      heroBolt,
      heroCodeBracket,
      heroCommandLine,
      heroLanguage,
      heroMoon,
      heroShieldCheck,
    }),
  ],
  template: `
    <article class="mx-auto max-w-[100rem] pb-10 sm:pb-12">
      <header class="border-b border-blue-200 pb-4 pt-1 dark:border-blue-950/70">
        <span
          class="inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-blue-800 dark:bg-blue-950 dark:text-blue-200"
        >
          Templates
        </span>
        <div class="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1
              class="text-2xl font-bold leading-8 tracking-tight text-slate-950 dark:text-slate-50"
            >
              Northstar Admin
            </h1>
            <p class="mt-2 max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-300">
              A free, MIT-licensed Angular 22 admin dashboard built with NgNova UI and Tailwind CSS
              v4. Six working pages, dark mode, right-to-left support, and a command palette, ready
              to clone and connect to your API.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <a
              href="templates/admin/"
              target="_blank"
              rel="noopener"
              data-testid="open-admin-demo"
              [class]="primaryLink"
            >
              <ng-icon name="heroArrowTopRightOnSquare" class="size-4" aria-hidden="true" />
              Open live demo
            </a>
            <a
              [href]="stackblitzUrl"
              target="_blank"
              rel="noopener noreferrer"
              [class]="secondaryLink"
            >
              Open in StackBlitz
            </a>
            <a
              [href]="repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              [class]="secondaryLink"
            >
              View source
            </a>
          </div>
        </div>
      </header>

      <section class="py-5" aria-labelledby="admin-preview-title">
        <h2 id="admin-preview-title" class="text-base font-bold text-slate-950 dark:text-slate-50">
          Live preview
        </h2>
        <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
          The running template. Every button, filter, and form works; data resets when you reload.
        </p>
        <div
          class="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <iframe
            src="templates/admin/"
            title="Northstar Admin live demo"
            loading="lazy"
            class="block h-[46rem] w-full"
            data-testid="admin-template-preview"
          ></iframe>
        </div>
      </section>

      <section class="grid gap-3 py-5" aria-labelledby="admin-start-title">
        <h2 id="admin-start-title" class="text-base font-bold text-slate-950 dark:text-slate-50">
          Use this template
        </h2>
        <p class="max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-400">
          Copy the template into a new folder, install, and start the dev server. It depends on the
          published <code>&#64;ngnova/ui</code> package, so it stays independent of this repository.
        </p>
        <app-docs-code-block [code]="setupCode" filename="terminal" language="Shell" />
      </section>

      <section class="py-5" aria-labelledby="admin-pages-title">
        <h2 id="admin-pages-title" class="text-base font-bold text-slate-950 dark:text-slate-50">
          Pages
        </h2>
        <ul class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          @for (page of pages; track page.name) {
            <li>
              <a
                [href]="'templates/admin/' + page.path"
                target="_blank"
                rel="noopener"
                class="block h-full rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
              >
                <span class="text-sm font-semibold text-slate-950 dark:text-slate-50">{{
                  page.name
                }}</span>
                <span class="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-400">{{
                  page.description
                }}</span>
              </a>
            </li>
          }
        </ul>
      </section>

      <section class="py-5" aria-labelledby="admin-features-title">
        <h2 id="admin-features-title" class="text-base font-bold text-slate-950 dark:text-slate-50">
          What's included
        </h2>
        <ul class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          @for (feature of features; track feature.title) {
            <li
              class="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <ng-icon
                [name]="feature.icon"
                class="mt-0.5 size-5 shrink-0 text-blue-700 dark:text-blue-300"
                aria-hidden="true"
              />
              <span>
                <span class="block text-sm font-semibold text-slate-950 dark:text-slate-50">{{
                  feature.title
                }}</span>
                <span class="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-400">{{
                  feature.text
                }}</span>
              </span>
            </li>
          }
        </ul>
      </section>

      <section class="py-5" aria-labelledby="admin-components-title">
        <h2
          id="admin-components-title"
          class="text-base font-bold text-slate-950 dark:text-slate-50"
        >
          {{ components.length }} NgNova UI entry points in use
        </h2>
        <ul class="mt-3 flex flex-wrap gap-2" data-testid="admin-template-components">
          @for (component of components; track component.slug) {
            <li>
              <a
                [routerLink]="['/components', component.slug]"
                class="inline-flex rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:text-blue-200"
                >{{ component.label }}</a
              >
            </li>
          }
        </ul>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTemplatesComponent {
  protected readonly repositoryUrl = ADMIN_TEMPLATE_REPOSITORY_URL;
  protected readonly stackblitzUrl = ADMIN_TEMPLATE_STACKBLITZ_URL;
  protected readonly pages = PAGES;
  protected readonly features = FEATURES;
  protected readonly components = COMPONENTS;
  protected readonly primaryLink = `${linkButton} bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500`;
  protected readonly secondaryLink = `${linkButton} border border-slate-300 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-800 dark:hover:bg-blue-950/50`;
  protected readonly setupCode = [
    'npx degit chiragpatel273/ngnova-ui/templates/admin my-admin',
    'cd my-admin',
    'npm install',
    'npm start',
  ].join('\n');
}
