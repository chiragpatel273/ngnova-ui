// Deterministic demo data. Replace the services in this folder with HTTP calls to connect a real
// backend; nothing outside `core/` reads this file directly.
import { isoDate } from './dates';
import type {
  ActivityItem,
  Customer,
  CustomerPlan,
  CustomerStatus,
  DailyRevenue,
  Order,
  OrderEvent,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  TeamMember,
} from './models';

/** Small seeded PRNG so every visitor sees the same numbers. */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(20261116);
const pick = <T>(values: readonly T[]): T => values[Math.floor(random() * values.length)];
const between = (min: number, max: number): number => min + Math.floor(random() * (max - min + 1));

const DAY = 24 * 60 * 60 * 1000;
const today = new Date();
today.setHours(0, 0, 0, 0);

function daysAgo(days: number, hours = 9, minutes = 0): Date {
  const date = new Date(today.getTime() - days * DAY);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const FIRST_NAMES = [
  'Ava',
  'Liam',
  'Sofia',
  'Noah',
  'Mia',
  'Ethan',
  'Zara',
  'Lucas',
  'Aisha',
  'Mateo',
  'Hana',
  'Omar',
  'Chloe',
  'Kenji',
  'Priya',
  'Leo',
  'Nora',
  'Diego',
  'Elena',
  'Kofi',
  'Ines',
  'Arjun',
  'Freya',
  'Yusuf',
];
const LAST_NAMES = [
  'Patel',
  'Kim',
  'Garcia',
  'Okafor',
  'Novak',
  'Rossi',
  'Chen',
  'Haddad',
  'Silva',
  'Andersen',
  'Tanaka',
  'Mensah',
  'Dubois',
  'Kowalski',
  'Ibrahim',
  'Larsen',
  'Moreau',
  'Singh',
  'Costa',
  'Weber',
];
const COMPANIES = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella Labs',
  'Stark Retail',
  'Wayne Logistics',
  'Hooli',
  'Pied Piper',
  'Vandelay Imports',
  'Soylent Foods',
  'Cyberdyne',
  'Tyrell Systems',
  'Wonka Goods',
  'Gringotts Finance',
  'Oscorp Health',
  'Monarch Travel',
];
const LOCATIONS: readonly (readonly [string, string])[] = [
  ['San Francisco', 'United States'],
  ['New York', 'United States'],
  ['Toronto', 'Canada'],
  ['London', 'United Kingdom'],
  ['Berlin', 'Germany'],
  ['Paris', 'France'],
  ['Amsterdam', 'Netherlands'],
  ['Dubai', 'United Arab Emirates'],
  ['Bengaluru', 'India'],
  ['Singapore', 'Singapore'],
  ['Tokyo', 'Japan'],
  ['Sydney', 'Australia'],
  ['São Paulo', 'Brazil'],
  ['Lagos', 'Nigeria'],
];
const PLANS: readonly CustomerPlan[] = [
  'Free',
  'Starter',
  'Starter',
  'Pro',
  'Pro',
  'Pro',
  'Enterprise',
];
const STATUSES: readonly CustomerStatus[] = [
  'Active',
  'Active',
  'Active',
  'Active',
  'Active',
  'Trial',
  'Trial',
  'Churned',
];
const PLAN_SPEND: Record<CustomerPlan, readonly [number, number]> = {
  Free: [0, 0],
  Starter: [180, 1400],
  Pro: [1200, 9600],
  Enterprise: [12000, 64000],
};

export const MOCK_CUSTOMERS: readonly Customer[] = Array.from({ length: 48 }, (_, index) => {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = pick(LAST_NAMES);
  const company = pick(COMPANIES);
  const plan = pick(PLANS);
  const [city, country] = pick(LOCATIONS);
  const [minSpend, maxSpend] = PLAN_SPEND[plan];
  const domain = company.toLowerCase().replace(/[^a-z]+/g, '');
  return {
    id: `CUS-${1001 + index}`,
    name: `${first} ${last}`,
    email: `${first}.${last}@${domain}.com`.toLowerCase(),
    company,
    plan,
    status: plan === 'Free' ? pick<CustomerStatus>(['Trial', 'Churned', 'Active']) : pick(STATUSES),
    city,
    country,
    spent: between(minSpend, maxSpend),
    joined: isoDate(daysAgo(between(3, 720))),
    notes: '',
  };
});

export const MOCK_PRODUCTS: readonly Product[] = [
  { sku: 'NS-ANL-01', name: 'Analytics add-on', price: 49 },
  { sku: 'NS-SEAT-10', name: 'Team seats (10)', price: 120 },
  { sku: 'NS-API-50', name: 'API calls (50k)', price: 39 },
  { sku: 'NS-SUP-PR', name: 'Priority support', price: 199 },
  { sku: 'NS-STO-1T', name: 'Storage (1 TB)', price: 29 },
  { sku: 'NS-SSO-01', name: 'Single sign-on', price: 249 },
  { sku: 'NS-ONB-01', name: 'Onboarding workshop', price: 890 },
  { sku: 'NS-AUD-01', name: 'Audit log retention', price: 79 },
];

const ORDER_STATUSES: readonly OrderStatus[] = [
  'Delivered',
  'Delivered',
  'Delivered',
  'Shipped',
  'Shipped',
  'Processing',
  'Processing',
  'Pending',
  'Refunded',
];
const PAYMENT_METHODS: readonly PaymentMethod[] = [
  'Visa',
  'Visa',
  'Mastercard',
  'PayPal',
  'Bank transfer',
];

