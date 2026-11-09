import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-data-view`. See ADR 0004. */
export interface UiDataViewLabels {
  /** Message shown while items are loading. */
  readonly loading: string;
  /** Message shown when items fail to load. */
  readonly error: string;
  /** Message shown when there are no items. */
  readonly empty: string;
  /** Accessible name of the data view region. */
  readonly region: string;
  /** Accessible name of the layout toggle group. */
  readonly layout: string;
  /** Text of the grid layout button. */
  readonly grid: string;
  /** Text of the list layout button. */
  readonly list: string;
}

const DEFAULT_LABELS: UiDataViewLabels = {
  loading: 'Loading items...',
  error: 'Unable to load items.',
  empty: 'No items found.',
  region: 'Data view',
  layout: 'Choose layout',
  grid: 'Grid',
  list: 'List',
};

/**
 * Labels used by `ui-data-view`. Defaults to English; override with
 * `provideUiDataViewLabels()`.
 */
export const UI_DATA_VIEW_LABELS = new InjectionToken<UiDataViewLabels>('UI_DATA_VIEW_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-data-view` built-in text, merging over labels provided by a parent injector. */
export function provideUiDataViewLabels(labels: Partial<UiDataViewLabels>): Provider {
  return {
    provide: UI_DATA_VIEW_LABELS,
    useFactory: (): UiDataViewLabels => ({
      ...(inject(UI_DATA_VIEW_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
