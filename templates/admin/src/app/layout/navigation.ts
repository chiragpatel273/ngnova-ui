export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  /** Match the path exactly; used for the root route. */
  readonly exact?: boolean;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

export const NAVIGATION: readonly NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview', path: '/', icon: 'heroHome', exact: true },
      { label: 'Customers', path: '/customers', icon: 'heroUsers' },
      { label: 'Orders', path: '/orders', icon: 'heroShoppingBag' },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Settings', path: '/settings', icon: 'heroCog6Tooth' }],
  },
];
