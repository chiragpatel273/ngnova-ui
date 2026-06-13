import type { Routes } from '@angular/router';

import { ComponentDocPageComponent } from './docs/component-doc-page';
import { DocsLayoutComponent } from './docs/docs-layout';
import { DocsHomeComponent } from './docs/docs-home';
import { GetStartedComponent } from './docs/get-started';

export const routes: Routes = [
  {
    path: '',
    component: DocsLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: DocsHomeComponent },
      { path: 'get-started', component: GetStartedComponent },
      { path: 'components/:slug', component: ComponentDocPageComponent },
    ],
  },
];
