import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiAlertComponent } from '@ngnova/ui/alert';
import { UiBadgeComponent } from '@ngnova/ui/badge';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiCardComponent } from '@ngnova/ui/card';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiSwitchComponent } from '@ngnova/ui/switch';
import { UiTabsComponent } from '@ngnova/ui/tabs';
import type { UiTabItem } from '@ngnova/ui/tabs';
import { UiTableComponent } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow } from '@ngnova/ui/table';
import { UiTagComponent } from '@ngnova/ui/tag';

import { DocsCodeBlockComponent } from './docs-code-block';

const ADMIN_DASHBOARD_TEMPLATE = `<main class="grid min-h-screen bg-slate-100 text-slate-950 lg:grid-cols-[16rem_minmax(0,1fr)]">
  <aside class="border-r border-slate-200 bg-white p-5">
    <div>
      <p class="text-xl font-bold">Acme Admin</p>
      <p class="mt-1 text-sm text-slate-500">Operations workspace</p>
    </div>

    <nav class="mt-8 grid gap-1">
      <a class="rounded bg-blue-50 px-3 py-2 font-medium text-blue-800">Overview</a>
      <a class="rounded px-3 py-2 text-slate-600">Customers</a>
      <a class="rounded px-3 py-2 text-slate-600">Billing</a>
      <a class="rounded px-3 py-2 text-slate-600">Settings</a>
    </nav>
  </aside>

  <section class="grid gap-6 p-6">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <ui-badge size="sm">Admin dashboard</ui-badge>
        <h1 class="mt-3 text-3xl font-bold">Operations overview</h1>
        <p class="mt-1 text-slate-500">Monitor revenue, customer health, and release workflow.</p>
      </div>

      <div class="flex gap-3">
        <ui-select ariaLabel="Date range" [options]="rangeOptions" />
        <ui-button>Export report</ui-button>
      </div>
    </header>

    <ui-alert title="Release window is active" variant="warning">
      Two production services are inside a monitored deploy window.
    </ui-alert>

    <section class="grid gap-4 xl:grid-cols-4">
      <ui-card>
        <div uiCardHeader>
          <span class="text-sm font-medium text-slate-500">Revenue</span>
          <h2 class="mt-1 text-2xl font-semibold">$84.2k</h2>
        </div>
        <ui-progress-bar [value]="78" label="Revenue target" />
      </ui-card>

      <ui-card>
        <div uiCardHeader>
          <span class="text-sm font-medium text-slate-500">Activation</span>
          <h2 class="mt-1 text-2xl font-semibold">68%</h2>
        </div>
        <ui-tag variant="success">+8.4%</ui-tag>
      </ui-card>

      <ui-card>
        <div uiCardHeader>
          <span class="text-sm font-medium text-slate-500">Incidents</span>
          <h2 class="mt-1 text-2xl font-semibold">3</h2>
        </div>
        <ui-tag variant="warning">Needs review</ui-tag>
      </ui-card>

      <ui-card>
        <div uiCardHeader>
          <span class="text-sm font-medium text-slate-500">Queue</span>
          <h2 class="mt-1 text-2xl font-semibold">24</h2>
        </div>
        <ui-button size="sm" variant="outline">Review</ui-button>
      </ui-card>
    </section>

    <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <ui-card>
        <div uiCardHeader>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-xl font-semibold">Regional performance</h2>
              <p class="text-sm text-slate-500">Revenue and health by operating region.</p>
            </div>
            <ui-button size="sm" variant="outline">Open analytics</ui-button>
          </div>
        </div>

        <ui-tabs
          [tabs]="dashboardTabs"
          [active]="activeDashboardTab()"
          (activeChange)="activeDashboardTab.set($event)"
          ariaLabel="Dashboard views"
        >
          <ui-table [columns]="regionColumns" [rows]="regionRows" selectable />
        </ui-tabs>
      </ui-card>

      <div class="grid gap-5">
        <ui-card>
          <div uiCardHeader>
            <h2 class="text-xl font-semibold">Workflow controls</h2>
          </div>
          <div class="grid gap-4">
            <ui-switch label="Auto-approve low-risk deploys" />
            <ui-switch label="Send incident digest" />
            <ui-input label="Owner email" type="email" helperText="Used for escalation routing." />
          </div>
          <div uiCardFooter>
            <ui-button fullWidth>Save controls</ui-button>
          </div>
        </ui-card>

        <ui-card>
          <div uiCardHeader>
            <h2 class="text-xl font-semibold">Recent activity</h2>
          </div>
          <div class="grid gap-3 text-sm">
            <div class="flex items-center justify-between gap-3">
              <span>Billing sync completed</span>
              <ui-tag variant="success">Done</ui-tag>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span>EU deploy entered review</span>
              <ui-tag variant="warning">Review</ui-tag>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span>New enterprise customer</span>
              <ui-tag>Sales</ui-tag>
            </div>
          </div>
        </ui-card>
      </div>
    </section>
  </section>
</main>`;

