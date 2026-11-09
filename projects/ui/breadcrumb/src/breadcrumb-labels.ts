import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-breadcrumb`. See ADR 0004. */
export interface UiBreadcrumbLabels {
  /** Accessible name of the breadcrumb navigation landmark. */
  readonly navigation: string;
}

const DEFAULT_LABELS: UiBreadcrumbLabels = {
  navigation: 'Breadcrumb',
};

/** Labels used by `ui-breadcrumb`. Defaults to English; override with `provideUiBreadcrumbLabels()`. */
export const UI_BREADCRUMB_LABELS = new InjectionToken<UiBreadcrumbLabels>('UI_BREADCRUMB_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_LABELS,
});

/** Overrides `ui-breadcrumb` built-in text, merging over labels provided by a parent injector. */
export function provideUiBreadcrumbLabels(labels: Partial<UiBreadcrumbLabels>): Provider {
  return {
    provide: UI_BREADCRUMB_LABELS,
    useFactory: (): UiBreadcrumbLabels => ({
      ...(inject(UI_BREADCRUMB_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
