# Phase 3 Workflow Components Tracker

This tracker records release evidence for the workflow-completion components in Phase 3 of the
product roadmap. A component is Ready only when implementation, documentation, tests, harness,
package entry point, consumer build, accessibility behavior, and bundle contribution are verified.

| Order | Component             | Status | Entry point              | Harness               | Bundle evidence             |
| ----: | --------------------- | ------ | ------------------------ | --------------------- | --------------------------- |
|     1 | Tooltip               | Ready  | `@ngnova/ui/tooltip`     | `UiTooltipHarness`    | 10,138 B FESM / 2,014 B DTS |
|     2 | Popover               | Ready  | `@ngnova/ui/popover`     | `UiPopoverHarness`    | 12,319 B FESM / 2,808 B DTS |
|     3 | Drawer                | Ready  | `@ngnova/ui/drawer`      | `UiDrawerHarness`     | 15,917 B FESM / 3,483 B DTS |
|     4 | Menu / Dropdown Menu  | Ready  | `@ngnova/ui/menu`        | `UiMenuHarness`       | 12,496 B FESM / 3,099 B DTS |
|     5 | Divider               | Ready  | `@ngnova/ui/divider`     | Not required          | 3,401 B FESM / 899 B DTS    |
|     6 | Chip                  | Ready  | `@ngnova/ui/chip`        | `UiChipHarness`       | 6,831 B FESM / 1,547 B DTS  |
|     7 | Paginator             | Ready  | `@ngnova/ui/paginator`   | `UiPaginatorHarness`  | 13,714 B FESM / 3,355 B DTS |
|     8 | Breadcrumb            | Ready  | `@ngnova/ui/breadcrumb`  | `UiBreadcrumbHarness` | 6,522 B FESM / 1,512 B DTS  |
|     9 | Stepper               | Ready  | `@ngnova/ui/stepper`     | `UiStepperHarness`    | 13,658 B FESM / 2,650 B DTS |
|    10 | Form Field foundation | Ready  | `@ngnova/ui/form-field`  | `UiFormFieldHarness`  | 12,453 B FESM / 3,518 B DTS |
|    11 | Autocomplete/Combobox | Ready  | `@ngnova/ui/combobox`    | `UiComboboxHarness`   | 29,654 B FESM / 5,711 B DTS |
|    12 | Date Picker           | Ready  | `@ngnova/ui/date-picker` | `UiDatePickerHarness` | 38,878 B FESM / 6,285 B DTS |

## Tooltip Evidence

Completed: 2026-07-22

- Directive API supports plain text, four preferred positions, collision flipping and clamping,
  show/hide delays, disabled state, and stable generated or consumer-provided IDs.
- Hover and focus open the tooltip; leaving schedules dismissal; hovering the overlay preserves it;
  Escape closes immediately without moving focus.
- Existing `aria-describedby` values are preserved and restored, with `role="tooltip"` applied only
  while visible.
- Body overlay placement responds to resize and scroll and all timers, nodes, relationships, and
  listeners are removed on destroy.
- `UiTooltipHarness` is exported from `@ngnova/ui/testing` and exercises focus, document-overlay
  text, and Escape dismissal.
- Component docs cover purpose, non-goals, accessibility, keyboard behavior, collision handling,
  cleanup, API, and testing.
- Targeted directive/harness tests, docs API validation, library/docs builds, package audit, and the
  secondary entry point passed. Testing FESM after the harness is 18,781 bytes before compression.

## Popover Evidence

Completed: 2026-07-22

- Projected trigger and content directives support interactive contextual panels with controlled
  `open` state and `openChange`, `opened`, and `closed` lifecycle outputs.
- Trigger semantics include `aria-haspopup`, `aria-expanded`, and `aria-controls`; panels use a
  consumer-provided accessible label or visible title relationship.
- Native Popover API enhancement uses the browser top layer where available while fixed positioning
  remains functional as a fallback.
- Preferred placement flips at viewport edges, clamps on the cross axis, and responds to resize and
  scroll.
- Outside-pointer and Escape dismissal are independently configurable; Escape restores trigger
  focus and all global listeners are cleaned up after close and destroy.
