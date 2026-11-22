import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowDownTray,
  heroArrowUpRight,
  heroExclamationTriangle,
  heroReceiptRefund,
  heroShoppingBag,
  heroUserPlus,
} from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiButtonComponent, UiButtonIconStartDirective } from '@ngnova/ui/button';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiTableCellDirective, UiTableComponent } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow } from '@ngnova/ui/table';
import { UiTabsComponent } from '@ngnova/ui/tabs';
import type { UiTabItem } from '@ngnova/ui/tabs';
import { UiTagComponent } from '@ngnova/ui/tag';
import { UiToastService } from '@ngnova/ui/toast';

import { AnalyticsService } from '../../core/analytics.service';
import type { AnalyticsRange } from '../../core/analytics.service';
import { CustomersService } from '../../core/customers.service';
import { buildActivity } from '../../core/mock-data';
import type { CustomerPlan, DailyRevenue, OrderStatus } from '../../core/models';
import { orderTotal } from '../../core/models';
import { OrdersService } from '../../core/orders.service';
import { downloadCsv } from '../../core/table-utils';
import { DonutChart } from '../../shared/donut-chart';
import type { DonutSegment } from '../../shared/donut-chart';
import { KpiCard } from '../../shared/kpi-card';
import { LineChart } from '../../shared/line-chart';
import { PageHeader } from '../../shared/page-header';
import { ORDER_STATUS_VARIANT } from '../../shared/status';

const RANGE_OPTIONS: readonly UiSelectOption[] = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
];

type ChartMetric = 'revenue' | 'orders' | 'visitors';

const CHART_TABS: readonly UiTabItem[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'orders', label: 'Orders' },
  { value: 'visitors', label: 'Visitors' },
];

const PLAN_COLORS: Record<CustomerPlan, string> = {
  Enterprise: 'text-blue-600 dark:text-blue-400',
  Pro: 'text-violet-500 dark:text-violet-400',
  Starter: 'text-emerald-500 dark:text-emerald-400',
  Free: 'text-slate-300 dark:text-slate-600',
};

const ORDER_COLUMNS: readonly UiTableColumn[] = [
  { key: 'id', header: 'Order' },
  { key: 'customer', header: 'Customer' },
  { key: 'placedAt', header: 'Placed' },
  { key: 'status', header: 'Status' },
  { key: 'total', header: 'Total', align: 'end' },
];

const ACTIVITY_ICONS = {
  order: 'heroShoppingBag',
  customer: 'heroUserPlus',
  refund: 'heroReceiptRefund',
  alert: 'heroExclamationTriangle',
} as const;

const ACTIVITY_TONES = {
  order: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
  customer: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
  refund: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
  alert: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
} as const;

interface RecentOrder {
  readonly id: string;
  readonly customer: string;
  readonly placedAt: string;
  readonly status: OrderStatus;
  readonly total: number;
}

const card =
  'min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';

