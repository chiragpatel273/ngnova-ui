import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowDownTray,
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

@Component({
  selector: 'app-admin-dashboard-template',
  standalone: true,
  imports: [
    AdminRevenueChartComponent,
    NgIcon,
    NgTemplateOutlet,
    UiAvatarComponent,
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
      heroArrowDownTray,
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
            class="group flex min-h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-xs font-medium transition-colors"
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
                class="rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700"
              >
                {{ item.badge }}
              </span>
            }
          </button>
        }
      </nav>

      <div class="mt-auto border-t border-slate-200 pt-3 dark:border-slate-800">
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <ui-avatar label="Maya Chen" size="sm" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs font-semibold text-slate-900">Maya Chen</span>
            <span class="block truncate text-xs text-slate-500">Administrator</span>
          </span>
          <ng-icon name="heroChevronDown" class="size-3.5 text-slate-400" aria-hidden="true" />
        </button>
      </div>
    </ng-template>

    <div
      class="relative min-h-[42rem] bg-slate-50/70 text-slate-950 dark:bg-slate-950 dark:text-slate-50 xl:grid xl:grid-cols-[12.5rem_minmax(0,1fr)]"
      data-admin-template
    >
      <a
        href="#admin-main-content"
        class="absolute left-3 top-3 z-50 -translate-y-20 rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-lg ring-2 ring-blue-500 transition-transform focus-visible:translate-y-0 dark:bg-slate-900 dark:text-blue-300"
      >
        Skip to dashboard content
      </a>

      <aside
        class="hidden border-r border-slate-200/80 bg-white p-3 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white xl:flex xl:flex-col"
      >
        <div
          class="flex items-center gap-2.5 border-b border-slate-100 px-1 pb-3 dark:border-slate-800"
        >
          <span
            class="inline-flex size-7 items-center justify-center rounded-md bg-blue-600 text-white"
          >
            <ng-icon name="heroBolt" class="size-4.5" aria-hidden="true" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-xs font-bold tracking-wide">NORTHSTAR</span>
            <span class="block truncate text-xs text-slate-500">Operations cloud</span>
          </span>
        </div>

        <div class="mt-3.5">
          <ui-input ariaLabel="Search workspace" placeholder="Search..." size="sm">
            <ng-icon inputPrefix name="heroMagnifyingGlass" class="size-4" aria-hidden="true" />
          </ui-input>
        </div>

        <p class="mb-1.5 mt-4 px-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
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

      <main
        id="admin-main-content"
        class="min-w-0 bg-slate-50/70 dark:bg-slate-950"
        aria-labelledby="admin-title"
        tabindex="-1"
      >
        <header
          class="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950"
          data-admin-header
        >
          <div class="flex min-h-16 items-center gap-3 px-3 sm:px-4 lg:px-5">
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

            <div class="flex min-w-0 items-center gap-2.5 xl:hidden">
              <span
                class="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/20 sm:inline-flex"
              >
                <ng-icon name="heroBolt" class="size-4.5" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block truncate text-xs font-bold tracking-wide">NORTHSTAR</span>
                <span class="hidden truncate text-xs text-slate-500 sm:block"
                  >Operations cloud</span
                >
              </span>
            </div>

            <div class="hidden w-full max-w-lg md:block">
              <ui-input
                data-admin-header-search
                ariaLabel="Search customers, orders, and reports"
                placeholder="Search customers, orders, and reports..."
                size="sm"
              >
                <ng-icon
                  inputPrefix
                  name="heroMagnifyingGlass"
                  class="size-4 text-slate-400"
                  aria-hidden="true"
                />
              </ui-input>
            </div>

            <div class="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
              <div
                class="mr-1 hidden items-center gap-2 text-xs text-slate-500 lg:flex dark:text-slate-400"
              >
                <span class="size-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
                <span>Live</span>
                <span class="hidden 2xl:inline">· Friday, July 24</span>
              </div>

              <span class="hidden h-6 w-px bg-slate-200 lg:block dark:bg-slate-800"></span>

              <ui-button
                class="relative"
                data-admin-notifications
                iconOnly
                ariaLabel="View notifications, 3 unread"
                variant="ghost"
                size="sm"
              >
                <ng-icon uiButtonIconStart name="heroBell" />
                <span
                  class="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"
                  aria-hidden="true"
                ></span>
              </ui-button>

              <ui-menu
                [items]="profileMenuItems"
                [open]="profileMenuOpen()"
                align="end"
                ariaLabel="Account actions"
                (openChange)="profileMenuOpen.set($event)"
              >
                <button
                  uiMenuTrigger
                  type="button"
                  class="inline-flex min-h-10 items-center gap-2 rounded-lg px-1.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:px-2 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                  aria-label="Open account menu for Maya Chen"
                >
                  <ui-avatar label="Maya Chen" size="sm" />
                  <span class="hidden min-w-0 sm:block">
                    <span
                      class="block max-w-24 truncate text-xs font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Maya Chen
                    </span>
                    <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                      Administrator
                    </span>
                  </span>
                  <ng-icon
                    name="heroChevronDown"
                    class="size-3.5 text-slate-400"
                    aria-hidden="true"
                  />
                </button>
              </ui-menu>
            </div>
          </div>
        </header>

        <div class="space-y-4 p-3 sm:p-4 lg:p-5">
          <section
            class="flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between"
            data-admin-page-intro
          >
            <div class="min-w-0">
              <div class="mb-1.5 flex items-center gap-2 text-xs">
                <span class="font-medium text-slate-500 dark:text-slate-400">Workspace</span>
                <span class="text-slate-300 dark:text-slate-700">/</span>
                <span class="truncate font-medium text-slate-700 dark:text-slate-300">
                  Acme Corporation
                </span>
              </div>
              <h1
                id="admin-title"
                class="text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
              >
                Overview
              </h1>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Good morning, Maya. Here is what is happening across your workspace today.
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <button type="button" uiButton variant="outline" size="sm" class="bg-white">
                <ng-icon uiButtonIconStart name="heroArrowDownTray" />
                Export
              </button>
              <ui-button size="sm">
                <ng-icon uiButtonIconStart name="heroUserPlus" />
                Add customer
              </ui-button>
            </div>
          </section>

          <section
            class="grid items-center gap-3 rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-3 sm:grid-cols-[minmax(0,1fr)_13rem] dark:border-emerald-900 dark:bg-emerald-950/30"
            aria-label="Quarterly revenue target"
          >
            <div class="flex min-w-0 items-center gap-2.5">
              <ng-icon
                name="heroCheckCircle"
                class="size-5 shrink-0 text-emerald-700 dark:text-emerald-300"
                aria-hidden="true"
              />
              <div class="min-w-0">
                <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                  Your Q3 revenue target is 84% complete
                </h2>
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

          <section class="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Key metrics">
            @for (metric of metrics; track metric.label) {
              <ui-card class="min-w-0" padding="none" [ariaLabel]="metric.label + ' metric'">
                <article
                  data-admin-metric
                  class="min-w-0 p-3 sm:p-3.5"
                  [attr.aria-label]="metric.label + ' metric'"
                >
                  <div class="flex items-start justify-between gap-2 sm:gap-3">
                    <span [class]="metricIconClasses(metric.tone)">
                      <ng-icon [name]="metric.icon" class="size-4" aria-hidden="true" />
                    </span>
                    <ui-tag size="sm" [variant]="metric.positive ? 'success' : 'danger'">
                      {{ metric.change }}
                    </ui-tag>
                  </div>
                  <p class="mt-3 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                    {{ metric.label }}
                  </p>
                  <p
                    class="mt-1 text-xl font-bold leading-none tracking-tight text-slate-950 dark:text-white"
                  >
                    {{ metric.value }}
                  </p>
                  <p class="mt-2 line-clamp-2 text-xs leading-4 text-slate-500 dark:text-slate-400">
                    {{ metric.context }}
                  </p>
                </article>
              </ui-card>
            }
          </section>

          <section
            class="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.95fr)]"
          >
            <ui-card class="h-full min-w-0" padding="none" ariaLabel="Revenue overview">
              <div class="flex items-start justify-between gap-3 px-4 pt-4">
                <div>
                  <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                    Revenue overview
                  </h2>
                  <p class="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
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

              <div class="mt-3 px-4">
                <app-admin-revenue-chart />
              </div>

              <div
                class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800"
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

            <ui-card class="h-full min-w-0" padding="none" ariaLabel="Team capacity">
              <div class="flex items-center justify-between gap-3 px-4 py-3">
                <h2 class="text-sm font-semibold text-slate-950 dark:text-white">Team capacity</h2>
                <button
                  type="button"
                  class="-mr-2 inline-flex min-h-8 items-center rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-offset-slate-950"
                >
                  View team
                </button>
              </div>
              <div
                class="divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800"
              >
                @for (team of teamCapacity; track team.label) {
                  <div
                    class="grid grid-cols-[4.5rem_2rem_minmax(3rem,1fr)_3rem] items-center gap-2.5 px-4 py-3.5"
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
                    <span class="text-right text-xs text-slate-500">
                      {{ team.assigned }}
                    </span>
                  </div>
                }
              </div>
            </ui-card>

            <ui-card class="h-full min-w-0" padding="none" ariaLabel="Recent activity">
              <div class="flex items-center justify-between gap-3 px-4 py-3">
                <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                  Recent activity
                </h2>
                <button
                  type="button"
                  class="-mr-2 inline-flex min-h-8 items-center rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-offset-slate-950"
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
                      <p class="mt-0.5 truncate text-xs text-slate-500">
                        {{ activity.detail }}
                      </p>
                    </div>
                    <span class="shrink-0 text-xs text-slate-400">{{ activity.time }}</span>
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
                class="-mr-2 inline-flex min-h-8 items-center rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-offset-slate-950"
              >
                View all orders
              </button>
            </div>

            <div
              class="divide-y divide-slate-200 sm:hidden dark:divide-slate-800"
              data-admin-mobile-orders
            >
              @for (row of orderRows; track row['id']) {
                <article class="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {{ text(row['id']) }}
                      </h3>
                      <ui-tag size="sm" [variant]="orderStatusVariant(row['status'])">
                        {{ text(row['status']) }}
                      </ui-tag>
                    </div>
                    <p
                      class="mt-1.5 truncate text-sm font-medium text-slate-800 dark:text-slate-100"
                    >
                      {{ text(row['customer']) }}
                    </p>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {{ text(row['date']) }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end justify-between gap-3">
                    <button
                      type="button"
                      uiButton
                      variant="ghost"
                      size="sm"
                      [attr.aria-label]="'Order actions for ' + text(row['id'])"
                    >
                      <ng-icon name="heroEllipsisVertical" class="size-4" aria-hidden="true" />
                    </button>
                    <p
                      class="whitespace-nowrap text-sm font-semibold text-slate-950 dark:text-white"
                    >
                      {{ text(row['total']) }}
                    </p>
                  </div>
                </article>
              }
            </div>

            <ui-table
              class="hidden sm:block [&_table]:!text-xs [&_td]:!px-3 [&_td]:!py-2 [&_th]:!px-3 [&_th]:!py-2"
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
      </main>
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