- `UiPopoverHarness` is exported from `@ngnova/ui/testing` and exercises controlled open state,
  projected content, and keyboard dismissal.
- Eight focused component tests, the shared harness suite, 22-component docs API validation, both
  builds and test suites, package audit/dry-run, and the clean consumer smoke build passed.

## Drawer Evidence

Completed: 2026-07-22

- Four edge positions and three public-token sizes support side-sheet and vertical-sheet workflows
  without exceeding the viewport.
- Modal dialog naming, initial focus, Tab wrapping, topmost Escape behavior, backdrop policy,
  document scroll locking, focus restoration, and destroy cleanup are implemented.
- Projected header and footer directives keep titles and actions semantically consistent, while all
  close behavior remains controlled through `openChange`.
- `UiDrawerHarness` is exported from `@ngnova/ui/testing` and reads open state, title, position, and
  drives the close action.
- Seven focused component tests plus the shared harness suite pass; all 251 library tests and 11 docs
  tests pass.
- The 23-component docs/API contract, 21-token theme contract, library/docs builds, package audit,
  78-file npm dry-run, and clean consumer build all pass.

## Menu / Dropdown Menu Evidence

Completed: 2026-07-22

- Projected triggers receive complete menu relationships and open a named action collection aligned
  to either trigger edge.
- Commands and links support disabled, destructive, and separator states with typed item and
  selection APIs.
- Arrow wrap, Home/End, first/last opening, buffered typeahead, Escape focus restoration, Tab
  dismissal, outside dismissal, and optional persistent selection are covered.
- `UiMenuHarness` is exported from `@ngnova/ui/testing` and opens, enumerates, selects, and dismisses
  actions by visible text.
- Six focused behavior tests plus the shared harness test pass; all 258 library tests and 11 docs
  tests pass.
- The 24-component docs/API contract, package audit, 81-file npm dry-run, library/docs builds, and
  clean consumer smoke build pass.

## Divider Evidence

Completed: 2026-07-23

- Horizontal and vertical orientation, four inset modes, optional visible labels, and decorative or
  meaningful separator semantics are implemented with static token-compatible styling.
- Three focused tests cover presentation semantics, named separators, labels, direction, and inset
  styling; a harness is intentionally unnecessary for this non-interactive component.
- All 261 library tests and 11 docs tests pass alongside the 25-component docs/API contract,
  package audit, 84-file npm dry-run, both builds, and clean consumer smoke build.

## Chip Evidence

Completed: 2026-07-23

- Read-only, selectable, removable, combined, and disabled modes share two sizes and five semantic
  variants without mutating parent-owned selection or collection state.
- Selectable chips use native pressed buttons; removal is a separately named native action and long
  labels truncate without obscuring removal.
- A projection regression discovered by the shared harness was fixed by defining projected content
  once and reusing it across conditional render modes.
- `UiChipHarness` is exported from `@ngnova/ui/testing` and locates by visible text, reads and toggles
  selection, and activates removal.
- All 265 library tests and 11 docs tests pass with the 26-component docs/API contract, package
  audit, 87-file npm dry-run, both builds, and clean consumer smoke build.

## Paginator Evidence

Completed: 2026-07-23

- One-based page and page-size state remain parent controlled while invalid page, size, total, and
  sibling inputs are safely normalized for rendering and emitted requests.
- Compact page ranges, deterministic ellipses, first/previous/next/last controls, native page-size
  selection, empty state, disabled state, and current-page semantics are implemented.
- Every visible and accessible label can be localized, including callbacks for numbered page names
  and live collection ranges.
- `UiPaginatorHarness` is exported from `@ngnova/ui/testing` and reads page and range state, navigates,
  and selects available page sizes.
- All 271 library tests and 11 docs tests pass with the 27-component docs/API contract, package
  audit, 90-file npm dry-run, both builds, and clean consumer smoke build.

## Breadcrumb Evidence

Completed: 2026-07-23

- Semantic hierarchy navigation uses a named `nav`, ordered list, native ancestor links, decorative
  separators, and one resolved `aria-current="page"` item.
