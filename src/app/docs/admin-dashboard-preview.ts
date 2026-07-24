import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AdminDashboardTemplateComponent } from './admin-dashboard-template';

@Component({
  selector: 'app-admin-dashboard-preview',
  standalone: true,
  imports: [AdminDashboardTemplateComponent],
  template: `
    <div>
      <app-admin-dashboard-template />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPreviewComponent {}
