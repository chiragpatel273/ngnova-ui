import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const distRoot = join(root, 'dist', 'ui');
const packageFile = join(distRoot, 'package.json');
const baselineFile = join(root, 'docs', 'api', 'public-api-baseline.json');
const reviewFile = join(root, 'docs', 'api', 'public-api-review.json');
const writeBaseline = process.argv.includes('--write');

function fail(message) {
  console.error(`Public API compatibility check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(packageFile)) {
  fail('dist/ui/package.json is missing; run npm.cmd run build:lib first.');
}

function normalizedDeclaration(contents) {
  return contents
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith('import ') &&
        !trimmed.startsWith('private ') &&
        !/^static\s+[Éµɵ]/u.test(trimmed) &&
        !trimmed.startsWith('static ngAcceptInputType_')
      );
    })
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function exportedSymbols(contents) {
  const symbols = new Set();
  const exportPattern = /export\s+(?:type\s+)?\{([^}]+)\};/g;
  for (const match of contents.matchAll(exportPattern)) {
    for (const item of match[1].split(',')) {
      const exported = item
        .trim()
        .split(/\s+as\s+/)
        .at(-1)
        ?.trim();
      if (exported) symbols.add(exported);
    }
  }
  return [...symbols].sort();
}

const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'));
const exportEntries = Object.entries(packageJson.exports)
  .filter(([, config]) => typeof config === 'object' && typeof config.types === 'string')
  .sort(([left], [right]) => left.localeCompare(right));

const entryPoints = {};
for (const [exportPath, config] of exportEntries) {
  const declarationFile = join(distRoot, config.types);
  if (!existsSync(declarationFile)) {
    fail(`${exportPath} points to missing declaration file ${config.types}.`);
  }
  const contents = readFileSync(declarationFile, 'utf8');
  const normalized = normalizedDeclaration(contents);
  entryPoints[exportPath] = {
    importPath: exportPath === '.' ? '@ngnova/ui' : `@ngnova/ui${exportPath.slice(1)}`,
    symbols: exportedSymbols(contents),
    signatureSha256: createHash('sha256').update(normalized).digest('hex'),
  };
}

const snapshot = {
  schemaVersion: 1,
  packageName: packageJson.name,
  packageVersion: packageJson.version,
  angularPeer: packageJson.peerDependencies?.['@angular/core'] ?? null,
  rootPolicy: 'minimal',
  entryPoints,
};

if (writeBaseline) {
  mkdirSync(dirname(baselineFile), { recursive: true });
  writeFileSync(baselineFile, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `Wrote public API baseline for ${Object.keys(entryPoints).length} entry points to docs/api/public-api-baseline.json.`,
  );
  process.exit(0);
}

if (!existsSync(baselineFile)) {
  fail('docs/api/public-api-baseline.json is missing; create it with --write after API review.');
}

const baselineContents = readFileSync(baselineFile, 'utf8');
const baseline = JSON.parse(baselineContents);
if (!existsSync(reviewFile)) {
  fail('docs/api/public-api-review.json is missing; the baseline has not been reviewed.');
}
const review = JSON.parse(readFileSync(reviewFile, 'utf8'));
const normalizedBaselineContents = baselineContents.replace(/\r\n?/g, '\n');
const baselineSha256 = createHash('sha256').update(normalizedBaselineContents).digest('hex');
if (review.baselineSha256 !== baselineSha256) {
  fail(
    'the API baseline changed without updating the reviewed digest and breaking-change documentation.',
  );
}
if (
  review.packageName !== snapshot.packageName ||
  review.reviewedPackageVersion !== baseline.packageVersion ||
  review.stabilityStage !== 'stable-1.0'
) {
  fail('the API review metadata does not match the stable 1.0 package baseline.');
}
const failures = [];
const baselinePaths = new Set(Object.keys(baseline.entryPoints ?? {}));
const currentPaths = new Set(Object.keys(entryPoints));

for (const path of baselinePaths) {
  if (!currentPaths.has(path)) failures.push(`${path}: entry point was removed`);
}
for (const path of currentPaths) {
  if (!baselinePaths.has(path))
    failures.push(`${path}: entry point was added without baseline review`);
}
for (const path of [...baselinePaths].filter((value) => currentPaths.has(value))) {
  const expected = baseline.entryPoints[path];
  const actual = entryPoints[path];
  const expectedSymbols = new Set(expected.symbols);
  const actualSymbols = new Set(actual.symbols);
  const removed = [...expectedSymbols].filter((symbol) => !actualSymbols.has(symbol));
  const added = [...actualSymbols].filter((symbol) => !expectedSymbols.has(symbol));
  if (removed.length) failures.push(`${path}: removed exports ${removed.join(', ')}`);
  if (added.length) failures.push(`${path}: added exports ${added.join(', ')}`);
  if (expected.signatureSha256 !== actual.signatureSha256) {
    failures.push(`${path}: normalized declaration signature changed`);
  }
}

if (
  baseline.packageName !== snapshot.packageName ||
  baseline.angularPeer !== snapshot.angularPeer ||
  baseline.rootPolicy !== snapshot.rootPolicy
) {
  failures.push('package name, Angular peer range, or root policy changed');
}

if (failures.length) {
  console.error('Public API compatibility check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(
    'Review the semver impact, add migration/release documentation, then intentionally refresh the baseline with --write.',
  );
  process.exit(1);
}

const symbolCount = Object.values(entryPoints).reduce(
  (total, entryPoint) => total + entryPoint.symbols.length,
  0,
);
console.log(
  `Public API compatibility check passed for ${Object.keys(entryPoints).length} entry points and ${symbolCount} exported symbols.`,
);
