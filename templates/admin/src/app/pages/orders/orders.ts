import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDownTray, heroMagnifyingGlass, heroTruck } from '@ng-icons/heroicons/outline';
import { UiButtonComponent, UiButtonIconStartDirective } from '@ngnova/ui/button';
import { UiDatePickerComponent } from '@ngnova/ui/date-picker';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiPaginatorComponent } from '@ngnova/ui/paginator';
import { UiTableCellDirective, UiTableComponent } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow, UiTableRowKey } from '@ngnova/ui/table';
import { createUiTableState } from '@ngnova/ui/table-state';
import { UiTabsComponent } from '@ngnova/ui/tabs';
import type { UiTabItem } from '@ngnova/ui/tabs';
import { UiTagComponent } from '@ngnova/ui/tag';
import { UiToastService } from '@ngnova/ui/toast';

import { CustomersService } from '../../core/customers.service';
import { isoDate } from '../../core/dates';
import type { OrderStatus } from '../../core/models';
import { orderItemCount, orderTotal } from '../../core/models';
import { canShip, OrdersService } from '../../core/orders.service';
import { downloadCsv, paginate, sortRows } from '../../core/table-utils';
import { PageHeader } from '../../shared/page-header';
import { ORDER_STATUS_VARIANT } from '../../shared/status';

interface OrderRow {
  readonly id: string;
  readonly customer: string;
  readonly placedAt: string;
  readonly items: number;
  readonly total: number;
  readonly payment: string;
  readonly status: OrderStatus;
}

const STATUSES: readonly OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Refunded',
];

const COLUMNS: readonly UiTableColumn[] = [
  { key: 'id', header: 'Order', sortable: true },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'placedAt', header: 'Placed', sortable: true },
  { key: 'items', header: 'Items', align: 'end' },
  { key: 'total', header: 'Total', sortable: true, align: 'end' },
  { key: 'payment', header: 'Payment' },
  { key: 'status', header: 'Status' },
];

