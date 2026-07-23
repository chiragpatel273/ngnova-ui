import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const matrixFile = join(root, 'docs', 'compatibility', 'support-matrix.json');
const browserslistFile = join(root, '.browserslistrc');

function fail(message) {
  console.error(`Support matrix check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(matrixFile) || !existsSync(browserslistFile)) {
  fail('the support matrix or .browserslistrc is missing.');
}

const matrix = JSON.parse(readFileSync(matrixFile, 'utf8'));
const browserslist = readFileSync(browserslistFile, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

if (JSON.stringify(browserslist) !== JSON.stringify(matrix.browserPolicy?.browserslist)) {
  fail('.browserslistrc differs from the documented browser policy.');
}

const tier1Browsers = new Set(
  matrix.browserPolicy.tier1.map((entry) => `${entry.browser}:${entry.platform}`),
);
for (const browser of ['Chrome', 'Edge', 'Firefox', 'Safari']) {
  if (![...tier1Browsers].some((entry) => entry.startsWith(`${browser}:`))) {
    fail(`${browser} is missing from the Tier 1 matrix.`);
  }
}

const atPairs = new Set(
  matrix.assistiveTechnology.map(
    (entry) => `${entry.screenReader}:${entry.browser}:${entry.platform}`,
  ),
);
for (const pairing of [
  'NVDA:Chrome:Windows',
  'NVDA:Firefox:Windows',
  'Narrator:Edge:Windows',
  'VoiceOver:Safari:macOS',
  'VoiceOver:Safari:iOS and iPadOS',
]) {
  if (!atPairs.has(pairing)) {
    fail(`${pairing} is missing from the assistive-technology matrix.`);
  }
}

for (const mode of [
  'keyboard-only',
  'screen reader',
  'touch',
  '200% zoom',
  'forced colors',
  'reduced motion',
]) {
  if (!matrix.interactionModes.includes(mode)) {
    fail(`${mode} is missing from required interaction coverage.`);
  }
}

console.log(
  `Support matrix check passed for ${matrix.browserPolicy.tier1.length} browser targets, ${matrix.assistiveTechnology.length} AT pairings, and ${matrix.interactionModes.length} interaction modes.`,
);
