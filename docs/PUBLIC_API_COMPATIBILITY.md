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
