import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBars3,
  heroBell,
  heroChevronDoubleLeft,
  heroChevronUpDown,
  heroCog6Tooth,
  heroHome,
  heroLanguage,
  heroMagnifyingGlass,
  heroMoon,
  heroShoppingBag,
  heroSparkles,
  heroSun,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiCommandPaletteComponent } from '@ngnova/ui/command-palette';
import type { UiCommand, UiCommandSelection } from '@ngnova/ui/command-palette';
import { UiConfirmationDialogComponent } from '@ngnova/ui/confirmation';
import { UiDrawerComponent, UiDrawerHeaderDirective } from '@ngnova/ui/drawer';
import { UiMenuComponent, UiMenuTriggerDirective } from '@ngnova/ui/menu';
import type { UiMenuItem, UiMenuSelection } from '@ngnova/ui/menu';
import {
  UiPopoverComponent,
  UiPopoverContentDirective,
  UiPopoverTriggerDirective,
} from '@ngnova/ui/popover';
import { UiToastComponent, UiToastService } from '@ngnova/ui/toast';
import { UiTooltipDirective } from '@ngnova/ui/tooltip';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CustomersService } from '../core/customers.service';
import { NotificationsService } from '../core/notifications.service';
import { OrdersService } from '../core/orders.service';
import { PreferencesService } from '../core/preferences.service';
import { APP_NAME } from '../core/title-strategy';
import { NAVIGATION } from './navigation';

const PROFILE_MENU: readonly UiMenuItem[] = [
  { value: 'profile', label: 'Your profile' },
  { value: 'settings', label: 'Settings' },
  { value: 'theme', label: 'Toggle dark mode' },
  { value: 'signout', label: 'Sign out', separatorBefore: true },
];

const WORKSPACES = ['Acme Inc', 'Globex Retail', 'Initech Labs'] as const;

const iconButton =
  'relative grid size-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white';

