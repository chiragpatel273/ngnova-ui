import { computed, inject, Injectable, signal } from '@angular/core';

import { API_LATENCY, wait } from './api-latency';
import { isoDate } from './dates';
import { MOCK_CUSTOMERS } from './mock-data';
import type { Customer, CustomerDraft, CustomerPlan, CustomerStatus } from './models';

export interface CustomerFilters {
  readonly query: string;
  readonly status: CustomerStatus | '';
  readonly plan: CustomerPlan | '';
}

export function filterCustomers(
  customers: readonly Customer[],
  filters: CustomerFilters,
): Customer[] {
  const query = filters.query.trim().toLowerCase();
  return customers.filter(
    (customer) =>
      (!filters.status || customer.status === filters.status) &&
      (!filters.plan || customer.plan === filters.plan) &&
      (!query ||
        [customer.name, customer.email, customer.company, customer.id].some((value) =>
          value.toLowerCase().includes(query),
        )),
  );
}

/**
 * Customer store. Methods are async so swapping the mock for HttpClient calls keeps every caller
 * unchanged.
 */
@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly latency = inject(API_LATENCY);
  private readonly state = signal<readonly Customer[]>([]);
  private readonly loadingState = signal(true);
  private loaded: Promise<void> | null = null;

  readonly customers = this.state.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly count = computed(() => this.state().length);

  /** Loads customers once; later calls reuse the first request. */
  load(): Promise<void> {
    this.loaded ??= wait(this.latency).then(() => {
      this.state.set(MOCK_CUSTOMERS);
      this.loadingState.set(false);
    });
    return this.loaded;
  }

  find(id: string): Customer | undefined {
    return this.state().find((customer) => customer.id === id);
  }

  async create(draft: CustomerDraft): Promise<Customer> {
    await wait(this.latency);
    const next =
      Math.max(1000, ...this.state().map((customer) => Number(customer.id.slice(4)))) + 1;
    const customer: Customer = {
      ...draft,
      id: `CUS-${next}`,
      spent: 0,
      joined: isoDate(new Date()),
    };
    this.state.update((customers) => [customer, ...customers]);
    return customer;
  }

  async update(id: string, draft: CustomerDraft): Promise<Customer> {
    await wait(this.latency);
    const current = this.find(id);
    if (!current) throw new Error(`Customer ${id} does not exist.`);
    const customer: Customer = { ...current, ...draft };
    this.state.update((customers) => customers.map((item) => (item.id === id ? customer : item)));
    return customer;
  }

  async remove(ids: readonly string[]): Promise<void> {
    await wait(this.latency);
    const removed = new Set(ids);
    this.state.update((customers) => customers.filter((customer) => !removed.has(customer.id)));
  }
}
