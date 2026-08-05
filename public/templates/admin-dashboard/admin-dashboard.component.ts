import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowDownTray,
  heroArrowPath,
  heroArrowTrendingUp,
  heroBars3,
  heroBell,
  heroBolt,
  heroCalendarDays,
  heroChartBar,
  heroCheckCircle,
  heroChevronDown,
  heroChevronLeft,
  heroChevronRight,
  heroClock,
  heroCog6Tooth,
  heroCreditCard,
  heroCube,
  heroEllipsisVertical,
  heroHome,
  heroLifebuoy,
  heroMagnifyingGlass,
  heroMoon,
  heroShoppingBag,
  heroSun,
  heroUserPlus,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import {
  UiButtonComponent,
  UiButtonDirective,
  UiButtonIconStartDirective,
} from '@ngnova/ui/button';
import { UiCardComponent } from '@ngnova/ui/card';
import { UiDrawerComponent, UiDrawerHeaderDirective } from '@ngnova/ui/drawer';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiMenuComponent, UiMenuTriggerDirective } from '@ngnova/ui/menu';
import type { UiMenuItem } from '@ngnova/ui/menu';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiTableCellDirective, UiTableComponent } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow, UiTableRowKey } from '@ngnova/ui/table';
import { UiTagComponent } from '@ngnova/ui/tag';
import type { UiTagVariant } from '@ngnova/ui/tag';
import { UiToastComponent, UiToastService } from '@ngnova/ui/toast';
import { UiTooltipDirective } from '@ngnova/ui/tooltip';

import { AdminRevenueChartComponent } from './admin-revenue-chart.component';

interface AdminNavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly badge?: string;
  readonly description: string;
}

interface AdminCustomer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly plan: 'Enterprise' | 'Growth' | 'Starter';
  readonly status: 'Active' | 'Trial' | 'At risk';
  readonly joined: string;
}

