import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCreditCard,
  heroEnvelope,
  heroMapPin,
  heroPrinter,
  heroReceiptRefund,
  heroTruck,
} from '@ng-icons/heroicons/outline';
import { UiAlertComponent } from '@ngnova/ui/alert';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import {
  UiButtonComponent,
  UiButtonDirective,
  UiButtonIconStartDirective,
} from '@ngnova/ui/button';
import { UiConfirmationService } from '@ngnova/ui/confirmation';
import { UiSkeletonComponent } from '@ngnova/ui/skeleton';
import { UiStepperComponent } from '@ngnova/ui/stepper';
import type { UiStepItem } from '@ngnova/ui/stepper';
import { UiTagComponent } from '@ngnova/ui/tag';
import { UiToastService } from '@ngnova/ui/toast';

import { CustomersService } from '../../core/customers.service';
import type { Order } from '../../core/models';
import { orderSubtotal, orderTotal } from '../../core/models';
import { canRefund, canShip, OrdersService } from '../../core/orders.service';
import { EmptyState } from '../../shared/empty-state';
import { PageHeader } from '../../shared/page-header';
import { ORDER_STATUS_VARIANT } from '../../shared/status';

const FULFILLMENT_STEPS = ['Placed', 'Paid', 'Packed', 'Shipped', 'Delivered'] as const;

/** Index of the current fulfillment step for an order. */
function activeStep(order: Order): number {
  switch (order.status) {
    case 'Pending':
      return 1;
    case 'Processing':
      return 2;
    case 'Shipped':
      return 4;
    case 'Delivered':
      return 4;
    case 'Refunded':
      return 3;
  }
}

