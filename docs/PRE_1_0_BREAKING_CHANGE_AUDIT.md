# Final pre-1.0 breaking-change audit

This audit freezes the reviewed `@ngnova/ui` contract immediately before the 1.0 stability
process. The machine-readable declaration baseline and its separately reviewed digest are the
source of truth.

## Result

No undocumented breaking change exists between the packaged 0.1.0 candidate and
`docs/api/public-api-baseline.json`.

The review covered:

- all 43 packaged TypeScript entry points and 239 exported symbols;
- selectors, inputs, outputs, services, exported types, and declaration signatures;
- the deliberately minimal package root and focused secondary entry points;
- the optional Angular CDK peer boundary;
- the theme stylesheet export and documented behavioral contracts.

## Changes incorporated before the freeze

The pre-1.0 implementation was still allowed to reshape unstable APIs. Those changes were
incorporated into the final candidate rather than presented as compatibility guarantees:

- component outputs use semantic names such as `pressed`, `focused`, `blurred`, and
  `valueChange`;
- Button icon projection uses the public `uiButtonIcon`, `uiButtonIconStart`, and
  `uiButtonIconEnd` marker directives, including dedicated icon-only sizing and decorative
  accessibility behavior;
- all component imports use focused `@ngnova/ui/<component>` entry points;
- the package root remains minimal to avoid duplicate Angular declarations and optional-CDK
  coupling;
- the theme contract moved to semantic `--ui-*` tokens with documented compatibility aliases;
- testing harnesses became a supported `@ngnova/ui/testing` surface.

These decisions are documented in the public API report, design-system documentation, theme
migration guide, and component documentation.

## Enforcement

`npm.cmd run check:public-api` performs two independent checks:

1. built declarations must match the reviewed entry points, exports, signatures, Angular peer
   range, and root policy;
2. the baseline file must match the SHA-256 digest in `docs/api/public-api-review.json`.

Refreshing the declaration baseline alone therefore fails. An intentional compatibility change
requires a semver decision, a changeset, migration and release notes, an updated ledger, and a
deliberate review-digest update.
