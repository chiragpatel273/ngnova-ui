import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-toast`. See ADR 0004. */
export interface UiToastLabels {
  /** Accessible name of each notification's dismiss button. */
  readonly dismiss: string;
}

const DEFAULT_LABELS: UiToastLabels = {
  dismiss: 'Dismiss notification',
};

/** Labels used by `ui-toast`. Defaults to English; override with `provideUiToastLabels()`. */
export const UI_TOAST_LABELS = new InjectionToken<UiToastLabels>('UI_TOAST_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-toast` built-in text, merging over labels provided by a parent injector. */
export function provideUiToastLabels(labels: Partial<UiToastLabels>): Provider {
  return {
    provide: UI_TOAST_LABELS,
    useFactory: (): UiToastLabels => ({
      ...(inject(UI_TOAST_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
