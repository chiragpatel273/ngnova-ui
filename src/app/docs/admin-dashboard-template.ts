import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowPath,
  heroArrowTrendingUp,
  heroBars3,
  heroBell,
  heroBolt,
  heroCalendarDays,
  heroChartBar,
  heroCheckCircle,
  heroChevronDown,
  heroClock,
  heroCog6Tooth,
  heroCreditCard,
  heroCube,
  heroEllipsisVertical,
  heroHome,
  heroLifebuoy,
  heroMagnifyingGlass,
  heroShoppingBag,
  heroUserPlus,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiBadgeComponent } from '@ngnova/ui/badge';
import {
  UiButtonComponent,
  UiButtonDirective,
  UiButtonIconStartDirective,
} from '@ngnova/ui/button';
import { UiCardComponent } from '@ngnova/ui/card';
import { UiDrawerComponent, UiDrawerHeaderDirective } from '@ngnova/ui/drawer';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiMenuComponent, UiMenuTriggerDirective } from '@ngnova/ui/menu';
import type { UiMenuItem } from '@ngnova/ui/menu';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiTableCellDirective, UiTableComponent } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow, UiTableRowKey } from '@ngnova/ui/table';
import { UiTagComponent } from '@ngnova/ui/tag';
import type { UiTagVariant } from '@ngnova/ui/tag';

import { AdminRevenueChartComponent } from './admin-revenue-chart';

interface AdminNavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly badge?: string;
}

interface AdminMetric {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly context: string;
  readonly icon: string;
  readonly tone: 'blue' | 'emerald' | 'violet' | 'amber';
  readonly positive: boolean;
}

interface TeamCapacity {
  readonly label: string;
  readonly value: number;
  readonly assigned: string;
}

interface AdminActivity {
  readonly icon: string;
  readonly title: string;
  readonly detail: string;
  readonly time: string;
  readonly tone: 'blue' | 'emerald' | 'violet' | 'amber';
}

export const ADMIN_DASHBOARD_TEMPLATE_SOURCE = `<main class="grid min-h-screen bg-white xl:grid-cols-[11.5rem_minmax(0,1fr)]">
  <aside class="hidden border-r border-slate-200 p-3 xl:flex xl:flex-col">
    <!-- Brand, search, workspace navigation, and signed-in user -->
  </aside>

  <section class="min-w-0">
    <header class="flex min-h-14 items-center border-b border-slate-200 px-4">
      <!-- Workspace status, date, notifications, and account menu -->
    </header>

    <div class="space-y-4 p-4">
      <section class="grid gap-4 rounded-md border border-emerald-200 bg-emerald-50/70 p-4">
        <!-- Quarterly revenue target and progress -->
      </section>

      <section class="grid gap-px border border-slate-200 bg-slate-200 xl:grid-cols-4">
        <!-- Revenue, customers, orders, and conversion -->
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.25fr_1fr_0.95fr]">
        <ui-card><!-- Revenue trend --></ui-card>
        <ui-card><!-- Team capacity --></ui-card>
        <ui-card><!-- Recent activity --></ui-card>
      </section>

      <ui-card padding="none">
        <!-- Recent orders table with row selection -->
      </ui-card>
    </div>
  </section>
</main>`;

