import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-combobox`. See ADR 0004. */
export interface UiComboboxLabels {
  /** Message shown when no option matches the query. */
  readonly noResults: string;
  /** Message shown while suggestions are loading. */
  readonly loading: string;
  /** Accessible name of the clear button. */
  readonly clear: string;
  /** Accessible name of the toggle button while the listbox is closed. */
  readonly open: string;
  /** Accessible name of the toggle button while the listbox is open. */
  readonly close: string;
  /** Accessible name of the listbox when neither `label` nor `ariaLabel` is set. */
  readonly suggestions: string;
}

const DEFAULT_LABELS: UiComboboxLabels = {
  noResults: 'No results found',
  loading: 'Loading suggestions',
  clear: 'Clear selection',
  open: 'Open suggestions',
  close: 'Close suggestions',
  suggestions: 'Suggestions',
};

/** Labels used by `ui-combobox`. Defaults to English; override with `provideUiComboboxLabels()`. */
export const UI_COMBOBOX_LABELS = new InjectionToken<UiComboboxLabels>('UI_COMBOBOX_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-combobox` built-in text, merging over labels provided by a parent injector. */
export function provideUiComboboxLabels(labels: Partial<UiComboboxLabels>): Provider {
  return {
    provide: UI_COMBOBOX_LABELS,
    useFactory: (): UiComboboxLabels => ({
      ...(inject(UI_COMBOBOX_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
