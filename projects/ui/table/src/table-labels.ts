import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-table`. See ADR 0004. */
export interface UiTableLabels {
  /** Status shown when there are no rows. */
  readonly empty: string;
  /** Status shown while rows are loading. */
  readonly loading: string;
  /** Alert shown when rows failed to load. */
  readonly error: string;
  /** Screen-reader header of the single-selection column. */
  readonly selectionColumn: string;
  /** Accessible name of the select-all checkbox. */
  readonly selectAll: string;
  /** Accessible name prefix of a row selection control, followed by the row key. */
  readonly selectRow: string;
  /** Accessible name of the pagination navigation landmark. */
  readonly pagination: string;
  /** Visible text of the previous page button. */
  readonly previousText: string;
  /** Visible text of the next page button. */
  readonly nextText: string;
  /** Accessible name of the previous page button. */
  readonly previousPage: string;
  /** Accessible name of the next page button. */
  readonly nextPage: string;
  /** Visible range summary; receives `0, 0, 0` when there are no items. */
  readonly paginationSummary: (start: number, end: number, total: number) => string;
  /** Visible current page status. */
  readonly pageStatus: (page: number, totalPages: number) => string;
}

const DEFAULT_LABELS: UiTableLabels = {
  empty: 'No records found.',
  loading: 'Loading records...',
  error: 'Unable to load records.',
  selectionColumn: 'Row selection',
  selectAll: 'Select all rows on this page',
  selectRow: 'Select row',
  pagination: 'Table pagination',
  previousText: 'Previous',
  nextText: 'Next',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  paginationSummary: (start, end, total) =>
    total === 0 ? '0 items' : `${start}–${end} of ${total}`,
  pageStatus: (page, totalPages) => `Page ${page} of ${totalPages}`,
};

/** Labels used by `ui-table`. Defaults to English; override with `provideUiTableLabels()`. */
export const UI_TABLE_LABELS = new InjectionToken<UiTableLabels>('UI_TABLE_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-table` built-in text, merging over labels provided by a parent injector. */
export function provideUiTableLabels(labels: Partial<UiTableLabels>): Provider {
  return {
    provide: UI_TABLE_LABELS,
    useFactory: (): UiTableLabels => ({
      ...(inject(UI_TABLE_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