interface AdminModuleInsight {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

interface AdminMetric {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly context: string;
  readonly icon: string;
  readonly tone: 'blue' | 'emerald' | 'violet' | 'amber';
  readonly positive: boolean;
}

interface TeamCapacity {
  readonly label: string;
  readonly value: number;
  readonly assigned: string;
}

interface AdminActivity {
  readonly icon: string;
  readonly title: string;
  readonly detail: string;
  readonly time: string;
  readonly tone: 'blue' | 'emerald' | 'violet' | 'amber';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    AdminRevenueChartComponent,
    NgIcon,
    NgTemplateOutlet,
    UiAvatarComponent,
    UiButtonComponent,
    UiButtonDirective,
    UiButtonIconStartDirective,
    UiCardComponent,
    UiDrawerComponent,
    UiDrawerHeaderDirective,
    UiInputComponent,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiProgressBarComponent,
    UiTableCellDirective,
    UiTableComponent,
    UiTagComponent,
    UiToastComponent,
    UiTooltipDirective,
  ],
  providers: [
    provideIcons({
      heroArrowDownTray,
      heroArrowPath,
      heroArrowTrendingUp,
      heroBars3,
      heroBell,
      heroBolt,
      heroCalendarDays,
      heroChartBar,
      heroCheckCircle,
      heroChevronDown,
      heroChevronLeft,
      heroChevronRight,
      heroClock,
      heroCog6Tooth,
      heroCreditCard,
      heroCube,
      heroEllipsisVertical,
      heroHome,
      heroLifebuoy,
      heroMagnifyingGlass,
      heroMoon,
      heroShoppingBag,
      heroSun,
      heroUserPlus,
      heroUsers,
    }),
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  private readonly document = inject(DOCUMENT);
  private readonly toastService = inject(UiToastService);

  protected readonly mobileNavigationOpen = signal(false);
  protected readonly profileMenuOpen = signal(false);
  protected readonly activeNavigation = signal('Overview');
  protected readonly sidebarCollapsed = signal(this.readPreference('ngnova-admin-sidebar') === '1');
  protected readonly darkMode = signal(this.readPreference('ngnova-admin-theme') === 'dark');
  protected readonly selectedOrderKeys = signal<readonly UiTableRowKey[]>([]);
  protected readonly customerDrawerOpen = signal(false);
  protected readonly selectedCustomer = signal<AdminCustomer | null>(null);
  protected readonly customerSearch = signal('');
  protected readonly customerStatusFilter = signal<AdminCustomer['status'] | 'All'>('All');
  protected readonly orderSearch = signal('');
  protected readonly orderStatusFilter = signal<
    'All' | 'Processing' | 'Shipped' | 'Pending' | 'Delivered'
  >('All');
  protected readonly customerFormName = signal('');
  protected readonly customerFormEmail = signal('');
  protected readonly customerFormCompany = signal('');
  protected readonly customerFormPlan = signal<AdminCustomer['plan']>('Growth');
  protected readonly customerFormStatus = signal<AdminCustomer['status']>('Active');

  protected readonly navigationItems: readonly AdminNavigationItem[] = [
    {
      label: 'Overview',
      icon: 'heroHome',
      description: 'Good morning, Maya. Here is what is happening across your workspace today.',
    },
    {
      label: 'Analytics',
      icon: 'heroChartBar',
      description: 'Review product performance, acquisition, and revenue trends.',
    },
    {
      label: 'Customers',
      icon: 'heroUsers',
      description: 'Search, filter, create, and update customer accounts.',
    },
    {
      label: 'Orders',
      icon: 'heroShoppingBag',
      badge: '12',
      description: 'Track fulfillment, review order status, and run bulk actions.',
    },
    {
      label: 'Billing',
      icon: 'heroCreditCard',
      description: 'Monitor subscriptions, invoices, and account balances.',
    },
    {
      label: 'Products',
      icon: 'heroCube',
      description: 'Manage catalog availability, inventory, and pricing.',
    },
    {
      label: 'Settings',
      icon: 'heroCog6Tooth',
      description: 'Configure workspace preferences, access, and integrations.',
    },
    {
      label: 'Support',
      icon: 'heroLifebuoy',
      badge: '3',
      description: 'Review open conversations and customer service performance.',
    },
  ];

  protected readonly activePageDescription = computed(
    () =>
      this.navigationItems.find((item) => item.label === this.activeNavigation())?.description ??
      '',
  );

  protected readonly profileMenuItems: readonly UiMenuItem[] = [
    { value: 'profile', label: 'View profile' },
    { value: 'workspace', label: 'Workspace settings' },
    { value: 'billing', label: 'Billing and plans' },
    { value: 'sign-out', label: 'Sign out', separatorBefore: true },
  ];

  protected readonly customers = signal<readonly AdminCustomer[]>([
    {
      id: 'CUS-1042',
      name: 'Olivia Martin',
      email: 'olivia@acme.co',
      company: 'Acme Corporation',
      plan: 'Enterprise',
      status: 'Active',
      joined: 'Jul 18, 2026',
    },
    {
      id: 'CUS-1041',
      name: 'Jackson Lee',
      email: 'jackson@northwind.io',
      company: 'Northwind Traders',
      plan: 'Growth',
      status: 'Active',
      joined: 'Jul 16, 2026',
    },
    {
      id: 'CUS-1038',
      name: 'Sophia Patel',
      email: 'sophia@stark.example',
      company: 'Stark Industries',
      plan: 'Enterprise',
      status: 'At risk',
      joined: 'Jul 10, 2026',
    },
    {
      id: 'CUS-1035',
      name: 'Ethan Williams',
      email: 'ethan@wayne.example',
      company: 'Wayne Enterprises',
      plan: 'Growth',
      status: 'Trial',
      joined: 'Jul 5, 2026',
    },
    {
      id: 'CUS-1029',
      name: 'Ava Thompson',
      email: 'ava@globex.example',
      company: 'Globex Corporation',
      plan: 'Starter',
      status: 'Active',
      joined: 'Jun 28, 2026',
    },
  ]);

  protected readonly filteredCustomers = computed(() => {
    const query = this.customerSearch().trim().toLowerCase();
    const status = this.customerStatusFilter();
    return this.customers().filter(
      (customer) =>
        (status === 'All' || customer.status === status) &&
        (!query ||
          [customer.name, customer.email, customer.company, customer.plan].some((value) =>
            value.toLowerCase().includes(query),
          )),
    );
  });

  protected readonly activeModuleInsights = computed<readonly AdminModuleInsight[]>(() => {
    const insights: Record<string, readonly AdminModuleInsight[]> = {
      Analytics: [
        { label: 'Sessions', value: '86.4k', detail: '12.4% more than the previous period.' },
        {
          label: 'Qualified leads',
          value: '4,218',
          detail: '68% originated from organic channels.',
        },
        { label: 'Activation', value: '72.6%', detail: '3.1 points above the quarterly target.' },
      ],
      Billing: [
        {
          label: 'Monthly recurring revenue',
          value: '$186.2k',
          detail: 'Up 9.4% month over month.',
        },
        { label: 'Open invoices', value: '24', detail: '$18,740 is currently outstanding.' },
        {
          label: 'Renewals this month',
          value: '138',
          detail: '92% are expected to renew automatically.',
        },
      ],
      Products: [
        { label: 'Active products', value: '148', detail: '12 products were updated this week.' },
        {
          label: 'Low inventory',
          value: '7',
          detail: 'Items require replenishment within five days.',
        },
        {
          label: 'Catalog conversion',
          value: '6.8%',
          detail: '0.7 points higher than last month.',
        },
      ],
      Settings: [
        {
          label: 'Team members',
          value: '46',
          detail: 'Four invitations are waiting for acceptance.',
        },
        {
          label: 'Integrations',
          value: '9',
          detail: 'All connected services are operating normally.',
        },
        { label: 'Security score', value: '94%', detail: 'Two optional recommendations remain.' },
      ],
      Support: [
        { label: 'Open conversations', value: '18', detail: 'Three require a first response.' },
        {
          label: 'Median response',
          value: '8m',
          detail: 'Two minutes faster than the team target.',
        },
        { label: 'Satisfaction', value: '96%', detail: 'Based on 428 responses this month.' },
      ],
    };
    return insights[this.activeNavigation()] ?? [];
  });

  protected readonly metrics: readonly AdminMetric[] = [
    {
      label: 'Net revenue',
      value: '$253.4k',
      change: '+12.8%',
      context: '$28.6k collected this week',
      icon: 'heroCreditCard',
      tone: 'blue',
      positive: true,
    },
    {
      label: 'Active customers',
      value: '12,842',
      change: '+8.2%',
      context: '946 joined this month',
      icon: 'heroUsers',
      tone: 'emerald',
      positive: true,
    },
    {
      label: 'Orders',
      value: '3,486',
      change: '+5.4%',
      context: '128 awaiting fulfillment',
      icon: 'heroShoppingBag',
      tone: 'violet',
      positive: true,
    },
    {
      label: 'Conversion',
      value: '4.82%',
      change: '-0.3%',
      context: '0.3 points below target',
      icon: 'heroArrowTrendingUp',
      tone: 'amber',
      positive: false,
    },
  ];

  protected readonly teamCapacity: readonly TeamCapacity[] = [
    { label: 'Fulfillment', value: 72, assigned: '23 / 32' },
    { label: 'Support', value: 58, assigned: '14 / 24' },
    { label: 'Finance', value: 61, assigned: '11 / 18' },
    { label: 'Engineering', value: 78, assigned: '36 / 46' },
  ];

  protected readonly activities: readonly AdminActivity[] = [
    {
      icon: 'heroUserPlus',
      title: 'New enterprise customer',
      detail: 'Acme Corp. signed annual plan',
      time: '10m ago',
      tone: 'emerald',
    },
    {
      icon: 'heroArrowTrendingUp',
      title: 'Revenue milestone',
      detail: 'Daily revenue exceeded $50k',
      time: '1h ago',
      tone: 'blue',
    },
    {
      icon: 'heroShoppingBag',
      title: 'High order volume',
      detail: '312 orders received today',
      time: '2h ago',
      tone: 'violet',
    },
    {
      icon: 'heroArrowPath',
      title: 'Conversion dip',
      detail: '0.3 points below target',
      time: '3h ago',
      tone: 'amber',
    },
  ];

  protected readonly orderColumns: readonly UiTableColumn[] = [
    { key: 'id', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'date', header: 'Date' },
    { key: 'status', header: 'Status' },
    { key: 'total', header: 'Total', align: 'right' },
    { key: 'items', header: 'Items', align: 'right' },
    { key: 'actions', header: '', align: 'right' },
  ];

  protected readonly orderRows = signal<readonly UiTableRow[]>([
    {
      id: 'ORD-2026-0724-1287',
      customer: 'Acme Corp.',
      date: 'Jul 24, 2026 09:41',
      status: 'Processing',
      total: '$12,480.00',
      items: '8',
      actions: '',
    },
    {
      id: 'ORD-2026-0724-1286',
      customer: 'Northwind Traders',
      date: 'Jul 24, 2026 09:12',
      status: 'Shipped',
      total: '$6,320.00',
      items: '5',
      actions: '',
    },
    {
      id: 'ORD-2026-0724-1285',
      customer: 'Stark Industries',
      date: 'Jul 24, 2026 08:47',
      status: 'Processing',
      total: '$9,870.00',
      items: '6',
      actions: '',
    },
    {
      id: 'ORD-2026-0724-1284',
      customer: 'Wayne Enterprises',
      date: 'Jul 24, 2026 08:15',
      status: 'Pending',
      total: '$3,210.00',
      items: '3',
      actions: '',
    },
    {
      id: 'ORD-2026-0723-1279',
      customer: 'Globex Corporation',
      date: 'Jul 23, 2026 17:32',
      status: 'Delivered',
      total: '$15,760.00',
      items: '11',
      actions: '',
    },
  ]);

  protected readonly filteredOrderRows = computed(() => {
    const query = this.orderSearch().trim().toLowerCase();
    const status = this.orderStatusFilter();
    return this.orderRows().filter(
      (row) =>
        (status === 'All' || this.text(row['status']) === status) &&
        (!query ||
          [row['id'], row['customer'], row['status']].some((value) =>
            this.text(value).toLowerCase().includes(query),
          )),
    );
  });

  protected selectNavigation(label: string): void {
    this.activeNavigation.set(label);
    this.mobileNavigationOpen.set(false);
  }

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => {
      const next = !collapsed;
      this.writePreference('ngnova-admin-sidebar', next ? '1' : '0');
      return next;
    });
  }

  protected toggleDarkMode(): void {
    this.darkMode.update((enabled) => {
      const next = !enabled;
      this.writePreference('ngnova-admin-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  protected handleGlobalSearch(value: string): void {
    const query = value.trim();
    if (!query) {
      return;
    }
    this.customerSearch.set(query);
    this.activeNavigation.set('Customers');
  }

  protected updateCustomerStatusFilter(event: Event): void {
    const value = this.inputValue(event);
    if (value === 'All' || value === 'Active' || value === 'Trial' || value === 'At risk') {
      this.customerStatusFilter.set(value);
    }
  }

  protected updateOrderStatusFilter(event: Event): void {
    const value = this.inputValue(event);
    if (
      value === 'All' ||
      value === 'Processing' ||
      value === 'Shipped' ||
      value === 'Pending' ||
      value === 'Delivered'
    ) {
      this.orderStatusFilter.set(value);
    }
  }

  protected openCustomerEditor(customer: AdminCustomer | null = null): void {
    this.selectedCustomer.set(customer);
    this.customerFormName.set(customer?.name ?? '');
    this.customerFormEmail.set(customer?.email ?? '');
    this.customerFormCompany.set(customer?.company ?? '');
    this.customerFormPlan.set(customer?.plan ?? 'Growth');
    this.customerFormStatus.set(customer?.status ?? 'Active');
    this.customerDrawerOpen.set(true);
  }

  protected updateCustomerFormPlan(event: Event): void {
    const value = this.inputValue(event);
    if (value === 'Enterprise' || value === 'Growth' || value === 'Starter') {
      this.customerFormPlan.set(value);
    }
  }

  protected updateCustomerFormStatus(event: Event): void {
    const value = this.inputValue(event);
    if (value === 'Active' || value === 'Trial' || value === 'At risk') {
      this.customerFormStatus.set(value);
    }
  }

  protected saveCustomer(event: Event): void {
    event.preventDefault();
    const name = this.customerFormName().trim();
    const email = this.customerFormEmail().trim();
    const company = this.customerFormCompany().trim();
    if (!name || !email || !company) {
      return;
    }

    const selected = this.selectedCustomer();
    const customer: AdminCustomer = {
      id: selected?.id ?? `CUS-${1043 + this.customers().length}`,
      name,
      email,
      company,
      plan: this.customerFormPlan(),
      status: this.customerFormStatus(),
      joined: selected?.joined ?? 'Aug 1, 2026',
    };
    this.customers.update((customers) =>
      selected
        ? customers.map((current) => (current.id === selected.id ? customer : current))
        : [customer, ...customers],
    );
    this.customerDrawerOpen.set(false);
    this.toastService.success(
      selected ? 'Customer updated' : 'Customer created',
      `${customer.name} at ${customer.company} is ready.`,
      3500,
    );
  }

  protected markOrdersShipped(): void {
    const selected = new Set(this.selectedOrderKeys());
    this.orderRows.update((rows) =>
      rows.map((row) => (selected.has(this.text(row['id'])) ? { ...row, status: 'Shipped' } : row)),
    );
    this.toastService.success(
      'Orders updated',
      `${selected.size} ${selected.size === 1 ? 'order is' : 'orders are'} marked as shipped.`,
      3500,
    );
    this.selectedOrderKeys.set([]);
  }

  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected text(value: unknown): string {
    return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  }

  protected orderStatusVariant(value: unknown): UiTagVariant {
    switch (value) {
      case 'Shipped':
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  }

  protected customerStatusVariant(status: AdminCustomer['status']): UiTagVariant {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Trial':
        return 'info';
      case 'At risk':
        return 'warning';
    }
  }

  protected metricIconClasses(tone: AdminMetric['tone']): string {
    const tones: Record<AdminMetric['tone'], string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      violet: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    };
    return `inline-flex size-8 shrink-0 items-center justify-center rounded-md ${tones[tone]}`;
  }

  protected activityIconClasses(tone: AdminActivity['tone']): string {
    const tones: Record<AdminActivity['tone'], string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      violet: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    };
    return `inline-flex size-8 shrink-0 items-center justify-center rounded-md ${tones[tone]}`;
  }

  private readPreference(key: string): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private writePreference(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch {
      // The dashboard remains usable when storage is unavailable.
    }
  }
}
