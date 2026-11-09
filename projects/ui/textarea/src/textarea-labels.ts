import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-textarea`. See ADR 0004. */
export interface UiTextareaLabels {
  /** Validation messages keyed by form error key; the `validationMessages` input wins per key. */
  readonly validationMessages: Readonly<Record<string, string>>;
  /** Validation message for error keys without a message. */
  readonly invalidValue: string;
}

const DEFAULT_LABELS: UiTextareaLabels = {
  validationMessages: {
    required: 'This field is required.',
    minlength: 'The value is too short.',
    maxlength: 'The value is too long.',
  },
  invalidValue: 'Enter a valid value.',
};

/** Labels used by `ui-textarea`. Defaults to English; override with `provideUiTextareaLabels()`. */
export const UI_TEXTAREA_LABELS = new InjectionToken<UiTextareaLabels>('UI_TEXTAREA_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/**
 * Overrides `ui-textarea` built-in text, merging over labels provided by a parent injector.
 * `validationMessages` merges per key over the parent map.
 */
export function provideUiTextareaLabels(labels: Partial<UiTextareaLabels>): Provider {
  return {
    provide: UI_TEXTAREA_LABELS,
    useFactory: (): UiTextareaLabels => {
      const parent =
        inject(UI_TEXTAREA_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS;
      return {
        ...parent,
        ...labels,
        validationMessages: { ...parent.validationMessages, ...labels.validationMessages },
      };
    },
  };
}
