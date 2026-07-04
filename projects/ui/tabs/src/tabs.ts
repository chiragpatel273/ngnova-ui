import { ChangeDetectionStrategy, booleanAttribute, Component, Input, output } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface UiTabItem {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

let nextTabsId = 0;

@Component({
  selector: 'ui-tabs',
  standalone: true,
  template: `
    <div
      role="tablist"
      [attr.aria-label]="ariaLabel || null"
      class="inline-flex rounded-md bg-slate-100 p-1 dark:bg-slate-900"
      [class.w-full]="fullWidth"
      tabindex="-1"
      (keydown)="onKeydown($event)"
    >
      @for (tab of tabs; track tab.value) {
        <button
          type="button"
          role="tab"
          [id]="tabId(tab)"
          [attr.aria-selected]="tab.value === active"
          [attr.aria-controls]="panelId(tab)"
          [disabled]="tab.disabled"
          [tabIndex]="tab.value === active ? 0 : -1"
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
  @Input() id = `ui-tabs-${++nextTabsId}`;
  @Input() tabs: readonly UiTabItem[] = [];
  @Input() active = '';
  @Input() ariaLabel = 'Tabs';
  @Input({ transform: booleanAttribute }) fullWidth = false;
  readonly activeChange = output<string>();

  protected get activeTabId(): string | null {
    return this.active ? `${this.id}-tab-${this.toDomId(this.active)}` : null;
  }

  protected get activePanelId(): string | null {
    return this.active ? `${this.id}-panel-${this.toDomId(this.active)}` : null;
  }

  protected tabId(tab: UiTabItem): string {
    return `${this.id}-tab-${this.toDomId(tab.value)}`;
  }

  protected panelId(tab: UiTabItem): string {
    return `${this.id}-panel-${this.toDomId(tab.value)}`;
  }

  protected tabClasses(tab: UiTabItem): string {
    return uiClassNames(
      'inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:opacity-50',
      this.fullWidth && 'flex-1',
      tab.value === this.active
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

    const currentIndex = Math.max(
      0,
      enabledTabs.findIndex((tab) => tab.value === this.active),
    );
    const lastIndex = enabledTabs.length - 1;
    const nextIndex = this.getNextIndex(event.key, currentIndex, lastIndex);
    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    this.selectTab(enabledTabs[nextIndex]);
  }

  private getNextIndex(key: string, currentIndex: number, lastIndex: number): number | null {
    switch (key) {
      case 'ArrowRight':
        return currentIndex === lastIndex ? 0 : currentIndex + 1;
      case 'ArrowLeft':
        return currentIndex === 0 ? lastIndex : currentIndex - 1;
      case 'Home':
        return 0;
      case 'End':
        return lastIndex;
      default:
        return null;
    }
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
