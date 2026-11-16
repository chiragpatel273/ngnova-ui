# @ngnova/ui

## 1.1.0

### Minor Changes

- f243d04: Add translatable built-in labels. Twenty-six components with built-in text (accessible names,
  status messages, and button text) now export a typed labels provider from their own entry point,
  for example `provideUiModalLabels({ close: 'Fermer' })`, plus a matching `UI_<NAME>_LABELS` token
  and `Ui<Name>Labels` interface. Providers merge partial overrides and can be scoped to routes or
  components; explicit inputs still win. Formerly fixed English text in Stepper, Table, Spinner,
  Combobox, File Upload, Input, and Textarea is now replaceable, with label functions for ranges,
  counts, step positions, and file sizes. English output is unchanged when no provider is used.
- f243d04: Add an `ng add @ngnova/ui` schematic. It installs Tailwind CSS v4 and its PostCSS plugin when they
  are missing, imports the optional theme stylesheet, configures class-based or media dark mode, adds
  the `@source` entry Tailwind needs to scan the package, and can install `@angular/cdk` with
  `--cdk`. Re-running the schematic is safe, and Tailwind CSS v3 workspaces receive an upgrade hint
  instead of being modified.
- Add right-to-left support. Components now lay out with logical start/end utilities, mirror
  directional icons, and swap ArrowLeft/ArrowRight in Tabs, Tree, Tree Table, and Date Picker when
  the content is right-to-left. Set `dir="rtl"` on `<html>` or on any container; no provider or
  `@angular/cdk` dependency is needed. New direction-aware option values: Drawer `position: 'start' |
'end'`, Toast `position: 'top-end' | 'bottom-end'`, and Table and Tree Table column `align:
'start' | 'end'`. Table sticky `start`/`end` columns and Menu `align` now follow the text
  direction. Left-to-right rendering is unchanged.

### Patch Changes

- Fix keyboard focus in zoneless applications: opening Date Picker from the keyboard now focuses
  the active date, moving into a month that is not rendered yet keeps focus in the calendar, and
  opening Menu with ArrowDown or ArrowUp focuses the first or last item instead of dropping focus to
  the page. Escape now also closes a pointer-opened Menu while focus is still on its trigger.

## 1.0.2

### Patch Changes

- a3e1c84: Fix Date Picker integration with Angular 22 Signal Forms, document verified `FormField`
  compatibility across the NgNova value-control suite, and add an interactive Signal Forms
  validation and submission playground.

## 1.0.1

### Patch Changes

- Improve the published npm onboarding with direct links to the documentation, component catalog,
  GitHub repository, and runnable Angular 22 quick start.

## 1.0.0

### Major Changes

- Release the NgNova UI 1.0 contract: 40 documented Angular 22 standalone components, focused
  secondary entry points, semantic theme tokens, supported testing harnesses, accessible interaction
  contracts, segmented/underline/pills Tabs variants, advanced data/overlay workflows, MIT-licensed
  source and package artifacts, visual regression coverage, and verified zoneless, SSR, and
  hydration consumers.

  This promotes the final `0.1.0` candidate API to the first stable contract. Consumers upgrading
  from earlier pre-1.0 snapshots must follow the
  [1.0 migration guide](https://github.com/chiragpatel273/ngnova-ui/blob/main/docs/MIGRATION_TO_1_0.md).
