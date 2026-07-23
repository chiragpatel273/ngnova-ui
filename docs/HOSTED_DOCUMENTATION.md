# Hosted versioned documentation

NgNova UI documentation is prepared for GitHub Pages with a stable major-version URL:

- Current 1.x line: `https://chiragpatel273.github.io/ngnova-ui/v1/`
- Button documentation:
  `https://chiragpatel273.github.io/ngnova-ui/v1/#/components/button`
- Unversioned root and `/latest/`: redirect to the default major line.

The URL is a deployment contract. The site becomes publicly reachable after the Pages workflow is
committed to `main` and GitHub Pages is configured to use GitHub Actions as its source.

## URL contract

The machine-readable source is `docs/hosting/versions.json`.

- Major paths such as `/v1/` remain stable for the lifetime of that major line.
- Hash routing keeps every client-side route directly reloadable on static hosting.
- The root and `/latest/` are convenience redirects and are not version-pinned.
- Existing major directories must not be removed while their status is `stable` or `maintenance`.
- A future major must add a new manifest entry and preserve the built assets for supported older
  majors before changing `defaultVersion`.

The v1 path is marked `release-candidate` until the 1.0 package is published. Change it to `stable`
in the same release change that publishes 1.0.

## Local build

```powershell
npm.cmd run build:docs:versioned
```

This builds the library and documentation app with `/ngnova-ui/v1/` as the base URL, validates the
built HTML, and assembles the Pages artifact in `dist/versioned-docs`.

Preview the artifact with any static server rooted at `dist/versioned-docs`, then open
`/v1/#/components/button`.

## Deployment

`.github/workflows/docs.yml` follows GitHub's Pages artifact flow:

1. install the locked dependency graph;
2. build the versioned static artifact;
3. configure Pages and upload `dist/versioned-docs`; and
4. deploy through the protected `github-pages` environment.

The workflow runs on `main` and can be run manually. Repository Pages settings must select
**GitHub Actions** as the publishing source. Deployment requires only `pages: write` and
`id-token: write`; the build job retains read-only repository access.

## Release procedure

Before a docs deployment:

1. update component docs and the version manifest in the same change;
2. run `npm.cmd run check:versioned-docs`;
3. run `npm.cmd run build:docs:versioned`;
4. verify root, `/latest/`, `/v1/`, and at least one component hash route locally; and
5. review the Pages deployment URL and status after the workflow completes.
