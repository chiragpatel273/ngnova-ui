import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-tabs`. See ADR 0004. */
export interface UiTabsLabels {
  /** Accessible name of the tab list. */
  readonly tabList: string;
}

const DEFAULT_LABELS: UiTabsLabels = {
  tabList: 'Tabs',
};

/** Labels used by `ui-tabs`. Defaults to English; override with `provideUiTabsLabels()`. */
export const UI_TABS_LABELS = new InjectionToken<UiTabsLabels>('UI_TABS_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-tabs` built-in text, merging over labels provided by a parent injector. */
export function provideUiTabsLabels(labels: Partial<UiTabsLabels>): Provider {
  return {
    provide: UI_TABS_LABELS,
    useFactory: (): UiTabsLabels => ({
      ...(inject(UI_TABS_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