@Component({
  selector: 'app-docs-templates',
  standalone: true,
  imports: [
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiInputComponent,
    UiProgressBarComponent,
    UiSelectComponent,
    UiSwitchComponent,
    UiTableComponent,
    UiTabsComponent,
    UiTagComponent,
    DocsCodeBlockComponent,
  ],
  template: `
    <article class="mx-auto max-w-[90rem] pb-20">
      <header class="border-b border-blue-200 pb-8 pt-5 dark:border-blue-950/70">
        <span
          class="rounded bg-blue-100 px-3 py-2 text-sm font-medium uppercase tracking-wide text-blue-800 dark:bg-blue-950 dark:text-blue-200"
        >
          Templates
        </span>
        <h1 class="mt-7 text-5xl font-bold leading-tight text-slate-950 dark:text-slate-50">
          Admin Dashboard Template
        </h1>
        <p class="mt-5 max-w-4xl text-xl leading-9 text-slate-600 dark:text-slate-300">
          A realistic SaaS admin layout composed from today&apos;s NgNova UI primitives. Use it as a
          copyable product pattern now, and as evidence for which navigation and layout primitives
          should become first-class components later.
        </p>
      </header>

      <section class="grid gap-6 py-8">
        <div
          class="overflow-hidden rounded border border-blue-200 bg-white shadow-sm dark:border-blue-950 dark:bg-slate-950"
        >
          <div class="border-b border-blue-100 p-5 dark:border-blue-950/70 sm:p-6">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold text-slate-950 dark:text-slate-50">
                  SaaS Operations Console
                </h2>
                <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
                  Includes a sidebar, dashboard header, KPI cards, alert state, data table, workflow
                  settings, and recent activity.
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                @for (item of templateImports; track item) {
                  <ui-badge size="sm">{{ item }}</ui-badge>
                }
              </div>
            </div>
          </div>

          <div class="bg-slate-100 p-4 dark:bg-slate-900 sm:p-6">
            <main
              class="grid min-h-[48rem] overflow-hidden rounded border border-slate-200 bg-slate-100 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 lg:grid-cols-[14rem_minmax(0,1fr)]"
            >
              <aside
                class="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:border-b-0 lg:border-r"
              >
                <div>
                  <p class="text-lg font-bold">Acme Admin</p>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Operations workspace
                  </p>
                </div>

                <nav class="mt-7 grid gap-1 text-sm" aria-label="Admin template navigation">
                  @for (item of navigationItems; track item) {
                    <a
                      class="rounded px-3 py-2 transition"
                      [class.bg-blue-50]="item === 'Overview'"
                      [class.text-blue-800]="item === 'Overview'"
                      [class.font-medium]="item === 'Overview'"
                      [class.text-slate-600]="item !== 'Overview'"
                      [class.dark:text-slate-300]="item !== 'Overview'"
                    >
                      {{ item }}
                    </a>
                  }
                </nav>
              </aside>

              <section class="grid content-start gap-5 p-4 sm:p-5">
                <header class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <ui-badge size="sm">Admin dashboard</ui-badge>
                    <h3 class="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                      Operations overview
                    </h3>
                    <p class="mt-1 text-slate-500 dark:text-slate-400">
                      Monitor revenue, customer health, and release workflow.
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-3">
                    <ui-select ariaLabel="Date range" [options]="rangeOptions" />
                    <ui-button>Export report</ui-button>
                  </div>
                </header>

                <ui-alert title="Release window is active" variant="warning">
                  Two production services are inside a monitored deploy window.
                </ui-alert>

                <section class="grid gap-4 xl:grid-cols-4">
                  @for (metric of metrics; track metric.label) {
                    <ui-card>
                      <div uiCardHeader>
                        <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {{ metric.label }}
                        </span>
                        <h4 class="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                          {{ metric.value }}
                        </h4>
                      </div>
                      @if (metric.progress !== null) {
                        <ui-progress-bar [value]="metric.progress" [label]="metric.label" />
                      } @else {
                        <ui-tag [variant]="metric.tagVariant">{{ metric.tag }}</ui-tag>
                      }
                    </ui-card>
                  }
                </section>

                <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
                  <ui-card>
                    <div uiCardHeader>
                      <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 class="text-xl font-semibold text-slate-950 dark:text-white">
                            Regional performance
                          </h4>
                          <p class="text-sm text-slate-500 dark:text-slate-400">
                            Revenue and health by operating region.
                          </p>
                        </div>
                        <ui-button size="sm" variant="outline">Open analytics</ui-button>
                      </div>
                    </div>

                    <ui-tabs
                      [tabs]="dashboardTabs"
                      [active]="activeDashboardTab()"
                      (activeChange)="activeDashboardTab.set($event)"
                      ariaLabel="Dashboard views"
                    >
                      <ui-table [columns]="regionColumns" [rows]="regionRows" selectable />
                    </ui-tabs>
                  </ui-card>

                  <div class="grid gap-5">
                    <ui-card>
                      <div uiCardHeader>
                        <h4 class="text-xl font-semibold text-slate-950 dark:text-white">
                          Workflow controls
                        </h4>
                      </div>
                      <div class="grid gap-4">
                        <ui-switch label="Auto-approve low-risk deploys" />
                        <ui-switch label="Send incident digest" />
                        <ui-input
                          label="Owner email"
                          type="email"
                          helperText="Used for escalation routing."
                        />
                      </div>
                      <div uiCardFooter>
                        <ui-button fullWidth>Save controls</ui-button>
                      </div>
                    </ui-card>

                    <ui-card>
                      <div uiCardHeader>
                        <h4 class="text-xl font-semibold text-slate-950 dark:text-white">
                          Recent activity
                        </h4>
                      </div>
                      <div class="grid gap-3 text-sm">
                        @for (activity of activities; track activity.label) {
                          <div class="flex items-center justify-between gap-3">
                            <span>{{ activity.label }}</span>
                            <ui-tag [variant]="activity.variant">{{ activity.status }}</ui-tag>
                          </div>
                        }
                      </div>
                    </ui-card>
                  </div>
                </section>
              </section>
            </main>
          </div>
        </div>

        <app-docs-code-block
          [code]="templateCode"
          filename="admin-dashboard.template.html"
          language="Angular template"
        />
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTemplatesComponent {
  protected readonly templateCode = ADMIN_DASHBOARD_TEMPLATE;
  protected readonly activeDashboardTab = signal('regions');
  protected readonly navigationItems = ['Overview', 'Customers', 'Billing', 'Settings'] as const;
  protected readonly templateImports = [
    'UiAlertComponent',
    'UiButtonComponent',
    'UiCardComponent',
    'UiInputComponent',
    'UiProgressBarComponent',
    'UiSelectComponent',
    'UiSwitchComponent',
    'UiTableComponent',
    'UiTabsComponent',
    'UiTagComponent',
  ] as const;
  protected readonly rangeOptions: readonly UiSelectOption[] = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Quarter to date', value: 'qtd' },
  ];
  protected readonly dashboardTabs: readonly UiTabItem[] = [
    { label: 'Regions', value: 'regions' },
    { label: 'Accounts', value: 'accounts' },
    { label: 'Incidents', value: 'incidents' },
  ];
  protected readonly metrics: readonly {
    readonly label: string;
    readonly value: string;
    readonly progress: number | null;
    readonly tag: string;
    readonly tagVariant: 'default' | 'success' | 'warning' | 'danger';
  }[] = [
    { label: 'Revenue', value: '$84.2k', progress: 78, tag: '', tagVariant: 'default' },
    { label: 'Activation', value: '68%', progress: 68, tag: '', tagVariant: 'default' },
    { label: 'Incidents', value: '3', progress: null, tag: 'Needs review', tagVariant: 'warning' },
    { label: 'Queue', value: '24', progress: null, tag: 'Active', tagVariant: 'success' },
  ];
  protected readonly regionColumns: readonly UiTableColumn[] = [
    { key: 'region', header: 'Region', sortable: true },
    { key: 'revenue', header: 'Revenue', align: 'right' },
    { key: 'health', header: 'Health' },
    { key: 'owner', header: 'Owner' },
  ];
  protected readonly regionRows: readonly UiTableRow[] = [
    { region: 'North America', revenue: '$42.8k', health: 'Healthy', owner: 'Maya' },
    { region: 'Europe', revenue: '$28.4k', health: 'Review', owner: 'Noah' },
    { region: 'APAC', revenue: '$13.0k', health: 'Healthy', owner: 'Iris' },
  ];
  protected readonly activities: readonly {
    readonly label: string;
    readonly status: string;
    readonly variant: 'default' | 'success' | 'warning' | 'danger';
  }[] = [
    { label: 'Billing sync completed', status: 'Done', variant: 'success' },
    { label: 'EU deploy entered review', status: 'Review', variant: 'warning' },
    { label: 'New enterprise customer', status: 'Sales', variant: 'default' },
  ];
}