@Component({
  selector: 'app-overview-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    DonutChart,
    FormField,
    KpiCard,
    LineChart,
    NgIcon,
    PageHeader,
    PercentPipe,
    RouterLink,
    UiAvatarComponent,
    UiButtonComponent,
    UiButtonIconStartDirective,
    UiProgressBarComponent,
    UiSelectComponent,
    UiTableCellDirective,
    UiTableComponent,
    UiTabsComponent,
    UiTagComponent,
  ],
  viewProviders: [
    provideIcons({
      heroArrowDownTray,
      heroArrowUpRight,
      heroExclamationTriangle,
      heroReceiptRefund,
      heroShoppingBag,
      heroUserPlus,
    }),
  ],
  template: `
    <app-page-header [title]="greeting() + ', Maya'" [description]="today">
      <div actions class="flex items-end gap-2">
        <ui-select
          class="w-40"
          ariaLabel="Reporting period"
          size="sm"
          [options]="rangeOptions"
          [formField]="rangeForm.range"
        />
        <ui-button variant="outline" size="sm" (pressed)="exportReport()">
          <ng-icon uiButtonIconStart name="heroArrowDownTray" size="16" aria-hidden="true" />
          Export
        </ui-button>
      </div>
    </app-page-header>

    <section aria-label="Key metrics" class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <app-kpi-card
        label="Revenue"
        prefix="$"
        [value]="analytics.revenue().current"
        [change]="analytics.revenue().change"
        [series]="series('revenue')"
        [caption]="
          'vs. ' +
          (analytics.revenue().previous | currency: 'USD' : 'symbol' : '1.0-0') +
          ' previous period'
        "
      />
      <app-kpi-card
        label="Orders"
        [value]="analytics.orders().current"
        [change]="analytics.orders().change"
        [series]="series('orders')"
        [caption]="'Average order ' + (averageOrder() | currency: 'USD' : 'symbol' : '1.0-0')"
      />
      <app-kpi-card
        label="Sign-ups"
        [value]="analytics.signups().current"
        [change]="analytics.signups().change"
        [series]="series('signups')"
        caption="Trial accounts started"
      />
      <app-kpi-card
        label="Conversion"
        suffix="%"
        digits="1.2-2"
        [scale]="100"
        [value]="analytics.conversion().current"
        [change]="analytics.conversion().change"
        [series]="conversionSeries()"
        caption="Visitors who placed an order"
      />
    </section>

    <div class="mt-6 grid gap-6 xl:grid-cols-3">
      <section [class]="card + ' p-5 xl:col-span-2'" aria-labelledby="performance-heading">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="performance-heading"
              class="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Performance
            </h2>
            <p class="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {{ chartTotal() }}
              <span class="ms-1 text-sm font-medium text-slate-500 dark:text-slate-400"
                >{{ chartTabLabel().toLowerCase() }} in {{ analytics.range() }} days</span
              >
            </p>
          </div>
          <div
            class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400"
            aria-hidden="true"
          >
            <span class="flex items-center gap-1.5">
              <span class="h-0.5 w-4 rounded bg-blue-600 dark:bg-blue-400"></span> This period
            </span>
            <span class="flex items-center gap-1.5">
              <span
                class="w-4 border-t-2 border-dashed border-slate-300 dark:border-slate-600"
              ></span>
              Previous period
            </span>
          </div>
        </div>
        <ui-tabs
          class="mt-4 block"
          variant="segmented"
          ariaLabel="Chart metric"
          [tabs]="chartTabs"
          [active]="chartMetric()"
          (activeChange)="selectMetric($event)"
        >
          <app-line-chart
            class="mt-5 block"
            [label]="chartTabLabel() + ' per day for the last ' + analytics.range() + ' days'"
            [seriesLabel]="chartTabLabel()"
            [valueFormat]="chartMetric() === 'revenue' ? 'currency' : 'number'"
            [series]="chartPoints()"
            [comparison]="comparisonPoints()"
          />
        </ui-tabs>
      </section>

      <section [class]="card + ' flex flex-col p-5'" aria-labelledby="plans-heading">
        <h2 id="plans-heading" class="text-sm font-medium text-slate-600 dark:text-slate-400">
          Customers by plan
        </h2>
        <app-donut-chart class="mt-5 block" totalLabel="Customers" [segments]="planSegments()" />
        <div class="mt-auto pt-6">
          <div class="rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-950">
            <div class="flex items-baseline justify-between gap-3">
              <p class="font-medium text-slate-900 dark:text-white">Quarterly goal</p>
              <p class="font-semibold tabular-nums text-slate-900 dark:text-white">
                {{ goalProgress() | percent }}
              </p>
            </div>
            <p class="mt-1 text-slate-600 dark:text-slate-400">
              {{ analytics.quarterRevenue | currency: 'USD' : 'symbol' : '1.0-0' }} of
              {{ goal | currency: 'USD' : 'symbol' : '1.0-0' }}
            </p>
            <ui-progress-bar
              class="mt-3 block"
              variant="success"
              label="Quarterly revenue goal"
              [value]="goalProgress() * 100"
            />
          </div>
        </div>
      </section>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <section [class]="card + ' p-5'" aria-labelledby="products-heading">
        <h2 id="products-heading" class="text-sm font-semibold text-slate-900 dark:text-white">
          Top products
        </h2>
        <ol class="mt-4 grid gap-4">
          @for (product of topProducts(); track product.sku) {
            <li>
              <div class="flex items-baseline justify-between gap-3 text-sm">
                <span class="min-w-0 truncate font-medium text-slate-900 dark:text-white">{{
                  product.name
                }}</span>
                <span class="shrink-0 tabular-nums text-slate-900 dark:text-white">{{
                  product.revenue | currency: 'USD' : 'symbol' : '1.0-0'
                }}</span>
              </div>
              <div class="mt-1.5 flex items-center gap-3">
                <div
                  class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  aria-hidden="true"
                >
                  <div
                    class="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                    [style.width.%]="(product.revenue / topProductRevenue()) * 100"
                  ></div>
                </div>
                <span class="w-20 text-end text-xs tabular-nums text-slate-500 dark:text-slate-400"
                  >{{ product.units | number }} sold</span
                >
              </div>
            </li>
          }
        </ol>
      </section>

      <section [class]="card + ' p-5'" aria-labelledby="channels-heading">
        <h2 id="channels-heading" class="text-sm font-semibold text-slate-900 dark:text-white">
          Revenue by channel
        </h2>
        <ul class="mt-4 grid gap-4">
          @for (channel of analytics.channels(); track channel.name) {
            <li>
              <div class="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span class="font-medium text-slate-900 dark:text-white">{{ channel.name }}</span>
                <span class="tabular-nums text-slate-500 dark:text-slate-400">
                  {{ channel.revenue | currency: 'USD' : 'symbol' : '1.0-0' }}
                  <span class="ms-1 text-xs">{{ channel.share | percent }}</span>
                </span>
              </div>
              <ui-progress-bar
                [value]="channel.share * 100"
                [ariaValueText]="channel.name + ' ' + (channel.share | percent)"
                [label]="channel.name + ' share'"
              />
            </li>
          }
        </ul>
      </section>

      <section
        [class]="card + ' p-5 lg:col-span-2 xl:col-span-1'"
        aria-labelledby="activity-heading"
      >
        <h2 id="activity-heading" class="text-sm font-semibold text-slate-900 dark:text-white">
          Activity
        </h2>
        <ol class="mt-4 grid gap-4">
          @for (item of activity(); track item.id) {
            <li class="flex gap-3">
              <span
                class="grid size-8 shrink-0 place-items-center rounded-full"
                [class]="activityTones[item.kind]"
                aria-hidden="true"
              >
                <ng-icon [name]="activityIcons[item.kind]" size="16" />
              </span>
              <div class="min-w-0 text-sm">
                @if (item.link) {
                  <a
                    [routerLink]="item.link"
                    class="font-medium text-slate-900 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-white"
                    >{{ item.title }}</a
                  >
                } @else {
                  <p class="font-medium text-slate-900 dark:text-white">{{ item.title }}</p>
                }
                <p class="line-clamp-2 text-slate-500 dark:text-slate-400">{{ item.detail }}</p>
                <p class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {{ item.at | date: 'MMM d, h:mm a' }}
                </p>
              </div>
            </li>
          }
        </ol>
      </section>
    </div>

    <section [class]="card + ' mt-6'" aria-labelledby="recent-orders-heading">
      <div class="flex items-center justify-between gap-3 p-5">
        <div>
          <h2
            id="recent-orders-heading"
            class="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Recent orders
          </h2>
          <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {{ orders.openCount() }} waiting to be shipped
          </p>
        </div>
        <a
          routerLink="/orders"
          class="inline-flex items-center gap-1 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-400"
        >
          View all
          <ng-icon name="heroArrowUpRight" size="14" aria-hidden="true" class="rtl:-scale-x-100" />
        </a>
      </div>
      <ul
        class="divide-y divide-slate-100 border-t border-slate-200 md:hidden dark:divide-slate-800 dark:border-slate-800"
        aria-label="Recent orders"
      >
        @for (order of recentOrders(); track order.id) {
          <li>
            <a
              [routerLink]="['/orders', order.id]"
              class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800/50"
            >
              <ui-avatar size="sm" [label]="order.customer" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-slate-900 dark:text-white">{{
                  order.customer
                }}</span>
                <span class="block text-xs text-slate-500 dark:text-slate-400"
                  >{{ order.id }} · {{ order.placedAt | date: 'MMM d, h:mm a' }}</span
                >
              </span>
              <span class="text-end">
                <span
                  class="block text-sm font-semibold tabular-nums text-slate-900 dark:text-white"
                  >{{ order.total | currency: 'USD' }}</span
                >
                <ui-tag size="sm" [variant]="statusVariant[order.status]">{{
                  order.status
                }}</ui-tag>
              </span>
            </a>
          </li>
        }
      </ul>
      <ui-table
        class="hidden border-t border-slate-200 md:block dark:border-slate-800"
        caption="Recent orders"
        [columns]="orderColumns"
        [rows]="recentOrderRows()"
        [loading]="orders.loading()"
      >
        <ng-template uiTableCell="id" let-row="row">
          <a
            [routerLink]="['/orders', asOrder(row).id]"
            class="rounded font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400"
            >{{ asOrder(row).id }}</a
          >
        </ng-template>
        <ng-template uiTableCell="customer" let-row="row">
          <span class="flex items-center gap-3">
            <ui-avatar size="sm" [label]="asOrder(row).customer" />
            <span class="truncate">{{ asOrder(row).customer }}</span>
          </span>
        </ng-template>
        <ng-template uiTableCell="placedAt" let-row="row">
          {{ asOrder(row).placedAt | date: 'MMM d, h:mm a' }}
        </ng-template>
        <ng-template uiTableCell="status" let-row="row">
          <ui-tag size="sm" [variant]="statusVariant[asOrder(row).status]">{{
            asOrder(row).status
          }}</ui-tag>
        </ng-template>
        <ng-template uiTableCell="total" let-row="row">
          <span class="font-medium tabular-nums">{{ asOrder(row).total | currency: 'USD' }}</span>
        </ng-template>
      </ui-table>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly analytics = inject(AnalyticsService);
  protected readonly orders = inject(OrdersService);
  private readonly customers = inject(CustomersService);
  private readonly toast = inject(UiToastService);

  protected readonly card = card;
  protected readonly rangeOptions = RANGE_OPTIONS;
  protected readonly chartTabs = CHART_TABS;
  protected readonly orderColumns = ORDER_COLUMNS;
  protected readonly statusVariant = ORDER_STATUS_VARIANT;
  protected readonly activityIcons = ACTIVITY_ICONS;
  protected readonly activityTones = ACTIVITY_TONES;
  protected readonly goal = 1_300_000;
  protected readonly today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  /** Form model for the period select, kept in sync with the shared analytics range. */
  protected readonly rangeModel = linkedSignal(() => ({ range: String(this.analytics.range()) }));
  protected readonly rangeForm = form(this.rangeModel);
  protected readonly chartMetric = signal<ChartMetric>('revenue');

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  });

  protected readonly chartTabLabel = computed(
    () => CHART_TABS.find((tab) => tab.value === this.chartMetric())?.label ?? '',
  );
  protected readonly chartPoints = computed(() => this.points(this.analytics.current()));
  protected readonly comparisonPoints = computed(() => this.points(this.analytics.previous()));
  protected readonly chartTotal = computed(() => {
    const total = this.chartPoints().reduce((sum, point) => sum + point.value, 0);
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      ...(this.chartMetric() === 'revenue' ? { style: 'currency', currency: 'USD' } : {}),
    }).format(total);
  });
  protected readonly conversionSeries = computed(() =>
    this.analytics.current().map((day) => day.orders / Math.max(1, day.visitors)),
  );
  protected readonly averageOrder = computed(
    () => this.analytics.revenue().current / Math.max(1, this.analytics.orders().current),
  );
  protected readonly goalProgress = computed(() =>
    Math.min(1, this.analytics.quarterRevenue / this.goal),
  );
  protected readonly topProducts = computed(() => this.analytics.topProducts().slice(0, 5));
  protected readonly topProductRevenue = computed(() =>
    Math.max(1, ...this.topProducts().map((product) => product.revenue)),
  );

  protected readonly planSegments = computed<DonutSegment[]>(() => {
    const customers = this.customers.customers();
    return (['Enterprise', 'Pro', 'Starter', 'Free'] as const).map((plan) => ({
      label: plan,
      value: customers.filter((customer) => customer.plan === plan).length,
      color: PLAN_COLORS[plan],
    }));
  });

  protected readonly recentOrders = computed(() =>
    this.orders
      .orders()
      .slice(0, 6)
      .map(
        (order): RecentOrder => ({
          id: order.id,
          customer: this.customers.find(order.customerId)?.name ?? 'Unknown customer',
          placedAt: order.placedAt,
          status: order.status,
          total: orderTotal(order),
        }),
      ),
  );
  protected readonly recentOrderRows = computed<UiTableRow[]>(() =>
    this.recentOrders().map((row) => ({ ...row })),
  );

  protected readonly activity = computed(() =>
    buildActivity(this.customers.customers(), this.orders.orders()).slice(0, 5),
  );

  constructor() {
    void this.customers.load();
    void this.orders.load();
    effect(() => {
      const range = Number(this.rangeModel().range) as AnalyticsRange;
      if (range !== this.analytics.range()) this.analytics.range.set(range);
    });
  }

  protected series(key: 'revenue' | 'orders' | 'signups'): number[] {
    return this.analytics.current().map((day) => day[key]);
  }

  protected selectMetric(value: string): void {
    if (CHART_TABS.some((tab) => tab.value === value)) this.chartMetric.set(value as ChartMetric);
  }

  protected asOrder(row: UiTableRow): RecentOrder {
    return row as unknown as RecentOrder;
  }

  protected exportReport(): void {
    downloadCsv(
      `northstar-revenue-${this.analytics.range()}d.csv`,
      ['Date', 'Revenue', 'Orders', 'Visitors', 'Signups'],
      this.analytics
        .current()
        .map((day) => [day.date, day.revenue, day.orders, day.visitors, day.signups]),
    );
    this.toast.success('Report exported', `Last ${this.analytics.range()} days of revenue.`);
  }

  private points(days: readonly DailyRevenue[]): { date: string; value: number }[] {
    const metric = this.chartMetric();
    return days.map((day) => ({ date: day.date, value: day[metric] }));
  }
}
