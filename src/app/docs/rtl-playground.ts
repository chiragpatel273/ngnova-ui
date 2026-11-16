import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiBreadcrumbComponent } from '@ngnova/ui/breadcrumb';
import type { UiBreadcrumbItem } from '@ngnova/ui/breadcrumb';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiDatePickerComponent, provideUiDatePickerLabels } from '@ngnova/ui/date-picker';
import {
  UiDrawerComponent,
  UiDrawerFooterDirective,
  UiDrawerHeaderDirective,
  provideUiDrawerLabels,
} from '@ngnova/ui/drawer';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiMenuComponent, UiMenuTriggerDirective } from '@ngnova/ui/menu';
import type { UiMenuItem } from '@ngnova/ui/menu';
import { UiPaginatorComponent, provideUiPaginatorLabels } from '@ngnova/ui/paginator';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiSwitchComponent } from '@ngnova/ui/switch';
import { UiTabsComponent } from '@ngnova/ui/tabs';
import type { UiTabItem } from '@ngnova/ui/tabs';
import { UiTreeComponent } from '@ngnova/ui/tree';
import type { UiTreeNode } from '@ngnova/ui/tree';

type PlaygroundDirection = 'rtl' | 'ltr';

const TABS: readonly UiTabItem[] = [
  { label: 'نظرة عامة', value: 'overview' },
  { label: 'الفواتير', value: 'billing' },
  { label: 'الإعدادات', value: 'settings' },
];

const PLAN_OPTIONS: readonly UiSelectOption[] = [
  { label: 'الأساسية', value: 'starter' },
  { label: 'الاحترافية', value: 'pro' },
  { label: 'المؤسسات', value: 'enterprise' },
];

const MENU_ITEMS: readonly UiMenuItem[] = [
  { value: 'edit', label: 'تعديل' },
  { value: 'duplicate', label: 'نسخ' },
  { value: 'delete', label: 'حذف', danger: true, separatorBefore: true },
];

const BREADCRUMB: readonly UiBreadcrumbItem[] = [
  { label: 'الرئيسية', href: '#' },
  { label: 'المشاريع', href: '#' },
  { label: 'نوفا' },
];

const TREE_NODES: readonly UiTreeNode[] = [
  {
    value: 'components',
    label: 'المكونات',
    children: [
      { value: 'forms', label: 'النماذج' },
      { value: 'overlays', label: 'الطبقات' },
    ],
  },
  { value: 'guides', label: 'الأدلة' },
];

/**
 * Live right-to-left preview. The section sets dir="rtl" and lang="ar"; components resolve their
 * direction from the DOM, so no provider or CDK Directionality is required.
 */
