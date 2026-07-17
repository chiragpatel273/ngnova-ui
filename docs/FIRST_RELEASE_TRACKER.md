# NgNova UI First Release Tracker

Use this tracker with `docs/NGNOVA_WORLD_CLASS_AGENT.md` when preparing `@ngnova/ui` for its first public npm release.

Status key:

- `Not started`: no release audit has been performed.
- `In progress`: audit or implementation work has started.
- `Ready`: implementation, docs, tests, and package surface are aligned.
- `Blocked`: known issue prevents release readiness.

## Release Gates

| Gate                                             | Status      | Evidence                                                          | Notes                                                                                                                                                         |
| ------------------------------------------------ | ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular 22 standards documented                  | Ready       | `docs/ANGULAR_22_LIBRARY_STANDARDS.md`                            | Baseline exists for component, docs, testing, packaging, and release checks.                                                                                  |
| Continuous agent workflow documented             | Ready       | `docs/NGNOVA_WORLD_CLASS_AGENT.md`                                | Defines task loop, release gates, component definition of done, and issue/PR templates.                                                                       |
| Tailwind and dark mode consumer setup documented | Ready       | `README.md`, `/theming` docs                                      | Includes `@source "../node_modules/@ngnova/ui"` and class-based dark-mode variant setup.                                                                      |
| Per-component secondary entry points             | Ready       | `projects/ui/*/src/*.ts`, `dist/ui/fesm2022`                      | Component implementations now live under secondary entry points. Generated secondary FESM/DTS files no longer re-export from root `@ngnova/ui`.               |
| Root package is minimal                          | Ready       | `projects/ui/src/public-api.ts`, `dist/ui/fesm2022/ngnova-ui.mjs` | Root exports only `NGNOVA_UI_VERSION`; public components are imported from focused secondary paths.                                                           |
| Source formatting ignores generated output       | Ready       | `.prettierignore`, `npm.cmd run format:check`                     | Excludes `dist`, `.angular`, `coverage`, and `node_modules` so package builds do not poison formatting checks.                                                |
| Package dry run                                  | Ready       | `npm.cmd pack --dry-run` from `dist/ui`                           | Verified the generated npm tarball packs successfully after the secondary entry-point migration.                                                              |
| npm package metadata                             | Not started | `projects/ui/package.json`, `dist/ui/package.json`                | Verify repository, license, keywords, exports, peer dependencies, and publish access.                                                                         |
| CI release checks                                | Ready       | `.github/workflows/ci.yml`, `npm.cmd run release:check`           | CI and local release checks now share the same gate: format, lint, tests, library build, docs build, package audit, package dry run, and consumer smoke test. |

## Component Release Matrix

| Order | Component    | Risk area                          | Status      | Implementation | Docs    | A11y    | Dark mode          | Tests   | Package entry                  | Notes                                                                                                                                                      |
| ----- | ------------ | ---------------------------------- | ----------- | -------------- | ------- | ------- | ------------------ | ------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Input        | Forms, CVA, validation, ARIA       | Ready       | Ready          | Ready   | Ready   | Present in classes | Ready   | Isolated secondary entry point | Issue #1 audit aligned docs outputs with implementation and added CVA emission/disabled coverage.                                                          |
| 2     | Textarea     | Forms, CVA, counters               | Ready       | Ready          | Ready   | Ready   | Present in classes | Ready   | Isolated secondary entry point | Issue #5 re-audit kept docs aligned, tightened typed class maps, and expanded native attribute/read-only/counter coverage.                                 |
| 3     | Checkbox     | Forms, indeterminate state         | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify mixed state and CVA behavior.                                                                                                                       |
| 4     | Radio        | Forms, grouped inputs              | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify keyboard expectations and labeling.                                                                                                                 |
| 5     | Switch       | Forms, boolean state               | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify switch semantics and forms sync.                                                                                                                    |
| 6     | Select       | Forms, native select options       | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify placeholder, disabled options, and CVA behavior.                                                                                                    |
| 7     | Button       | Actions, loading, forwarded events | Ready       | Ready          | Ready   | Ready   | Present in classes | Ready   | Isolated secondary entry point | Issue #9 aligned docs with semantic outputs and expanded tests for pressed, focus/blur, native attributes, loading, variants, sizes, and full-width state. |
| 8     | Modal        | Overlay, focus, Escape             | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | High risk for accessibility and focus management.                                                                                                          |
| 9     | Toast        | Service, live feedback             | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify service lifecycle and accessibility.                                                                                                                |
| 10    | Tabs         | Keyboard navigation                | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify tablist semantics and keyboard behavior.                                                                                                            |
| 11    | Accordion    | Disclosure behavior                | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify button semantics and expanded state.                                                                                                                |
| 12    | Card         | Layout and projection              | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify slots and docs playground.                                                                                                                          |
| 13    | Table        | Data rendering, sorting            | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify responsive docs and sort API.                                                                                                                       |
| 14    | Progress Bar | Feedback state                     | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify ARIA progress attributes.                                                                                                                           |
| 15    | Alert        | Feedback semantics                 | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify role and dismiss behavior.                                                                                                                          |
| 16    | Badge        | Display primitive                  | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Lower risk display component.                                                                                                                              |
| 17    | Tag          | Display primitive                  | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Lower risk display component.                                                                                                                              |
| 18    | Avatar       | Display primitive                  | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify image fallback and accessible labels.                                                                                                               |
| 19    | Skeleton     | Loading primitive                  | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify decorative behavior.                                                                                                                                |
| 20    | Spinner      | Loading primitive                  | Not started | Unknown        | Unknown | Unknown | Unknown            | Unknown | Isolated secondary entry point | Verify label/decorative mode.                                                                                                                              |

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
