# Changesets

Use Changesets to document public package changes before publishing `@ngnova/ui`.

Create a changeset:

```bash
npm run changeset
```

Version packages:

```bash
npm run version:packages
```

After committing the version and changelog updates, run the complete release gate:

```bash
npm run release:check
```

Publish by creating a stable GitHub Release whose tag matches the package version. The
[trusted-publishing workflow](../docs/TRUSTED_PUBLISHING.md) verifies and publishes `dist/ui`.
