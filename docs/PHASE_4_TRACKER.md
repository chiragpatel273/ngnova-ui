# Phase 4 Data And Enterprise Depth Tracker

This tracker records release evidence for Phase 4. An item is Ready only when its advanced behavior
is independently importable, documented, tested for accessibility and large-data risks, package
audited, bundle measured, and verified in the clean consumer release gate.

| Order | Capability                              | Status | Entry point                       | Harness / evidence            | Bundle evidence                                              |
| ----: | --------------------------------------- | ------ | --------------------------------- | ----------------------------- | ------------------------------------------------------------ |
|     1 | Table composition and headless state    | Ready  | `@ngnova/ui/table-state`          | Table harness extension       | 20,497 / 4,960-byte Table; 3,739 / 1,994-byte state FESM/DTS |
|     2 | Table advanced states and orchestration | Ready  | `@ngnova/ui/table`                | Extended Table harness        | 44,001 / 9,622-byte FESM/DTS                                 |
|     3 | Virtual scrolling CDK integration       | Ready  | `@ngnova/ui/table-virtual-scroll` | 10,000-row bounded DOM        | 11,114 / 3,233-byte FESM/DTS                                 |
|     4 | Data View                               | Ready  | `@ngnova/ui/data-view`            | `UiDataViewHarness`           | 14,874 / 3,919-byte FESM/DTS                                 |
|     5 | Tree                                    | Ready  | `@ngnova/ui/tree`                 | `UiTreeHarness`               | 13,312 / 2,804-byte FESM/DTS                                 |
|     6 | Tree Table                              | Ready  | `@ngnova/ui/tree-table`           | `UiTreeTableHarness`          | 24,152 / 5,036-byte FESM/DTS                                 |
|     7 | File Upload                             | Ready  | `@ngnova/ui/file-upload`          | `UiFileUploadHarness`         | 24,321 / 4,740-byte FESM/DTS                                 |
|     8 | Command Palette                         | Ready  | `@ngnova/ui/command-palette`      | `UiCommandPaletteHarness`     | 28,314 / 5,277-byte FESM/DTS                                 |
|     9 | Advanced Overlay                        | Ready  | `@ngnova/ui/overlay`              | `UiOverlayHarness`            | 26,990 / 7,097-byte FESM/DTS                                 |
|    10 | Confirmation workflows                  | Ready  | `@ngnova/ui/confirmation`         | `UiConfirmationDialogHarness` | 22,021 / 4,573-byte FESM/DTS                                 |

## 1. Table composition and headless state

- Added typed `uiTableHeader` and `uiTableCell` templates with column, row, value, and row-index
  contexts while retaining the safe text-rendering fallback.
- Added the independently importable `@ngnova/ui/table-state` controller for controlled sorting,
  immutable single/multiple selection, bulk selection, page state, and stable snapshots without
  adding that orchestration code to the base Table bundle.
- Table and controller tests cover template composition, keyboard behavior, controlled state,
  selection reconciliation, pagination boundaries, and immutable snapshots.
- Docs include live composed-cell/header examples, API coverage, state-controller guidance, and
  focused secondary imports.
- Built bundle evidence before compression: Table 20,497-byte FESM and 4,960-byte declarations;
  table-state 3,739-byte FESM and 1,994-byte declarations.
- The package audit explicitly distinguishes the documented headless utility from visual component
  entry points; all visual components still require component docs metadata.

## 2. Table advanced states and orchestration

- Added controlled single/multiple selection with native radio/checkbox semantics, stable row keys,
  visible-page select-all, immutable change events, and localized accessible labels.
- Added compact controlled pagination that emits bounded page requests and leaves server/client data
  ownership with the consumer.
- Added sticky headers, start/end columns, optional sticky selection, and collision-safe offsets.
- Added deterministic loading, error, empty, and populated state precedence with status/alert
  announcements and valid dynamic column spans.
- Expanded docs, live preview, public types, focused component coverage, and `UiTableHarness`
  selection/state inspection.
- All 315 library tests and 11 docs tests pass; docs/API, focus, theme, package audit, 108-file npm
  dry-run, library/docs builds, and clean consumer smoke pass.
- Built contribution before compression: 44,001-byte FESM and 9,622-byte declarations; the CDK-free
  base entry point remains independently importable.

## 3. Virtual scrolling CDK integration

- Added an optional `@ngnova/ui/table-virtual-scroll` entry point using Angular CDK fixed-size
  virtualization; the base Table and headless state packages remain CDK-free.
- Added typed `uiTableVirtualRow` templates, stable tracking, normalized row/buffer sizes, a
  focusable named rowgroup, absolute row indexes, busy state, first-visible-index events, and public
  scroll/layout methods.
- A 10,000-row performance test verifies that the rendered DOM stays bounded below the dataset
  length; focused tests also cover template compilation and accessibility state.
- Added a live 10,000-record docs preview, complete API metadata, performance/accessibility
  tradeoffs, stable-identity guidance, and README coverage.
- All 318 library tests and 11 docs tests pass with 33-component docs/API validation, 34 package
  entry points, 111 packed files, and the clean consumer release gate.
- Built contribution before compression: 11,114-byte FESM and 3,233-byte declarations.

## 4. Data View

- Added typed responsive grid/list rendering with adaptive item context, tokenized gaps, stable
  tracking, safe fallback rendering, and controlled layout requests.
- Added an optional localized layout switch using native buttons and `aria-pressed`, plus named
  section and list/listitem semantics.
