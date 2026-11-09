import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-progress-bar`. See ADR 0004. */
export interface UiProgressBarLabels {
  /** Accessible name of the progress bar. */
  readonly progress: string;
}

const DEFAULT_LABELS: UiProgressBarLabels = {
  progress: 'Progress',
};

/** Labels used by `ui-progress-bar`. Defaults to English; override with `provideUiProgressBarLabels()`. */
export const UI_PROGRESS_BAR_LABELS = new InjectionToken<UiProgressBarLabels>(
  'UI_PROGRESS_BAR_LABELS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_LABELS,
  },
);

/** Overrides `ui-progress-bar` built-in text, merging over labels provided by a parent injector. */
export function provideUiProgressBarLabels(labels: Partial<UiProgressBarLabels>): Provider {
  return {
    provide: UI_PROGRESS_BAR_LABELS,
    useFactory: (): UiProgressBarLabels => ({
      ...(inject(UI_PROGRESS_BAR_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
