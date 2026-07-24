import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ADMIN_DASHBOARD_TEMPLATE_SOURCE,
  AdminDashboardTemplateComponent,
} from './admin-dashboard-template';
import { DocsCodeBlockComponent } from './docs-code-block';

@Component({
  selector: 'app-docs-templates',
  standalone: true,
  imports: [AdminDashboardTemplateComponent, DocsCodeBlockComponent],
  template: `
    <article class="mx-auto max-w-[100rem] pb-14 sm:pb-16">
      <header class="border-b border-blue-200 pb-6 pt-2 dark:border-blue-950/70 sm:pt-3">
        <span
          class="inline-flex rounded-md bg-blue-100 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-blue-800 dark:bg-blue-950 dark:text-blue-200"
        >
          Templates
        </span>
        <h1
          class="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50"
        >
          Admin dashboard
        </h1>
        <p
          class="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300"
        >
          A responsive SaaS operations console built from NgNova UI components, with practical
          navigation, metrics, data visualization, filters, and order-management workflows.
        </p>
      </header>

      <section class="py-6">
        <div
          class="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
        >
          <app-admin-dashboard-template />
        </div>
      </section>

      <section class="grid gap-4">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300"
          >
            Composition blueprint
          </p>
          <h2 class="mt-1.5 text-xl font-bold text-slate-950 dark:text-slate-50">
            Start with the product structure
          </h2>
          <p class="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Use this layout map to understand the main NgNova component boundaries, then copy the
            live implementation when you need its full data and responsive behavior.
          </p>
        </div>

        <app-docs-code-block
          [code]="templateCode"
          filename="admin-dashboard.component.html"
          language="Angular template"
        />
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTemplatesComponent {
  protected readonly templateCode = ADMIN_DASHBOARD_TEMPLATE_SOURCE;
}
