# Hosted latest documentation

NgNova UI documentation is published to GitHub Pages at one primary URL that always serves the
latest release:

- Latest documentation: `https://chiragpatel273.github.io/ngnova-ui/`
- Button documentation:
  `https://chiragpatel273.github.io/ngnova-ui/#/components/button`
- `/latest/` and `/v1/`: redirect to the latest documentation.

The root URL is the public deployment contract. GitHub Pages is configured to use GitHub Actions as
its source.

## URL contract

The machine-readable source is `docs/hosting/versions.json`.

- The project root always serves the latest documentation build.
- Hash routing keeps every client-side route directly reloadable on static hosting.
- `/latest/` and the current major path are compatibility redirects, not separately maintained
  documentation copies.
- A future major release may update the manifest and redirect aliases without changing the primary
  URL.

## Local build

```powershell
npm.cmd run build:docs:versioned
```

This builds the library and documentation app with `/ngnova-ui/` as the base URL, validates the
built HTML, and assembles the Pages artifact in `dist/versioned-docs`.

Preview the artifact with any static server rooted at `dist/versioned-docs`, then open
`/#/components/button`.

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
4. verify the root app, `/latest/` and `/v1/` redirects, and at least one component hash route
   locally; and
5. review the Pages deployment URL and status after the workflow completes.
