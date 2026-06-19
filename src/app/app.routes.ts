import type { Routes } from '@angular/router';

import { ComponentDocPageComponent } from './docs/component-doc-page';
import { DocsApiReferenceComponent } from './docs/docs-api-reference';
import { DocsLayoutComponent } from './docs/docs-layout';
import { DocsHomeComponent } from './docs/docs-home';
import { DocsTopicPageComponent } from './docs/docs-topic-page';
import { GetStartedComponent } from './docs/get-started';

export const routes: Routes = [
  {
    path: '',
    component: DocsLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: DocsHomeComponent },
      { path: 'get-started', component: GetStartedComponent },
      { path: 'guide', redirectTo: 'get-started', pathMatch: 'full' },
      { path: 'apis', component: DocsApiReferenceComponent },
      { path: 'components', component: DocsTopicPageComponent, data: { topic: 'components' } },
      { path: 'playground', component: DocsTopicPageComponent, data: { topic: 'playground' } },
      {
        path: 'accessibility',
        component: DocsTopicPageComponent,
        data: { topic: 'accessibility' },
      },
      { path: 'theming', component: DocsTopicPageComponent, data: { topic: 'theming' } },
      { path: 'roadmap', component: DocsTopicPageComponent, data: { topic: 'roadmap' } },
      { path: 'components/:slug', component: ComponentDocPageComponent },
    ],
  },
];
