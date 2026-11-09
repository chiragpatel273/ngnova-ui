import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-table-virtual-scroll`. See ADR 0004. */
export interface UiTableVirtualScrollLabels {
  /** Accessible name of the scrollable row group. */
  readonly rows: string;
}

const DEFAULT_LABELS: UiTableVirtualScrollLabels = {
  rows: 'Virtualized table rows',
};

/** Labels used by `ui-table-virtual-scroll`. Defaults to English; override with `provideUiTableVirtualScrollLabels()`. */
export const UI_TABLE_VIRTUAL_SCROLL_LABELS = new InjectionToken<UiTableVirtualScrollLabels>(
  'UI_TABLE_VIRTUAL_SCROLL_LABELS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_LABELS,
  },
);

/** Overrides `ui-table-virtual-scroll` built-in text, merging over labels provided by a parent injector. */
export function provideUiTableVirtualScrollLabels(
  labels: Partial<UiTableVirtualScrollLabels>,
): Provider {
  return {
    provide: UI_TABLE_VIRTUAL_SCROLL_LABELS,
    useFactory: (): UiTableVirtualScrollLabels => ({
      ...(inject(UI_TABLE_VIRTUAL_SCROLL_LABELS, { skipSelf: true, optional: true }) ??
        DEFAULT_LABELS),
      ...labels,
    }),
  };
}
