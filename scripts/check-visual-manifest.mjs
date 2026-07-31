import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const docsSource = readFileSync(join(root, 'src', 'app', 'docs', 'docs-data.ts'), 'utf8');
const pageSource = readFileSync(join(root, 'src', 'app', 'docs', 'component-doc-page.ts'), 'utf8');
const cardSource = readFileSync(join(root, 'src', 'app', 'docs', 'card-doc-playground.ts'), 'utf8');
const manifest = JSON.parse(
  readFileSync(join(root, 'docs', 'visual-regression-manifest.json'), 'utf8'),
);

function fail(message) {
  console.error(`Visual regression manifest check failed: ${message}`);
  process.exit(1);
}

const documentedSlugs = [...docsSource.matchAll(/^\s{4}slug: '([^']+)',\s*$/gm)].map(
  (match) => match[1],
);
const manifestSlugs = manifest.componentStates.map((entry) => entry.slug);

if (JSON.stringify(documentedSlugs) !== JSON.stringify(manifestSlugs)) {
  fail('componentStates must cover every documented component once and in documentation order.');
}

const allSources = `${pageSource}\n${cardSource}`;
const visualIds = manifest.componentStates.flatMap((entry) => entry.visualIds);
const dynamicExampleCollections = {
  button: 'BUTTON_USAGE_EXAMPLES',
  input: 'INPUT_USAGE_EXAMPLES',
  table: 'TABLE_USAGE_EXAMPLES',
};

function hasDynamicExample(state, visualId) {
  const collectionName = dynamicExampleCollections[state.slug];
  const prefix = `${state.slug}-`;
  if (!collectionName || !visualId.startsWith(prefix)) {
    return false;
  }

  const collectionMatch = pageSource.match(
    new RegExp(`const ${collectionName}:[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\];`),
  );
  const binding = `[visualId]="'${state.slug}-' + example.id"`;
  const exampleId = visualId.slice(prefix.length);

  return (
    pageSource.includes(binding) && Boolean(collectionMatch?.[1].includes(`id: '${exampleId}'`))
  );
}

if (new Set(visualIds).size !== visualIds.length) {
  fail('visual IDs must be unique.');
}

for (const state of manifest.componentStates) {
  for (const visualId of state.visualIds) {
    const hasDefaultPreview =
      visualId === `${state.slug}-default` &&
      allSources.includes(
        state.slug === 'card'
          ? 'visualId="card-default"'
          : '[visualId]="componentDoc.slug + \'-default\'"',
      );
    if (!hasDefaultPreview && !hasDynamicExample(state, visualId)) {
      fail(`${visualId} is not connected to a rendered documentation preview.`);
    }
  }
}

for (const theme of ['light', 'dark']) {
  if (!manifest.themes.includes(theme)) {
    fail(`${theme} theme coverage is missing.`);
  }
}
for (const engine of ['chromium', 'webkit']) {
  if (!manifest.engines.includes(engine)) {
    fail(`${engine} engine coverage is missing.`);
  }
}
for (const viewport of ['desktop', 'mobile']) {
  if (!manifest.viewports[viewport]) {
    fail(`${viewport} viewport coverage is missing.`);
  }
}

const interactiveSlugs = new Set(manifest.interactiveStates.map((entry) => entry.slug));
for (const slug of [
  'modal',
  'combobox',
  'date-picker',
  'command-palette',
  'overlay',
  'confirmation',
  'menu',
  'drawer',
  'popover',
  'tooltip',
]) {
  if (!interactiveSlugs.has(slug)) {
    fail(`${slug} open/visible state coverage is missing.`);
  }
}

console.log(
  `Visual manifest check passed for ${manifestSlugs.length} components, ${visualIds.length} static states, and ${manifest.interactiveStates.length} interactive states.`,
);
