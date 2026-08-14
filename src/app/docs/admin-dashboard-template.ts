import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  heroChevronLeft,
  heroChevronRight,
  heroClock,
  heroCog6Tooth,
  heroCreditCard,
  heroCube,
  heroEllipsisVertical,
  heroHome,
  heroLifebuoy,
  heroMagnifyingGlass,
  heroMoon,
  heroShoppingBag,
  heroSun,
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
import { UiToastComponent, UiToastService } from '@ngnova/ui/toast';
import { UiTooltipDirective } from '@ngnova/ui/tooltip';

import { AdminRevenueChartComponent } from './admin-revenue-chart';

interface AdminNavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly badge?: string;
  readonly description: string;
}

interface AdminCustomer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly plan: 'Enterprise' | 'Growth' | 'Starter';
  readonly status: 'Active' | 'Trial' | 'At risk';
  readonly joined: string;
}

interface AdminModuleInsight {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
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
    UiToastComponent,
    UiTooltipDirective,
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
      heroChevronLeft,
      heroChevronRight,
      heroClock,
      heroCog6Tooth,
      heroCreditCard,
      heroCube,
      heroEllipsisVertical,
      heroHome,
      heroLifebuoy,
      heroMagnifyingGlass,
      heroMoon,
      heroShoppingBag,
      heroSun,
      heroUserPlus,
      heroUsers,
    }),
  ],
  template: `
    <ng-template #adminNavigation let-compact="compact">
      <div class="flex min-h-0 flex-1 flex-col">
        <nav class="min-h-0 flex-1 overflow-y-auto py-0.5" aria-label="Admin workspace">
          <div class="grid gap-0.5">
            @for (item of navigationItems; track item.label) {
              <button
                type="button"
                class="group flex min-h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                [class.justify-center]="compact"
                [class.bg-blue-50]="activeNavigation() === item.label"
                [class.text-blue-700]="activeNavigation() === item.label"
                [class.dark:bg-blue-950]="activeNavigation() === item.label"
                [class.dark:text-blue-200]="activeNavigation() === item.label"
                [class.shadow-[inset_2px_0_0_#2563eb]]="activeNavigation() === item.label"
                [class.text-slate-600]="activeNavigation() !== item.label"
                [class.dark:text-slate-300]="activeNavigation() !== item.label"
                [class.hover:bg-slate-100]="activeNavigation() !== item.label"
                [class.hover:text-slate-950]="activeNavigation() !== item.label"
                [class.dark:hover:bg-slate-900]="activeNavigation() !== item.label"
                [class.dark:hover:text-white]="activeNavigation() !== item.label"
                [attr.aria-label]="compact ? item.label : null"
                [uiTooltip]="item.label"
                tooltipPosition="right"
                [tooltipDisabled]="!compact"
                (click)="selectNavigation(item.label)"
              >
                <ng-icon [name]="item.icon" class="size-4 shrink-0" aria-hidden="true" />
                @if (!compact) {
                  <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                }
                @if (item.badge && !compact) {
                  <span
                    class="rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700"
                  >
                    {{ item.badge }}
                  </span>
                }
              </button>
            }
          </div>
        </nav>

        <div class="shrink-0 border-t border-slate-200 pt-3 dark:border-slate-800">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-md p-2 text-left outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            [class.justify-center]="compact"
            [attr.aria-label]="compact ? 'Account settings for Maya Chen' : null"
            uiTooltip="Account settings"
            tooltipPosition="right"
            [tooltipDisabled]="!compact"
          >
            <ui-avatar label="Maya Chen" size="sm" />
            @if (!compact) {
              <span class="min-w-0 flex-1">
                <span class="block truncate text-xs font-semibold text-slate-900">Maya Chen</span>
                <span class="block truncate text-xs text-slate-500 dark:text-slate-400"
                  >Administrator</span
                >
              </span>
              <ng-icon name="heroChevronDown" class="size-3.5 text-slate-400" aria-hidden="true" />
            }
          </button>
        </div>
      </div>
    </ng-template>

    <ng-template #customerWorkspace>
      <ui-card padding="none" ariaLabel="Customer management">
        <div
          class="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[minmax(15rem,1fr)_11rem_auto] md:items-center"
        >
          <ui-input
            ariaLabel="Search customers"
            placeholder="Search name, company, or email..."
            size="sm"
            clearable
            (valueChange)="customerSearch.set($event)"
          >
            <ng-icon inputPrefix name="heroMagnifyingGlass" class="size-4" aria-hidden="true" />
          </ui-input>
          <label>
            <span class="sr-only">Filter customers by status</span>
            <select
              class="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              [value]="customerStatusFilter()"
              (change)="updateCustomerStatusFilter($event)"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="At risk">At risk</option>
            </select>
          </label>
          <p class="text-xs font-medium text-slate-500 md:text-right dark:text-slate-400">
            {{ filteredCustomers().length }} customers
          </p>
        </div>

        @if (filteredCustomers().length > 0) {
          <div class="divide-y divide-slate-200 md:hidden dark:divide-slate-800">
            @for (customer of filteredCustomers(); track customer.id) {
              <button
                type="button"
                class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-slate-900"
                (click)="openCustomerEditor(customer)"
              >
                <ui-avatar [label]="customer.name" size="sm" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {{ customer.name }}
                  </span>
                  <span class="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                    {{ customer.company }} · {{ customer.plan }}
                  </span>
                </span>
                <ui-tag size="sm" [variant]="customerStatusVariant(customer.status)">
                  {{ customer.status }}
                </ui-tag>
              </button>
            }
          </div>

          <div class="hidden overflow-x-auto md:block">
            <table class="w-full border-collapse text-left text-xs">
              <caption class="sr-only">
                Customers matching the current filters
              </caption>
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Customer</th>
                  <th class="px-4 py-3 font-semibold">Company</th>
                  <th class="px-4 py-3 font-semibold">Plan</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold">Joined</th>
                  <th class="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                @for (customer of filteredCustomers(); track customer.id) {
                  <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2.5">
                        <ui-avatar [label]="customer.name" size="sm" />
                        <div class="min-w-0">
                          <p class="font-semibold text-slate-900 dark:text-slate-100">
                            {{ customer.name }}
                          </p>
                          <p class="mt-0.5 text-slate-500 dark:text-slate-400">
                            {{ customer.email }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {{ customer.company }}
                    </td>
                    <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {{ customer.plan }}
                    </td>
                    <td class="px-4 py-3">
                      <ui-tag size="sm" [variant]="customerStatusVariant(customer.status)">
                        {{ customer.status }}
                      </ui-tag>
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400">
                      {{ customer.joined }}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button
                        type="button"
                        uiButton
                        variant="ghost"
                        size="sm"
                        (click)="openCustomerEditor(customer)"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="px-4 py-12 text-center">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">No customers found</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try a different search or status filter.
            </p>
          </div>
        }
      </ui-card>
    </ng-template>

    <ng-template #ordersWorkspace>
      <ui-card padding="none" ariaLabel="Order management">
        <div
          class="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[minmax(15rem,1fr)_11rem_auto] md:items-center"
        >
          <ui-input
            ariaLabel="Search orders"
            placeholder="Search order or customer..."
            size="sm"
            clearable
            (valueChange)="orderSearch.set($event)"
          >
            <ng-icon inputPrefix name="heroMagnifyingGlass" class="size-4" aria-hidden="true" />
          </ui-input>
          <label>
            <span class="sr-only">Filter orders by status</span>
            <select
              class="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              [value]="orderStatusFilter()"
              (change)="updateOrderStatusFilter($event)"
            >
              <option value="All">All statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>
          <p class="text-xs font-medium text-slate-500 md:text-right dark:text-slate-400">
            {{ filteredOrderRows().length }} orders
          </p>
        </div>

        @if (selectedOrderKeys().length > 0) {
          <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-900 dark:bg-blue-950/40"
          >
            <p class="text-xs font-semibold text-blue-800 dark:text-blue-200">
              {{ selectedOrderKeys().length }} selected
            </p>
            <div class="flex gap-2">
              <button
                type="button"
                uiButton
                variant="outline"
                size="sm"
                (click)="markOrdersShipped()"
              >
                Mark shipped
              </button>
              <button
                type="button"
                uiButton
                variant="ghost"
                size="sm"
                (click)="selectedOrderKeys.set([])"
              >
                Clear
              </button>
            </div>
          </div>
        }

        <div class="divide-y divide-slate-200 sm:hidden dark:divide-slate-800">
          @for (row of filteredOrderRows(); track row['id']) {
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
                <p class="mt-1.5 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {{ text(row['customer']) }}
                </p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {{ text(row['date']) }}
                </p>
              </div>
              <p class="whitespace-nowrap text-sm font-semibold text-slate-950 dark:text-white">
                {{ text(row['total']) }}
              </p>
            </article>
          }
        </div>

        <ui-table
          class="hidden sm:block [&_table]:!text-xs [&_td]:!px-3 [&_td]:!py-2.5 [&_th]:!px-3 [&_th]:!py-2.5"
          caption="Filtered customer orders"
          [columns]="orderColumns"
          [rows]="filteredOrderRows()"
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
            <span class="font-medium text-slate-800 dark:text-slate-100">{{ text(value) }}</span>
          </ng-template>
          <ng-template uiTableCell="status" let-value>
            <ui-tag size="sm" [variant]="orderStatusVariant(value)">{{ text(value) }}</ui-tag>
          </ng-template>
          <ng-template uiTableCell="total" let-value>
            <span class="font-semibold text-slate-900 dark:text-slate-100">{{ text(value) }}</span>
          </ng-template>
          <ng-template uiTableCell="date" let-value>
            <span class="whitespace-nowrap text-slate-600 dark:text-slate-300">{{
              text(value)
            }}</span>
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
    </ng-template>

    <ng-template #moduleWorkspace>
      <section
        class="grid gap-3 md:grid-cols-3"
        [attr.aria-label]="activeNavigation() + ' summary'"
      >
        @for (insight of activeModuleInsights(); track insight.label) {
          <ui-card padding="md" [ariaLabel]="insight.label">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
              {{ insight.label }}
            </p>
            <p class="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {{ insight.value }}
            </p>
            <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {{ insight.detail }}
            </p>
          </ui-card>
        }
      </section>
      <ui-card class="mt-4" padding="md" [ariaLabel]="activeNavigation() + ' activity'">
        <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
          Recent {{ activeNavigation().toLowerCase() }} activity
        </h2>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          This workspace is ready for product-specific data. The template keeps navigation,
          responsive layout, theming, and interaction patterns consistent while your application
          supplies its own API.
        </p>
      </ui-card>
    </ng-template>

    <div
      class="relative h-screen min-h-screen h-dvh min-h-dvh overflow-hidden bg-slate-50/70 text-slate-950 dark:bg-slate-950 dark:text-slate-50 motion-reduce:transition-none xl:grid xl:grid-rows-[minmax(0,1fr)] xl:transition-[grid-template-columns] xl:duration-200"
      [class.dark]="darkMode()"
      [style.grid-template-columns]="
        sidebarCollapsed() ? '4rem minmax(0, 1fr)' : '14.5rem minmax(0, 1fr)'
      "
      data-admin-template
    >
      <a
        href="#admin-main-content"
        class="absolute left-3 top-3 z-50 -translate-y-20 rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-lg ring-2 ring-blue-500 transition-transform focus-visible:translate-y-0 dark:bg-slate-900 dark:text-blue-300"
      >
        Skip to dashboard content
      </a>

      <aside
        class="hidden h-full min-h-0 overflow-hidden border-r border-slate-200/80 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white xl:flex xl:flex-col"
        [class.p-2]="sidebarCollapsed()"
        [class.p-3]="!sidebarCollapsed()"
        data-admin-desktop-navigation
      >
        <div
          class="flex items-center border-b border-slate-100 pb-3 dark:border-slate-800"
          [class.justify-center]="sidebarCollapsed()"
          [class.gap-2.5]="!sidebarCollapsed()"
          [class.px-1]="!sidebarCollapsed()"
        >
          @if (!sidebarCollapsed()) {
            <span
              class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/20"
              data-admin-brand-mark
            >
              <ng-icon name="heroBolt" class="size-4.5" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-xs font-bold tracking-wide">NORTHSTAR</span>
              <span class="block truncate text-xs text-slate-500 dark:text-slate-400"
                >Operations cloud</span
              >
            </span>
          }
          <button
            type="button"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-800 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            [attr.aria-label]="
              sidebarCollapsed() ? 'Expand admin sidebar' : 'Collapse admin sidebar'
            "
            [attr.aria-pressed]="sidebarCollapsed()"
            (click)="toggleSidebar()"
          >
            <ng-icon
              [name]="sidebarCollapsed() ? 'heroChevronRight' : 'heroChevronLeft'"
              class="size-4"
              aria-hidden="true"
            />
          </button>
        </div>

        <div class="mt-3.5" [class.hidden]="sidebarCollapsed()">
          <ui-input ariaLabel="Search workspace" placeholder="Search..." size="sm">
            <ng-icon inputPrefix name="heroMagnifyingGlass" class="size-4" aria-hidden="true" />
          </ui-input>
        </div>

        <p
          class="mb-1.5 mt-4 px-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"
          [class.sr-only]="sidebarCollapsed()"
        >
          Workspace
        </p>
        <ng-container
          [ngTemplateOutlet]="adminNavigation"
          [ngTemplateOutletContext]="{ compact: sidebarCollapsed() }"
        />
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
        <div
          class="-m-4 flex min-h-full flex-col bg-white p-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
        >
          <ng-container
            [ngTemplateOutlet]="adminNavigation"
            [ngTemplateOutletContext]="{ compact: false }"
          />
        </div>
      </ui-drawer>

      <main
        id="admin-main-content"
        class="h-full min-h-0 min-w-0 overflow-y-auto bg-slate-50/70 dark:bg-slate-950"
        aria-labelledby="admin-title"
        tabindex="-1"
      >
        <header
          class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
          data-admin-header
        >
          <div
            class="mx-auto flex min-h-14 w-full max-w-[100rem] items-center gap-2.5 px-3 sm:px-4 lg:px-5"
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

            <div class="flex min-w-0 items-center gap-2.5 xl:hidden">
              <span
                class="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/20 sm:inline-flex"
              >
                <ng-icon name="heroBolt" class="size-4.5" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block truncate text-xs font-bold tracking-wide">NORTHSTAR</span>
                <span class="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400"
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
                (valueChange)="handleGlobalSearch($event)"
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
                iconOnly
                variant="ghost"
                size="sm"
                [ariaLabel]="darkMode() ? 'Use light dashboard theme' : 'Use dark dashboard theme'"
                [title]="darkMode() ? 'Use light theme' : 'Use dark theme'"
                [attr.aria-pressed]="darkMode()"
                (click)="toggleDarkMode()"
              >
                <ng-icon uiButtonIconStart [name]="darkMode() ? 'heroSun' : 'heroMoon'" />
              </ui-button>

              <ui-button
                class="relative"
                data-admin-notifications
                iconOnly
                ariaLabel="View notifications, 3 unread"
                variant="ghost"
                size="sm"
                (click)="showAction('Notifications', 'You have three unread operational updates.')"
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

        <div class="mx-auto w-full max-w-[100rem] space-y-4 p-3 sm:p-4 lg:p-5">
          <section
            class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            data-admin-page-intro
          >
            <div class="min-w-0">
              <div class="mb-1.5 flex items-center gap-2 text-xs">
                <span class="font-medium text-slate-500 dark:text-slate-400">Workspace</span>
                <span class="text-slate-300 dark:text-slate-700">/</span>
                <span class="truncate font-medium text-slate-700 dark:text-slate-300">
                  {{ activeNavigation() }}
                </span>
              </div>
              <h1
                id="admin-title"
                class="text-xl font-bold tracking-tight text-slate-950 dark:text-white"
              >
                {{ activeNavigation() }}
              </h1>
              <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {{ activePageDescription() }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              @if (activeNavigation() === 'Overview' || activeNavigation() === 'Orders') {
                <button
                  type="button"
                  uiButton
                  variant="outline"
                  size="sm"
                  class="bg-white dark:bg-slate-950"
                  (click)="exportOrders()"
                >
                  <ng-icon uiButtonIconStart name="heroArrowDownTray" />
                  Export
                </button>
              }
              @if (activeNavigation() === 'Overview' || activeNavigation() === 'Customers') {
                <ui-button size="sm" (click)="openCustomerEditor()">
                  <ng-icon uiButtonIconStart name="heroUserPlus" />
                  Add customer
                </ui-button>
              }
            </div>
          </section>

          @if (activeNavigation() === 'Customers') {
            <ng-container [ngTemplateOutlet]="customerWorkspace" />
          } @else if (activeNavigation() === 'Orders') {
            <ng-container [ngTemplateOutlet]="ordersWorkspace" />
          } @else if (activeNavigation() !== 'Overview') {
            <ng-container [ngTemplateOutlet]="moduleWorkspace" />
          }

          @if (activeNavigation() === 'Overview') {
            <section
              class="grid items-center gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm sm:grid-cols-[minmax(0,1fr)_14rem] dark:border-slate-800 dark:bg-slate-900"
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
                <span
                  class="w-7 text-right text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  84%
                </span>
              </div>
            </section>

            <section class="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Key metrics">
              @for (metric of metrics; track metric.label) {
                <ui-card class="min-w-0" padding="none" [ariaLabel]="metric.label + ' metric'">
                  <article
                    data-admin-metric
                    class="min-w-0 p-3.5"
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
                    <p
                      class="mt-2 line-clamp-2 text-xs leading-4 text-slate-500 dark:text-slate-400"
                    >
                      {{ metric.context }}
                    </p>
                  </article>
                </ui-card>
              }
            </section>

            <section
              class="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(19rem,0.8fr)]"
              aria-label="Performance and operations"
            >
              <ui-card class="h-full min-w-0" padding="none" ariaLabel="Revenue overview">
                <div
                  class="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800"
                >
                  <div>
                    <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                      Revenue overview
                    </h2>
                    <div class="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                      <p class="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                        $253,400
                      </p>
                      <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        +12.8% vs. previous period
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
                    (click)="
                      showAction(
                        'Reporting period',
                        'Showing revenue from July 18 through July 24.'
                      )
                    "
                  >
                    Jul 18 – Jul 24
                    <ng-icon name="heroCalendarDays" class="size-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div class="px-4 pb-2 pt-3">
                  <app-admin-revenue-chart [darkMode]="darkMode()" />
                </div>

                <div
                  class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
                >
                  <span class="inline-flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-blue-600"></span>
                    Current period
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-slate-300"></span>
                    Previous period
                  </span>
                </div>
              </ui-card>

              <ui-card class="h-full min-w-0" padding="none" ariaLabel="Operations pulse">
                <div class="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                      Operations pulse
                    </h2>
                    <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Team capacity</p>
                  </div>
                  <ui-tag size="sm" variant="success">Healthy</ui-tag>
                </div>
                <div
                  class="divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800"
                >
                  @for (team of teamCapacity; track team.label) {
                    <div
                      class="grid grid-cols-[4.5rem_2rem_minmax(3rem,1fr)_3rem] items-center gap-2.5 px-4 py-2.5"
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
                      <span class="text-right text-xs text-slate-500 dark:text-slate-400">
                        {{ team.assigned }}
                      </span>
                    </div>
                  }
                </div>
              </ui-card>

              <ui-card
                class="h-full min-w-0 xl:col-span-2"
                padding="none"
                ariaLabel="Recent activity"
              >
                <div class="flex items-center justify-between gap-3 px-4 py-3">
                  <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                    Recent activity
                  </h2>
                  <button
                    type="button"
                    class="-mr-2 inline-flex min-h-8 items-center rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-offset-slate-950"
                    (click)="
                      showAction('Activity feed', 'You are viewing the latest workspace events.')
                    "
                  >
                    View all
                  </button>
                </div>
                <ol
                  class="grid border-t border-slate-200 px-4 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x dark:border-slate-800 dark:divide-slate-800"
                >
                  @for (activity of activities; track activity.title + activity.time) {
                    <li class="flex min-w-0 gap-2.5 py-2.5 sm:px-3 sm:first:pl-0 xl:last:pr-0">
                      <span [class]="activityIconClasses(activity.tone)">
                        <ng-icon [name]="activity.icon" class="size-4" aria-hidden="true" />
                      </span>
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                          {{ activity.title }}
                        </p>
                        <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
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
                <div>
                  <h2 class="text-sm font-semibold text-slate-950 dark:text-white">
                    Recent orders
                  </h2>
                  <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Latest transactions requiring operational visibility
                  </p>
                </div>
                <button
                  type="button"
                  class="-mr-2 inline-flex min-h-8 items-center rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-offset-slate-950"
                  (click)="selectNavigation('Orders')"
                >
                  View all orders
                </button>
              </div>

              <div
                class="divide-y divide-slate-200 sm:hidden dark:divide-slate-800"
                data-admin-mobile-orders
              >
                @for (row of orderRows(); track row['id']) {
                  <article class="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3
                          class="truncate text-xs font-semibold text-slate-900 dark:text-slate-100"
                        >
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
                        (click)="showOrderActions(row)"
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
                [rows]="orderRows()"
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
                    (click)="showOrderActions(row)"
                  >
                    <ng-icon name="heroEllipsisVertical" class="size-4" aria-hidden="true" />
                  </button>
                </ng-template>
              </ui-table>
            </ui-card>
          }
        </div>
      </main>

      <ui-drawer
        position="right"
        size="md"
        [open]="customerDrawerOpen()"
        [ariaLabel]="selectedCustomer() ? 'Edit customer' : 'Add customer'"
        closeAriaLabel="Close customer editor"
        drawerId="admin-customer-editor"
        (openChange)="customerDrawerOpen.set($event)"
      >
        <span uiDrawerHeader>{{ selectedCustomer() ? 'Customer details' : 'Add customer' }}</span>
        <form class="grid gap-5" (submit)="saveCustomer($event)">
          <div>
            <p class="text-sm font-semibold text-slate-950 dark:text-white">
              {{ selectedCustomer() ? 'Update customer record' : 'Create a customer record' }}
            </p>
            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              This local workflow demonstrates a production form without requiring a backend.
            </p>
          </div>

          <label class="grid gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
            Full name
            <input
              name="customerName"
              required
              autocomplete="name"
              class="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              [value]="customerFormName()"
              (input)="customerFormName.set(inputValue($event))"
            />
          </label>
          <label class="grid gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
            Work email
            <input
              name="customerEmail"
              type="email"
              required
              autocomplete="email"
              class="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              [value]="customerFormEmail()"
              (input)="customerFormEmail.set(inputValue($event))"
            />
          </label>
          <label class="grid gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
            Company
            <input
              name="customerCompany"
              required
              autocomplete="organization"
              class="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              [value]="customerFormCompany()"
              (input)="customerFormCompany.set(inputValue($event))"
            />
          </label>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
              Plan
              <select
                name="customerPlan"
                class="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
                [value]="customerFormPlan()"
                (change)="updateCustomerFormPlan($event)"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Growth">Growth</option>
                <option value="Starter">Starter</option>
              </select>
            </label>
            <label class="grid gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
              Status
              <select
                name="customerStatus"
                class="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
                [value]="customerFormStatus()"
                (change)="updateCustomerFormStatus($event)"
              >
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="At risk">At risk</option>
              </select>
            </label>
          </div>

          <div
            class="mt-2 flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800"
          >
            <button
              type="button"
              uiButton
              variant="outline"
              (click)="customerDrawerOpen.set(false)"
            >
              Cancel
            </button>
            <ui-button type="submit">Save customer</ui-button>
          </div>
        </form>
      </ui-drawer>

      <ui-toast position="bottom-right" viewportOffset="1rem" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardTemplateComponent {
  private readonly document = inject(DOCUMENT);
  private readonly toastService = inject(UiToastService);

  protected readonly mobileNavigationOpen = signal(false);
  protected readonly profileMenuOpen = signal(false);
  protected readonly activeNavigation = signal('Overview');
  protected readonly sidebarCollapsed = signal(this.readPreference('ngnova-admin-sidebar') === '1');
  protected readonly darkMode = signal(this.readPreference('ngnova-admin-theme') === 'dark');
  protected readonly selectedOrderKeys = signal<readonly UiTableRowKey[]>([]);
  protected readonly customerDrawerOpen = signal(false);
  protected readonly selectedCustomer = signal<AdminCustomer | null>(null);
  protected readonly customerSearch = signal('');
  protected readonly customerStatusFilter = signal<AdminCustomer['status'] | 'All'>('All');
  protected readonly orderSearch = signal('');
  protected readonly orderStatusFilter = signal<
    'All' | 'Processing' | 'Shipped' | 'Pending' | 'Delivered'
  >('All');
  protected readonly customerFormName = signal('');
  protected readonly customerFormEmail = signal('');
  protected readonly customerFormCompany = signal('');
  protected readonly customerFormPlan = signal<AdminCustomer['plan']>('Growth');
  protected readonly customerFormStatus = signal<AdminCustomer['status']>('Active');

  protected readonly navigationItems: readonly AdminNavigationItem[] = [
    {
      label: 'Overview',
      icon: 'heroHome',
      description: 'Good morning, Maya. Here is what is happening across your workspace today.',
    },
    {
      label: 'Analytics',
      icon: 'heroChartBar',
      description: 'Review product performance, acquisition, and revenue trends.',
    },
    {
      label: 'Customers',
      icon: 'heroUsers',
      description: 'Search, filter, create, and update customer accounts.',
    },
    {
      label: 'Orders',
      icon: 'heroShoppingBag',
      badge: '12',
      description: 'Track fulfillment, review order status, and run bulk actions.',
    },
    {
      label: 'Billing',
      icon: 'heroCreditCard',
      description: 'Monitor subscriptions, invoices, and account balances.',
    },
    {
      label: 'Products',
      icon: 'heroCube',
      description: 'Manage catalog availability, inventory, and pricing.',
    },
    {
      label: 'Settings',
      icon: 'heroCog6Tooth',
      description: 'Configure workspace preferences, access, and integrations.',
    },
    {
      label: 'Support',
      icon: 'heroLifebuoy',
      badge: '3',
      description: 'Review open conversations and customer service performance.',
    },
  ];

  protected readonly activePageDescription = computed(
    () =>
      this.navigationItems.find((item) => item.label === this.activeNavigation())?.description ??
      '',
  );

  protected readonly profileMenuItems: readonly UiMenuItem[] = [
    { value: 'profile', label: 'View profile' },
    { value: 'workspace', label: 'Workspace settings' },
    { value: 'billing', label: 'Billing and plans' },
    { value: 'sign-out', label: 'Sign out', separatorBefore: true },
  ];

  protected readonly customers = signal<readonly AdminCustomer[]>([
    {
      id: 'CUS-1042',
      name: 'Olivia Martin',
      email: 'olivia@acme.co',
      company: 'Acme Corporation',
      plan: 'Enterprise',
      status: 'Active',
      joined: 'Jul 18, 2026',
    },
    {
      id: 'CUS-1041',
      name: 'Jackson Lee',
      email: 'jackson@northwind.io',
      company: 'Northwind Traders',
      plan: 'Growth',
      status: 'Active',
      joined: 'Jul 16, 2026',
    },
    {
      id: 'CUS-1038',
      name: 'Sophia Patel',
      email: 'sophia@stark.example',
      company: 'Stark Industries',
      plan: 'Enterprise',
      status: 'At risk',
      joined: 'Jul 10, 2026',
    },
    {
      id: 'CUS-1035',
      name: 'Ethan Williams',
      email: 'ethan@wayne.example',
      company: 'Wayne Enterprises',
      plan: 'Growth',
      status: 'Trial',
      joined: 'Jul 5, 2026',
    },
    {
      id: 'CUS-1029',
      name: 'Ava Thompson',
      email: 'ava@globex.example',
      company: 'Globex Corporation',
      plan: 'Starter',
      status: 'Active',
      joined: 'Jun 28, 2026',
    },
  ]);

  protected readonly filteredCustomers = computed(() => {
    const query = this.customerSearch().trim().toLowerCase();
    const status = this.customerStatusFilter();
    return this.customers().filter(
      (customer) =>
        (status === 'All' || customer.status === status) &&
        (!query ||
          [customer.name, customer.email, customer.company, customer.plan].some((value) =>
            value.toLowerCase().includes(query),
          )),
    );
  });

  protected readonly activeModuleInsights = computed<readonly AdminModuleInsight[]>(() => {
    const insights: Record<string, readonly AdminModuleInsight[]> = {
      Analytics: [
        { label: 'Sessions', value: '86.4k', detail: '12.4% more than the previous period.' },
        {
          label: 'Qualified leads',
          value: '4,218',
          detail: '68% originated from organic channels.',
        },
        { label: 'Activation', value: '72.6%', detail: '3.1 points above the quarterly target.' },
      ],
      Billing: [
        {
          label: 'Monthly recurring revenue',
          value: '$186.2k',
          detail: 'Up 9.4% month over month.',
        },
        { label: 'Open invoices', value: '24', detail: '$18,740 is currently outstanding.' },
        {
          label: 'Renewals this month',
          value: '138',
          detail: '92% are expected to renew automatically.',
        },
      ],
      Products: [
        { label: 'Active products', value: '148', detail: '12 products were updated this week.' },
        {
          label: 'Low inventory',
          value: '7',
          detail: 'Items require replenishment within five days.',
        },
        {
          label: 'Catalog conversion',
          value: '6.8%',
          detail: '0.7 points higher than last month.',
        },
      ],
      Settings: [
        {
          label: 'Team members',
          value: '46',
          detail: 'Four invitations are waiting for acceptance.',
        },
        {
          label: 'Integrations',
          value: '9',
          detail: 'All connected services are operating normally.',
        },
        { label: 'Security score', value: '94%', detail: 'Two optional recommendations remain.' },
      ],
      Support: [
        { label: 'Open conversations', value: '18', detail: 'Three require a first response.' },
        {
          label: 'Median response',
          value: '8m',
          detail: 'Two minutes faster than the team target.',
        },
        { label: 'Satisfaction', value: '96%', detail: 'Based on 428 responses this month.' },
      ],
    };
    return insights[this.activeNavigation()] ?? [];
  });

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

  protected readonly orderRows = signal<readonly UiTableRow[]>([
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
  ]);

  protected readonly filteredOrderRows = computed(() => {
    const query = this.orderSearch().trim().toLowerCase();
    const status = this.orderStatusFilter();
    return this.orderRows().filter(
      (row) =>
        (status === 'All' || this.text(row['status']) === status) &&
        (!query ||
          [row['id'], row['customer'], row['status']].some((value) =>
            this.text(value).toLowerCase().includes(query),
          )),
    );
  });

  protected selectNavigation(label: string): void {
    this.activeNavigation.set(label);
    this.mobileNavigationOpen.set(false);
  }

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => {
      const next = !collapsed;
      this.writePreference('ngnova-admin-sidebar', next ? '1' : '0');
      return next;
    });
  }

  protected toggleDarkMode(): void {
    this.darkMode.update((enabled) => {
      const next = !enabled;
      this.writePreference('ngnova-admin-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  protected handleGlobalSearch(value: string): void {
    const query = value.trim();
    if (!query) {
      return;
    }
    this.customerSearch.set(query);
    this.activeNavigation.set('Customers');
  }

  protected updateCustomerStatusFilter(event: Event): void {
    const value = this.inputValue(event);
    if (value === 'All' || value === 'Active' || value === 'Trial' || value === 'At risk') {
      this.customerStatusFilter.set(value);
    }
  }

  protected updateOrderStatusFilter(event: Event): void {
    const value = this.inputValue(event);
    if (
      value === 'All' ||
      value === 'Processing' ||
      value === 'Shipped' ||
      value === 'Pending' ||
      value === 'Delivered'
    ) {
      this.orderStatusFilter.set(value);
    }
  }

  protected openCustomerEditor(customer: AdminCustomer | null = null): void {
    this.selectedCustomer.set(customer);
    this.customerFormName.set(customer?.name ?? '');
    this.customerFormEmail.set(customer?.email ?? '');
    this.customerFormCompany.set(customer?.company ?? '');
    this.customerFormPlan.set(customer?.plan ?? 'Growth');
    this.customerFormStatus.set(customer?.status ?? 'Active');
    this.customerDrawerOpen.set(true);
  }

  protected updateCustomerFormPlan(event: Event): void {
    const value = this.inputValue(event);
    if (value === 'Enterprise' || value === 'Growth' || value === 'Starter') {
      this.customerFormPlan.set(value);
    }
  }

  protected updateCustomerFormStatus(event: Event): void {
    const value = this.inputValue(event);
    if (value === 'Active' || value === 'Trial' || value === 'At risk') {
      this.customerFormStatus.set(value);
    }
  }

  protected saveCustomer(event: Event): void {
    event.preventDefault();
    const name = this.customerFormName().trim();
    const email = this.customerFormEmail().trim();
    const company = this.customerFormCompany().trim();
    if (!name || !email || !company) {
      return;
    }

    const selected = this.selectedCustomer();
    const customer: AdminCustomer = {
      id: selected?.id ?? `CUS-${1043 + this.customers().length}`,
      name,
      email,
      company,
      plan: this.customerFormPlan(),
      status: this.customerFormStatus(),
      joined: selected?.joined ?? 'Aug 1, 2026',
    };
    this.customers.update((customers) =>
      selected
        ? customers.map((current) => (current.id === selected.id ? customer : current))
        : [customer, ...customers],
    );
    this.customerDrawerOpen.set(false);
    this.toastService.success(
      selected ? 'Customer updated' : 'Customer created',
      `${customer.name} at ${customer.company} is ready.`,
      3500,
    );
  }

  protected markOrdersShipped(): void {
    const selected = new Set(this.selectedOrderKeys());
    this.orderRows.update((rows) =>
      rows.map((row) => (selected.has(this.text(row['id'])) ? { ...row, status: 'Shipped' } : row)),
    );
    this.toastService.success(
      'Orders updated',
      `${selected.size} ${selected.size === 1 ? 'order is' : 'orders are'} marked as shipped.`,
      3500,
    );
    this.selectedOrderKeys.set([]);
  }

  protected exportOrders(): void {
    const csvRows = [
      ['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Items'],
      ...this.orderRows().map((row) => [
        this.text(row['id']),
        this.text(row['customer']),
        this.text(row['date']),
        this.text(row['status']),
        this.text(row['total']),
        this.text(row['items']),
      ]),
    ];
    const csv = csvRows.map((row) => row.map((value) => this.csvCell(value)).join(',')).join('\n');
    const browserWindow = this.document.defaultView;

    if (!browserWindow || typeof browserWindow.URL.createObjectURL !== 'function') {
      this.showAction('Export ready', 'The current order report is ready to download.');
      return;
    }

    const downloadUrl = browserWindow.URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    );
    const downloadLink = this.document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'northstar-orders.csv';
    downloadLink.click();
    browserWindow.URL.revokeObjectURL(downloadUrl);
    this.showAction('Export complete', 'The latest order report was downloaded as CSV.');
  }

  protected showOrderActions(row: UiTableRow): void {
    this.showAction(
      `Order ${this.text(row['id'])}`,
      `${this.text(row['customer'])} · ${this.text(row['status'])} · ${this.text(row['total'])}`,
    );
  }

  protected showAction(title: string, message: string): void {
    this.toastService.success(title, message, 3000);
  }

  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
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

  protected customerStatusVariant(status: AdminCustomer['status']): UiTagVariant {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Trial':
        return 'info';
      case 'At risk':
        return 'warning';
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

  private csvCell(value: string): string {
    return `"${value.replaceAll('"', '""')}"`;
  }

  private readPreference(key: string): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private writePreference(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch {
      // The dashboard remains usable when storage is unavailable.
    }
  }
}
