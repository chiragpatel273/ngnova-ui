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
      'inline-flex max-w-full gap-1 overflow-auto rounded-[var(--ui-control-radius,0.5rem)] bg-slate-100 p-1 dark:bg-slate-900',
      this.orientation === 'horizontal' && 'flex-row',
      this.orientation === 'vertical' && 'flex-col items-stretch',
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
      'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950',
      this.fullWidth && 'flex-1',
      tab.value === this.selectedValue
        ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-slate-50'
        : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-50',
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
