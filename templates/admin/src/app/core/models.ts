export type CustomerPlan = 'Free' | 'Starter' | 'Pro' | 'Enterprise';
export type CustomerStatus = 'Active' | 'Trial' | 'Churned';

export interface Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly plan: CustomerPlan;
  readonly status: CustomerStatus;
  readonly city: string;
  readonly country: string;
  /** Lifetime spend in US dollars. */
  readonly spent: number;
  /** ISO date (yyyy-mm-dd). */
  readonly joined: string;
  readonly notes: string;
}

export type CustomerDraft = Omit<Customer, 'id' | 'spent' | 'joined'>;

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Refunded';
export type PaymentMethod = 'Visa' | 'Mastercard' | 'PayPal' | 'Bank transfer';

export interface Product {
  readonly sku: string;
  readonly name: string;
  readonly price: number;
}

export interface OrderItem {
  readonly product: Product;
  readonly quantity: number;
}

export interface OrderEvent {
  /** ISO timestamp. */
  readonly at: string;
  readonly title: string;
  readonly detail: string;
}

export interface Order {
  readonly id: string;
  readonly customerId: string;
  /** ISO timestamp. */
  readonly placedAt: string;
  readonly status: OrderStatus;
  readonly payment: PaymentMethod;
  readonly items: readonly OrderItem[];
  readonly shipping: number;
  readonly tax: number;
  readonly events: readonly OrderEvent[];
}

export interface DailyRevenue {
  /** ISO date (yyyy-mm-dd). */
  readonly date: string;
  readonly revenue: number;
  readonly orders: number;
  readonly visitors: number;
  readonly signups: number;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  readonly status: 'Active' | 'Invited';
}

export interface ActivityItem {
  readonly id: string;
  /** ISO timestamp. */
  readonly at: string;
  readonly kind: 'order' | 'customer' | 'refund' | 'alert';
  readonly title: string;
  readonly detail: string;
  readonly link?: string;
}

export function orderSubtotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function orderTotal(order: Order): number {
  return orderSubtotal(order) + order.shipping + order.tax;
}

export function orderItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}
