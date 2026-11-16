# Public API Compatibility

NgNova UI treats selectors, entry-point paths, exported symbols and types, inputs, outputs, service
methods, and documented keyboard/accessibility behavior as semver-sensitive.

## Reviewed 1.0 candidate surface

- The package root `@ngnova/ui` is deliberately minimal and exports only
  `NGNOVA_UI_VERSION`.
- Visual components are public through focused `@ngnova/ui/<component>` entry points.
- `@ngnova/ui/table-state` is the independently importable headless Table controller.
- `@ngnova/ui/testing` is the supported component-harness surface.
- Optional CDK behavior stays in focused entry points such as `overlay` and
  `table-virtual-scroll`.
- Theme consumers use the explicit `@ngnova/ui/styles/theme.css` export.

This split is intentional. Compiling the same Angular declarations into both the primary barrel and
secondary entry points is not supported reliably by this ng-packagr graph, and a full root barrel
would make optional integrations part of the default dependency surface.

## Automated compatibility check

`docs/api/public-api-baseline.json` records every packaged TypeScript entry point, its exported
symbol set, and a SHA-256 signature of normalized declaration output. Normalization excludes
compiler-generated Angular metadata and private members while retaining public and protected type
contracts. `docs/api/public-api-review.json` separately pins the reviewed baseline digest, so
regenerating declarations cannot silently redefine compatibility.

Run:

```bash
npm.cmd run build:lib
npm.cmd run check:public-api
```

The release gate fails on:

- removed or unreviewed entry points;
- added or removed exported symbols;
- public/protected declaration signature changes;
- package-name, Angular peer-range, or root-policy changes;
- a baseline refresh without a matching reviewed digest and breaking-change audit.

After an intentional API change, review semver impact, add a changeset and migration/release notes,
update the breaking-change ledger, refresh with `npm.cmd run baseline:public-api`, and deliberately
record the new reviewed digest. A refreshed baseline is evidence of review; it does not make a
breaking change non-breaking.

## Current compatibility statement

The checked baseline is the final pre-1.0 candidate contract. At the time it was captured:

- every visual entry point had docs metadata and package-audit coverage;
- root and secondary imports were verified through the clean-consumer smoke build;
- the complete release gate passed;
- no undocumented breaking change was known between the reviewed implementation and baseline.

Compatibility from 1.0 follows the policy in `docs/VERSIONING_AND_DEPRECATION.md`.

## Post-1.0 reviewed changes

### 1.0.2 Signal Forms compatibility fix

Date Picker's `min` and `max` Angular input write types now accept `undefined` and `null`
constraint metadata and normalize those values to the existing empty-string representation. This
is an additive widening: existing string bindings and runtime behavior remain compatible.

The control's internal selected value was also renamed so Angular Signal Forms does not
structurally misclassify the existing `ControlValueAccessor` as a native
`FormValueControl`. That internal rename does not change the exported consumer contract.

Review result: no breaking change and no migration step required. The matching patch changeset and
Angular Forms compatibility guide document the consumer-visible fix.

### 1.1.0 built-in label providers

Twenty-six component entry points each add one interface, one `InjectionToken`, and one provider
function following [ADR 0004](decisions/0004-built-in-label-contract.md), for example
`UiModalLabels`, `UI_MODAL_LABELS`, and `provideUiModalLabels()`. Stepper also exports
`UiStepperStepLabelContext`.

- Existing inputs keep their names and types; their defaults now come from the labels token, which
  resolves to the same English text when no provider is present.
- `UiConfirmationDialogComponent` now implements `OnChanges` to detect an explicitly bound
  `queueLabel`; rendering is unchanged when it is bound or left at its default.
- Generated declarations were diffed against the published 1.0.2 package: no input, output,
  selector, or exported type was removed or retyped.

Review result: additive minor change, no migration step required.

`NGNOVA_UI_VERSION` now reports the actual package version. Releases up to 1.0.2 exported the stale
literal `'1.0.0'`; from 1.1.0 the declaration is `string` so the value can change on every release
without changing the declared type. The release documentation check keeps it equal to the package
version. Only code that relied on the exact literal type `'1.0.0'` is affected.

### 1.1.0 right-to-left support

Following [ADR 0005](decisions/0005-right-to-left-direction-contract.md), three exported types widen
with direction-aware values:

- `UiDrawerPosition` adds `'start' | 'end'`.
- `UiToastPosition` adds `'top-end' | 'bottom-end'`.
- `UiTableAlign` and `UiTreeTableAlign` add `'start' | 'end'`.

Existing values keep their physical meaning and existing defaults are unchanged. When a column has
no `align`, it now renders `text-start` instead of `text-left`, which is identical in left-to-right
layouts. Table `sticky: 'start' | 'end'` and Menu `align: 'start' | 'end'` now follow the text
direction, as their names always promised; left-to-right placement is unchanged.

Code that exhaustively switches over these union types needs a case for the new members; this is
the usual consequence of an additive union widening and does not affect templates.

Review result: additive minor change, no migration step required.
