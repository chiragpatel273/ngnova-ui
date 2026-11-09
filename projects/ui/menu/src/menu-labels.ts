import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-menu`. See ADR 0004. */
export interface UiMenuLabels {
  /** Accessible name of the menu panel. */
  readonly menu: string;
}

const DEFAULT_LABELS: UiMenuLabels = {
  menu: 'Actions',
};

/** Labels used by `ui-menu`. Defaults to English; override with `provideUiMenuLabels()`. */
export const UI_MENU_LABELS = new InjectionToken<UiMenuLabels>('UI_MENU_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-menu` built-in text, merging over labels provided by a parent injector. */
export function provideUiMenuLabels(labels: Partial<UiMenuLabels>): Provider {
  return {
    provide: UI_MENU_LABELS,
    useFactory: (): UiMenuLabels => ({
      ...(inject(UI_MENU_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
