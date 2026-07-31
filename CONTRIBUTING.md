# Contributing

Thanks for helping improve NgNova UI.

## Before You Start

Read the project standards:

- `AGENTS.md`
- `docs/ANGULAR_22_LIBRARY_STANDARDS.md`
- `docs/VERSIONING_AND_DEPRECATION.md`

By participating, you agree to follow `CODE_OF_CONDUCT.md`. Report vulnerabilities through the
private process in `SECURITY.md`, never through a public issue or pull request.

## Contribution License

By submitting a contribution to NgNova UI, you agree that your contribution will be licensed under
the project's MIT License. You confirm that you have the right to submit the contribution. NgNova
UI does not currently require a separate contributor license agreement.

## Development

Install dependencies:

```powershell
npm.cmd install
```

Run the docs app:

```powershell
npm.cmd start
```

## Component Rules

- Follow Angular 22 standalone component patterns.
- Use `ChangeDetectionStrategy.OnPush`.
- Use Tailwind static class strings and `[class]` bindings.
- Prefer `inject()`, signals for suitable local state, `computed()` for derivations, and `output()`
  for new outputs.
- Avoid output names that collide with native DOM events.
- Keep public API changes semver-aware and preserve parent-owned input state.
- Update docs, API tables, accessibility notes, tests, and examples with every public API change.
- Export intentional API from a focused secondary entry point and keep optional dependencies
  isolated.

## Tests and documentation

Add behavior tests for public inputs, outputs, disabled/loading states, keyboard behavior, ARIA,
forms, and regressions affected by the change. Add or update a supported CDK harness for reusable
interactive behavior.

Every public visual component requires a live documentation preview, matching code, import
instructions, API tables, accessibility guidance, and testing notes. Review visual baselines when
a change intentionally affects rendering.

## Required Checks

Run these before opening a pull request:

```powershell
npm.cmd run release:check
```

For an intentional visual change, also run:

```powershell
npm.cmd run test:visual
```

## Changesets and compatibility

For any user-facing package change, run:

```powershell
npm.cmd run changeset
```

Choose the semver bump using `docs/VERSIONING_AND_DEPRECATION.md` and write a concise user-facing
summary. Public API changes must also update the compatibility baseline, migration guidance,
release notes, and breaking-change audit as applicable.

## Pull requests

Keep a pull request focused, describe the consumer impact, link its issue when one exists, and list
the checks run. Do not commit generated `dist/`, Playwright reports, npm tarballs, secrets, or
machine-specific files. Maintainers may request changes when implementation, public API,
accessibility, documentation, test evidence, or release metadata are incomplete.
