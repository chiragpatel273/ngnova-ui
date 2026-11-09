import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-tree`. See ADR 0004. */
export interface UiTreeLabels {
  /** Accessible name of the tree. */
  readonly tree: string;

  /** Status text shown when the tree has no nodes. */
  readonly empty: string;
}

const DEFAULT_LABELS: UiTreeLabels = {
  tree: 'Tree',
  empty: 'No items.',
};

/** Labels used by `ui-tree`. Defaults to English; override with `provideUiTreeLabels()`. */
export const UI_TREE_LABELS = new InjectionToken<UiTreeLabels>('UI_TREE_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-tree` built-in text, merging over labels provided by a parent injector. */
export function provideUiTreeLabels(labels: Partial<UiTreeLabels>): Provider {
  return {
    provide: UI_TREE_LABELS,
    useFactory: (): UiTreeLabels => ({
      ...(inject(UI_TREE_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
