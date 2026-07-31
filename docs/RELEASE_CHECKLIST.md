# Release Checklist

Use this checklist before publishing `@ngnova/ui`.

## Pre-Release

- Confirm all public API changes are documented.
- Confirm docs app examples match the current API.
- Confirm a changeset exists for user-facing changes.
- Confirm `projects/ui/package.json` has the intended version after `npm run version:packages`.
- Confirm npm scope/package access for `@ngnova/ui`.

## Verification

```bash
npm run format:check
npm run lint
npm run test:lib
npm run build:lib
npm run build:docs
npm run pack:lib
```

Inspect the package from `dist/ui`:

```bash
cd dist/ui
npm pack --dry-run
```

## Publish

```bash
npm login
cd dist/ui
npm publish --access public
```

## Post-Release

- Push version and changelog changes.
- Create a GitHub release with the changelog summary.
- Verify installation in a fresh Angular app:

```bash
npm install @ngnova/ui
```
