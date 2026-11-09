import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-command-palette`. See ADR 0004. */
export interface UiCommandPaletteLabels {
  /** Accessible name of the palette dialog. */
  readonly palette: string;
  /** Accessible name of the search input. */
  readonly search: string;
  /** Accessible name of the results listbox. */
  readonly results: string;
  /** Placeholder of the search input. */
  readonly placeholder: string;
  /** Message shown when no command matches the query. */
  readonly empty: string;
  /** Message shown while commands are loading. */
  readonly loading: string;
  /** Accessible name of the close button. */
  readonly close: string;
  /** Keyboard usage hint shown in the footer. */
  readonly hint: string;
  /** Open shortcut hint shown in the footer. */
  readonly shortcut: string;
}

const DEFAULT_LABELS: UiCommandPaletteLabels = {
  palette: 'Command palette',
  search: 'Search commands',
  results: 'Available commands',
  placeholder: 'Type a command or search...',
  empty: 'No commands found.',
  loading: 'Loading commands...',
  close: 'Close command palette',
  hint: 'Use arrow keys to navigate and Enter to select',
  shortcut: 'Ctrl or Command + K',
};

/**
 * Labels used by `ui-command-palette`. Defaults to English; override with
 * `provideUiCommandPaletteLabels()`.
 */
export const UI_COMMAND_PALETTE_LABELS = new InjectionToken<UiCommandPaletteLabels>(
  'UI_COMMAND_PALETTE_LABELS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_LABELS,
  },
);

/**
 * Overrides `ui-command-palette` built-in text, merging over labels provided by a parent
 * injector.
 */
export function provideUiCommandPaletteLabels(labels: Partial<UiCommandPaletteLabels>): Provider {
  return {
    provide: UI_COMMAND_PALETTE_LABELS,
    useFactory: (): UiCommandPaletteLabels => ({
      ...(inject(UI_COMMAND_PALETTE_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
