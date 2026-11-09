import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-button`. See ADR 0004. */
export interface UiButtonLabels {
  /** Screen reader text announced while the button is loading. */
  readonly loading: string;
}

const DEFAULT_LABELS: UiButtonLabels = {
  loading: 'Loading',
};

/** Labels used by `ui-button`. Defaults to English; override with `provideUiButtonLabels()`. */
export const UI_BUTTON_LABELS = new InjectionToken<UiButtonLabels>('UI_BUTTON_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-button` built-in text, merging over labels provided by a parent injector. */
export function provideUiButtonLabels(labels: Partial<UiButtonLabels>): Provider {
  return {
    provide: UI_BUTTON_LABELS,
    useFactory: (): UiButtonLabels => ({
      ...(inject(UI_BUTTON_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
