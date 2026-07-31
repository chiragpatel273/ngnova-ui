# NgNova UI First Release Tracker

Use this tracker with `docs/NGNOVA_WORLD_CLASS_AGENT.md` when preparing `@ngnova/ui` for its first public npm release.

Status key:

- `Not started`: no release audit has been performed.
- `In progress`: audit or implementation work has started.
- `Ready`: implementation, docs, tests, and package surface are aligned.
- `Blocked`: known issue prevents release readiness.

## Release Gates

| Gate                                             | Status      | Evidence                                                                            | Notes                                                                                                                                            |
| ------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Angular 22 standards documented                  | Ready       | `docs/ANGULAR_22_LIBRARY_STANDARDS.md`                                              | Baseline exists for component, docs, testing, packaging, and release checks.                                                                     |
| Focus and blur event contract                    | Ready       | `docs/decisions/0001-focus-blur-event-contract.md`                                  | Preserves semantic Angular outputs, forwards native host events, and prevents native-event output aliases.                                       |
| Component API documentation consistency          | Ready       | `npm.cmd run check:docs-api`                                                        | AST-based check compares documented inputs and outputs with all 20 implementations and public Button directives.                                 |
| Responsive mobile documentation navigation       | Ready       | `src/app/docs/docs-layout.ts`, `src/app/app.spec.ts`                                | Component content renders immediately; the modal drawer traps focus, locks scroll, closes with Escape or navigation, and restores trigger focus. |
| Responsive Preview and Code examples             | Ready       | `src/app/docs/docs-preview-canvas.ts`, `src/app/app.spec.ts`                        | All component pages, including the Card playground, share accessible tabs with keyboard navigation, copy coverage, and verified 390px layouts.   |
| Built-in SVG icon contract                       | Ready       | `docs/decisions/0002-built-in-icon-contract.md`, component tests                    | Accordion, Alert, Modal, Tag, and Toast use consistent current-color SVG geometry instead of font-dependent action glyphs.                       |
| Common focus-visible contract                    | Ready       | `docs/decisions/0003-focus-visible-contract.md`, `npm.cmd run check:focus-contract` | Fourteen interactive component entry points use the same keyboard-only ring, dark-mode treatment, and documented clipping exception.             |
| Repository-backed documentation claims           | Ready       | `src/app/docs/docs-home.ts`, `docs/NGNOVA_DESIGN_SYSTEM.md`, `src/app/app.spec.ts`  | Homepage facts map to package, compatibility, catalog, and release evidence; Button foundations match the implementation.                        |
| Documentation initial bundle budget              | Ready       | `src/app/app.routes.ts`, `src/app/app.spec.ts`, `npm.cmd run build:docs:app`        | Lazy screen boundaries reduced the production initial bundle from 624.67 kB to 333.89 kB while retaining the 500 kB warning budget.              |
| Continuous agent workflow documented             | Ready       | `docs/NGNOVA_WORLD_CLASS_AGENT.md`                                                  | Defines task loop, release gates, component definition of done, and issue/PR templates.                                                          |
| Tailwind and dark mode consumer setup documented | Ready       | `README.md`, `/theming` docs                                                        | Includes `@source "../node_modules/@ngnova/ui"` and class-based dark-mode variant setup.                                                         |
| Per-component secondary entry points             | Ready       | `projects/ui/*/src/*.ts`, `dist/ui/fesm2022`                                        | Component implementations now live under secondary entry points. Generated secondary FESM/DTS files no longer re-export from root `@ngnova/ui`.  |
| Root package is minimal                          | Ready       | `projects/ui/src/public-api.ts`, `dist/ui/fesm2022/ngnova-ui.mjs`                   | Root exports only `NGNOVA_UI_VERSION`; public components are imported from focused secondary paths.                                              |
| Source formatting ignores generated output       | Ready       | `.prettierignore`, `npm.cmd run format:check`                                       | Excludes `dist`, `.angular`, `coverage`, and `node_modules` so package builds do not poison formatting checks.                                   |
| Package dry run                                  | Ready       | `npm.cmd pack --dry-run` from `dist/ui`                                             | Verified the generated npm tarball packs successfully after the secondary entry-point migration.                                                 |
| npm package metadata                             | Not started | `projects/ui/package.json`, `dist/ui/package.json`                                  | Verify repository, license, keywords, exports, peer dependencies, and publish access.                                                            |
| CI release checks                                | Ready       | `.github/workflows/ci.yml`, `npm.cmd run release:check`                             | CI and local release checks now share format, lint, library/docs tests, builds, package audit, package dry run, and consumer smoke gates.        |

