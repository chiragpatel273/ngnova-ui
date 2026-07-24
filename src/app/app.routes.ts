import type { Routes } from '@angular/router';

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
        loadComponent: () =>
          import('./docs/get-started').then((module) => module.GetStartedComponent),
      },
      { path: 'get-started', redirectTo: 'guide', pathMatch: 'full' },
      {
        path: 'apis',
        loadComponent: () =>
          import('./docs/docs-api-reference').then((module) => module.DocsApiReferenceComponent),
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: { topic: 'components' },
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./docs/docs-templates').then((module) => module.DocsTemplatesComponent),
      },
      {
        path: 'playground',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: { topic: 'playground' },
      },
      {
        path: 'accessibility',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: { topic: 'accessibility' },
      },
      {
        path: 'theming',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: { topic: 'theming' },
      },
      {
        path: 'roadmap',
        loadComponent: () =>
          import('./docs/docs-topic-page').then((module) => module.DocsTopicPageComponent),
        data: { topic: 'roadmap' },
      },
      {
        path: 'components/:slug',
        loadComponent: () =>
          import('./docs/component-doc-page').then((module) => module.ComponentDocPageComponent),
      },
    ],
  },
  {
    path: 'templates/admin-dashboard',
    loadComponent: () =>
      import('./docs/admin-dashboard-preview').then(
        (module) => module.AdminDashboardPreviewComponent,
      ),
  },
];
