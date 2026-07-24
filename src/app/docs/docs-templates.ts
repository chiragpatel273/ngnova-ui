import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDownTray, heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';

import { AdminDashboardTemplateComponent } from './admin-dashboard-template';
import { DocsCodeBlockComponent } from './docs-code-block';
import {
  ADMIN_DASHBOARD_SOURCE_FILES,
  type AdminDashboardSourceFile,
  type AdminDashboardSourceId,
} from './generated/admin-dashboard-template-sources';

@Component({
  selector: 'app-docs-templates',
  standalone: true,
  imports: [AdminDashboardTemplateComponent, DocsCodeBlockComponent, NgIcon],
  providers: [provideIcons({ heroArrowDownTray, heroArrowTopRightOnSquare })],
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
              Admin dashboard
            </h1>
            <p class="mt-2 max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-300">
              A responsive SaaS operations console built from NgNova UI components, with practical
              navigation, metrics, data visualization, filters, and order-management workflows.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <a
              href="#/templates/admin-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-800 dark:hover:bg-blue-950/50"
            >
              <ng-icon name="heroArrowTopRightOnSquare" class="size-4" aria-hidden="true" />
              Open dashboard
            </a>
            <a
              href="templates/admin-dashboard/ngnova-admin-dashboard.zip"
              download
              class="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <ng-icon name="heroArrowDownTray" class="size-4" aria-hidden="true" />
              Download ZIP
            </a>
          </div>
        </div>
      </header>

      <section class="py-5" aria-labelledby="dashboard-preview-title">
        <div class="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="dashboard-preview-title"
              class="text-base font-bold text-slate-950 dark:text-slate-50"
            >
              Live preview
            </h2>
            <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Responsive, interactive, and composed from published NgNova components.
            </p>
          </div>
        </div>
        <div
          class="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
        >
          <app-admin-dashboard-template />
        </div>
      </section>

      <section class="grid gap-3" aria-labelledby="dashboard-source-title">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300"
          >
            Complete source
          </p>
          <h2
            id="dashboard-source-title"
            class="mt-1 text-base font-bold text-slate-950 dark:text-slate-50"
          >
            Copy individual files or download the project-ready package
          </h2>
          <p class="mt-1.5 max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-400">
            The source below is generated from the live preview. The ZIP also includes the canvas
            chart helper and setup instructions, so no dashboard code is omitted.
          </p>
        </div>

        <div
          class="flex w-fit max-w-full gap-1 overflow-x-auto rounded-md bg-slate-100 p-1 dark:bg-slate-900"
          role="tablist"
          aria-label="Admin dashboard source files"
        >
          @for (file of sourceFiles; track file.id) {
            <button
              type="button"
              role="tab"
              class="min-h-8 shrink-0 cursor-pointer rounded px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
              [class.bg-white]="activeSourceId() === file.id"
              [class.text-blue-800]="activeSourceId() === file.id"
              [class.shadow-sm]="activeSourceId() === file.id"
              [class.dark:bg-slate-800]="activeSourceId() === file.id"
              [class.dark:text-blue-200]="activeSourceId() === file.id"
              [class.text-slate-600]="activeSourceId() !== file.id"
              [class.hover:text-slate-950]="activeSourceId() !== file.id"
              [class.dark:text-slate-300]="activeSourceId() !== file.id"
              [class.dark:hover:text-white]="activeSourceId() !== file.id"
              [attr.aria-selected]="activeSourceId() === file.id"
              [attr.aria-controls]="'dashboard-source-' + file.id"
              (click)="selectSource(file.id)"
            >
              {{ file.label }}
            </button>
          }
        </div>

        <div
          role="tabpanel"
          [id]="'dashboard-source-' + activeSource().id"
          [attr.aria-label]="activeSource().label"
        >
          <app-docs-code-block
            [code]="activeSource().code"
            [filename]="activeSource().filename"
            [language]="activeSource().language"
          />
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTemplatesComponent {
  protected readonly sourceFiles = ADMIN_DASHBOARD_SOURCE_FILES;
  protected readonly activeSourceId = signal<AdminDashboardSourceId>('html');
  protected readonly activeSource = computed<AdminDashboardSourceFile>(
    () => this.sourceFiles.find((file) => file.id === this.activeSourceId()) ?? this.sourceFiles[0],
  );

  protected selectSource(sourceId: AdminDashboardSourceId): void {
    this.activeSourceId.set(sourceId);
  }
}