@Component({
  selector: 'app-orders-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    FormField,
    NgIcon,
    PageHeader,
    RouterLink,
    UiButtonComponent,
    UiButtonIconStartDirective,
    UiDatePickerComponent,
    UiInputComponent,
    UiPaginatorComponent,
    UiTableCellDirective,
    UiTableComponent,
    UiTabsComponent,
    UiTagComponent,
  ],
  viewProviders: [provideIcons({ heroArrowDownTray, heroMagnifyingGlass, heroTruck })],
  template: `
    <app-page-header title="Orders" description="Track payments and fulfillment for every order.">
      <ng-container actions>
        <ui-button variant="outline" size="sm" (pressed)="exportCsv()">
          <ng-icon uiButtonIconStart name="heroArrowDownTray" size="16" aria-hidden="true" />
          Export
        </ui-button>
      </ng-container>
    </app-page-header>

    <dl class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      @for (stat of stats(); track stat.label) {
        <div
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <dt class="text-sm text-slate-600 dark:text-slate-400">{{ stat.label }}</dt>
          <dd class="mt-1 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white">
            {{ stat.value }}
          </dd>
          <dd class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ stat.hint }}</dd>
        </div>
      }
    </dl>

    <section
      class="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label="Order list"
    >
      <ui-tabs
        class="block px-4 pt-3"
        variant="underline"
        ariaLabel="Filter orders by status"
        [tabs]="tabs()"
        [active]="status()"
        (activeChange)="status.set($event)"
      >
        <div class="flex flex-col gap-3 py-4 md:flex-row md:items-end">
          <ui-input
            class="md:max-w-xs md:flex-1"
            ariaLabel="Search orders"
            placeholder="Search order or customer"
            size="sm"
            clearable
            [formField]="filterForm.query"
          >
            <ng-icon uiInputPrefix name="heroMagnifyingGlass" size="16" aria-hidden="true" />
          </ui-input>
          <ui-date-picker
            class="md:w-52"
            ariaLabel="Placed on or after"
            placeholder="Placed on or after"
            size="sm"
            clearable
            [max]="today"
            [formField]="filterForm.since"
          />
          @if (selectedShippable().length) {
            <div class="flex items-center gap-2 md:ms-auto" data-testid="bulk-actions">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >{{ table.selectedKeys().length }} selected</span
              >
              <ui-button
                size="sm"
                [loading]="shipping()"
                loadingLabel="Updating orders"
                (pressed)="shipSelected()"
              >
                <ng-icon uiButtonIconStart name="heroTruck" size="16" aria-hidden="true" />
                Mark {{ selectedShippable().length }} as shipped
              </ui-button>
            </div>
          } @else {
            <p class="text-sm text-slate-500 md:ms-auto dark:text-slate-400" role="status">
              {{ filtered().length }} {{ filtered().length === 1 ? 'order' : 'orders' }}
            </p>
          }
        </div>
      </ui-tabs>

      <ul
        class="divide-y divide-slate-100 border-t border-slate-200 md:hidden dark:divide-slate-800 dark:border-slate-800"
        aria-label="Orders"
      >
        @if (orders.loading()) {
          <li class="p-4 text-sm text-slate-500">Loading orders…</li>
        } @else if (!filtered().length) {
          <li class="p-4 text-sm text-slate-500 dark:text-slate-400">
            No orders match your filters.
          </li>
        }
        @for (order of pageOrders(); track order.id) {
          <li>
            <a
              [routerLink]="['/orders', order.id]"
              class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800/50"
            >
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-slate-900 dark:text-white"
                  >{{ order.id }} · {{ order.customer }}</span
                >
                <span class="block text-xs text-slate-500 dark:text-slate-400">{{
                  order.placedAt | date: 'MMM d, h:mm a'
                }}</span>
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
      <ui-paginator
        class="block border-t border-slate-200 p-3 md:hidden dark:border-slate-800"
        [page]="table.page()"
        [pageSize]="table.pageSize()"
        [totalItems]="filtered().length"
        [siblingCount]="0"
        (pageChange)="table.setPage($event)"
      />

      <ui-table
        class="hidden border-t border-slate-200 md:block dark:border-slate-800"
        caption="Orders"
        rowKey="id"
        selectionMode="multiple"
        emptyText="No orders match your filters."
        [columns]="columns"
        [rows]="pageRows()"
        [loading]="orders.loading()"
        [sort]="table.sort()"
        [selectedKeys]="table.selectedKeys()"
        [page]="table.page()"
        [pageSize]="table.pageSize()"
        [totalItems]="filtered().length"
        (sortChange)="table.setSort($event)"
        (selectedKeysChange)="table.selectMany($event)"
        (pageChange)="table.setPage($event)"
      >
        <ng-template uiTableCell="id" let-row="row">
          <a
            [routerLink]="['/orders', asOrder(row).id]"
            class="rounded font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400"
            >{{ asOrder(row).id }}</a
          >
        </ng-template>
        <ng-template uiTableCell="placedAt" let-row="row">
          {{ asOrder(row).placedAt | date: 'MMM d, h:mm a' }}
        </ng-template>
        <ng-template uiTableCell="total" let-row="row">
          <span class="font-medium tabular-nums">{{ asOrder(row).total | currency: 'USD' }}</span>
        </ng-template>
        <ng-template uiTableCell="status" let-row="row">
          <ui-tag size="sm" [variant]="statusVariant[asOrder(row).status]">{{
            asOrder(row).status
          }}</ui-tag>
        </ng-template>
      </ui-table>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  protected readonly orders = inject(OrdersService);
  private readonly customers = inject(CustomersService);
  private readonly toast = inject(UiToastService);

  protected readonly columns = COLUMNS;
  protected readonly statusVariant = ORDER_STATUS_VARIANT;
  protected readonly today = isoDate(new Date());

  protected readonly status = signal<string>('all');
  protected readonly filters = signal({ query: '', since: '' });
  protected readonly filterForm = form(this.filters);
  protected readonly table = createUiTableState({
    pageSize: 10,
    sort: { key: 'placedAt', direction: 'desc' },
  });
  protected readonly shipping = signal(false);

  private readonly rows = computed<OrderRow[]>(() =>
    this.orders.orders().map((order) => ({
      id: order.id,
      customer: this.customers.find(order.customerId)?.name ?? 'Unknown customer',
      placedAt: order.placedAt,
      items: orderItemCount(order),
      total: orderTotal(order),
      payment: order.payment,
      status: order.status,
    })),
  );

  protected readonly stats = computed(() => {
    const orders = this.orders.orders();
    const money = (value: number): string =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    const paid = orders.filter(
      (order) => order.status !== 'Refunded' && order.status !== 'Pending',
    );
    const revenue = paid.reduce((sum, order) => sum + orderTotal(order), 0);
    const refunded = orders.filter((order) => order.status === 'Refunded').length;
    const open = orders.filter(canShip).length;
    return [
      {
        label: 'Open orders',
        value: String(open),
        hint: open ? 'Waiting to be shipped' : 'All caught up',
      },
      { label: 'Order revenue', value: money(revenue), hint: `Across ${paid.length} paid orders` },
      {
        label: 'Average order',
        value: money(revenue / Math.max(1, paid.length)),
        hint: 'Paid orders only',
      },
      {
        label: 'Refund rate',
        value: `${((refunded / Math.max(1, orders.length)) * 100).toFixed(1)}%`,
        hint: `${refunded} refunded orders`,
      },
    ];
  });

  protected readonly tabs = computed<UiTabItem[]>(() => {
    const rows = this.rows();
    return [
      { value: 'all', label: `All (${rows.length})` },
      ...STATUSES.map((status) => ({
        value: status,
        label: `${status} (${rows.filter((row) => row.status === status).length})`,
      })),
    ];
  });

  protected readonly filtered = computed(() => {
    const status = this.status();
    const query = this.filters().query.trim().toLowerCase();
    const since = this.filters().since;
    const rows = this.rows().filter(
      (row) =>
        (status === 'all' || row.status === status) &&
        (!since || row.placedAt.slice(0, 10) >= since) &&
        (!query ||
          row.id.toLowerCase().includes(query) ||
          row.customer.toLowerCase().includes(query)),
    );
    return sortRows(rows, this.table.sort(), (row, key) => {
      const value = row[key as keyof OrderRow];
      return typeof value === 'number' ? value : String(value);
    });
  });

  protected readonly pageOrders = computed(() =>
    paginate(this.filtered(), this.table.page(), this.table.pageSize()),
  );
  protected readonly pageRows = computed<UiTableRow[]>(() =>
    this.pageOrders().map((row) => ({ ...row })),
  );

  protected readonly selectedShippable = computed(() => {
    const selected = new Set<UiTableRowKey>(this.table.selectedKeys());
    return this.orders.orders().filter((order) => selected.has(order.id) && canShip(order));
  });

  constructor() {
    void this.orders.load();
    void this.customers.load();
    effect(() => {
      this.status();
      this.filters();
      untracked(() => {
        this.table.setPage(1);
        this.table.clearSelection();
      });
    });
  }

  protected asOrder(row: UiTableRow): OrderRow {
    return row as unknown as OrderRow;
  }

  protected async shipSelected(): Promise<void> {
    this.shipping.set(true);
    try {
      const changed = await this.orders.ship(this.selectedShippable().map((order) => order.id));
      this.table.clearSelection();
      this.toast.success(`${changed} ${changed === 1 ? 'order' : 'orders'} marked as shipped`);
    } finally {
      this.shipping.set(false);
    }
  }

  protected exportCsv(): void {
    const rows = this.filtered();
    downloadCsv(
      'northstar-orders.csv',
      ['Order', 'Customer', 'Placed', 'Items', 'Total', 'Payment', 'Status'],
      rows.map((row) => [
        row.id,
        row.customer,
        row.placedAt,
        row.items,
        row.total,
        row.payment,
        row.status,
      ]),
    );
    this.toast.success('Export ready', `${rows.length} orders exported to CSV.`);
  }
}
