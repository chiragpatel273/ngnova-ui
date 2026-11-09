import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-chip`. See ADR 0004. */
export interface UiChipLabels {
  /** Accessible name of the remove button. */
  readonly remove: string;
}

const DEFAULT_LABELS: UiChipLabels = {
  remove: 'Remove',
};

/** Labels used by `ui-chip`. Defaults to English; override with `provideUiChipLabels()`. */
export const UI_CHIP_LABELS = new InjectionToken<UiChipLabels>('UI_CHIP_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-chip` built-in text, merging over labels provided by a parent injector. */
export function provideUiChipLabels(labels: Partial<UiChipLabels>): Provider {
  return {
    provide: UI_CHIP_LABELS,
    useFactory: (): UiChipLabels => ({
      ...(inject(UI_CHIP_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
