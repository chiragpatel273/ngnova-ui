import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-in',
    title: 'Sign in',
    loadComponent: () => import('./pages/sign-in/sign-in').then((m) => m.SignInPage),
  },
  {
    path: '',
    // The shell is lazy too, so the sign-in page loads without it.
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        title: 'Overview',
        loadComponent: () => import('./pages/overview/overview').then((m) => m.OverviewPage),
      },
      {
        path: 'customers',
        title: 'Customers',
        loadComponent: () => import('./pages/customers/customers').then((m) => m.CustomersPage),
      },
      {
        path: 'orders',
        title: 'Orders',
        loadComponent: () => import('./pages/orders/orders').then((m) => m.OrdersPage),
      },
      {
        path: 'orders/:id',
        title: 'Order details',
        loadComponent: () => import('./pages/orders/order-detail').then((m) => m.OrderDetailPage),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.SettingsPage),
      },
      {
        path: '**',
        title: 'Page not found',
        loadComponent: () => import('./pages/not-found').then((m) => m.NotFoundPage),
      },
    ],
  },
];