## Component Release Matrix

| Order | Component    | Risk area                          | Status | Implementation | Docs  | A11y  | Dark mode          | Tests | Package entry                  | Notes                                                                                                                                          |
| ----- | ------------ | ---------------------------------- | ------ | -------------- | ----- | ----- | ------------------ | ----- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Input        | Forms, CVA, validation, ARIA       | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Issue #1 audit aligned docs outputs with implementation and added CVA emission/disabled coverage.                                              |
| 2     | Textarea     | Forms, CVA, counters               | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Issue #5 re-audit kept docs aligned, tightened typed class maps, and expanded native attribute/read-only/counter coverage.                     |
| 3     | Checkbox     | Forms, indeterminate state         | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | CVA value/disabled synchronization, mixed-state ownership, native semantics, focus events, harness behavior, docs, and package output audited. |
| 4     | Radio        | Forms, grouped inputs              | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Native group semantics, optional ARIA naming, CVA sync, disabled options, keyboard model, harness, docs, and packed output audited.            |
| 5     | Switch       | Forms, boolean state               | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Native switch semantics, CVA synchronization, accessible naming, focus events, visual states, harness, docs, and packed output audited.        |
| 6     | Select       | Forms, native select options       | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | CVA sync, placeholder/option rules, validation ARIA, SVG chevron, sizes, focus events, harness, docs, and packed output audited.               |
| 7     | Button       | Actions, loading, forwarded events | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Docs and tests cover semantic events, loading, variants, sizes, icons, full-width state, and unclipped Button Group keyboard focus rings.      |
| 8     | Modal        | Overlay, focus, Escape             | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Dialog naming, initial/trapped/restored focus, dismissal policies, stacked locks, localization, harness, docs, and packed output audited.      |
| 9     | Toast        | Service, live feedback             | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Service lifecycle, variants, timed persistence, roles, caps, safe areas, localization, harness, docs, and packed output audited.               |
| 10    | Tabs         | Keyboard navigation                | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | ARIA relationships, roving focus, orientation keys, disabled fallback, overflow, harness, docs, and packed output audited.                     |
| 11    | Accordion    | Disclosure behavior                | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Unique ARIA IDs, heading levels, controlled single/multiple state, disabled behavior, harness, docs, and packed output audited.                |
| 12    | Card         | Layout and projection              | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Projection, neutral/named-region semantics, all variants/paddings, empty slots, harness decision, docs, and packed output audited.             |
| 13    | Table        | Data rendering, sorting            | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Captions, busy states, keyboard rows, controlled sorting, SVG indicators, stable keys, harness, docs, and packed output audited.               |
| 14    | Progress Bar | Feedback state                     | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Normalized/clamped ranges, determinate/indeterminate ARIA, value text, variants, harness decision, docs, and packed output audited.            |
| 15    | Alert        | Feedback semantics                 | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Live-region roles, controlled dismissal, localization, variants, harness, docs, and packed output audited.                                     |
| 16    | Badge        | Display primitive                  | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Named semantics, live-region override, truncation, variants/sizes, docs, harness decision, and packed output audited.                          |
| 17    | Tag          | Display primitive                  | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Crisp SVG projection, named semantics, removal, variants/sizes, harness, docs, and packed output audited.                                      |
| 18    | Avatar       | Display primitive                  | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Single image semantics, error fallback/retry, names, sizes/shapes, docs, harness decision, and packed output audited.                          |
| 19    | Skeleton     | Loading primitive                  | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Decorative semantics, reduced motion, animation opt-out, shapes/sizing, docs, harness decision, and packed output audited.                     |
| 20    | Spinner      | Loading primitive                  | Ready  | Ready          | Ready | Ready | Present in classes | Ready | Isolated secondary entry point | Named/decorative status, label fallback, reduced motion, sizes, docs, harness decision, and packed output audited.                             |

