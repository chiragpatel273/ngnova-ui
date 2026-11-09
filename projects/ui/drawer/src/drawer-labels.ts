import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-drawer`. See ADR 0004. */
export interface UiDrawerLabels {
  /** Accessible name of the close button. */
  readonly close: string;
}

const DEFAULT_LABELS: UiDrawerLabels = {
  close: 'Close drawer',
};

/** Labels used by `ui-drawer`. Defaults to English; override with `provideUiDrawerLabels()`. */
export const UI_DRAWER_LABELS = new InjectionToken<UiDrawerLabels>('UI_DRAWER_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-drawer` built-in text, merging over labels provided by a parent injector. */
export function provideUiDrawerLabels(labels: Partial<UiDrawerLabels>): Provider {
  return {
    provide: UI_DRAWER_LABELS,
    useFactory: (): UiDrawerLabels => ({
      ...(inject(UI_DRAWER_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
