import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-alert`. See ADR 0004. */
export interface UiAlertLabels {
  /** Accessible name of the dismiss button. */
  readonly dismiss: string;
}

const DEFAULT_LABELS: UiAlertLabels = {
  dismiss: 'Dismiss alert',
};

/** Labels used by `ui-alert`. Defaults to English; override with `provideUiAlertLabels()`. */
export const UI_ALERT_LABELS = new InjectionToken<UiAlertLabels>('UI_ALERT_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-alert` built-in text, merging over labels provided by a parent injector. */
export function provideUiAlertLabels(labels: Partial<UiAlertLabels>): Provider {
  return {
    provide: UI_ALERT_LABELS,
    useFactory: (): UiAlertLabels => ({
      ...(inject(UI_ALERT_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
