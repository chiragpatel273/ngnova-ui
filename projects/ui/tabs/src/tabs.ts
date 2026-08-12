import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  Input,
  output,
} from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface UiTabItem {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

export type UiTabsOrientation = 'horizontal' | 'vertical';
export type UiTabsVariant = 'segmented' | 'underline' | 'pills';

const TABLIST_VARIANT_CLASSES: Record<UiTabsVariant, string> = {
  segmented: 'gap-1 rounded-[var(--ui-control-radius,0.5rem)] bg-slate-100 p-1 dark:bg-slate-900',
  underline: 'gap-4 border-slate-200 bg-transparent dark:border-slate-800',
  pills: 'gap-2 bg-transparent',
};

const TAB_VARIANT_BASE_CLASSES: Record<UiTabsVariant, string> = {
  segmented: 'rounded-md px-3 py-1.5',
  underline: '',
  pills: 'rounded-full border px-3.5 py-1.5',
};

const TAB_VARIANT_ACTIVE_CLASSES: Record<UiTabsVariant, string> = {
  segmented: 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-slate-50',
  underline: 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300',
  pills:
    'border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-500 dark:bg-blue-500 dark:text-slate-950',
};

const TAB_VARIANT_INACTIVE_CLASSES: Record<UiTabsVariant, string> = {
  segmented: 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-50',
  underline:
    'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50',
  pills:
    'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50',
};

let nextTabsId = 0;

@Component({
  selector: 'ui-tabs',
  standalone: true,
  template: `
    <div
      role="tablist"
      [attr.aria-label]="ariaLabel || null"
      [attr.aria-orientation]="orientation"
      [class]="tablistClasses"
      [class.w-full]="fullWidth"
      tabindex="-1"
      (keydown)="onKeydown($event)"
    >
      @for (tab of tabs; track tab.value) {
        <button
          type="button"
          role="tab"
          [id]="tabId(tab)"
          [attr.aria-selected]="tab.value === selectedValue"
          [attr.aria-controls]="panelId(tab)"
          [disabled]="tab.disabled"
          [tabIndex]="tab.value === selectedValue ? 0 : -1"
          [class]="tabClasses(tab)"
          (click)="selectTab(tab)"
        >
          {{ tab.label }}
        </button>
      }
    </div>

    <div
      class="mt-4"
      role="tabpanel"
      [id]="activePanelId"
      [attr.aria-labelledby]="activeTabId"
      tabindex="0"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabsComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() id = `ui-tabs-${++nextTabsId}`;
  @Input() tabs: readonly UiTabItem[] = [];
  @Input() active = '';
  @Input() ariaLabel = 'Tabs';
  @Input() orientation: UiTabsOrientation = 'horizontal';
  @Input() variant: UiTabsVariant = 'segmented';
  @Input({ transform: booleanAttribute }) fullWidth = false;
  readonly activeChange = output<string>();

  protected get selectedValue(): string {
    return this.selectedTab?.value ?? '';
  }

  protected get activeTabId(): string | null {
    return this.selectedTab ? this.tabId(this.selectedTab) : null;
  }

  protected get activePanelId(): string | null {
    return this.selectedTab ? this.panelId(this.selectedTab) : null;
  }

  protected get tablistClasses(): string {
    return uiClassNames(
      'inline-flex max-w-full',
      TABLIST_VARIANT_CLASSES[this.variant],
      this.orientation === 'horizontal' && 'flex-row overflow-x-auto overflow-y-hidden',
      this.orientation === 'vertical' && 'flex-col items-stretch overflow-x-hidden overflow-y-auto',
      this.variant === 'underline' && this.orientation === 'horizontal' && 'border-b',
      this.variant === 'underline' && this.orientation === 'vertical' && 'border-l',
    );
  }

  protected tabId(tab: UiTabItem): string {
    return `${this.id}-tab-${this.toDomId(tab.value)}`;
  }

  protected panelId(tab: UiTabItem): string {
    return `${this.id}-panel-${this.toDomId(tab.value)}`;
  }

  protected tabClasses(tab: UiTabItem): string {
    return uiClassNames(
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950',
      TAB_VARIANT_BASE_CLASSES[this.variant],
      this.variant === 'underline' &&
        this.orientation === 'horizontal' &&
        '-mb-px rounded-none border-b-2 px-1 py-2.5',
      this.variant === 'underline' &&
        this.orientation === 'vertical' &&
        '-ml-px rounded-none border-l-2 px-3 py-2',
      this.fullWidth && 'flex-1',
      tab.value === this.selectedValue
        ? TAB_VARIANT_ACTIVE_CLASSES[this.variant]
        : TAB_VARIANT_INACTIVE_CLASSES[this.variant],
    );
  }

  protected selectTab(tab: UiTabItem): void {
    if (tab.disabled || tab.value === this.active) {
      return;
    }

    this.activeChange.emit(tab.value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const enabledTabs = this.tabs.filter((tab) => !tab.disabled);
    if (!enabledTabs.length) {
      return;
    }

    const currentIndex = this.getCurrentIndex(enabledTabs);
    const lastIndex = enabledTabs.length - 1;
    const nextIndex = this.getNextIndex(event.key, currentIndex, lastIndex);
    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    this.selectTab(nextTab);
    this.focusTab(nextTab);
  }

  private getNextIndex(key: string, currentIndex: number, lastIndex: number): number | null {
    switch (key) {
      case 'ArrowRight':
        return this.orientation === 'horizontal'
          ? currentIndex === lastIndex
            ? 0
            : currentIndex + 1
          : null;
      case 'ArrowLeft':
        return this.orientation === 'horizontal'
          ? currentIndex === 0
            ? lastIndex
            : currentIndex - 1
          : null;
      case 'ArrowDown':
        return this.orientation === 'vertical'
          ? currentIndex === lastIndex
            ? 0
            : currentIndex + 1
          : null;
      case 'ArrowUp':
        return this.orientation === 'vertical'
          ? currentIndex === 0
            ? lastIndex
            : currentIndex - 1
          : null;
      case 'Home':
        return 0;
      case 'End':
        return lastIndex;
      default:
        return null;
    }
  }

  private get selectedTab(): UiTabItem | undefined {
    return (
      this.tabs.find((tab) => !tab.disabled && tab.value === this.active) ??
      this.tabs.find((tab) => !tab.disabled)
    );
  }

  private getCurrentIndex(enabledTabs: readonly UiTabItem[]): number {
    const activeElement = this.host.nativeElement.ownerDocument.activeElement;
    const focusedIndex = enabledTabs.findIndex(
      (tab) => activeElement instanceof HTMLElement && activeElement.id === this.tabId(tab),
    );
    if (focusedIndex !== -1) {
      return focusedIndex;
    }
    return Math.max(
      0,
      enabledTabs.findIndex((tab) => tab.value === this.selectedValue),
    );
  }

  private focusTab(tab: UiTabItem): void {
    const tabs = this.host.nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    Array.from(tabs)
      .find((element) => element.id === this.tabId(tab))
      ?.focus();
  }

  private toDomId(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'tab'
    );
  }
}
