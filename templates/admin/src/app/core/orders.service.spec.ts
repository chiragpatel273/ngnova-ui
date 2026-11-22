import { TestBed } from '@angular/core/testing';

import { API_LATENCY } from './api-latency';
import { canRefund, canShip, OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [{ provide: API_LATENCY, useValue: 0 }] });
    service = TestBed.inject(OrdersService);
    await service.load();
  });

  it('ships only orders that are pending or processing', async () => {
    const shippable = service.orders().find(canShip);
    const delivered = service.orders().find((order) => order.status === 'Delivered');
    if (!shippable || !delivered) throw new Error('Mock data needs open and delivered orders.');

    const changed = await service.ship([shippable.id, delivered.id]);

    expect(changed).toBe(1);
    expect(service.find(shippable.id)?.status).toBe('Shipped');
    expect(service.find(shippable.id)?.events.at(-1)?.title).toBe('Shipped');
    expect(service.find(delivered.id)?.status).toBe('Delivered');
  });

  it('refunds paid orders and records the event', async () => {
    const order = service.orders().find(canRefund);
    if (!order) throw new Error('Mock data needs a refundable order.');
    await service.refund(order.id);
    const refunded = service.find(order.id);
    expect(refunded?.status).toBe('Refunded');
    expect(refunded && canRefund(refunded)).toBe(false);
    expect(refunded?.events.at(-1)?.title).toBe('Refunded');
  });
});
