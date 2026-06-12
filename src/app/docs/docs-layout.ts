import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiBadgeComponent } from '@ngnova/ui';

import { componentDocs } from './docs-data';

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UiBadgeComponent],
  template: `
    <main class="min-h-dvh bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div class="mx-auto grid min-h-dvh max-w-7xl lg:grid-cols-[17rem_1fr]">
        <aside
          class="border-b border-slate-200 bg-white/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/80 lg:border-b-0 lg:border-r lg:sticky lg:top-0 lg:h-dvh"
        >
          <a routerLink="/" class="block">
            <ui-badge variant="info" size="sm">Angular 22 + Tailwind 4</ui-badge>
            <h1 class="mt-4 text-2xl font-semibold tracking-tight">NgNova UI</h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Component previews, usage examples, and API notes.
            </p>
          </a>

          <nav
            class="mt-8 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
            aria-label="Component documentation"
          >
            @for (doc of docs; track doc.slug) {
              <a
                class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                [routerLink]="['/components', doc.slug]"
                routerLinkActive="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              >
                {{ doc.name }}
              </a>
            }
          </nav>
        </aside>

        <section class="min-w-0 px-5 py-8 lg:px-10">
          <router-outlet />
        </section>
      </div>
    </main>
  `,
})
export class DocsLayoutComponent {
  protected readonly docs = componentDocs;
}
