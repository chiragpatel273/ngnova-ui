import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-date-picker`. See ADR 0004. */
export interface UiDatePickerLabels {
  /** Placeholder of the date input. */
  readonly placeholder: string;
  /** Accessible name of the calendar dialog. */
  readonly calendar: string;
  /** Accessible name of the toggle button while the calendar is closed. */
  readonly open: string;
  /** Accessible name of the toggle button while the calendar is open. */
  readonly close: string;
  /** Accessible name of the clear button. */
  readonly clear: string;
  /** Accessible name of the previous month button. */
  readonly previousMonth: string;
  /** Accessible name of the next month button. */
  readonly nextMonth: string;
  /** Text of the button that selects today. */
  readonly today: string;
}

const DEFAULT_LABELS: UiDatePickerLabels = {
  placeholder: 'Select a date',
  calendar: 'Choose date',
  open: 'Open calendar',
  close: 'Close calendar',
  clear: 'Clear date',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  today: 'Today',
};

/**
 * Labels used by `ui-date-picker`. Defaults to English; override with
 * `provideUiDatePickerLabels()`.
 */
export const UI_DATE_PICKER_LABELS = new InjectionToken<UiDatePickerLabels>(
  'UI_DATE_PICKER_LABELS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_LABELS,
  },
);

/** Overrides `ui-date-picker` built-in text, merging over labels provided by a parent injector. */
export function provideUiDatePickerLabels(labels: Partial<UiDatePickerLabels>): Provider {
  return {
    provide: UI_DATE_PICKER_LABELS,
    useFactory: (): UiDatePickerLabels => ({
      ...(inject(UI_DATE_PICKER_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
