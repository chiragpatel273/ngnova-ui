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
if (new Set(visualIds).size !== visualIds.length) {
  fail('visual IDs must be unique.');
}

for (const state of manifest.componentStates) {
  for (const visualId of state.visualIds) {
    const sourceToken =
      visualId === `${state.slug}-default`
        ? state.slug === 'card'
          ? 'visualId="card-default"'
          : '[visualId]="componentDoc.slug + \'-default\'"'
        : visualId.replace('button-', '');
    if (!allSources.includes(sourceToken)) {
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