## Input Audit Notes

Started: 2026-06-24

Evidence reviewed:

- `projects/ui/src/lib/components/input/input.ts`
- `projects/ui/src/lib/components/input/input.spec.ts`
- `projects/ui/input/public-api.ts`
- `src/app/docs/docs-data.ts`

Initial findings:

- Implementation includes `ControlValueAccessor`, validation message mapping, labels, helper/error text, counters, prefix/suffix projection, clear action, password reveal, and dark-mode classes.
- Tests cover CVA update, `aria-describedby`, focus/blur host events, projection, counter, clear action, validation errors, floating labels, word counters, password reveal, and Enter submit.
- Package entry point now builds from `projects/ui/input/src/input.ts`.
- Generated `dist/ui/input` output contains the Input implementation directly and no longer re-exports from root `@ngnova/ui`.

Completed checks:

- Verified docs examples use supported Input APIs and per-component `@ngnova/ui/input` imports.
- Corrected the API table to document the actual `focused` and `blurred` Angular outputs while noting native host focus/blur forwarding.
- Verified Input docs include Angular forms/CVA usage in the primary example and forms guidance.
- Added regression coverage that `writeValue`/reactive form updates do not emit `valueChange`, user input does emit `valueChange`, and `setDisabledState` disables the native input.

## Button Audit Notes

Started: 2026-07-17

Evidence reviewed:

- `projects/ui/button/src/button.ts`
- `projects/ui/src/lib/components/button/button.spec.ts`
- `projects/ui/button/public-api.ts`
- `src/app/docs/docs-data.ts`

Completed checks:

- Verified `UiButtonComponent` is standalone, uses `ChangeDetectionStrategy.OnPush`, exposes typed variant, size, type, disabled, loading, full-width, aria-label, and loading-label inputs, and publishes through the `@ngnova/ui/button` secondary entry point.
- Aligned Button docs to the actual `pressed`, `focused`, and `blurred` Angular outputs and kept examples scoped to the current public API.
- Added release-audit coverage for `pressed`, `focused`, `blurred`, host focus/blur forwarding, native `type`, `ariaLabel`, disabled/loading behavior, loading screen-reader text, all current variants and sizes, `fullWidth`, and dark-mode-ready classes.

## Textarea Audit Notes

Started: 2026-07-04

Evidence reviewed:

- `projects/ui/textarea/src/textarea.ts`
- `projects/ui/src/lib/components/textarea/textarea.spec.ts`
- `projects/ui/textarea/public-api.ts`
- `src/app/docs/docs-data.ts`

Completed checks:

- Verified `UiTextareaComponent` is standalone, uses `ChangeDetectionStrategy.OnPush`, implements `ControlValueAccessor`, exposes intentional typed inputs/outputs, and ships through the `@ngnova/ui/textarea` secondary entry point.
- Verified labels, helper text, error text, generated IDs, counters, `aria-describedby`, `aria-invalid`, native textarea attributes, resize classes, and dark-mode classes align with the implementation.
- Corrected Textarea docs to list the actual `focused` and `blurred` Angular outputs while noting native host focus/blur forwarding.
- Added regression coverage for CVA user input, programmatic writes without `valueChange`, disabled state sync, blur touched state, focus/blur outputs, validation messaging, counter ARIA wiring, resize, appearance, size, and dark-mode-ready classes.
- Issue #5 follow-up omits false `aria-required` and `aria-invalid` states from the native textarea and adds regression coverage for required/error ARIA states, `ariaLabel`, `name`, `minLength`, `maxLength`, `rows`, `readonly`, and `hideCounter` behavior.
- Re-audited for Issue #5 on 2026-07-12: tightened appearance and resize classes into typed `Record` maps, verified docs still match the public API, and added native attribute, read-only, required, explicit error, and hidden-counter coverage.

