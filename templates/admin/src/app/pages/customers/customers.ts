import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowDownTray,
  heroEllipsisHorizontal,
  heroEnvelope,
  heroMagnifyingGlass,
  heroMapPin,
  heroPencilSquare,
  heroPlus,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiButtonComponent, UiButtonIconStartDirective } from '@ngnova/ui/button';
import { UiChipComponent } from '@ngnova/ui/chip';
import { UiConfirmationService } from '@ngnova/ui/confirmation';
import {
  UiDrawerComponent,
  UiDrawerFooterDirective,
  UiDrawerHeaderDirective,
} from '@ngnova/ui/drawer';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiMenuComponent, UiMenuTriggerDirective } from '@ngnova/ui/menu';
import type { UiMenuItem, UiMenuSelection } from '@ngnova/ui/menu';
import { UiPaginatorComponent } from '@ngnova/ui/paginator';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiTableCellDirective, UiTableComponent, UiTableHeaderDirective } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow, UiTableRowKey, UiTableSort } from '@ngnova/ui/table';
import { createUiTableState } from '@ngnova/ui/table-state';
import { UiTagComponent } from '@ngnova/ui/tag';
import { UiToastService } from '@ngnova/ui/toast';

import { CustomersService, filterCustomers } from '../../core/customers.service';
import type { CustomerFilters } from '../../core/customers.service';
import type { Customer, CustomerDraft } from '../../core/models';
import { orderTotal } from '../../core/models';
import { OrdersService } from '../../core/orders.service';
import { downloadCsv, paginate, sortRows } from '../../core/table-utils';
import { PageHeader } from '../../shared/page-header';
import { CUSTOMER_STATUS_VARIANT, ORDER_STATUS_VARIANT, PLAN_VARIANT } from '../../shared/status';
import { CustomerForm, PLAN_OPTIONS, STATUS_OPTIONS } from './customer-form';

const COLUMNS: readonly UiTableColumn[] = [
  { key: 'name', header: 'Customer', sortable: true },
  { key: 'company', header: 'Company', sortable: true },
  { key: 'plan', header: 'Plan', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'spent', header: 'Lifetime spend', sortable: true, align: 'end' },
  { key: 'joined', header: 'Joined', sortable: true },
  { key: 'actions', header: 'Actions', align: 'end' },
];

const ROW_MENU: readonly UiMenuItem[] = [
  { value: 'view', label: 'View details' },
  { value: 'edit', label: 'Edit' },
  { value: 'delete', label: 'Delete', danger: true, separatorBefore: true },
];

const EMPTY_FILTERS: CustomerFilters = { query: '', status: '', plan: '' };

