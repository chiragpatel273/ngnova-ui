import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  heroClock,
  heroCog6Tooth,
  heroCreditCard,
  heroCube,
  heroEllipsisVertical,
  heroHome,
  heroLifebuoy,
  heroMagnifyingGlass,
  heroShoppingBag,
  heroUserPlus,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiBadgeComponent } from '@ngnova/ui/badge';
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

import { AdminRevenueChartComponent } from './admin-revenue-chart.component';

interface AdminNavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly badge?: string;
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
    UiBadgeComponent,
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
      heroClock,
      heroCog6Tooth,
      heroCreditCard,
      heroCube,
      heroEllipsisVertical,
      heroHome,
      heroLifebuoy,
      heroMagnifyingGlass,
      heroShoppingBag,
      heroUserPlus,
      heroUsers,
    }),
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  protected readonly mobileNavigationOpen = signal(false);
  protected readonly profileMenuOpen = signal(false);
  protected readonly activeNavigation = signal('Overview');
  protected readonly selectedOrderKeys = signal<readonly UiTableRowKey[]>([]);

  protected readonly navigationItems: readonly AdminNavigationItem[] = [
    { label: 'Overview', icon: 'heroHome' },
    { label: 'Analytics', icon: 'heroChartBar' },
    { label: 'Customers', icon: 'heroUsers' },
    { label: 'Orders', icon: 'heroShoppingBag', badge: '12' },
    { label: 'Billing', icon: 'heroCreditCard' },
    { label: 'Products', icon: 'heroCube' },
    { label: 'Settings', icon: 'heroCog6Tooth' },
    { label: 'Support', icon: 'heroLifebuoy', badge: '3' },
  ];

  protected readonly profileMenuItems: readonly UiMenuItem[] = [
    { value: 'profile', label: 'View profile' },
    { value: 'workspace', label: 'Workspace settings' },
    { value: 'billing', label: 'Billing and plans' },
    { value: 'sign-out', label: 'Sign out', separatorBefore: true },
  ];

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

  protected readonly orderRows: readonly UiTableRow[] = [
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
  ];

  protected selectNavigation(label: string): void {
    this.activeNavigation.set(label);
    this.mobileNavigationOpen.set(false);
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
}
