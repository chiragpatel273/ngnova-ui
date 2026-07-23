# Versioning and deprecation

NgNova UI follows Semantic Versioning for the published `@ngnova/ui` package beginning with 1.0.
Every user-facing package change requires a Changeset.

## Version meanings

- **Patch:** compatible bug fixes, accessibility corrections, documentation corrections, and
  internal changes that preserve supported public behavior.
- **Minor:** backward-compatible components, entry points, inputs, outputs, tokens, behaviors, or
  opt-in capabilities.
- **Major:** removal or incompatible change to a supported public contract.

Prerelease versions may change before 1.0, but every known migration from the final pre-1.0
candidate is documented in `docs/MIGRATION_TO_1_0.md`.

## Semver-sensitive public contracts

The following are public API:

- npm entry-point paths, exported symbols, types, and function signatures;
- Angular selectors, inputs, outputs, directives, services, and supported harness methods;
- the exported theme stylesheet and documented `--ui-*` tokens;
- documented keyboard interaction, focus behavior, ARIA semantics, and form-control behavior; and
- supported Angular peer ranges and required runtime dependencies.

Internal DOM structure, undocumented Tailwind utilities, private/protected implementation details
not present in generated declarations, test-only internals, and experimental APIs explicitly
labelled as such are not compatibility promises.

## Deprecation process

When a public contract must be replaced:

1. Introduce the replacement without removing the old contract when technically and safely
   possible.
2. Mark the old API deprecated in TypeScript declarations and documentation.
3. Add a Changeset, changelog entry, migration instructions, and release-note notice.
4. Keep the deprecated contract for at least one minor release and 90 days before removal.
5. Remove it only in a major release.

The compatibility window may be shortened for an actively exploited vulnerability, legal
requirement, impossible upstream compatibility, or behavior that risks data loss. The release
notes must explain the exception and the safest migration.

Security exceptions follow the private reporting and coordinated disclosure process in
`SECURITY.md`.

Deprecations should identify the replacement, include a compact before/after example, and state the
earliest version in which removal may occur. A warning should not create noisy production output
unless users can act on it.

## Angular compatibility

Angular support follows `docs/ANGULAR_COMPATIBILITY.md`. Dropping a supported Angular major,
raising a required peer range incompatibly, or making an optional peer mandatory requires a major
NgNova UI release.

## Release evidence

Before publishing, maintainers must:

- run `npm.cmd run release:check`;
- review the public API and bundle baselines;
- confirm the Changeset bump matches the compatibility impact;
- update the changelog, migration guide, and release notes;
- verify package contents from `dist/ui`; and
- publish only the ng-packagr output.

The machine-readable public API baseline catches declaration drift, but it does not replace
maintainer judgment for behavioral, accessibility, styling-token, or peer-dependency changes.