@Component({
  selector: 'app-customers-page',
  imports: [
    CurrencyPipe,
    CustomerForm,
    DatePipe,
    FormField,
    NgIcon,
    PageHeader,
    RouterLink,
    UiAvatarComponent,
    UiButtonComponent,
    UiButtonIconStartDirective,
    UiChipComponent,
    UiDrawerComponent,
    UiDrawerFooterDirective,
    UiDrawerHeaderDirective,
    UiInputComponent,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiPaginatorComponent,
    UiSelectComponent,
    UiTableCellDirective,
    UiTableComponent,
    UiTableHeaderDirective,
    UiTagComponent,
  ],
  viewProviders: [
    provideIcons({
      heroArrowDownTray,
      heroEllipsisHorizontal,
      heroEnvelope,
      heroMagnifyingGlass,
      heroMapPin,
      heroPencilSquare,
      heroPlus,
      heroTrash,
    }),
  ],
  template: `
    <app-page-header
      title="Customers"
      [description]="
        customers.loading()
          ? 'Loading customers…'
          : customers.count() + ' customers in your workspace'
      "
    >
      <ng-container actions>
        <ui-button variant="outline" size="sm" (pressed)="exportCsv(filtered())">
          <ng-icon uiButtonIconStart name="heroArrowDownTray" size="16" aria-hidden="true" />
          Export
        </ui-button>
        <ui-button size="sm" data-testid="add-customer" (pressed)="openForm(null)">
          <ng-icon uiButtonIconStart name="heroPlus" size="16" aria-hidden="true" />
          Add customer
        </ui-button>
      </ng-container>
    </app-page-header>

    <section aria-label="Filter by status" class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      @for (stat of statusStats(); track stat.value) {
        <button
          type="button"
          class="rounded-xl border bg-white p-4 text-start shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-slate-900"
          [class]="
            filters().status === stat.value
              ? 'border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400'
              : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
          "
          [attr.aria-pressed]="filters().status === stat.value"
          (click)="filterStatus(stat.value)"
        >
          <span class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span class="size-2 rounded-full" [class]="stat.dot" aria-hidden="true"></span>
            {{ stat.label }}
          </span>
          <span
            class="mt-1 block text-2xl font-semibold tabular-nums text-slate-950 dark:text-white"
            >{{ stat.count }}</span
          >
          <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{{
            stat.hint
          }}</span>
        </button>
      }
    </section>

    <section
      class="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label="Customer list"
    >
      <div
        class="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-end dark:border-slate-800"
      >
        <ui-input
          class="md:max-w-xs md:flex-1"
          ariaLabel="Search customers"
          placeholder="Search name, email, or company"
          size="sm"
          clearable
          [formField]="filterForm.query"
        >
          <ng-icon uiInputPrefix name="heroMagnifyingGlass" size="16" aria-hidden="true" />
        </ui-input>
        <div class="grid grid-cols-2 gap-3 md:flex">
          <ui-select
            class="md:w-40"
            ariaLabel="Filter by status"
            placeholder="All statuses"
            size="sm"
            [options]="statusOptions"
            [formField]="filterForm.status"
          />
          <ui-select
            class="md:w-40"
            ariaLabel="Filter by plan"
            placeholder="All plans"
            size="sm"
            [options]="planOptions"
            [formField]="filterForm.plan"
          />
        </div>
        <p class="text-sm text-slate-500 md:ms-auto dark:text-slate-400" role="status">
          {{ filtered().length }} {{ filtered().length === 1 ? 'result' : 'results' }}
        </p>
      </div>

      @if (activeFilters().length || selectedCount()) {
        <div
          class="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800"
        >
          @for (chip of activeFilters(); track chip.key) {
            <ui-chip
              size="sm"
              removable
              [removeAriaLabel]="'Remove filter ' + chip.label"
              (removed)="clearFilter(chip.key)"
            >
              {{ chip.label }}
            </ui-chip>
          }
          @if (activeFilters().length) {
            <button
              type="button"
              class="rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-400"
              (click)="filters.set(emptyFilters)"
            >
              Clear filters
            </button>
          }
          @if (selectedCount()) {
            <div class="flex items-center gap-2 md:ms-auto" data-testid="bulk-actions">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >{{ selectedCount() }} selected</span
              >
              <ui-button size="sm" variant="outline" (pressed)="exportCsv(selectedCustomers())"
                >Export</ui-button
              >
              <ui-button
                size="sm"
                intent="danger"
                appearance="tonal"
                (pressed)="confirmDelete(selectedCustomers())"
              >
                Delete
              </ui-button>
            </div>
          }
        </div>
      }

      <ul class="divide-y divide-slate-100 md:hidden dark:divide-slate-800" aria-label="Customers">
        @if (customers.loading()) {
          <li class="p-4 text-sm text-slate-500">Loading customers…</li>
        } @else if (!filtered().length) {
          <li class="p-4 text-sm text-slate-500 dark:text-slate-400">
            No customers match your filters.
          </li>
        }
        @for (customer of pageCustomers(); track customer.id) {
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-start hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800/50"
              (click)="openDetail(customer.id)"
            >
              <ui-avatar size="sm" [label]="customer.name" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-slate-900 dark:text-white">{{
                  customer.name
                }}</span>
                <span class="block truncate text-xs text-slate-500 dark:text-slate-400">{{
                  customer.company
                }}</span>
              </span>
              <ui-tag size="sm" [variant]="statusVariant[customer.status]">{{
                customer.status
              }}</ui-tag>
            </button>
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
        class="hidden md:block"
        caption="Customers"
        rowKey="id"
        selectionMode="multiple"
        emptyText="No customers match your filters."
        [columns]="columns"
        [rows]="pageRows()"
        [loading]="customers.loading()"
        [sort]="table.sort()"
        [selectedKeys]="table.selectedKeys()"
        [page]="table.page()"
        [pageSize]="table.pageSize()"
        [totalItems]="filtered().length"
        (sortChange)="sortBy($event)"
        (selectedKeysChange)="table.selectMany($event)"
        (pageChange)="table.setPage($event)"
      >
        <ng-template uiTableCell="name" let-row="row">
          <button
            type="button"
            class="flex items-center gap-3 rounded-lg text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            (click)="openDetail(asCustomer(row).id)"
          >
            <ui-avatar size="sm" [label]="asCustomer(row).name" />
            <span class="min-w-0">
              <span class="block font-medium text-slate-900 hover:underline dark:text-white">{{
                asCustomer(row).name
              }}</span>
              <span class="block text-xs text-slate-500 dark:text-slate-400">{{
                asCustomer(row).email
              }}</span>
            </span>
          </button>
        </ng-template>
        <ng-template uiTableCell="plan" let-row="row">
          <ui-tag size="sm" [variant]="planVariant[asCustomer(row).plan]">{{
            asCustomer(row).plan
          }}</ui-tag>
        </ng-template>
        <ng-template uiTableCell="status" let-row="row">
          <ui-tag size="sm" [variant]="statusVariant[asCustomer(row).status]">{{
            asCustomer(row).status
          }}</ui-tag>
        </ng-template>
        <ng-template uiTableCell="spent" let-row="row">
          <span class="tabular-nums">{{
            asCustomer(row).spent | currency: 'USD' : 'symbol' : '1.0-0'
          }}</span>
        </ng-template>
        <ng-template uiTableCell="joined" let-row="row">
          {{ asCustomer(row).joined | date: 'mediumDate' }}
        </ng-template>
        <ng-template uiTableHeader="actions"><span class="sr-only">Actions</span></ng-template>
        <ng-template uiTableCell="actions" let-row="row">
          <ui-menu
            align="end"
            [ariaLabel]="'Actions for ' + asCustomer(row).name"
            [items]="rowMenu"
            (itemSelected)="rowAction($event, asCustomer(row))"
          >
            <button
              uiMenuTrigger
              type="button"
              class="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800 dark:hover:text-white"
              [attr.aria-label]="'Actions for ' + asCustomer(row).name"
            >
              <ng-icon name="heroEllipsisHorizontal" size="18" aria-hidden="true" />
            </button>
          </ui-menu>
        </ng-template>
      </ui-table>
    </section>

    <ui-drawer position="end" size="md" [open]="!!detail()" (openChange)="$event || closeDetail()">
      <span uiDrawerHeader>Customer details</span>
      @if (detail(); as customer) {
        <div class="flex items-center gap-4">
          <ui-avatar size="lg" [label]="customer.name" />
          <div class="min-w-0">
            <p class="truncate text-lg font-semibold text-slate-950 dark:text-white">
              {{ customer.name }}
            </p>
            <p class="truncate text-sm text-slate-500 dark:text-slate-400">
              {{ customer.company }} · {{ customer.id }}
            </p>
            <div class="mt-2 flex gap-2">
              <ui-tag size="sm" [variant]="planVariant[customer.plan]">{{ customer.plan }}</ui-tag>
              <ui-tag size="sm" [variant]="statusVariant[customer.status]">{{
                customer.status
              }}</ui-tag>
            </div>
          </div>
        </div>

        <dl class="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
          <div>
            <dt class="text-xs text-slate-500 dark:text-slate-400">Lifetime spend</dt>
            <dd class="mt-1 font-semibold tabular-nums text-slate-900 dark:text-white">
              {{ customer.spent | currency: 'USD' : 'symbol' : '1.0-0' }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-slate-500 dark:text-slate-400">Customer since</dt>
            <dd class="mt-1 font-semibold text-slate-900 dark:text-white">
              {{ customer.joined | date: 'mediumDate' }}
            </dd>
          </div>
        </dl>

        <ul class="mt-6 grid gap-3 text-sm">
          <li class="flex items-center gap-3">
            <ng-icon name="heroEnvelope" size="16" class="text-slate-400" aria-hidden="true" />
            <a
              class="text-blue-600 hover:underline dark:text-blue-400"
              [href]="'mailto:' + customer.email"
              >{{ customer.email }}</a
            >
          </li>
          <li class="flex items-center gap-3">
            <ng-icon name="heroMapPin" size="16" class="text-slate-400" aria-hidden="true" />
            {{ customer.city || 'Unknown city' }}, {{ customer.country || 'Unknown country' }}
          </li>
        </ul>

        @if (customer.notes) {
          <h3 class="mt-6 text-sm font-semibold text-slate-900 dark:text-white">Notes</h3>
          <p class="mt-2 whitespace-pre-line text-sm">{{ customer.notes }}</p>
        }

        <h3 class="mt-6 text-sm font-semibold text-slate-900 dark:text-white">Recent orders</h3>
        @if (detailOrders().length) {
          <ul
            class="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800"
          >
            @for (order of detailOrders(); track order.id) {
              <li>
                <a
                  [routerLink]="['/orders', order.id]"
                  class="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800/50"
                >
                  <span>
                    <span class="block font-medium text-slate-900 dark:text-white">{{
                      order.id
                    }}</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">{{
                      order.placedAt | date: 'mediumDate'
                    }}</span>
                  </span>
                  <span class="flex items-center gap-3">
                    <ui-tag size="sm" [variant]="orderVariant[order.status]">{{
                      order.status
                    }}</ui-tag>
                    <span class="tabular-nums">{{ order.total | currency: 'USD' }}</span>
                  </span>
                </a>
              </li>
            }
          </ul>
        } @else {
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">No orders yet.</p>
        }
      }
      @if (detail(); as customer) {
        <div uiDrawerFooter class="flex w-full justify-between gap-3">
          <ui-button variant="ghost" intent="danger" (pressed)="confirmDelete([customer])">
            <ng-icon uiButtonIconStart name="heroTrash" size="16" aria-hidden="true" />
            Delete
          </ui-button>
          <ui-button (pressed)="openForm(customer)">
            <ng-icon uiButtonIconStart name="heroPencilSquare" size="16" aria-hidden="true" />
            Edit
          </ui-button>
        </div>
      }
    </ui-drawer>

    <app-customer-form
      [open]="formOpen()"
      [customer]="editing()"
      [saveAction]="saveCustomer"
      (openChange)="formOpen.set($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  protected readonly customers = inject(CustomersService);
  private readonly orders = inject(OrdersService);
  private readonly confirmation = inject(UiConfirmationService);
  private readonly toast = inject(UiToastService);
  private readonly router = inject(Router);

  /** `?customer=CUS-1001` opens that customer's details; `?new=1` opens the add form. */
  readonly customer = input<string>();
  readonly new = input<string>();

  protected readonly columns = COLUMNS;
  protected readonly rowMenu = ROW_MENU;
  protected readonly planOptions: readonly UiSelectOption[] = PLAN_OPTIONS;
  protected readonly statusOptions: readonly UiSelectOption[] = STATUS_OPTIONS;
  protected readonly planVariant = PLAN_VARIANT;
  protected readonly statusVariant = CUSTOMER_STATUS_VARIANT;
  protected readonly orderVariant = ORDER_STATUS_VARIANT;
  protected readonly emptyFilters = EMPTY_FILTERS;

  protected readonly filters = signal<CustomerFilters>(EMPTY_FILTERS);
  protected readonly filterForm = form(this.filters);
  protected readonly table = createUiTableState({
    pageSize: 10,
    sort: { key: 'joined', direction: 'desc' },
  });

  protected readonly detailId = signal<string | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly editing = signal<Customer | null>(null);

  protected readonly filtered = computed(() =>
    sortRows(
      filterCustomers(this.customers.customers(), this.filters()),
      this.table.sort(),
      (row, key) => (key === 'spent' ? row.spent : String(row[key as keyof Customer])),
    ),
  );
  protected readonly pageCustomers = computed(() =>
    paginate(this.filtered(), this.table.page(), this.table.pageSize()),
  );
  protected readonly pageRows = computed<UiTableRow[]>(() =>
    this.pageCustomers().map((customer) => ({ ...customer })),
  );
  protected readonly selectedCustomers = computed(() => {
    const selected = new Set<UiTableRowKey>(this.table.selectedKeys());
    return this.customers.customers().filter((customer) => selected.has(customer.id));
  });
  protected readonly statusStats = computed(() => {
    const customers = this.customers.customers();
    const total = Math.max(1, customers.length);
    const spend = customers.reduce((sum, customer) => sum + customer.spent, 0);
    const count = (status: string): number =>
      customers.filter((customer) => customer.status === status).length;
    const share = (status: string): string =>
      `${Math.round((count(status) / total) * 100)}% of customers`;
    return [
      {
        value: '' as const,
        label: 'All customers',
        count: customers.length,
        hint: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(spend)} lifetime spend`,
        dot: 'bg-blue-500',
      },
      {
        value: 'Active' as const,
        label: 'Active',
        count: count('Active'),
        hint: share('Active'),
        dot: 'bg-emerald-500',
      },
      {
        value: 'Trial' as const,
        label: 'Trial',
        count: count('Trial'),
        hint: share('Trial'),
        dot: 'bg-amber-500',
      },
      {
        value: 'Churned' as const,
        label: 'Churned',
        count: count('Churned'),
        hint: share('Churned'),
        dot: 'bg-slate-400',
      },
    ];
  });
  protected readonly selectedCount = computed(() => this.selectedCustomers().length);
  protected readonly activeFilters = computed(() => {
    const { query, status, plan } = this.filters();
    const chips: { key: keyof CustomerFilters; label: string }[] = [];
    if (query.trim()) chips.push({ key: 'query', label: `Search: ${query.trim()}` });
    if (status) chips.push({ key: 'status', label: `Status: ${status}` });
    if (plan) chips.push({ key: 'plan', label: `Plan: ${plan}` });
    return chips;
  });

  protected readonly detail = computed(() => {
    const id = this.detailId();
    return id ? (this.customers.customers().find((customer) => customer.id === id) ?? null) : null;
  });
  protected readonly detailOrders = computed(() => {
    const id = this.detailId();
    return this.orders
      .orders()
      .filter((order) => order.customerId === id)
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        status: order.status,
        placedAt: order.placedAt,
        total: orderTotal(order),
      }));
  });

  /** Passed to the form so it can show a loading state until the save completes. */
  protected readonly saveCustomer = async (draft: CustomerDraft): Promise<void> => {
    const editing = this.editing();
    if (editing) {
      await this.customers.update(editing.id, draft);
      this.toast.success('Customer updated', draft.name);
    } else {
      const created = await this.customers.create(draft);
      // Show the new customer at the top of the first page.
      this.filters.set(EMPTY_FILTERS);
      this.table.setSort({ key: 'joined', direction: 'desc' });
      this.table.setPage(1);
      this.toast.success('Customer added', `${created.name} was added to your workspace.`);
    }
  };

  constructor() {
    void this.customers.load();
    void this.orders.load();

    // Back to the first page whenever the filters change.
    effect(() => {
      this.filters();
      untracked(() => this.table.setPage(1));
    });

    // Drop selections that are no longer in the list, for example after a delete.
    effect(() => {
      const ids = this.customers.customers().map((customer) => customer.id);
      untracked(() => this.table.reconcileSelection(ids));
    });

    // Deep links from the command palette.
    effect(() => {
      const id = this.customer();
      if (id) untracked(() => this.openDetail(id));
    });
    effect(() => {
      if (this.new()) untracked(() => this.openForm(null));
    });
  }

  protected asCustomer(row: UiTableRow): Customer {
    return row as unknown as Customer;
  }

  protected sortBy(sort: UiTableSort): void {
    this.table.setSort(sort);
  }

  protected filterStatus(status: CustomerFilters['status']): void {
    this.filters.update((filters) => ({ ...filters, status }));
  }

  protected clearFilter(key: keyof CustomerFilters): void {
    this.filters.update((filters) => ({ ...filters, [key]: '' }));
  }

  protected openDetail(id: string): void {
    this.detailId.set(id);
  }

  protected closeDetail(): void {
    this.detailId.set(null);
    this.clearQueryParams();
  }

  protected openForm(customer: Customer | null): void {
    this.editing.set(customer);
    this.formOpen.set(true);
    this.clearQueryParams();
  }

  protected rowAction({ item }: UiMenuSelection, customer: Customer): void {
    if (item.value === 'view') this.openDetail(customer.id);
    else if (item.value === 'edit') this.openForm(customer);
    else void this.confirmDelete([customer]);
  }

  protected async confirmDelete(customers: readonly Customer[]): Promise<void> {
    const many = customers.length > 1;
    const result = await this.confirmation.confirm({
      title: many ? `Delete ${customers.length} customers?` : `Delete ${customers[0].name}?`,
      message: 'Their profile and notes will be removed. Orders are kept for your records.',
      confirmLabel: 'Delete',
      intent: 'danger',
    });
    if (!result.confirmed) return;
    await this.customers.remove(customers.map((customer) => customer.id));
    if (customers.some((customer) => customer.id === this.detailId())) this.closeDetail();
    this.toast.success(many ? `${customers.length} customers deleted` : 'Customer deleted');
  }

  protected exportCsv(customers: readonly Customer[]): void {
    downloadCsv(
      'northstar-customers.csv',
      [
        'ID',
        'Name',
        'Email',
        'Company',
        'Plan',
        'Status',
        'City',
        'Country',
        'Lifetime spend',
        'Joined',
      ],
      customers.map((c) => [
        c.id,
        c.name,
        c.email,
        c.company,
        c.plan,
        c.status,
        c.city,
        c.country,
        c.spent,
        c.joined,
      ]),
    );
    this.toast.success('Export ready', `${customers.length} customers exported to CSV.`);
  }

  private clearQueryParams(): void {
    if (this.customer() || this.new()) {
      void this.router.navigate([], {
        queryParams: { customer: null, new: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }
}
