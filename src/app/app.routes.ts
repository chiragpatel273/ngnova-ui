import type { Routes } from '@angular/router';

import { ComponentDocPageComponent } from './docs/component-doc-page';
import { DocsLayoutComponent } from './docs/docs-layout';

export const routes: Routes = [
  {
    path: '',
    component: DocsLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'components/button' },
      { path: 'components/:slug', component: ComponentDocPageComponent },
    ],
  },
];
