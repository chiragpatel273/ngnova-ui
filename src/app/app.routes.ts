import type { Routes } from '@angular/router';

import { resolveComponentMeta } from './docs/docs-seo';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./docs/docs-layout').then((module) => module.DocsLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./docs/docs-home').then((module) => module.DocsHomeComponent),
      },
      {
        path: 'guide',
        title: 'Getting started',
        loadComponent: () =>
          import('./docs/get-started').then((module) => module.GetStartedComponent),
        data: {
          description:
            'Install NgNova UI with ng add or npm, configure Tailwind CSS v4, and import standalone Angular 22 components from focused entry points.',
        },
      },
      { path: 'get-started', redirectTo: 'guide', pathMatch: 'full' },
      {
        path: 'apis',
        title: 'API reference',
        loadComponent: () =>
          import('./docs/docs-api-reference').then((module) => module.DocsApiReferenceComponent),
        data: {
          description:
            'Typed inputs, outputs, and entry points for every NgNova UI Angular component, checked against the implementation on every release.',
        },
      },
      {
        path: 'components',
        title: 'Components',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: {
          description:
            'Browse 40 accessible Angular 22 components: forms, overlays, data tables, navigation, feedback, and layout.',
          topic: 'components',
        },
      },
      {
        path: 'forms',
        title: 'Angular Forms and Signal Forms',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: {
          description:
            'Use NgNova UI form controls with Angular 22 Signal Forms, Reactive Forms, and template-driven forms.',
          topic: 'forms',
        },
      },
      {
        path: 'templates',
        title: 'Templates',
        loadComponent: () =>
          import('./docs/docs-templates').then((module) => module.DocsTemplatesComponent),
        data: {
          description:
            'Production-style Angular templates built with NgNova UI components, including an admin dashboard.',
        },
      },
      {
        path: 'playground',
        title: 'Playground',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: {
          description:
            'Experiment with NgNova UI component states, dark mode, forms behavior, and density.',
          topic: 'playground',
        },
      },
      {
        path: 'accessibility',
        title: 'Accessibility',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: {
          description:
            'Keyboard, ARIA, focus-visible, reduced-motion, and forced-colors contracts for NgNova UI Angular components.',
          topic: 'accessibility',
        },
      },
      {
        path: 'theming',
        title: 'Theming and design tokens',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: {
          description:
            'Customize NgNova UI with Tailwind CSS v4, versioned --ui-* CSS tokens, and light and dark modes.',
          topic: 'theming',
        },
      },
      {
        path: 'roadmap',
        title: 'Roadmap',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: {
          description: 'What the NgNova UI Angular component library is building next and why.',
          topic: 'roadmap',
        },
      },
      {
        path: 'contributing',
        title: 'Contributing',
        loadComponent: () =>
          import('./docs/docs-contributing').then((module) => module.DocsContributingComponent),
        data: {
          description: 'How to contribute components, fixes, and documentation to NgNova UI.',
        },
      },
      {
        path: 'components/:slug',
        resolve: { componentMeta: resolveComponentMeta },
        loadComponent: () =>
          import('./docs/component-doc-page').then((module) => module.ComponentDocPageComponent),
      },
    ],
  },
  {
    path: 'templates/admin-dashboard',
    title: 'Admin dashboard template',
    loadComponent: () =>
      import('./docs/admin-dashboard-preview').then(
        (module) => module.AdminDashboardPreviewComponent,
      ),
    data: {
      description: 'A responsive Angular admin dashboard built entirely from NgNova UI components.',
    },
  },
];