- Optional middle collapsing preserves the first location and nearest ancestors; invalid limits
  safely fall back to the full hierarchy, and long labels truncate without changing accessible text.
- `itemSelected` reports the original item, source index, and native event while preserving a real
  `href` for progressive navigation behavior.
- `UiBreadcrumbHarness` is exported from `@ngnova/ui/testing` and reads hierarchy labels and current
  state, detects collapsed paths, and follows linked ancestors.
- All 276 library tests and 11 docs tests pass with the 28-component docs/API contract, package
  audit, 93-file npm dry-run, both builds, and clean consumer smoke build.

## Stepper Evidence

Completed: 2026-07-23

- Controlled active state supports horizontal and vertical layouts, linear backward-only header
  navigation, non-interactive display, and first-enabled fallback without mutating parent state.
- Complete, current, error, upcoming, optional, and disabled states have distinct text, structure,
  and visual treatments with local horizontal overflow and readable vertical descriptions.
- A named navigation landmark and ordered list expose the workflow; `aria-current="step"` labels the
  projected active region through stable generated or consumer-supplied IDs.
- `UiStepperHarness` is exported from `@ngnova/ui/testing` and reads labels, states, current step,
  orientation, projected content, and selectable navigation.
- All 283 library tests and 11 docs tests pass with the 29-component docs/API contract, package
  audit, 96-file npm dry-run, both builds, and clean consumer smoke build.

## Form Field Foundation Evidence

Completed: 2026-07-23

- A composable field shell supports visible or hidden native labels, helper and polite error
  messaging, prefix/suffix slots, outline/filled appearances, and three control sizes.
- `uiFormFieldControl` preserves consumer IDs and description tokens while merging generated label,
  helper/error, invalid, required, and disabled ARIA relationships; Angular Forms still owns value
  and native interaction state.
- Registration and cleanup work without parent-state mutation, and the control directive safely
  remains inert when used outside a Form Field.
- `UiFormFieldHarness` is exported from `@ngnova/ui/testing` and locates by label, reads and writes
  projected values, reads messages, and inspects required, invalid, and disabled states.
- All 290 library tests and 11 docs tests pass with the 30-component docs/API contract, package
  audit, 99-file npm dry-run, both builds, and clean consumer smoke build.

## Autocomplete / Combobox Evidence

Completed: 2026-07-23

- Single-select Angular Forms state remains separate from visible query text, with local
  label/description filtering or parent-owned server results, clearing, and explicit loading and
  empty states.
- The input/listbox pattern implements expanded, controls, autocomplete, active-descendant,
  selected, disabled, busy, required, invalid, label, and description relationships while DOM focus
  remains on the input.
- Arrow, Home, End, Enter, Escape, Tab, pointer, outside-click, disabled-option, localization, three
  sizes, and open-state behavior are implemented without mutating parent-owned option collections.
- `UiComboboxHarness` is exported from `@ngnova/ui/testing` and queries, opens, closes, filters,
  reads active/options/message state, selects, clears, and inspects disabled state.
- All 297 library tests and 11 docs tests pass with the 31-component docs/API contract, package
  audit, 102-file npm dry-run, both builds, and clean consumer smoke build.

## Date Picker Evidence

Completed: 2026-07-23

- Angular Forms reads and writes timezone-stable ISO dates while Intl localizes selected, month,
  weekday, and full-date accessible labels; invalid external values resolve safely to empty.
- The non-modal dialog has a stable six-week calendar grid, configurable week start and outside
  dates, min/max and explicit blackouts, bounded month navigation, today, clearing, and three sizes.
- Roving day focus supports Arrow, Home, End, Page Up/Down, Shift-year, Enter, Space, Escape, pointer,
  outside-click, focus-leave, and focus-return paths with disabled dates skipped.
- `UiDatePickerHarness` is exported from `@ngnova/ui/testing` and reads display/month/visible-date
  state, opens, closes, navigates months, selects, clears, and inspects disabled state.
- All 305 library tests and 11 docs tests pass with the 32-component docs/API contract, package
  audit, 105-file npm dry-run, both builds, and clean consumer smoke build.
