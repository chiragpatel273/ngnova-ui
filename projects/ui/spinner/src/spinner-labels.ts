import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-spinner`. See ADR 0004. */
export interface UiSpinnerLabels {
  /** Accessible status name, also used when the `label` input is empty. */
  readonly loading: string;
}

const DEFAULT_LABELS: UiSpinnerLabels = {
  loading: 'Loading',
};

/** Labels used by `ui-spinner`. Defaults to English; override with `provideUiSpinnerLabels()`. */
export const UI_SPINNER_LABELS = new InjectionToken<UiSpinnerLabels>('UI_SPINNER_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-spinner` built-in text, merging over labels provided by a parent injector. */
export function provideUiSpinnerLabels(labels: Partial<UiSpinnerLabels>): Provider {
  return {
    provide: UI_SPINNER_LABELS,
    useFactory: (): UiSpinnerLabels => ({
      ...(inject(UI_SPINNER_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
