import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-modal`. See ADR 0004. */
export interface UiModalLabels {
  /** Accessible name of the close button. */
  readonly close: string;
}

const DEFAULT_LABELS: UiModalLabels = {
  close: 'Close dialog',
};

/** Labels used by `ui-modal`. Defaults to English; override with `provideUiModalLabels()`. */
export const UI_MODAL_LABELS = new InjectionToken<UiModalLabels>('UI_MODAL_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-modal` built-in text, merging over labels provided by a parent injector. */
export function provideUiModalLabels(labels: Partial<UiModalLabels>): Provider {
  return {
    provide: UI_MODAL_LABELS,
    useFactory: (): UiModalLabels => ({
      ...(inject(UI_MODAL_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
