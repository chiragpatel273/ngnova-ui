import { RenderMode, type ServerRoute } from '@angular/ssr';

import { componentDocs } from './docs/docs-data';

/**
 * Every documentation route is prerendered to static HTML so GitHub Pages can serve
 * crawlable, reload-safe path URLs without a server.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'components/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => componentDocs.map((doc) => ({ slug: doc.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
