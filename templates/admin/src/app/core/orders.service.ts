import { computed, inject, Injectable, signal } from '@angular/core';

import { API_LATENCY, wait } from './api-latency';
import { MOCK_ORDERS } from './mock-data';
import type { Order, OrderEvent, OrderStatus } from './models';

/** Orders that can still be shipped. */
export function canShip(order: Order): boolean {
  return order.status === 'Pending' || order.status === 'Processing';
}

export function canRefund(order: Order): boolean {
  return order.status !== 'Refunded' && order.status !== 'Pending';
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly latency = inject(API_LATENCY);
  private readonly state = signal<readonly Order[]>([]);
  private readonly loadingState = signal(true);
  private loaded: Promise<void> | null = null;

  readonly orders = this.state.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly openCount = computed(() => this.state().filter(canShip).length);

  load(): Promise<void> {
    this.loaded ??= wait(this.latency).then(() => {
      this.state.set(MOCK_ORDERS);
      this.loadingState.set(false);
    });
    return this.loaded;
  }

  find(id: string): Order | undefined {
    return this.state().find((order) => order.id === id);
  }

  /** Marks every shippable order in `ids` as shipped and returns how many changed. */
  async ship(ids: readonly string[]): Promise<number> {
    await wait(this.latency);
    const targets = new Set(ids);
    let changed = 0;
    this.state.update((orders) =>
      orders.map((order) => {
        if (!targets.has(order.id) || !canShip(order)) return order;
        changed += 1;
        return this.withStatus(order, 'Shipped', {
          title: 'Shipped',
          detail: 'Marked as shipped from the admin.',
        });
      }),
    );
    return changed;
  }

  async refund(id: string): Promise<void> {
    await wait(this.latency);
    this.state.update((orders) =>
      orders.map((order) =>
        order.id === id && canRefund(order)
          ? this.withStatus(order, 'Refunded', {
              title: 'Refunded',
              detail: 'The full amount was returned to the customer.',
            })
          : order,
      ),
    );
  }

  private withStatus(order: Order, status: OrderStatus, event: Omit<OrderEvent, 'at'>): Order {
    return {
      ...order,
      status,
      events: [...order.events, { ...event, at: new Date().toISOString() }],
    };
  }
}
