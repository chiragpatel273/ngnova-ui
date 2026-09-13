# Release Checklist

Use this checklist before publishing `@ngnova/ui`.

## Pre-Release

- Confirm all public API changes are documented.
- Confirm docs app examples match the current API.
- Confirm a changeset exists for user-facing changes.
- Confirm `projects/ui/package.json` has the intended version after `npm run version:packages`.
- Confirm npm scope/package access for `@ngnova/ui`.
- Confirm the npm trusted publisher and GitHub `npm` environment follow
  [the trusted-publishing guide](TRUSTED_PUBLISHING.md).
- Confirm the release commit is merged to `main` and required CI checks pass.

## Verification

```bash
npm run release:check
```

Inspect the package from `dist/ui`:

```bash
cd dist/ui
npm pack --dry-run
```

## Automated publish

1. Create a GitHub Release targeting the verified release commit.
2. Use a tag exactly matching `v<projects/ui/package.json version>`.
3. Publish the GitHub Release as a stable release, not a prerelease.
4. Approve the protected `npm` environment if required.
5. Confirm **Publish npm package** passes.

The workflow reruns the release gate and publishes `dist/ui` with npm OIDC provenance. It must not
use a long-lived `NPM_TOKEN`.

## Post-Release

- Verify the expected version is tagged `latest` on npm.
- Verify npm displays provenance for the published version.
- Verify the GitHub Release links to the correct tag and changelog summary.
- Verify installation in a fresh Angular app:

```bash
npm install @ngnova/ui
```

- Confirm the hosted documentation and version redirects remain healthy.
