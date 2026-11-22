import { TestBed } from '@angular/core/testing';

import { API_LATENCY } from './api-latency';
import { CustomersService, filterCustomers } from './customers.service';
import { MOCK_CUSTOMERS } from './mock-data';

describe('filterCustomers', () => {
  it('matches the query against name, email, company, and id', () => {
    const [first] = MOCK_CUSTOMERS;
    const byName = filterCustomers(MOCK_CUSTOMERS, {
      query: first.name.toUpperCase(),
      status: '',
      plan: '',
    });
    expect(byName.map((customer) => customer.id)).toContain(first.id);
    expect(filterCustomers(MOCK_CUSTOMERS, { query: first.id, status: '', plan: '' })).toEqual([
      first,
    ]);
  });

  it('combines status and plan filters', () => {
    const result = filterCustomers(MOCK_CUSTOMERS, { query: '', status: 'Active', plan: 'Pro' });
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((customer) => customer.status === 'Active' && customer.plan === 'Pro'),
    ).toBe(true);
  });
});

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [{ provide: API_LATENCY, useValue: 0 }] });
    service = TestBed.inject(CustomersService);
    await service.load();
  });

  it('adds new customers to the top with the next id', async () => {
    const created = await service.create({
      name: 'Test Person',
      email: 'test@example.com',
      company: 'Example Inc',
      plan: 'Pro',
      status: 'Trial',
      city: '',
      country: '',
      notes: '',
    });
    expect(created.id).toBe(`CUS-${1001 + MOCK_CUSTOMERS.length}`);
    expect(service.customers()[0]).toEqual(created);
    expect(service.count()).toBe(MOCK_CUSTOMERS.length + 1);
  });

  it('removes customers by id', async () => {
    const ids = service
      .customers()
      .slice(0, 2)
      .map((customer) => customer.id);
    await service.remove(ids);
    expect(service.customers().some((customer) => ids.includes(customer.id))).toBe(false);
  });
});
