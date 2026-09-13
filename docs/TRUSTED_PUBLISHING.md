# Trusted npm publishing

NgNova UI publishes stable releases from GitHub Actions with npm trusted publishing. The workflow
uses short-lived OpenID Connect credentials and publishes provenance; it does not require an
`NPM_TOKEN` secret.

The repository workflow is `.github/workflows/publish.yml`. It runs only when a non-prerelease
GitHub Release is published, validates that its `vX.Y.Z` tag matches
`projects/ui/package.json`, runs the complete release gate, and publishes only `dist/ui`.

## One-time GitHub setup

Create an environment named `npm` under **Settings > Environments**.

- Restrict deployments to release tags matching `v*`.
- Add required reviewers when another maintainer is available.
- Do not add an npm token or other publishing secret.
- Do not enable "prevent self-review" when the project has only one eligible reviewer.

The workflow declares only `contents: read` and `id-token: write`. The latter allows npm to
exchange GitHub's OIDC identity for a short-lived publishing credential.

## One-time npm setup

Open the settings for `@ngnova/ui` on npm and add a GitHub Actions trusted publisher with these
exact values:

| Field                | Value                |
| -------------------- | -------------------- |
| Organization or user | `chiragpatel273`     |
| Repository           | `ngnova-ui`          |
| Workflow filename    | `publish.yml`        |
| Environment          | `npm`                |
| Allowed action       | Direct `npm publish` |

The workflow filename must be entered without the `.github/workflows/` prefix. These values are
case-sensitive. The repository must remain public for npm provenance generation.

## Publishing a stable release

1. Add changesets for user-facing changes and run `npm run version:packages`.
2. Confirm the package version, changelogs, documentation, and migration guidance.
3. Run `npm run release:check` and merge the release commit to `main`.
4. Create and publish a GitHub Release whose tag is exactly
   `v<projects/ui/package.json version>`.
5. Approve the `npm` environment deployment if protection rules require it.
6. Wait for **Publish npm package** to pass.
7. Verify the version and provenance on npm, then test `npm install @ngnova/ui` in a clean app.

Publishing a GitHub prerelease intentionally skips the npm job. Define a separate prerelease
dist-tag policy before automating prerelease packages.

## Failure handling

A tag/version mismatch stops the workflow before the release gate and publish step. Authentication
failures normally mean the npm trusted-publisher settings do not exactly match the repository,
workflow filename, or environment. After correcting external configuration, rerun the failed job.

Do not add a long-lived automation token as a workaround. Manual publishing remains an emergency
maintainer operation and must still use the verified `dist/ui` output.