- Added deterministic loading, error, empty, and populated state precedence with busy, status, and
  alert communication.
- Added live docs, full API/usage/accessibility/edge-case guidance, README coverage, focused tests,
  and `UiDataViewHarness`.
- All 323 library tests and 11 docs tests pass with 34-component docs/API validation, 35 package
  entry points, 114 packed files, and the clean consumer release gate.
- Built contribution before compression: 14,874-byte FESM and 3,919-byte declarations.

## 5. Tree

- Added a flattened visible-node model with complete tree/treeitem hierarchy metadata, controlled
  immutable expansion, controlled single selection, disabled states, descriptions, and empty state.
- Added roving focus, Arrow Up/Down/Left/Right, Home/End, Enter/Space activation, parent/child
  navigation, character typeahead, and consistent keyboard focus styling.
- Added live controlled docs, full API/accessibility/keyboard/edge-case guidance, README coverage,
  four focused component tests, and `UiTreeHarness` integration coverage.
- All 328 library tests and 11 docs tests pass with 35-component docs/API validation, 36 package
  entry points, 117 packed files, and the clean consumer release gate.
- Built contribution before compression: 13,312-byte FESM and 2,804-byte declarations.

## 6. Tree Table

- Added an independent controlled treegrid that combines flattened hierarchy with typed column
  metadata, expansion, selection, sorting, stable row identity, alignment, and safe cell rendering.
- Added roving row focus, Arrow Up/Down/Left/Right, Home/End, Enter/Space activation, parent focus,
  native expansion/sort controls, decorative SVG indicators, and full ARIA hierarchy/sort state.
- Added deterministic loading/error/empty precedence, dynamic column spans, dark/responsive styling,
  localized state and expansion labels, live docs, focused tests, and `UiTreeTableHarness`.
- All 333 library tests and 11 docs tests pass with 36-component docs/API validation, 37 package
  entry points, 120 packed files, and the clean consumer release gate.
- Built contribution before compression: 24,152-byte FESM and 5,036-byte declarations.

## 7. File Upload

- Added a controlled drag-and-drop and native file-picker workflow with multiple/single selection,
  stable duplicate detection, immutable file changes, removal, clearing, and explicit upload
  requests without owning transport or network state.
- Added accept-type, per-file size, total-size, and count validation with typed rejection reasons;
  progress is keyed by stable file identity and exposed with native progress semantics.
- Added disabled and drag-active states, localized accessible names and messages, keyboard-operable
  controls, dark styling, live docs, focused tests, and `UiFileUploadHarness`.
- All 338 library tests and 11 docs tests pass with 37-component docs/API validation, 38 package
  entry points, 123 packed files, and the clean consumer release gate.
- Built contribution before compression: 24,321-byte FESM and 4,740-byte declarations.

## 8. Command Palette

- Added a controlled modal command surface with filtering across labels, descriptions, and
  keywords, stable grouping, disabled commands, shortcut presentation, and typed keyboard/pointer
  selection intent.
- Added Ctrl/Cmd+K invocation, active-descendant navigation, Arrow/Home/End/Enter/Escape behavior,
  real Tab focus trapping, search focus on open, and focus restoration after controlled closure.
- Added loading/empty states, dismissal policies, complete localization, live controlled docs,
  focused accessibility and interaction tests, and `UiCommandPaletteHarness`.
- All 345 library tests and 11 docs tests pass with 38-component docs/API validation, 39 package
  entry points, 126 packed files, and the clean consumer release gate.
- Built contribution before compression: 28,314-byte FESM and 5,277-byte declarations.

## 9. Advanced Overlay

- Added an optional Angular CDK connected-overlay primitive with ordered fallback placements,
  logical alignment, main/cross-axis offsets, viewport pushing, flexible dimensions, origin-width
  matching, and typed position reporting.
- Added reposition/close/block/no-op scroll strategies, optional backdrop, independent
  outside/backdrop/Escape policies, navigation disposal, trigger ARIA synchronization, keyboard
  opening, focus entry, and focus restoration.
- Embedded the required CDK structural container/backdrop styles in the optional component entry
  point, preserving self-contained consumer behavior without changing basic overlay bundles.
- Added live docs, full API/accessibility/edge-case guidance, four focused portal/keyboard/focus
  tests, and `UiOverlayHarness`.
- All 350 library tests and 11 docs tests pass with 39-component docs/API validation, 40 package
  entry points, 129 packed files, and the clean consumer release gate.
- Built contribution before compression: 26,990-byte FESM and 7,097-byte declarations.

## 10. Confirmation workflows

- Added a root-provided FIFO confirmation service with immutable requests, Promise-based typed
  outcomes, machine-readable confirm/cancel/Escape/backdrop/destroyed reasons, pending count, and
  deterministic queue cancellation.
- Added a single application-shell alertdialog host with primary/warning/danger intent, exact-text
  verification, per-request labels and dismissal policy, safe Cancel-first focus, Tab trapping,
  queue-wide focus restoration, and scroll-lock cleanup.
- Added live guarded-deletion docs, complete service/host/accessibility/edge-case guidance, six
  focused workflow tests, host-destruction coverage, and `UiConfirmationDialogHarness`.
- All 357 library tests and 11 docs tests pass with 40-component docs/API validation, 41 package
  entry points, 132 packed files, and the clean consumer release gate.
- Built contribution before compression: 22,021-byte FESM and 4,573-byte declarations.
