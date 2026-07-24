import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AdminDashboardTemplateComponent } from './admin-dashboard-template';

@Component({
  selector: 'app-admin-dashboard-preview',
  standalone: true,
  imports: [AdminDashboardTemplateComponent],
  template: `
    <main class="min-h-dvh bg-slate-100 p-2 dark:bg-slate-950 sm:p-3">
      <div
        class="mx-auto min-h-[calc(100dvh-1.5rem)] max-w-[100rem] overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <app-admin-dashboard-template />
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPreviewComponent {}
