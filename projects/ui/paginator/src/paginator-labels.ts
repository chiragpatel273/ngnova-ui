import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-paginator`. See ADR 0004. */
export interface UiPaginatorLabels {
  /** Accessible name of the pagination navigation landmark. */
  readonly navigation: string;
  /** Visible label of the page size select. */
  readonly itemsPerPage: string;
  /** Accessible name of the first page button. */
  readonly firstPage: string;
  /** Accessible name of the previous page button. */
  readonly previousPage: string;
  /** Accessible name of the next page button. */
  readonly nextPage: string;
  /** Accessible name of the last page button. */
  readonly lastPage: string;
  /** Accessible name of a numbered page button. */
  readonly page: (page: number) => string;
  /** Visible range summary; receives `0, 0, 0` when there are no items. */
  readonly range: (start: number, end: number, total: number) => string;
}

const DEFAULT_LABELS: UiPaginatorLabels = {
  navigation: 'Pagination',
  itemsPerPage: 'Items per page',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  page: (page) => `Page ${page}`,
  range: (start, end, total) => `${start}–${end} of ${total}`,
};

/** Labels used by `ui-paginator`. Defaults to English; override with `provideUiPaginatorLabels()`. */
export const UI_PAGINATOR_LABELS = new InjectionToken<UiPaginatorLabels>('UI_PAGINATOR_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-paginator` built-in text, merging over labels provided by a parent injector. */
export function provideUiPaginatorLabels(labels: Partial<UiPaginatorLabels>): Provider {
  return {
    provide: UI_PAGINATOR_LABELS,
    useFactory: (): UiPaginatorLabels => ({
      ...(inject(UI_PAGINATOR_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
