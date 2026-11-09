import { InjectionToken, type Provider, inject } from '@angular/core';

import type { UiStepState } from './stepper';

/** Values available to the `step` label of `ui-stepper`. */
export interface UiStepperStepLabelContext {
  /** The step's visible label. */
  readonly label: string;
  /** One-based position of the step. */
  readonly position: number;
  /** Total number of steps. */
  readonly total: number;
  /** Current state of the step. */
  readonly status: UiStepState;
}

/** Built-in text rendered by `ui-stepper`. See ADR 0004. */
export interface UiStepperLabels {
  /** Accessible name of the step navigation landmark. */
  readonly navigation: string;
  /** Visible marker shown under optional steps. */
  readonly optional: string;
  /** Accessible name of a selectable step button. */
  readonly step: (context: UiStepperStepLabelContext) => string;
}

const DEFAULT_LABELS: UiStepperLabels = {
  navigation: 'Progress',
  optional: 'Optional',
  step: ({ label, position, total, status }) => `${label}, step ${position} of ${total}, ${status}`,
};

/** Labels used by `ui-stepper`. Defaults to English; override with `provideUiStepperLabels()`. */
export const UI_STEPPER_LABELS = new InjectionToken<UiStepperLabels>('UI_STEPPER_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-stepper` built-in text, merging over labels provided by a parent injector. */
export function provideUiStepperLabels(labels: Partial<UiStepperLabels>): Provider {
  return {
    provide: UI_STEPPER_LABELS,
    useFactory: (): UiStepperLabels => ({
      ...(inject(UI_STEPPER_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