@Component({
  selector: 'app-rtl-playground',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UiBreadcrumbComponent,
    UiButtonComponent,
    UiDatePickerComponent,
    UiDrawerComponent,
    UiDrawerFooterDirective,
    UiDrawerHeaderDirective,
    UiInputComponent,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiPaginatorComponent,
    UiSelectComponent,
    UiSwitchComponent,
    UiTabsComponent,
    UiTreeComponent,
  ],
  providers: [
    provideUiDrawerLabels({ close: 'إغلاق' }),
    provideUiDatePickerLabels({ previousMonth: 'الشهر السابق', nextMonth: 'الشهر التالي' }),
    provideUiPaginatorLabels({ previousPage: 'الصفحة السابقة', nextPage: 'الصفحة التالية' }),
  ],
  template: `
    <section
      class="overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800"
      aria-labelledby="rtl-playground-title"
    >
      <div
        class="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Live direction scope
          </p>
          <h2
            id="rtl-playground-title"
            class="mt-1 text-base font-semibold text-slate-950 dark:text-white"
          >
            Right-to-left preview
          </h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Every control below sits inside dir="{{ direction() }}". Try the arrow keys in the tabs,
            tree, and calendar.
          </p>
        </div>
        <button
          type="button"
          class="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          [attr.aria-pressed]="direction() === 'ltr'"
          (click)="toggleDirection()"
        >
          Preview {{ direction() === 'rtl' ? 'left-to-right' : 'right-to-left' }}
        </button>
      </div>

      <div
        data-rtl-playground
        class="grid gap-6 bg-slate-50 p-4 dark:bg-slate-900 lg:grid-cols-2"
        [attr.dir]="direction()"
        [attr.lang]="direction() === 'rtl' ? 'ar' : null"
      >
        <div class="grid content-start gap-4">
          <ui-breadcrumb [items]="breadcrumb" ariaLabel="مسار التنقل" />
          <ui-tabs
            [tabs]="tabs"
            [active]="activeTab()"
            (activeChange)="activeTab.set($event)"
            ariaLabel="أقسام الحساب"
          >
            <p class="py-3 text-sm text-slate-600 dark:text-slate-300">{{ tabSummary() }}</p>
          </ui-tabs>
          <ui-input
            label="البريد الإلكتروني"
            type="email"
            helperText="سنرسل الفواتير إلى هذا العنوان."
            [maxLength]="40"
            [formControl]="email"
          />
          <ui-select
            label="الخطة"
            placeholder="اختر خطة"
            [options]="planOptions"
            [formControl]="plan"
          />
          <ui-switch label="إشعارات الإصدار" [formControl]="notifications" />
          <ui-date-picker label="تاريخ الإطلاق" locale="ar" [formControl]="releaseDate" />
        </div>

        <div class="grid content-start gap-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <ui-menu [items]="menuItems" align="end" ariaLabel="إجراءات السجل">
              <button
                uiMenuTrigger
                type="button"
                class="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                إجراءات
              </button>
            </ui-menu>
            <ui-button variant="secondary" (pressed)="drawerOpen.set(true)">
              فتح الفلاتر
            </ui-button>
          </div>
          <ui-tree
            [nodes]="treeNodes"
            [expanded]="expanded()"
            (expandedChange)="expanded.set($event)"
            [selected]="selectedNode()"
            (selectedChange)="selectedNode.set($event)"
            ariaLabel="الوثائق"
          />
          <ui-paginator [(page)]="page" [pageSize]="10" [totalItems]="48" />
        </div>

        <ui-drawer
          [open]="drawerOpen()"
          (openChange)="drawerOpen.set($event)"
          position="end"
          size="sm"
          titleId="rtl-drawer-title"
        >
          <span uiDrawerHeader id="rtl-drawer-title">الفلاتر</span>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            يفتح هذا الدرج من الحافة النهائية، أي من اليسار في الاتجاه من اليمين إلى اليسار.
          </p>
          <ui-button uiDrawerFooter (pressed)="drawerOpen.set(false)">تطبيق</ui-button>
        </ui-drawer>
      </div>
    </section>
  `,
})
export class RtlPlaygroundComponent {
  protected readonly direction = signal<PlaygroundDirection>('rtl');
  protected readonly tabs = TABS;
  protected readonly planOptions = PLAN_OPTIONS;
  protected readonly menuItems = MENU_ITEMS;
  protected readonly breadcrumb = BREADCRUMB;
  protected readonly treeNodes = TREE_NODES;
  protected readonly activeTab = signal('overview');
  protected readonly expanded = signal<readonly string[]>(['components']);
  protected readonly selectedNode = signal<string | null>('forms');
  protected readonly drawerOpen = signal(false);
  protected readonly page = signal(1);
  protected readonly email = new FormControl('team@example.com', { nonNullable: true });
  protected readonly plan = new FormControl('pro', { nonNullable: true });
  protected readonly notifications = new FormControl(true, { nonNullable: true });
  protected readonly releaseDate = new FormControl('2026-11-16', { nonNullable: true });

  protected tabSummary(): string {
    return TABS.find((tab) => tab.value === this.activeTab())?.label ?? '';
  }

  protected toggleDirection(): void {
    this.direction.update((direction) => (direction === 'rtl' ? 'ltr' : 'rtl'));
  }
}
