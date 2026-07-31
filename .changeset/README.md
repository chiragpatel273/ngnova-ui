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

Publish only after the library is built and verified:

```bash
npm run test:lib
npm run lint
npm run build:lib
npm run build:docs
npm run pack:lib
cd dist/ui
npm publish --access public
```
