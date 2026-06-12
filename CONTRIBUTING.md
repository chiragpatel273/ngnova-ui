# Contributing

Thanks for helping improve NgNova UI.

## Before You Start

Read the project standards:

- `AGENTS.md`
- `docs/ANGULAR_22_LIBRARY_STANDARDS.md`

## Development

Install dependencies:

```bash
npm install
```

Run the docs app:

```bash
npm start
```

## Component Rules

- Follow Angular 22 standalone component patterns.
- Use `ChangeDetectionStrategy.OnPush`.
- Use Tailwind static class strings and `[class]` bindings.
- Use `output()` for outputs.
- Avoid output names that collide with native DOM events.
- Keep public API changes semver-aware.
- Update docs and tests with every public API change.

## Required Checks

Run these before opening a pull request:

```bash
npm run format:check
npm run lint
npm run test:lib
npm run build:lib
npm run build:demo
npm run pack:lib
```

## Changesets

For any public package change, run:

```bash
npm run changeset
```

Choose the correct semver bump and write a clear user-facing summary.
