import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-input`. See ADR 0004. */
export interface UiInputLabels {
  /** Validation messages keyed by form error key; the `validationMessages` input wins per key. */
  readonly validationMessages: Readonly<Record<string, string>>;
  /** Validation message for error keys without a message. */
  readonly invalidValue: string;
  /** Accessible name of the clear button. */
  readonly clear: string;
  /** Visible text of the clear button while its accessible name is the default. */
  readonly clearText: string;
  /** Accessible name of the reveal button while the password is hidden. */
  readonly showPassword: string;
  /** Visible text of the reveal button while its accessible name is the default. */
  readonly showText: string;
  /** Accessible name of the reveal button while the password is visible. */
  readonly hidePassword: string;
  /** Visible text of the hide button while its accessible name is the default. */
  readonly hideText: string;
}

const DEFAULT_LABELS: UiInputLabels = {
  validationMessages: {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    minlength: 'The value is too short.',
    maxlength: 'The value is too long.',
    min: 'The value is below the minimum.',
    max: 'The value is above the maximum.',
    pattern: 'Enter a valid value.',
  },
  invalidValue: 'Enter a valid value.',
  clear: 'Clear input',
  clearText: 'Clear',
  showPassword: 'Show password',
  showText: 'Show',
  hidePassword: 'Hide password',
  hideText: 'Hide',
};

/** Labels used by `ui-input`. Defaults to English; override with `provideUiInputLabels()`. */
export const UI_INPUT_LABELS = new InjectionToken<UiInputLabels>('UI_INPUT_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/**
 * Overrides `ui-input` built-in text, merging over labels provided by a parent injector.
 * `validationMessages` merges per key over the parent map.
 */
export function provideUiInputLabels(labels: Partial<UiInputLabels>): Provider {
  return {
    provide: UI_INPUT_LABELS,
    useFactory: (): UiInputLabels => {
      const parent = inject(UI_INPUT_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS;
      return {
        ...parent,
        ...labels,
        validationMessages: { ...parent.validationMessages, ...labels.validationMessages },
      };
    },
  };
}