/** Builds the event history an order with the given status would have. */
export function orderEvents(
  status: OrderStatus,
  placedAt: Date,
  payment: PaymentMethod,
): OrderEvent[] {
  const at = (hours: number): string =>
    new Date(placedAt.getTime() + hours * 60 * 60 * 1000).toISOString();
  const events: OrderEvent[] = [
    { at: at(0), title: 'Order placed', detail: 'The customer completed checkout.' },
  ];
  if (status === 'Pending') return events;
  events.push({ at: at(0.2), title: 'Payment captured', detail: `Paid with ${payment}.` });
  if (status === 'Processing') return events;
  events.push({ at: at(20), title: 'Packed', detail: 'Items were picked and packed.' });
  if (status === 'Refunded') {
    events.push({
      at: at(30),
      title: 'Refunded',
      detail: 'The full amount was returned to the customer.',
    });
    return events;
  }
  events.push({ at: at(26), title: 'Shipped', detail: 'Handed to the carrier with tracking.' });
  if (status === 'Shipped') return events;
  events.push({ at: at(74), title: 'Delivered', detail: 'Signed for by the customer.' });
  return events;
}

export const MOCK_ORDERS: readonly Order[] = Array.from({ length: 64 }, (_, index) => {
  const age = Math.floor((index * 45) / 64);
  const placedAt = daysAgo(age, between(7, 21), between(0, 59));
  // Recent orders are still in progress; older ones have been delivered or refunded.
  const status: OrderStatus =
    age < 1
      ? pick<OrderStatus>(['Pending', 'Processing'])
      : age < 4
        ? pick<OrderStatus>(['Processing', 'Shipped', 'Shipped'])
        : pick(ORDER_STATUSES.filter((value) => value !== 'Pending' && value !== 'Processing'));
  const payment = pick(PAYMENT_METHODS);
  const items: OrderItem[] = [];
  const lineCount = between(1, 3);
  const products = [...MOCK_PRODUCTS].sort(() => random() - 0.5).slice(0, lineCount);
  for (const product of products) items.push({ product, quantity: between(1, 4) });
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return {
    id: `NS-${4120 - index}`,
    customerId: MOCK_CUSTOMERS[between(0, MOCK_CUSTOMERS.length - 1)].id,
    placedAt: placedAt.toISOString(),
    status,
    payment,
    items,
    shipping: subtotal > 500 ? 0 : 12,
    tax: Math.round(subtotal * 0.08 * 100) / 100,
    events: orderEvents(status, placedAt, payment),
  };
});

/** 180 days of daily metrics, oldest first, with a weekly rhythm and steady growth. */
export const MOCK_DAILY_REVENUE: readonly DailyRevenue[] = Array.from(
  { length: 180 },
  (_, index) => {
    const daysBack = 179 - index;
    const date = daysAgo(daysBack);
    const weekday = date.getDay();
    const weekend = weekday === 0 || weekday === 6;
    const growth = 1 + index / 260;
    const base = (weekend ? 5200 : 8400) * growth;
    const revenue = Math.round(base * (0.82 + random() * 0.36));
    const visitors = Math.round((weekend ? 300 : 520) * growth * (0.85 + random() * 0.3));
    return {
      date: isoDate(date),
      revenue,
      orders: Math.round(revenue / between(900, 1150)),
      visitors,
      signups: Math.round(visitors * (0.02 + random() * 0.015)),
    };
  },
);

export const MOCK_TEAM: readonly TeamMember[] = [
  { id: 'USR-1', name: 'Maya Chen', email: 'maya@northstar.app', role: 'Owner', status: 'Active' },
  {
    id: 'USR-2',
    name: 'Daniel Okafor',
    email: 'daniel@northstar.app',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'USR-3',
    name: 'Lena Novak',
    email: 'lena@northstar.app',
    role: 'Editor',
    status: 'Active',
  },
  {
    id: 'USR-4',
    name: 'Rahul Singh',
    email: 'rahul@northstar.app',
    role: 'Viewer',
    status: 'Active',
  },
  {
    id: 'USR-5',
    name: 'Sara Haddad',
    email: 'sara@northstar.app',
    role: 'Editor',
    status: 'Invited',
  },
];

export function buildActivity(
  customers: readonly Customer[],
  orders: readonly Order[],
): ActivityItem[] {
  const customerName = (id: string): string =>
    customers.find((customer) => customer.id === id)?.name ?? 'A customer';
  const recentOrders = orders.slice(0, 3).map<ActivityItem>((order) => ({
    id: `act-${order.id}`,
    at: order.placedAt,
    kind: 'order',
    title: `New order ${order.id}`,
    detail: `${customerName(order.customerId)} · ${order.items.length} item${order.items.length === 1 ? '' : 's'}`,
    link: `/orders/${order.id}`,
  }));
  const refund = orders.find((order) => order.status === 'Refunded');
  const newest = [...customers].sort((a, b) => b.joined.localeCompare(a.joined))[0];
  const items: ActivityItem[] = [...recentOrders];
  if (newest) {
    items.push({
      id: `act-${newest.id}`,
      at: daysAgo(0, 8, 12).toISOString(),
      kind: 'customer',
      title: 'New customer',
      detail: `${newest.name} joined on the ${newest.plan} plan`,
      link: '/customers',
    });
  }
  if (refund) {
    items.push({
      id: `act-refund-${refund.id}`,
      at: daysAgo(1, 16, 40).toISOString(),
      kind: 'refund',
      title: `Refund issued for ${refund.id}`,
      detail: customerName(refund.customerId),
      link: `/orders/${refund.id}`,
    });
  }
  items.push({
    id: 'act-alert',
    at: daysAgo(1, 11, 5).toISOString(),
    kind: 'alert',
    title: 'Conversion dipped below target',
    detail: 'Checkout conversion fell 0.3 points week over week',
  });
  return items.sort((a, b) => b.at.localeCompare(a.at));
}
