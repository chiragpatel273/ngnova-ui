# NgNova UI First Release Tracker

Use this tracker with `docs/NGNOVA_WORLD_CLASS_AGENT.md` when preparing `@ngnova/ui` for its first public npm release.

Status key:

- `Not started`: no release audit has been performed.
- `In progress`: audit or implementation work has started.
- `Ready`: implementation, docs, tests, and package surface are aligned.
- `Blocked`: known issue prevents release readiness.

## Release Gates

| Gate                                             | Status      | Evidence                                               | Notes                                                                                                                                                                                                  |
| ------------------------------------------------ | ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Angular 22 standards documented                  | Ready       | `docs/ANGULAR_22_LIBRARY_STANDARDS.md`                 | Baseline exists for component, docs, testing, packaging, and release checks.                                                                                                                           |
| Continuous agent workflow documented             | Ready       | `docs/NGNOVA_WORLD_CLASS_AGENT.md`                     | Defines task loop, release gates, component definition of done, and issue/PR templates.                                                                                                                |
| Tailwind and dark mode consumer setup documented | Ready       | `README.md`, `/theming` docs                           | Includes `@source "../node_modules/@ngnova/ui"` and class-based dark-mode variant setup.                                                                                                               |
| Per-component secondary entry points             | Blocked     | `projects/ui/*/public-api.ts`, `npm.cmd run build:lib` | Current root re-export shape builds, but a direct source export attempt failed in ng-packagr secondary analysis. Needs an intentional architecture pass before claiming ideal per-component packaging. |
| Source formatting ignores generated output       | Ready       | `.prettierignore`, `npm.cmd run format:check`          | Excludes `dist`, `.angular`, `coverage`, and `node_modules` so package builds do not poison formatting checks.                                                                                         |
| Package dry run                                  | Not started | `npm.cmd pack --dry-run`                               | Run from `dist/ui` after final library build.                                                                                                                                                          |
| npm package metadata                             | Not started | `projects/ui/package.json`, `dist/ui/package.json`     | Verify repository, license, keywords, exports, peer dependencies, and publish access.                                                                                                                  |
| CI release checks                                | Not started | `.github/workflows` or equivalent                      | CI should run format, lint, tests, library build, docs build, and package dry run.                                                                                                                     |

## Component Release Matrix

| Order | Component    | Risk area                          | Status      | Implementation | Docs            | A11y        | Dark mode          | Tests                     | Package entry                         | Notes                                                   |
| ----- | ------------ | ---------------------------------- | ----------- | -------------- | --------------- | ----------- | ------------------ | ------------------------- | ------------------------------------- | ------------------------------------------------------- |
| 1     | Input        | Forms, CVA, validation, ARIA       | In progress | Under audit    | Under audit     | Under audit | Present in classes | Present, needs gap review | Builds through current root re-export | First component audit started.                          |
| 2     | Textarea     | Forms, CVA, counters               | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Audit after Input.                                      |
| 3     | Checkbox     | Forms, indeterminate state         | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify mixed state and CVA behavior.                    |
| 4     | Radio        | Forms, grouped inputs              | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify keyboard expectations and labeling.              |
| 5     | Switch       | Forms, boolean state               | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify switch semantics and forms sync.                 |
| 6     | Select       | Forms, native select options       | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify placeholder, disabled options, and CVA behavior. |
| 7     | Button       | Actions, loading, forwarded events | Not started | Unknown        | Recently edited | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Re-audit after forms.                                   |
| 8     | Modal        | Overlay, focus, Escape             | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | High risk for accessibility and focus management.       |
| 9     | Toast        | Service, live feedback             | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify service lifecycle and accessibility.             |
| 10    | Tabs         | Keyboard navigation                | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify tablist semantics and keyboard behavior.         |
| 11    | Accordion    | Disclosure behavior                | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify button semantics and expanded state.             |
| 12    | Card         | Layout and projection              | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify slots and docs playground.                       |
| 13    | Table        | Data rendering, sorting            | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify responsive docs and sort API.                    |
| 14    | Progress Bar | Feedback state                     | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify ARIA progress attributes.                        |
| 15    | Alert        | Feedback semantics                 | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify role and dismiss behavior.                       |
| 16    | Badge        | Display primitive                  | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Lower risk display component.                           |
| 17    | Tag          | Display primitive                  | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Lower risk display component.                           |
| 18    | Avatar       | Display primitive                  | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify image fallback and accessible labels.            |
| 19    | Skeleton     | Loading primitive                  | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify decorative behavior.                             |
| 20    | Spinner      | Loading primitive                  | Not started | Unknown        | Unknown         | Unknown     | Unknown            | Unknown                   | Builds through current root re-export | Verify label/decorative mode.                           |

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
- Package entry point currently builds through the root `@ngnova/ui` re-export. A direct source export attempt failed during ng-packagr secondary entry-point analysis, so this needs a dedicated architecture pass.
- Generated `dist/ui/input` output currently re-exports `UiInputComponent` from root `@ngnova/ui`, so the import path exists but is not yet proven as an isolated component bundle.

Open checks:

- Verify docs examples match the current Input implementation exactly.
- Verify docs do not document unsupported native attributes.
- Verify Input docs include a focused forms/CVA example.
- Verify library build succeeds after secondary entry-point changes.
- Check whether focus and blur host event forwarding should preserve bubbling semantics or use a different event construction strategy.