@Component({
  selector: 'app-admin-dashboard-template',
  standalone: true,
  imports: [
    AdminRevenueChartComponent,
    NgIcon,
    NgTemplateOutlet,
    UiAvatarComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiButtonDirective,
    UiButtonIconStartDirective,
    UiCardComponent,
    UiDrawerComponent,
    UiDrawerHeaderDirective,
    UiInputComponent,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiProgressBarComponent,
    UiTableCellDirective,
    UiTableComponent,
    UiTagComponent,
  ],
  providers: [
    provideIcons({
      heroArrowPath,
      heroArrowTrendingUp,
      heroBars3,
      heroBell,
      heroBolt,
      heroCalendarDays,
      heroChartBar,
      heroCheckCircle,
      heroChevronDown,
      heroClock,
      heroCog6Tooth,
      heroCreditCard,
      heroCube,
      heroEllipsisVertical,
      heroHome,
      heroLifebuoy,
      heroMagnifyingGlass,
      heroShoppingBag,
      heroUserPlus,
      heroUsers,
    }),
  ],
  template: `
    <ng-template #adminNavigation>
      <nav class="grid gap-0.5" aria-label="Admin workspace">
        @for (item of navigationItems; track item.label) {
          <button
            type="button"
            class="group flex min-h-10 w-full items-center gap-2.5 rounded px-2.5 text-left text-sm font-medium transition-colors"
            [class.bg-blue-50]="activeNavigation() === item.label"
            [class.text-blue-700]="activeNavigation() === item.label"
            [class.shadow-[inset_2px_0_0_#2563eb]]="activeNavigation() === item.label"
            [class.text-slate-600]="activeNavigation() !== item.label"
            [class.hover:bg-slate-100]="activeNavigation() !== item.label"
            [class.hover:text-slate-950]="activeNavigation() !== item.label"
            (click)="selectNavigation(item.label)"
          >
            <ng-icon [name]="item.icon" class="size-4 shrink-0" aria-hidden="true" />
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            @if (item.badge) {
              <span
                class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-blue-700"
              >
                {{ item.badge }}
              </span>
            }
          </button>
        }
      </nav>

      <div class="mt-auto border-t border-slate-200 pt-3">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded p-2 text-left transition-colors hover:bg-slate-100"
        >
          <ui-avatar label="Maya Chen" size="sm" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs font-semibold text-slate-900">Maya Chen</span>
            <span class="block truncate text-[0.6875rem] text-slate-500">Administrator</span>
          </span>
          <ng-icon name="heroChevronDown" class="size-3.5 text-slate-400" aria-hidden="true" />
        </button>
      </div>
    </ng-template>

    <div
      class="relative min-h-[46rem] bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50 xl:grid xl:grid-cols-[11.5rem_minmax(0,1fr)]"
      data-admin-template
    >
      <aside
        class="hidden border-r border-slate-200 bg-white p-3 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white xl:flex xl:flex-col"
      >
        <div class="flex items-center gap-2.5 px-1.5">
          <span
            class="inline-flex size-8 items-center justify-center rounded-md bg-blue-600 text-white"
          >
            <ng-icon name="heroBolt" class="size-4.5" aria-hidden="true" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-xs font-bold tracking-wide">NORTHSTAR</span>
            <span class="block truncate text-[0.6875rem] text-slate-500">Operations cloud</span>
          </span>
        </div>

        <div class="mt-4">
          <ui-input ariaLabel="Search workspace" placeholder="Search..." size="sm">
            <ng-icon inputPrefix name="heroMagnifyingGlass" class="size-4" aria-hidden="true" />
          </ui-input>
        </div>

        <p
          class="mb-1.5 mt-4 px-2.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-slate-400"
        >
          Workspace
        </p>
        <ng-container [ngTemplateOutlet]="adminNavigation" />
      </aside>

      <ui-drawer
        class="contents xl:hidden"
        position="left"
        size="sm"
        [open]="mobileNavigationOpen()"
        ariaLabel="Admin navigation"
        closeAriaLabel="Close admin navigation"
        drawerId="admin-mobile-navigation"
        (openChange)="mobileNavigationOpen.set($event)"
      >
        <span uiDrawerHeader>Northstar workspace</span>
        <div class="-m-4 flex min-h-full flex-col bg-white p-4 text-slate-950">
          <ng-container [ngTemplateOutlet]="adminNavigation" />
        </div>
      </ui-drawer>

      <section class="min-w-0">
        <header
          class="flex min-h-14 items-center gap-3 border-b border-slate-200 bg-white px-3 sm:px-4 dark:border-slate-800 dark:bg-slate-950"
        >
          <button
            type="button"
            uiButton
            variant="ghost"
            size="sm"
            class="xl:hidden"
            aria-label="Open admin navigation"
            aria-controls="admin-mobile-navigation"
            [attr.aria-expanded]="mobileNavigationOpen()"
            (click)="mobileNavigationOpen.set(true)"
          >
            <ng-icon name="heroBars3" class="size-5" aria-hidden="true" />
          </button>

          <div class="flex min-w-0 items-center gap-2">
            <ui-badge variant="success" size="sm">Live workspace</ui-badge>
            <span class="hidden truncate text-xs text-slate-500 sm:inline dark:text-slate-400">
              Friday, July 24, 2026
            </span>
          </div>

          <div class="ml-auto flex items-center gap-1.5">
            <ui-button iconOnly ariaLabel="View notifications" variant="ghost" size="sm">
              <ng-icon uiButtonIconStart name="heroBell" />
            </ui-button>

            <ui-menu
              [items]="profileMenuItems"
              [open]="profileMenuOpen()"
              align="end"
              ariaLabel="Account actions"
              (openChange)="profileMenuOpen.set($event)"
            >
              <button uiButton uiMenuTrigger type="button" variant="ghost" size="sm" class="gap-2">
                <ui-avatar label="Maya Chen" size="sm" />
                <span class="hidden text-xs font-medium sm:inline">Maya</span>
                <ng-icon name="heroChevronDown" class="size-3.5" aria-hidden="true" />
              </button>
            </ui-menu>
          </div>
        </header>

        <div class="space-y-4 p-3 sm:p-4">
          <section
            class="grid items-center gap-4 rounded-md border border-emerald-200 bg-emerald-50/70 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_14rem] dark:border-emerald-900 dark:bg-emerald-950/30"
            aria-label="Quarterly revenue target"
          >
            <div class="flex min-w-0 items-center gap-3">
              <ng-icon
                name="heroCheckCircle"
                class="size-5 shrink-0 text-emerald-700 dark:text-emerald-300"
                aria-hidden="true"
              />
              <div class="min-w-0">
                <h1 class="text-sm font-semibold text-slate-950 dark:text-white">
                  Your Q3 revenue target is 84% complete
                </h1>
                <p class="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                  You are $38,400 away from the quarterly goal with 18 days remaining.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <ui-progress-bar
                class="min-w-0 flex-1"
                [value]="84"
                label="Quarterly revenue target"
                ariaValueText="84 percent complete"
              />
              <span class="w-7 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">
                84%
              </span>
            </div>
          </section>

          <section aria-label="Key metrics">
            <ui-card padding="none" ariaLabel="Key metrics">
              <div class="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-4 dark:bg-slate-800">
                @for (metric of metrics; track metric.label) {
                  <article
                    data-admin-metric
                    class="flex min-w-0 gap-2.5 bg-white p-3 dark:bg-slate-950"
                    [attr.aria-label]="metric.label + ' metric'"
                  >
                    <span [class]="metricIconClasses(metric.tone)">
                      <ng-icon [name]="metric.icon" class="size-4" aria-hidden="true" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                        {{ metric.label }}
                      </p>
                      <p
                        class="mt-1 text-[1.375rem] font-bold leading-none tracking-tight text-slate-950 dark:text-white"
                      >
                        {{ metric.value }}
                      </p>
                      <p class="mt-2 truncate text-[0.6875rem] text-slate-500 dark:text-slate-400">
                        {{ metric.context }}
                      </p>
                      <ui-tag
                        class="mt-1.5 inline-flex"
                        size="sm"
                        [variant]="metric.positive ? 'success' : 'danger'"
                      >
                        {{ metric.change }}
                      </ui-tag>
                    </div>
                  </article>
                }
              </div>
            </ui-card>
          </section>

          <section
            class="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.95fr)]"
          >
            <ui-card class="min-w-0" padding="none" ariaLabel="Revenue overview">
              <div class="flex items-start justify-between gap-3 px-4 pt-4">
                <div>
                  <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                    Revenue overview
                  </h2>
                  <p class="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    $253,400
                  </p>
                  <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span class="text-xs text-slate-500">Total revenue</span>
                    <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      +12.8%
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  uiButton
                  variant="outline"
                  size="sm"
                  class="gap-1.5 text-xs"
                  aria-label="Revenue date range, July 18 through July 24, 2026"
                >
                  Jul 18 – Jul 24
                  <ng-icon name="heroCalendarDays" class="size-3.5" aria-hidden="true" />
                </button>
              </div>

              <div class="mt-2 px-3">
                <app-admin-revenue-chart />
              </div>

              <div
                class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 px-4 py-2.5 text-[0.6875rem] text-slate-500 dark:border-slate-800"
              >
                <span class="inline-flex items-center gap-1.5">
                  <span class="size-2 rounded-full bg-blue-600"></span>
                  Revenue
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <span class="size-2 rounded-full bg-slate-300"></span>
                  Previous period
                </span>
              </div>
            </ui-card>

            <ui-card class="min-w-0" padding="none" ariaLabel="Team capacity">
              <div class="flex items-center justify-between gap-3 px-4 py-3.5">
                <h2 class="text-sm font-semibold text-slate-950 dark:text-white">Team capacity</h2>
                <button
                  type="button"
                  class="text-xs font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300"
                >
                  View team
                </button>
              </div>
              <div
                class="divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800"
              >
                @for (team of teamCapacity; track team.label) {
                  <div
                    class="grid grid-cols-[4.5rem_2rem_minmax(3rem,1fr)_3rem] items-center gap-2 px-4 py-2.5"
                  >
                    <span class="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                      {{ team.label }}
                    </span>
                    <span
                      class="text-right text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {{ team.value }}%
                    </span>
                    <ui-progress-bar
                      [value]="team.value"
                      [label]="team.label + ' capacity'"
                      [ariaValueText]="team.value + ' percent allocated'"
                    />
                    <span class="text-right text-[0.6875rem] text-slate-500">
                      {{ team.assigned }}
                    </span>
                  </div>
                }
              </div>
            </ui-card>

            <ui-card class="min-w-0" padding="none" ariaLabel="Recent activity">
              <div class="flex items-center justify-between gap-3 px-4 py-3.5">
                <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                  Recent activity
                </h2>
                <button
                  type="button"
                  class="text-xs font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300"
                >
                  View all
                </button>
              </div>
              <ol
                class="divide-y divide-slate-200 border-t border-slate-200 px-4 dark:divide-slate-800 dark:border-slate-800"
              >
                @for (activity of activities; track activity.title + activity.time) {
                  <li class="flex gap-2.5 py-2.5">
                    <span [class]="activityIconClasses(activity.tone)">
                      <ng-icon [name]="activity.icon" class="size-4" aria-hidden="true" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                        {{ activity.title }}
                      </p>
                      <p class="mt-0.5 truncate text-[0.6875rem] text-slate-500">
                        {{ activity.detail }}
                      </p>
                    </div>
                    <span class="shrink-0 text-[0.625rem] text-slate-400">{{ activity.time }}</span>
                  </li>
                }
              </ol>
            </ui-card>
          </section>

          <ui-card padding="none" ariaLabel="Recent orders">
            <div
              class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800"
            >
              <h2 class="text-sm font-semibold text-slate-950 dark:text-white">Recent orders</h2>
              <button
                type="button"
                class="text-xs font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300"
              >
                View all orders
              </button>
            </div>

            <ui-table
              class="block [&_table]:!text-xs [&_td]:!px-2.5 [&_td]:!py-2 [&_th]:!px-2.5 [&_th]:!py-2"
              caption="Recent customer orders"
              [columns]="orderColumns"
              [rows]="orderRows"
              rowKey="id"
              selectionMode="multiple"
              [selectedKeys]="selectedOrderKeys()"
              (selectedKeysChange)="selectedOrderKeys.set($event)"
            >
              <ng-template uiTableCell="id" let-value>
                <span class="whitespace-nowrap font-medium text-slate-700 dark:text-slate-200">{{
                  text(value)
                }}</span>
              </ng-template>

              <ng-template uiTableCell="customer" let-value>
                <span class="font-medium text-slate-800 dark:text-slate-100">
                  {{ text(value) }}
                </span>
              </ng-template>

              <ng-template uiTableCell="status" let-value>
                <ui-tag size="sm" [variant]="orderStatusVariant(value)">
                  {{ text(value) }}
                </ui-tag>
              </ng-template>

              <ng-template uiTableCell="total" let-value>
                <span class="font-semibold text-slate-900 dark:text-slate-100">
                  {{ text(value) }}
                </span>
              </ng-template>

              <ng-template uiTableCell="date" let-value>
                <span class="whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {{ text(value) }}
                </span>
              </ng-template>

              <ng-template uiTableCell="actions" let-row="row">
                <button
                  type="button"
                  uiButton
                  variant="ghost"
                  size="sm"
                  [attr.aria-label]="'Order actions for ' + text(row['id'])"
                >
                  <ng-icon name="heroEllipsisVertical" class="size-4" aria-hidden="true" />
                </button>
              </ng-template>
            </ui-table>
          </ui-card>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardTemplateComponent {
  protected readonly mobileNavigationOpen = signal(false);
  protected readonly profileMenuOpen = signal(false);
  protected readonly activeNavigation = signal('Overview');
  protected readonly selectedOrderKeys = signal<readonly UiTableRowKey[]>([]);

  protected readonly navigationItems: readonly AdminNavigationItem[] = [
    { label: 'Overview', icon: 'heroHome' },
    { label: 'Analytics', icon: 'heroChartBar' },
    { label: 'Customers', icon: 'heroUsers' },
    { label: 'Orders', icon: 'heroShoppingBag', badge: '12' },
    { label: 'Billing', icon: 'heroCreditCard' },
    { label: 'Products', icon: 'heroCube' },
    { label: 'Settings', icon: 'heroCog6Tooth' },
    { label: 'Support', icon: 'heroLifebuoy', badge: '3' },
  ];

  protected readonly profileMenuItems: readonly UiMenuItem[] = [
    { value: 'profile', label: 'View profile' },
    { value: 'workspace', label: 'Workspace settings' },
    { value: 'billing', label: 'Billing and plans' },
    { value: 'sign-out', label: 'Sign out', separatorBefore: true },
  ];

  protected readonly metrics: readonly AdminMetric[] = [
    {
      label: 'Net revenue',
      value: '$253.4k',
      change: '+12.8%',
      context: '$28.6k collected this week',
      icon: 'heroCreditCard',
      tone: 'blue',
      positive: true,
    },
    {
      label: 'Active customers',
      value: '12,842',
      change: '+8.2%',
      context: '946 joined this month',
      icon: 'heroUsers',
      tone: 'emerald',
      positive: true,
    },
    {
      label: 'Orders',
      value: '3,486',
      change: '+5.4%',
      context: '128 awaiting fulfillment',
      icon: 'heroShoppingBag',
      tone: 'violet',
      positive: true,
    },
    {
      label: 'Conversion',
      value: '4.82%',
      change: '-0.3%',
      context: '0.3 points below target',
      icon: 'heroArrowTrendingUp',
      tone: 'amber',
      positive: false,
    },
  ];

  protected readonly teamCapacity: readonly TeamCapacity[] = [
    { label: 'Fulfillment', value: 72, assigned: '23 / 32' },
    { label: 'Support', value: 58, assigned: '14 / 24' },
    { label: 'Finance', value: 61, assigned: '11 / 18' },
    { label: 'Engineering', value: 78, assigned: '36 / 46' },
  ];

  protected readonly activities: readonly AdminActivity[] = [
    {
      icon: 'heroUserPlus',
      title: 'New enterprise customer',
      detail: 'Acme Corp. signed annual plan',
      time: '10m ago',
      tone: 'emerald',
    },
    {
      icon: 'heroArrowTrendingUp',
      title: 'Revenue milestone',
      detail: 'Daily revenue exceeded $50k',
      time: '1h ago',
      tone: 'blue',
    },
    {
      icon: 'heroShoppingBag',
      title: 'High order volume',
      detail: '312 orders received today',
      time: '2h ago',
      tone: 'violet',
    },
    {
      icon: 'heroArrowPath',
      title: 'Conversion dip',
      detail: '0.3 points below target',
      time: '3h ago',
      tone: 'amber',
    },
  ];

  protected readonly orderColumns: readonly UiTableColumn[] = [
    { key: 'id', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'date', header: 'Date' },
    { key: 'status', header: 'Status' },
    { key: 'total', header: 'Total', align: 'right' },
    { key: 'items', header: 'Items', align: 'right' },
    { key: 'actions', header: '', align: 'right' },
  ];

  protected readonly orderRows: readonly UiTableRow[] = [
    {
      id: 'ORD-2026-0724-1287',
      customer: 'Acme Corp.',
      date: 'Jul 24, 2026 09:41',
      status: 'Processing',
      total: '$12,480.00',
      items: '8',
      actions: '',
    },
    {
      id: 'ORD-2026-0724-1286',
      customer: 'Northwind Traders',
      date: 'Jul 24, 2026 09:12',
      status: 'Shipped',
      total: '$6,320.00',
      items: '5',
      actions: '',
    },
    {
      id: 'ORD-2026-0724-1285',
      customer: 'Stark Industries',
      date: 'Jul 24, 2026 08:47',
      status: 'Processing',
      total: '$9,870.00',
      items: '6',
      actions: '',
    },
    {
      id: 'ORD-2026-0724-1284',
      customer: 'Wayne Enterprises',
      date: 'Jul 24, 2026 08:15',
      status: 'Pending',
      total: '$3,210.00',
      items: '3',
      actions: '',
    },
    {
      id: 'ORD-2026-0723-1279',
      customer: 'Globex Corporation',
      date: 'Jul 23, 2026 17:32',
      status: 'Delivered',
      total: '$15,760.00',
      items: '11',
      actions: '',
    },
  ];

  protected selectNavigation(label: string): void {
    this.activeNavigation.set(label);
    this.mobileNavigationOpen.set(false);
  }

  protected text(value: unknown): string {
    return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  }

  protected orderStatusVariant(value: unknown): UiTagVariant {
    switch (value) {
      case 'Shipped':
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  }

  protected metricIconClasses(tone: AdminMetric['tone']): string {
    const tones: Record<AdminMetric['tone'], string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      violet: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    };
    return `inline-flex size-8 shrink-0 items-center justify-center rounded-md ${tones[tone]}`;
  }

  protected activityIconClasses(tone: AdminActivity['tone']): string {
    const tones: Record<AdminActivity['tone'], string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      violet: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    };
    return `inline-flex size-8 shrink-0 items-center justify-center rounded-md ${tones[tone]}`;
  }
}
