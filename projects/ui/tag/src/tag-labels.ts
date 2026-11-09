import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-tag`. See ADR 0004. */
export interface UiTagLabels {
  /** Accessible name of the remove button. */
  readonly remove: string;
}

const DEFAULT_LABELS: UiTagLabels = {
  remove: 'Remove tag',
};

/** Labels used by `ui-tag`. Defaults to English; override with `provideUiTagLabels()`. */
export const UI_TAG_LABELS = new InjectionToken<UiTagLabels>('UI_TAG_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-tag` built-in text, merging over labels provided by a parent injector. */
export function provideUiTagLabels(labels: Partial<UiTagLabels>): Provider {
  return {
    provide: UI_TAG_LABELS,
    useFactory: (): UiTagLabels => ({
      ...(inject(UI_TAG_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