## Checkbox Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/checkbox/src/checkbox.ts`
- `projects/ui/src/lib/components/checkbox/checkbox.spec.ts`
- `projects/ui/testing/checkbox/checkbox-harness.ts`
- `projects/ui/checkbox/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated `dist/ui/fesm2022/ngnova-ui-checkbox.mjs` and checkbox declarations

Completed checks:

- Fixed the `OnPush` ControlValueAccessor boundary so programmatic form values and disabled state update the native checkbox reliably.
- Kept the public `disabled` input separate from Angular Forms disabled state, so enabling a form does not overwrite a consumer-owned disabled input.
- Verified native checkbox, label, generated ID, helper association, `name`, `required`, accessible-label, focus-visible, disabled, dark-mode, and indeterminate behavior.
- Verified user changes emit the CVA and `valueChange`, programmatic writes do not emit, mixed state clears through `indeterminateChange`, and blur marks the CVA touched while forwarding the documented events.
- Verified `UiCheckboxHarness` selects by label and covers checked, indeterminate, disabled, and user-toggle behavior.
- Verified the docs API table and release examples use only the public `@ngnova/ui/checkbox` contract.
- Recorded the built secondary entry contribution: 7,928-byte FESM and 2,539-byte declaration bundle before compression.

## Radio Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/radio/src/radio.ts`
- `projects/ui/src/lib/components/radio/radio.spec.ts`
- `projects/ui/testing/radio/radio-harness.ts`
- `projects/ui/radio/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated `dist/ui/fesm2022/ngnova-ui-radio.mjs` and radio declarations

Completed checks:

- Fixed the `OnPush` ControlValueAccessor boundary so form value and disabled-state changes update every native radio reliably without mutating the public disabled input.
- Added an optional `ariaLabel` for groups that intentionally omit a visible legend and exposed error state through `aria-invalid` while retaining helper/error description wiring.
- Verified native fieldset/legend semantics, shared radio names, required state, option-level and group disabled behavior, focus/blur/touched events, focus-visible and dark-mode classes, and wrapping horizontal layout.
- Retained native radio keyboard behavior: Tab enters the group, arrow keys move selection, and Space selects the focused option.
- Verified `UiRadioGroupHarness` selects groups by legend, selects options by visible label, and reads the current value.
- Verified docs examples and the generated secondary package use only the intentional public API.
- Recorded the built secondary entry contribution: 9,481-byte FESM and 2,676-byte declaration bundle before compression.

## Switch Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/switch/src/switch.ts`
- `projects/ui/src/lib/components/switch/switch.spec.ts`
- `projects/ui/testing/switch/switch-harness.ts`
- `projects/ui/switch/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated `dist/ui/fesm2022/ngnova-ui-switch.mjs` and switch declarations

Completed checks:

- Fixed the `OnPush` ControlValueAccessor boundary so reactive form values and disabled state update the native switch without mutating the public disabled input.
- Verified the native checkbox with `role="switch"`, wrapping label, optional `ariaLabel`, helper association, generated ID, `name`, and `required` forwarding.
- Verified user changes update the CVA and emit `valueChange`, programmatic updates do not emit, and blur marks the CVA touched while focus/blur events follow the published contract.
- Verified checked, disabled, keyboard-focus, dark-mode, and thumb-motion classes plus full-row label interaction and long-copy-safe layout.
- Verified `UiSwitchHarness` selects by label and covers checked, disabled, and user-toggle behavior.
- Verified docs examples and the generated secondary package use only the intentional public API.
- Recorded the built secondary entry contribution: 7,931-byte FESM and 2,062-byte declaration bundle before compression.

## Select Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/select/src/select.ts`
- `projects/ui/src/lib/components/select/select.spec.ts`
- `projects/ui/testing/select/select-harness.ts`
- `projects/ui/select/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated `dist/ui/fesm2022/ngnova-ui-select.mjs` and select declarations

Completed checks:

- Fixed the `OnPush` ControlValueAccessor boundary so form values and disabled state update the native select without mutating its public disabled input.
- Restored the missing dropdown affordance with a current-color SVG chevron after `appearance-none` intentionally removes the browser-provided arrow.
- Corrected validation ARIA so `aria-invalid` is present only for an error, and visible labels remain the accessible name when an optional `ariaLabel` is also supplied.
- Verified optional and required placeholder rules, disabled options, unique option-value guidance, generated ID, `name`, helper/error descriptions, and native keyboard interaction.
- Verified small, medium, and large height/text contracts plus disabled, error, focus-visible, dark-mode, long-option, and full-width responsive behavior.
- Verified `UiSelectHarness` selects by label, value, or option text and reports options, value, and disabled state.
- Verified docs examples and the generated secondary package use only the intentional public API.
- Recorded the built secondary entry contribution: 9,749-byte FESM and 2,594-byte declaration bundle before compression.

## Modal Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/modal/src/modal.ts`
- `projects/ui/src/lib/components/modal/modal.spec.ts`
- `projects/ui/testing/modal/modal-harness.ts`
- `projects/ui/modal/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated `dist/ui/fesm2022/ngnova-ui-modal.mjs` and modal declarations

Completed checks:

- Verified `role="dialog"`, `aria-modal`, title or headerless naming, optional description association, localized close labeling, projected regions, SVG close icon, and responsive size/max-height classes.
- Added `initialFocus` with safe selector fallback, retained first-action fallback, verified forward/backward Tab wrapping, and covered default/disabled focus restoration.
- Verified Escape and backdrop close policies plus `openChange`, `opened`, `closed`, `backdropClick`, and `escapeKeyDown` lifecycle behavior.
- Added a per-document open stack so only the topmost dialog handles keyboard events, plus reference-counted scroll locking that preserves the original body overflow until the final dialog closes.
- Verified cleanup on input close and destruction, disabled dismissal policies for destructive workflows, dark-mode surfaces, long scrollable content, and mobile-safe `dvh` sizing.
- Verified `UiModalHarness` locates by title, reads open/name state, and drives the close action.
- Verified docs examples and the generated secondary package use only the intentional public API.
- Recorded the built secondary entry contribution: 15,316-byte FESM and 2,860-byte declaration bundle before compression.

## Toast Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/toast/src/toast.ts`
- `projects/ui/src/lib/components/toast/toast.spec.ts`
- `projects/ui/testing/toast/toast-harness.ts`
- `projects/ui/toast/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Toast and testing secondary bundles under `dist/ui`

Completed checks:

- Added info, success, warning, and danger service helpers; unique generated IDs; deterministic explicit-ID replacement; dismiss/clear cleanup; and optional positive-duration auto-dismissal.
- Kept messages persistent by default so time-limited content is always an explicit product decision, and verified replacement resets timers without leaking stale callbacks.
- Added atomic status semantics for normal variants, alert semantics for danger, localized dismiss labels, a newest-message viewport cap, keyboard-focus styling, dark variants, and shrink-safe long content.
- Verified top/bottom placement, configurable minimum offset, device safe-area insets, mobile full-width/max-width behavior, and pointer-event isolation.
- Added and exported `UiToastHarness` with message filtering, title/count reads, and dismiss interaction; shared harness coverage now exercises it against the real service.
- Verified docs cover lifecycle, accessibility, localization, duplicate IDs, caps, durations, placement, and only public package imports.
- Recorded the built contributions: 10,009-byte Toast FESM, 2,466-byte Toast declarations, and 12,867-byte testing FESM including the new harness, before compression.

## Tabs Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/tabs/src/tabs.ts`
- `projects/ui/src/lib/components/tabs/tabs.spec.ts`
- `projects/ui/testing/tabs/tabs-harness.ts`
- `projects/ui/tabs/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated `dist/ui/fesm2022/ngnova-ui-tabs.mjs` and Tabs declarations

Completed checks:

- Verified tablist/tab/tabpanel roles, accessible naming, generated and sanitized ID relationships, selected/disabled state, and controlled `activeChange` behavior.
- Added horizontal and vertical orientation contracts with the correct arrow-key axis, automatic activation, focus movement, Home/End support, wrapping, and disabled-tab skipping.
- Added a deterministic first-enabled fallback so an empty, missing, or disabled active value never leaves the tablist without a roving tab stop.
- Added maximum-width overflow containment for long localized labels and verified full-width, focus-visible, selected, hover, disabled, and dark-mode classes.
- Verified `UiTabsHarness` filters by selected label, reads labels/panel content, and activates tabs by visible label.
- Documented unique stable values, localized labels, automatic activation, overflow, and orientation behavior using only public APIs.
- Recorded the built secondary entry contribution: 8,185-byte FESM and 1,699-byte declaration bundle before compression.

## Accordion Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/accordion/src/accordion.ts`
- `projects/ui/src/lib/components/accordion/accordion.spec.ts`
- `projects/ui/testing/accordion/accordion-harness.ts`
- `projects/ui/accordion/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Accordion and testing secondary bundles under `dist/ui`

Completed checks:

- Replaced the collision-prone fixed default ID with a generated per-instance ID and verified trigger/panel `aria-controls` and `aria-labelledby` relationships.
- Replaced the fixed heading element with configurable, clamped `headingLevel` semantics so consumers can preserve their surrounding document outline.
- Verified native button activation, `aria-expanded`, disabled state, immutable controlled updates, close behavior, and single versus multiple expansion.
- Verified long-copy-safe full-width triggers, inset keyboard focus, decorative SVG rotation, borders, disabled styling, and dark-mode surfaces.
- Added and exported `UiAccordionHarness` with title filtering, title reads, expanded/disabled state, and toggle interaction.
- Documented unique stable values, controlled parent updates, heading levels, and test expectations using only public APIs.
- Recorded the built contributions: 8,025-byte Accordion FESM, 1,701-byte Accordion declarations, and 14,380-byte testing FESM including the new harness, before compression.

## Card Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/card/src/card.ts`
- `projects/ui/src/lib/components/card/card.spec.ts`
- `projects/ui/card/public-api.ts`
- `src/app/docs/docs-data.ts`
- Card playground and shared Preview/Code documentation
- generated `dist/ui/fesm2022/ngnova-ui-card.mjs` and Card declarations

