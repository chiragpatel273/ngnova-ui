import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-tree-table`. See ADR 0004. */
export interface UiTreeTableLabels {
  /** Accessible name of the tree grid. */
  readonly caption: string;
  /** Status shown while rows are loading. */
  readonly loading: string;
  /** Alert shown when rows failed to load. */
  readonly error: string;
  /** Status shown when there are no rows. */
  readonly empty: string;
  /** Accessible name of the button that expands a collapsed row. */
  readonly expand: string;
  /** Accessible name of the button that collapses an expanded row. */
  readonly collapse: string;
}

const DEFAULT_LABELS: UiTreeTableLabels = {
  caption: 'Tree table',
  loading: 'Loading rows...',
  error: 'Unable to load rows.',
  empty: 'No rows found.',
  expand: 'Expand row',
  collapse: 'Collapse row',
};

/** Labels used by `ui-tree-table`. Defaults to English; override with `provideUiTreeTableLabels()`. */
export const UI_TREE_TABLE_LABELS = new InjectionToken<UiTreeTableLabels>('UI_TREE_TABLE_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-tree-table` built-in text, merging over labels provided by a parent injector. */
export function provideUiTreeTableLabels(labels: Partial<UiTreeTableLabels>): Provider {
  return {
    provide: UI_TREE_TABLE_LABELS,
    useFactory: (): UiTreeTableLabels => ({
      ...(inject(UI_TREE_TABLE_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
