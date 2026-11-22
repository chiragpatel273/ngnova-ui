import type { UiTagVariant } from '@ngnova/ui/tag';

import type { CustomerPlan, CustomerStatus, OrderStatus } from '../core/models';

export const ORDER_STATUS_VARIANT: Record<OrderStatus, UiTagVariant> = {
  Pending: 'warning',
  Processing: 'info',
  Shipped: 'info',
  Delivered: 'success',
  Refunded: 'danger',
};

export const CUSTOMER_STATUS_VARIANT: Record<CustomerStatus, UiTagVariant> = {
  Active: 'success',
  Trial: 'warning',
  Churned: 'default',
};

export const PLAN_VARIANT: Record<CustomerPlan, UiTagVariant> = {
  Free: 'default',
  Starter: 'default',
  Pro: 'info',
  Enterprise: 'success',
};
