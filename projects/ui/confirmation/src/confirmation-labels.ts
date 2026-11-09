import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-confirmation-dialog`. See ADR 0004. */
export interface UiConfirmationLabels {
  /** Confirm button text when the request sets no `confirmLabel`. */
  readonly confirm: string;
  /** Cancel button text when the request sets no `cancelLabel`. */
  readonly cancel: string;
  /** Typed-confirmation field label when the request sets no `requireTextLabel`. */
  readonly prompt: string;
  /** Hint shown before the text that must be typed. */
  readonly promptHint: string;
  /** Status announcing how many confirmations are queued behind the current one. */
  readonly pendingConfirmations: (count: number) => string;
}

const DEFAULT_LABELS: UiConfirmationLabels = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  prompt: 'Confirmation text',
  promptHint: 'Type exactly:',
  pendingConfirmations: (count) => `${count} more confirmations pending`,
};

/**
 * Labels used by `ui-confirmation-dialog`. Defaults to English; override with
 * `provideUiConfirmationLabels()`.
 */
export const UI_CONFIRMATION_LABELS = new InjectionToken<UiConfirmationLabels>(
  'UI_CONFIRMATION_LABELS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_LABELS,
  },
);

/**
 * Overrides `ui-confirmation-dialog` built-in text, merging over labels provided by a parent
 * injector.
 */
export function provideUiConfirmationLabels(labels: Partial<UiConfirmationLabels>): Provider {
  return {
    provide: UI_CONFIRMATION_LABELS,
    useFactory: (): UiConfirmationLabels => ({
      ...(inject(UI_CONFIRMATION_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