@Component({
  selector: 'app-order-detail-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    EmptyState,
    NgIcon,
    PageHeader,
    RouterLink,
    UiAlertComponent,
    UiAvatarComponent,
    UiButtonComponent,
    UiButtonDirective,
    UiButtonIconStartDirective,
    UiSkeletonComponent,
    UiStepperComponent,
    UiTagComponent,
  ],
  viewProviders: [
    provideIcons({
      heroCreditCard,
      heroEnvelope,
      heroMapPin,
      heroPrinter,
      heroReceiptRefund,
      heroTruck,
    }),
  ],
  template: `
    @if (orders.loading()) {
      <ui-skeleton shape="text" width="12rem" height="1.75rem" />
      <ui-skeleton class="mt-6 block" shape="rect" height="6rem" />
      <ui-skeleton class="mt-6 block" shape="rect" height="18rem" />
    } @else if (order(); as order) {
      <app-page-header
        [title]="'Order ' + order.id"
        [description]="placedLabel()"
        [crumbs]="[{ label: 'Orders', link: '/orders' }, { label: order.id }]"
      >
        <ng-container actions>
          <ui-tag [variant]="statusVariant[order.status]">{{ order.status }}</ui-tag>
          <ui-button variant="ghost" size="sm" (pressed)="print()">
            <ng-icon uiButtonIconStart name="heroPrinter" size="16" aria-hidden="true" />
            Print
          </ui-button>
          @if (refundable()) {
            <ui-button variant="outline" size="sm" (pressed)="refund(order)">
              <ng-icon uiButtonIconStart name="heroReceiptRefund" size="16" aria-hidden="true" />
              Refund
            </ui-button>
          }
          @if (shippable()) {
            <ui-button
              size="sm"
              [loading]="busy()"
              loadingLabel="Updating order"
              (pressed)="ship(order)"
            >
              <ng-icon uiButtonIconStart name="heroTruck" size="16" aria-hidden="true" />
              Mark as shipped
            </ui-button>
          }
        </ng-container>
      </app-page-header>

      @if (order.status === 'Refunded') {
        <ui-alert class="mt-6 block" variant="danger" title="This order was refunded">
          {{ total() | currency: 'USD' }} was returned to the customer's
          {{ order.payment }} account.
        </ui-alert>
      }

      <section
        class="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        aria-label="Fulfillment progress"
      >
        <ui-stepper
          ariaLabel="Fulfillment progress"
          [interactive]="false"
          [steps]="steps()"
          [active]="steps()[active()].value"
        />
      </section>

      <div class="mt-6 grid gap-6 lg:grid-cols-3">
        <div class="grid content-start gap-6 lg:col-span-2">
          <section
            class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            aria-labelledby="items-heading"
          >
            <h2
              id="items-heading"
              class="px-5 pt-5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              Items
            </h2>
            <ul class="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              @for (item of order.items; track item.product.sku) {
                <li class="flex items-center gap-4 px-5 py-3">
                  <span
                    class="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    aria-hidden="true"
                    >{{ item.product.name.slice(0, 2).toUpperCase() }}</span
                  >
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm font-medium text-slate-900 dark:text-white">{{
                      item.product.name
                    }}</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">{{
                      item.product.sku
                    }}</span>
                  </span>
                  <span class="text-sm text-slate-500 tabular-nums dark:text-slate-400"
                    >{{ item.quantity }} × {{ item.product.price | currency: 'USD' }}</span
                  >
                  <span
                    class="w-24 text-end text-sm font-medium tabular-nums text-slate-900 dark:text-white"
                    >{{ item.quantity * item.product.price | currency: 'USD' }}</span
                  >
                </li>
              }
            </ul>
            <dl
              class="grid gap-2 border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-800"
            >
              <div class="flex justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Subtotal</dt>
                <dd class="tabular-nums">{{ subtotal() | currency: 'USD' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Shipping</dt>
                <dd class="tabular-nums">
                  {{ order.shipping ? (order.shipping | currency: 'USD') : 'Free' }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Tax</dt>
                <dd class="tabular-nums">{{ order.tax | currency: 'USD' }}</dd>
              </div>
              <div
                class="mt-1 flex justify-between border-t border-slate-200 pt-3 text-base font-semibold dark:border-slate-800"
              >
                <dt>Total</dt>
                <dd class="tabular-nums">{{ total() | currency: 'USD' }}</dd>
              </div>
            </dl>
          </section>

          <section
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            aria-labelledby="timeline-heading"
          >
            <h2 id="timeline-heading" class="text-sm font-semibold text-slate-900 dark:text-white">
              Timeline
            </h2>
            <ol class="mt-4">
              @for (event of timeline(); track event.at + event.title; let last = $last) {
                <li class="relative ps-7" [class.pb-5]="!last">
                  @if (!last) {
                    <span
                      class="absolute start-[5px] top-4 bottom-0 w-px bg-slate-200 dark:bg-slate-700"
                      aria-hidden="true"
                    ></span>
                  }
                  <span
                    class="absolute start-0 top-1.5 size-[11px] rounded-full ring-4 ring-white dark:ring-slate-900"
                    [class]="
                      $first ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-600'
                    "
                    aria-hidden="true"
                  ></span>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">
                    {{ event.title }}
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ event.detail }}</p>
                  <p class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {{ event.at | date: 'MMM d, y, h:mm a' }}
                  </p>
                </li>
              }
            </ol>
          </section>
        </div>

        <aside class="grid content-start gap-6" aria-label="Order information">
          <section
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            aria-labelledby="customer-heading"
          >
            <h2 id="customer-heading" class="text-sm font-semibold text-slate-900 dark:text-white">
              Customer
            </h2>
            @if (customer(); as customer) {
              <a
                [routerLink]="['/customers']"
                [queryParams]="{ customer: customer.id }"
                class="mt-4 flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <ui-avatar size="md" [label]="customer.name" />
                <span class="min-w-0">
                  <span
                    class="block truncate text-sm font-medium text-slate-900 hover:underline dark:text-white"
                    >{{ customer.name }}</span
                  >
                  <span class="block truncate text-xs text-slate-500 dark:text-slate-400">{{
                    customer.company
                  }}</span>
                </span>
              </a>
              <ul class="mt-4 grid gap-3 text-sm">
                <li class="flex items-center gap-3">
                  <ng-icon
                    name="heroEnvelope"
                    size="16"
                    class="shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <a
                    class="truncate text-blue-600 hover:underline dark:text-blue-400"
                    [href]="'mailto:' + customer.email"
                    >{{ customer.email }}</a
                  >
                </li>
                <li class="flex items-start gap-3">
                  <ng-icon
                    name="heroMapPin"
                    size="16"
                    class="mt-0.5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <span
                    >{{ customer.company }}<br />{{ customer.city }}, {{ customer.country }}</span
                  >
                </li>
              </ul>
            } @else {
              <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">
                This customer was deleted.
              </p>
            }
          </section>

          <section
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            aria-labelledby="payment-heading"
          >
            <h2 id="payment-heading" class="text-sm font-semibold text-slate-900 dark:text-white">
              Payment
            </h2>
            <p class="mt-4 flex items-center gap-3 text-sm">
              <ng-icon name="heroCreditCard" size="16" class="text-slate-400" aria-hidden="true" />
              {{ order.payment }}
            </p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {{
                order.status === 'Pending'
                  ? 'Awaiting payment'
                  : order.status === 'Refunded'
                    ? 'Refunded'
                    : 'Paid in full'
              }}
            </p>
          </section>
        </aside>
      </div>
    } @else {
      <app-empty-state
        title="Order not found"
        [message]="'There is no order with the number ' + id() + '.'"
      >
        <a uiButton routerLink="/orders">Back to orders</a>
      </app-empty-state>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailPage {
  protected readonly orders = inject(OrdersService);
  private readonly customers = inject(CustomersService);
  private readonly confirmation = inject(UiConfirmationService);
  private readonly toast = inject(UiToastService);

  /** Bound from the `:id` route parameter. */
  readonly id = input.required<string>();

  private readonly locale = inject(LOCALE_ID);

  protected readonly statusVariant = ORDER_STATUS_VARIANT;
  protected readonly busy = signal(false);

  protected readonly order = computed(() =>
    this.orders.orders().find((order) => order.id === this.id()),
  );
  protected readonly placedLabel = computed(() => {
    const order = this.order();
    return order
      ? `Placed ${formatDate(order.placedAt, "EEEE, MMMM d, y 'at' h:mm a", this.locale)}`
      : '';
  });
  protected readonly customer = computed(() => {
    const order = this.order();
    return order
      ? this.customers.customers().find((customer) => customer.id === order.customerId)
      : undefined;
  });
  protected readonly subtotal = computed(() => {
    const order = this.order();
    return order ? orderSubtotal(order) : 0;
  });
  protected readonly total = computed(() => {
    const order = this.order();
    return order ? orderTotal(order) : 0;
  });
  protected readonly shippable = computed(() => {
    const order = this.order();
    return !!order && canShip(order);
  });
  protected readonly refundable = computed(() => {
    const order = this.order();
    return !!order && canRefund(order);
  });
  protected readonly timeline = computed(() => [...(this.order()?.events ?? [])].reverse());
  protected readonly active = computed(() => {
    const order = this.order();
    return order ? activeStep(order) : 0;
  });
  protected readonly steps = computed<UiStepItem[]>(() => {
    const order = this.order();
    const active = this.active();
    const delivered = order?.status === 'Delivered';
    const refunded = order?.status === 'Refunded';
    return FULFILLMENT_STEPS.map((label, index) => ({
      value: label.toLowerCase(),
      label: refunded && index === 3 ? 'Refunded' : label,
      completed: index < active || (delivered && index === active),
      error: refunded && index === 3,
      disabled: refunded && index > 3,
    }));
  });

  constructor() {
    void this.orders.load();
    void this.customers.load();
  }

  protected print(): void {
    window.print();
  }

  protected async ship(order: Order): Promise<void> {
    this.busy.set(true);
    try {
      await this.orders.ship([order.id]);
      this.toast.success(
        `Order ${order.id} marked as shipped`,
        'The customer will get a tracking email.',
      );
    } finally {
      this.busy.set(false);
    }
  }

  protected async refund(order: Order): Promise<void> {
    const result = await this.confirmation.confirm({
      title: `Refund order ${order.id}?`,
      message: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(orderTotal(order))} will be returned to the customer. This cannot be undone.`,
      confirmLabel: 'Refund order',
      intent: 'danger',
      requireText: order.id,
    });
    if (!result.confirmed) return;
    await this.orders.refund(order.id);
    this.toast.success(`Order ${order.id} refunded`);
  }
}