@Component({
  selector: 'app-shell',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    UiAvatarComponent,
    UiCommandPaletteComponent,
    UiConfirmationDialogComponent,
    UiDrawerComponent,
    UiDrawerHeaderDirective,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiPopoverComponent,
    UiPopoverContentDirective,
    UiPopoverTriggerDirective,
    UiToastComponent,
    UiTooltipDirective,
  ],
  viewProviders: [
    provideIcons({
      heroBars3,
      heroBell,
      heroChevronDoubleLeft,
      heroChevronUpDown,
      heroCog6Tooth,
      heroHome,
      heroLanguage,
      heroMagnifyingGlass,
      heroMoon,
      heroShoppingBag,
      heroSparkles,
      heroSun,
      heroUsers,
    }),
  ],
  template: `
    <a
      href="#main"
      class="sr-only z-50 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      (click)="focusMain($event)"
      >Skip to content</a
    >

    <ng-template #brand let-compact="compact">
      <a
        routerLink="/"
        class="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        [attr.aria-label]="compact ? appName + ' home' : null"
      >
        <span
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"
          aria-hidden="true"
        >
          <ng-icon name="heroSparkles" size="18" />
        </span>
        @if (!compact) {
          <span
            class="truncate text-base font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            {{ appName }}
          </span>
        }
      </a>
    </ng-template>

    <ng-template #nav let-compact="compact">
      <nav aria-label="Main" class="flex flex-col gap-6">
        @for (group of navigation; track group.label) {
          <div>
            @if (!compact) {
              <p
                class="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                {{ group.label }}
              </p>
            }
            <ul class="mt-2 grid gap-1">
              @for (item of group.items; track item.path) {
                <li>
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                    [routerLinkActiveOptions]="{ exact: !!item.exact }"
                    ariaCurrentWhenActive="page"
                    class="group flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    [class.justify-center]="compact"
                    [uiTooltip]="item.label"
                    [tooltipDisabled]="!compact"
                    tooltipPosition="right"
                    [attr.aria-label]="compact ? item.label : null"
                    (click)="mobileNavOpen.set(false)"
                  >
                    <ng-icon [name]="item.icon" size="18" aria-hidden="true" class="shrink-0" />
                    @if (!compact) {
                      <span class="flex-1 truncate">{{ item.label }}</span>
                      @if (item.path === '/orders' && openOrders()) {
                        <span
                          class="rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                          [attr.aria-label]="openOrders() + ' open orders'"
                          >{{ openOrders() }}</span
                        >
                      }
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>
    </ng-template>

    <div
      class="min-h-dvh lg:grid"
      [class]="
        preferences.sidebarCollapsed()
          ? 'lg:grid-cols-[4.5rem_minmax(0,1fr)]'
          : 'lg:grid-cols-[16rem_minmax(0,1fr)]'
      "
    >
      <aside
        class="sticky top-0 hidden h-dvh flex-col border-e border-slate-200 bg-white px-3 py-4 lg:flex dark:border-slate-800 dark:bg-slate-900"
        aria-label="Sidebar"
      >
        @if (preferences.sidebarCollapsed()) {
          <div class="flex h-11 items-center justify-center">
            <ng-container
              [ngTemplateOutlet]="brand"
              [ngTemplateOutletContext]="{ compact: true }"
            />
          </div>
        } @else {
          <ui-menu
            class="block"
            ariaLabel="Workspaces"
            [items]="workspaceMenu()"
            (itemSelected)="switchWorkspace($event)"
          >
            <button
              uiMenuTrigger
              type="button"
              class="flex h-11 w-full items-center gap-2.5 rounded-lg px-1.5 text-start transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800"
              [attr.aria-label]="'Switch workspace, current ' + workspace()"
            >
              <span
                class="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"
                aria-hidden="true"
              >
                <ng-icon name="heroSparkles" size="18" />
              </span>
              <span class="min-w-0 flex-1 leading-tight">
                <span class="block truncate text-sm font-semibold text-slate-950 dark:text-white">{{
                  appName
                }}</span>
                <span class="block truncate text-xs text-slate-500 dark:text-slate-400">{{
                  workspace()
                }}</span>
              </span>
              <ng-icon
                name="heroChevronUpDown"
                size="16"
                class="shrink-0 text-slate-400"
                aria-hidden="true"
              />
            </button>
          </ui-menu>
        }
        <div class="mt-6 min-h-0 flex-1 overflow-y-auto">
          <ng-container
            [ngTemplateOutlet]="nav"
            [ngTemplateOutletContext]="{ compact: preferences.sidebarCollapsed() }"
          />
        </div>
        @if (!preferences.sidebarCollapsed()) {
          <a
            href="https://chiragpatel273.github.io/ngnova-ui/"
            target="_blank"
            rel="noopener"
            class="mb-3 block rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-blue-500/50 dark:hover:text-white"
          >
            <span class="font-semibold text-slate-900 dark:text-white">Built with NgNova UI</span>
            <span class="mt-0.5 block">Accessible Angular components for Tailwind CSS.</span>
          </a>
        }
        <button
          type="button"
          [class]="iconButton"
          class="self-end"
          [class.self-center]="preferences.sidebarCollapsed()"
          [attr.aria-label]="preferences.sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!preferences.sidebarCollapsed()"
          (click)="preferences.sidebarCollapsed.set(!preferences.sidebarCollapsed())"
        >
          <ng-icon
            name="heroChevronDoubleLeft"
            size="18"
            aria-hidden="true"
            class="transition-transform rtl:-scale-x-100"
            [class.rotate-180]="preferences.sidebarCollapsed()"
          />
        </button>
      </aside>

      <div class="flex min-w-0 flex-col">
        <header
          class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950/80"
        >
          <button
            type="button"
            [class]="iconButton"
            class="lg:hidden"
            aria-label="Open navigation"
            [attr.aria-expanded]="mobileNavOpen()"
            (click)="mobileNavOpen.set(true)"
          >
            <ng-icon name="heroBars3" size="20" aria-hidden="true" />
          </button>
          <div class="lg:hidden">
            <ng-container
              [ngTemplateOutlet]="brand"
              [ngTemplateOutletContext]="{ compact: false }"
            />
          </div>

          <button
            type="button"
            class="ms-auto flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-72 lg:ms-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
            data-testid="open-command-palette"
            (click)="paletteOpen.set(true)"
          >
            <ng-icon name="heroMagnifyingGlass" size="16" aria-hidden="true" />
            <span class="hidden flex-1 text-start sm:inline">Search or jump to…</span>
            <span class="sr-only sm:hidden">Search</span>
            <kbd
              class="hidden rounded border border-slate-200 px-1.5 font-sans text-[11px] font-medium text-slate-400 sm:inline dark:border-slate-700"
              >{{ shortcutLabel }}</kbd
            >
          </button>

          <div class="flex items-center gap-1 lg:ms-auto">
            <button
              type="button"
              [class]="iconButton"
              class="hidden sm:grid"
              [uiTooltip]="
                preferences.direction() === 'rtl'
                  ? 'Switch to left-to-right'
                  : 'Switch to right-to-left'
              "
              [attr.aria-label]="
                preferences.direction() === 'rtl'
                  ? 'Switch to left-to-right'
                  : 'Switch to right-to-left'
              "
              (click)="preferences.toggleDirection()"
            >
              <ng-icon name="heroLanguage" size="18" aria-hidden="true" />
            </button>
            <button
              type="button"
              [class]="iconButton"
              [uiTooltip]="preferences.dark() ? 'Switch to light mode' : 'Switch to dark mode'"
              [attr.aria-label]="
                preferences.dark() ? 'Switch to light mode' : 'Switch to dark mode'
              "
              data-testid="theme-toggle"
              (click)="preferences.toggleTheme()"
            >
              <ng-icon
                [name]="preferences.dark() ? 'heroSun' : 'heroMoon'"
                size="18"
                aria-hidden="true"
              />
            </button>

            <ui-popover position="bottom" ariaLabel="Notifications" [(open)]="notificationsOpen">
              <button
                uiPopoverTrigger
                type="button"
                [class]="iconButton"
                [attr.aria-label]="
                  notifications.unread()
                    ? 'Notifications, ' + notifications.unread() + ' unread'
                    : 'Notifications'
                "
              >
                <ng-icon name="heroBell" size="18" aria-hidden="true" />
                @if (notifications.unread()) {
                  <span
                    class="absolute end-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950"
                    aria-hidden="true"
                  ></span>
                }
              </button>
              <div uiPopoverContent class="w-80 max-w-full">
                <div class="flex items-center justify-between gap-3">
                  <h2 class="text-sm font-semibold">Notifications</h2>
                  @if (notifications.unread()) {
                    <button
                      type="button"
                      class="rounded text-xs font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-400"
                      (click)="notifications.markAllRead()"
                    >
                      Mark all as read
                    </button>
                  }
                </div>
                <ul class="-mx-2 mt-3 grid gap-1">
                  @for (item of notifications.notifications(); track item.id) {
                    <li>
                      <a
                        [routerLink]="item.link"
                        class="flex gap-3 rounded-lg p-2 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-900"
                        (click)="openNotification(item.id)"
                      >
                        <span
                          class="mt-1.5 size-2 shrink-0 rounded-full"
                          [class]="item.read ? 'bg-transparent' : 'bg-blue-600 dark:bg-blue-400'"
                          aria-hidden="true"
                        ></span>
                        <span class="min-w-0">
                          <span class="block text-sm font-medium text-slate-900 dark:text-white">{{
                            item.title
                          }}</span>
                          <span class="block text-xs text-slate-500 dark:text-slate-400">{{
                            item.detail
                          }}</span>
                          <span class="mt-1 block text-[11px] text-slate-400">{{
                            ago(item.minutesAgo)
                          }}</span>
                        </span>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            </ui-popover>

            <ui-menu
              align="end"
              ariaLabel="Account"
              [items]="profileMenu"
              (itemSelected)="profileAction($event)"
            >
              <button
                uiMenuTrigger
                type="button"
                class="ms-1 flex items-center gap-2 rounded-full p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:rounded-lg sm:pe-2"
                aria-label="Account menu for Maya Chen"
              >
                <ui-avatar label="Maya Chen" size="sm" />
                <span class="hidden text-start text-sm leading-tight sm:block">
                  <span class="block font-medium text-slate-900 dark:text-white">Maya Chen</span>
                  <span class="block text-xs text-slate-500 dark:text-slate-400">Owner</span>
                </span>
              </button>
            </ui-menu>
          </div>
        </header>

        <main id="main" tabindex="-1" class="flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          <div class="mx-auto max-w-[96rem]">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>

    <ui-drawer
      position="start"
      size="sm"
      [(open)]="mobileNavOpen"
      closeAriaLabel="Close navigation"
    >
      <span uiDrawerHeader>
        <ng-container [ngTemplateOutlet]="brand" [ngTemplateOutletContext]="{ compact: false }" />
      </span>
      <ng-container [ngTemplateOutlet]="nav" [ngTemplateOutletContext]="{ compact: false }" />
    </ui-drawer>

    <ui-command-palette
      [(open)]="paletteOpen"
      [(query)]="paletteQuery"
      [commands]="commands()"
      placeholder="Search pages, customers, orders, or actions"
      (commandSelected)="runCommand($event)"
    />
    <ui-toast position="bottom-end" />
    <ui-confirmation-dialog />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected readonly preferences = inject(PreferencesService);
  protected readonly notifications = inject(NotificationsService);
  private readonly customers = inject(CustomersService);
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly toast = inject(UiToastService);

  protected readonly appName = APP_NAME;
  protected readonly navigation = NAVIGATION;
  protected readonly profileMenu = PROFILE_MENU;
  protected readonly iconButton = iconButton;
  protected readonly mobileNavOpen = signal(false);
  protected readonly paletteOpen = signal(false);
  protected readonly paletteQuery = signal('');
  protected readonly workspace = signal<(typeof WORKSPACES)[number]>(WORKSPACES[0]);
  protected readonly workspaceMenu = computed<UiMenuItem[]>(() => [
    ...WORKSPACES.map((name) => ({
      value: name,
      label: name === this.workspace() ? `${name} (current)` : name,
    })),
    { value: 'new', label: 'Create workspace', separatorBefore: true },
  ]);
  protected readonly notificationsOpen = signal(false);
  protected readonly openOrders = this.orders.openCount;
  protected readonly shortcutLabel =
    typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform)
      ? '⌘K'
      : 'Ctrl K';

  protected readonly commands = computed<UiCommand[]>(() => [
    ...NAVIGATION.flatMap((group) =>
      group.items.map((item) => ({
        value: `go:${item.path}`,
        label: item.label,
        group: 'Pages',
        keywords: ['go', 'open', 'page'],
      })),
    ),
    {
      value: 'action:new-customer',
      label: 'Add customer',
      group: 'Actions',
      keywords: ['create', 'new'],
    },
    {
      value: 'action:theme',
      label: 'Toggle dark mode',
      group: 'Actions',
      keywords: ['theme', 'light', 'dark'],
    },
    {
      value: 'action:direction',
      label: 'Toggle right-to-left layout',
      group: 'Actions',
      keywords: ['rtl', 'ltr', 'direction', 'arabic', 'hebrew'],
    },
    ...this.customers
      .customers()
      .slice(0, 30)
      .map((customer) => ({
        value: `customer:${customer.id}`,
        label: customer.name,
        description: `${customer.company} · ${customer.email}`,
        group: 'Customers',
        keywords: [customer.email, customer.company, customer.id],
      })),
    ...this.orders
      .orders()
      .slice(0, 30)
      .map((order) => ({
        value: `order:${order.id}`,
        label: `Order ${order.id}`,
        description: order.status,
        group: 'Orders',
      })),
  ]);

  constructor() {
    // Load data once for the palette and the sidebar badge.
    void this.customers.load();
    void this.orders.load();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.mobileNavOpen.set(false));
    // Start each palette session with an empty search.
    effect(() => {
      if (!this.paletteOpen()) this.paletteQuery.set('');
    });
  }

  protected focusMain(event: Event): void {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }

  protected runCommand({ command }: UiCommandSelection): void {
    const [kind, value] = command.value.split(/:(.*)/s);
    switch (kind) {
      case 'go':
        void this.router.navigateByUrl(value);
        break;
      case 'customer':
        void this.router.navigate(['/customers'], { queryParams: { customer: value } });
        break;
      case 'order':
        void this.router.navigate(['/orders', value]);
        break;
      case 'action':
        if (value === 'new-customer')
          void this.router.navigate(['/customers'], { queryParams: { new: 1 } });
        else if (value === 'theme') this.preferences.toggleTheme();
        else this.preferences.toggleDirection();
        break;
    }
  }

  protected switchWorkspace({ item }: UiMenuSelection): void {
    const next = WORKSPACES.find((name) => name === item.value);
    if (!next) {
      this.toast.info('Create a workspace', 'Wire this up to your onboarding flow.');
    } else if (next !== this.workspace()) {
      this.workspace.set(next);
      this.toast.success(`Switched to ${next}`);
    }
  }

  protected profileAction({ item }: UiMenuSelection): void {
    if (item.value === 'profile')
      void this.router.navigate(['/settings'], { queryParams: { tab: 'profile' } });
    else if (item.value === 'settings') void this.router.navigate(['/settings']);
    else if (item.value === 'theme') this.preferences.toggleTheme();
    else void this.router.navigateByUrl('/sign-in');
  }

  protected openNotification(id: string): void {
    this.notifications.markRead(id);
    this.notificationsOpen.set(false);
  }

  protected ago(minutes: number): string {
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
}
