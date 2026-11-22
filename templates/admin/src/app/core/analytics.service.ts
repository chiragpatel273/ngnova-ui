import { computed, Injectable, signal } from '@angular/core';

import { MOCK_DAILY_REVENUE, MOCK_PRODUCTS } from './mock-data';
import type { DailyRevenue } from './models';

export type AnalyticsRange = 7 | 30 | 90;

/** Share of revenue per product SKU in the mock data. */
const PRODUCT_SHARES: Record<string, number> = {
  'NS-SSO-01': 0.24,
  'NS-ONB-01': 0.19,
  'NS-SUP-PR': 0.16,
  'NS-SEAT-10': 0.14,
  'NS-AUD-01': 0.1,
  'NS-ANL-01': 0.08,
};

export interface Kpi {
  readonly current: number;
  readonly previous: number;
  /** Relative change, for example 0.128 for +12.8%. */
  readonly change: number;
}

function kpi(current: number, previous: number): Kpi {
  return { current, previous, change: previous ? (current - previous) / previous : 0 };
}

function sum(days: readonly DailyRevenue[], key: keyof Omit<DailyRevenue, 'date'>): number {
  return days.reduce((total, day) => total + day[key], 0);
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  readonly range = signal<AnalyticsRange>(30);

  /** The selected range, oldest day first. */
  readonly current = computed(() => MOCK_DAILY_REVENUE.slice(-this.range()));
  /** The range immediately before the current one, for comparisons. */
  readonly previous = computed(() => MOCK_DAILY_REVENUE.slice(-this.range() * 2, -this.range()));

  readonly revenue = computed(() =>
    kpi(sum(this.current(), 'revenue'), sum(this.previous(), 'revenue')),
  );
  readonly orders = computed(() =>
    kpi(sum(this.current(), 'orders'), sum(this.previous(), 'orders')),
  );
  readonly signups = computed(() =>
    kpi(sum(this.current(), 'signups'), sum(this.previous(), 'signups')),
  );
  readonly conversion = computed(() =>
    kpi(
      sum(this.current(), 'orders') / Math.max(1, sum(this.current(), 'visitors')),
      sum(this.previous(), 'orders') / Math.max(1, sum(this.previous(), 'visitors')),
    ),
  );

  /** Revenue over the last 90 days, used for the quarterly goal. */
  readonly quarterRevenue = sum(MOCK_DAILY_REVENUE.slice(-90), 'revenue');

  /** Best-selling products for the current range, highest revenue first. */
  readonly topProducts = computed(() => {
    const total = this.revenue().current;
    return MOCK_PRODUCTS.filter((product) => PRODUCT_SHARES[product.sku])
      .map((product) => {
        const revenue = Math.round(total * PRODUCT_SHARES[product.sku]);
        return { ...product, revenue, units: Math.round(revenue / product.price) };
      })
      .sort((a, b) => b.revenue - a.revenue);
  });

  /** Revenue split by acquisition channel for the current range. */
  readonly channels = computed(() => {
    const total = this.revenue().current;
    return [
      { name: 'Direct', share: 0.38 },
      { name: 'Organic search', share: 0.27 },
      { name: 'Partners', share: 0.19 },
      { name: 'Paid social', share: 0.1 },
      { name: 'Email', share: 0.06 },
    ].map((channel) => ({ ...channel, revenue: Math.round(total * channel.share) }));
  });
}