Completed checks:

- Changed the default surface from an unnamed section landmark to a neutral container; optional `ariaLabel` promotes meaningful cards to named regions without polluting navigation for ordinary layout cards.
- Verified header, body, and footer projection order; automatic empty header/footer collapse; edge-to-edge media clipping; and host block layout.
- Verified outline/elevated treatments, all four body padding scales, borders, shadows, text colors, and light/dark surfaces.
- Verified long projected content remains consumer-controlled and the card itself introduces no keyboard or form behavior.
- Documented that Card intentionally has no harness because it exposes neither interaction nor state; projected content can be located with standard test selectors.
- Verified the playground and examples use the public secondary entry point and current semantic API.
- Recorded the built secondary entry contribution: 3,226-byte FESM and 795-byte declaration bundle before compression.

## Table Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/table/src/table.ts`
- `projects/ui/src/lib/components/table/table.spec.ts`
- `projects/ui/testing/table/table-harness.ts`
- `projects/ui/table/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Table and testing secondary bundles under `dist/ui`

Completed checks:

- Added accessible captions with hidden/visible presentation, loading `aria-busy`, announced loading/empty statuses, and valid fallback column spans.
- Replaced literal sort/asc/desc glyph text with decorative current-color SVG indicators and verified ascending/descending `aria-sort` behavior.
- Added optional controlled sort state while preserving internal indication for uncontrolled use; row data remains parent-sorted through `sortChange`.
- Made selectable rows keyboard focusable and operable with Enter or Space as well as pointer clicks, with shared focus-visible and dark-mode treatment.
- Added stable `rowKey` tracking for reordering datasets and verified DOM identity, alignment, responsive horizontal overflow, and immutable emitted rows.
- Added and exported `UiTableHarness` with caption filtering, header/row reads, sortable-header activation, and row selection.
- Documented naming, keyboard selection, controlled sorting, stable keys, status behavior, and only public package APIs.
- Recorded the built contributions: 14,984-byte Table FESM, 3,199-byte Table declarations, and 15,938-byte testing FESM including the new harness, before compression.

## Progress Bar Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/progress-bar/src/progress-bar.ts`
- `projects/ui/src/lib/components/progress-bar/progress-bar.spec.ts`
- `projects/ui/progress-bar/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Progress Bar bundles under `dist/ui`

Completed checks:

- Normalized non-positive and non-finite maxima to 1, normalized non-finite values to 0, and clamped determinate values so visual width and ARIA always describe the same range.
- Added optional `ariaValueText` for localized or human-readable determinate values.
- Verified determinate label, minimum, maximum, current value, value text, and percentage width behavior.
- Verified indeterminate mode omits all range and value attributes while retaining its accessible label and animated visual treatment.
- Verified all semantic variants include their intended light- and dark-mode classes.
- Documented that Progress Bar intentionally has no harness because it is a read-only status primitive with no interaction or hidden state.
- Verified the public secondary entry point and recorded the built contributions: 5,729-byte FESM and 1,610-byte declaration bundle before compression.

## Alert Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/alert/src/alert.ts`
- `projects/ui/src/lib/components/alert/alert.spec.ts`
- `projects/ui/testing/alert/alert-harness.ts`
- `projects/ui/alert/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Alert and testing bundles under `dist/ui`

Completed checks:

- Verified polite `status` semantics for info, success, and warning feedback; assertive `alert` semantics for danger; and deliberate role overrides.
- Verified closed rendering, immediate dismissal, `openChange` and `dismissed` outputs, and reopening after controlled state changes.
- Added `dismissAriaLabel` so the icon-only close action can be localized while its SVG remains decorative.
- Verified all semantic variants include the intended light- and dark-mode surface, border, and text classes.
- Added and exported `UiAlertHarness` with title filtering, visibility and role reads, and dismissal through public behavior.
- Documented live-region urgency, native keyboard behavior, localization, reopening, and harness usage.
- Recorded the built contributions: 6,207-byte Alert FESM, 1,507-byte Alert declarations, and 16,908-byte testing FESM including the new harness, before compression.

## Tag Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/tag/src/tag.ts`
- `projects/ui/src/lib/components/tag/tag.spec.ts`
- `projects/ui/testing/tag/tag-harness.ts`
- `projects/ui/tag/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Tag and testing bundles under `dist/ui`

Completed checks:

- Added and exported `uiTagIcon` projection so consumer SVG icons receive consistent size and decorative semantics; retained the legacy icon string for compatibility.
- Added named-group semantics when `ariaLabel` is supplied and documented the requirement for icon-heavy or visually compact tags.
- Verified the native remove action, localized label, decorative close SVG, and immutable parent-owned removal flow.
- Verified all five semantic variants, both sizes, truncation classes, focus-visible treatment, and light/dark styling.
- Added and exported `UiTagHarness` with text filtering, removability inspection, and removal through public behavior.
- Documented crisp current-color SVG use, keyboard behavior, accessible naming, and harness coverage.
- Recorded the built contributions: 7,674-byte Tag FESM, 1,715-byte Tag declarations, and 17,704-byte testing FESM including the new harness, before compression.

## Avatar Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/avatar/src/avatar.ts`
- `projects/ui/src/lib/components/avatar/avatar.spec.ts`
- `projects/ui/avatar/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Avatar bundles under `dist/ui`

Completed checks:

- Removed nested image semantics: a valid source now renders one native image, while initials fallback alone receives `role="img"`.
- Established accessible-name priority as `ariaLabel`, then `alt`, then `label`; an entirely unnamed fallback is explicitly decorative.
- Added automatic initials fallback when image loading fails and verified that changing `src` retries the replacement image.
- Verified initials derivation, all three size scales, both shapes, clipping, light/dark surfaces, and ring treatment.
- Documented image naming, decorative behavior, error recovery, and meaningful initials guidance.
- Documented that Avatar intentionally has no harness because it is non-interactive and its public image/fallback DOM is directly observable.
- Recorded the built contributions: 6,079-byte Avatar FESM and 1,543-byte declaration bundle before compression.

## Badge Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/badge/src/badge.ts`
- `projects/ui/src/lib/components/badge/badge.spec.ts`
- `projects/ui/badge/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Badge bundles under `dist/ui`

Completed checks:

- Migrated public state to signal inputs and a computed class string while preserving the existing API names and literal unions.
- Promoted badges with `ariaLabel` but no explicit role to named groups so compact accessible labels are exposed reliably.
- Preserved deliberate role overrides and documented that `status` should be reserved for dynamic announcements.
- Added bounded projected-content truncation and verified all five variants, both sizes, light/dark classes, and max-width behavior.
- Documented that Badge intentionally has no harness because it is non-interactive and all public state is directly observable in its DOM.
- Recorded the built contributions: 4,009-byte Badge FESM and 1,075-byte declaration bundle before compression.

## Skeleton Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/skeleton/src/skeleton.ts`
- `projects/ui/src/lib/components/skeleton/skeleton.spec.ts`
- `projects/ui/skeleton/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Skeleton bundles under `dist/ui`

Completed checks:

- Verified the component host remains hidden from assistive technology so application-owned loading messages provide the announcement.
- Added an `animated` input for static placeholders and automatic `prefers-reduced-motion` suppression for the default pulse.
- Verified text, rectangle, and circle shapes; width and height bindings; light/dark surfaces; and animation opt-out.
- Documented layout-preservation guidance, reduced motion, static usage, and the need for a separate loading label or live region.
- Documented that Skeleton intentionally has no harness because it is decorative, non-interactive, and absent from the accessibility tree.
- Recorded the built contributions: 3,305-byte Skeleton FESM and 1,027-byte declaration bundle before compression.

## Spinner Audit Notes

Completed: 2026-07-21

Evidence reviewed:

- `projects/ui/spinner/src/spinner.ts`
- `projects/ui/src/lib/components/spinner/spinner.spec.ts`
- `projects/ui/spinner/public-api.ts`
- `src/app/docs/docs-data.ts`
- generated Spinner bundles under `dist/ui`

Completed checks:

- Migrated public state to signal inputs and computed accessible labels and classes while preserving the existing API.
- Reduced non-decorative output to one named `status` semantic, with a safe `Loading` fallback for blank labels.
- Verified decorative mode removes the status name and hides the spinner from assistive technology.
- Added reduced-motion suppression and verified all three diameter/border scales plus light/dark current-color treatment.
- Documented labelled-button usage, Progress Bar selection, reduced motion, decorative behavior, and label fallback.
- Documented that Spinner intentionally has no harness because it is non-interactive and has only directly observable status state.
- Recorded the built contributions: 3,330-byte Spinner FESM and 954-byte declaration bundle before compression.
