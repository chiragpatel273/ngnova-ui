import { gzipSync } from 'node:zlib';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const distRoot = join(root, 'dist', 'ui');
const packageFile = join(distRoot, 'package.json');
const baselineFile = join(root, 'docs', 'performance', 'bundle-budgets.json');
const writeBaseline = process.argv.includes('--write');

function fail(message) {
  console.error(`Bundle budget check failed: ${message}`);
  process.exit(1);
}

function size(path) {
  const contents = readFileSync(path);
  return { rawBytes: contents.byteLength, gzipBytes: gzipSync(contents, { level: 9 }).byteLength };
}

function budgetFor(measurement) {
  return {
    rawBytes: Math.ceil(Math.max(measurement.rawBytes * 1.1, measurement.rawBytes + 512)),
    gzipBytes: Math.ceil(Math.max(measurement.gzipBytes * 1.1, measurement.gzipBytes + 256)),
  };
}

if (!existsSync(packageFile)) {
  fail('dist/ui/package.json is missing; run npm.cmd run build:lib first.');
}

const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'));
const entryPoints = {};
for (const [exportPath, config] of Object.entries(packageJson.exports).sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  if (
    typeof config !== 'object' ||
    config === null ||
    typeof config.default !== 'string' ||
    !config.default.endsWith('.mjs')
  ) {
    continue;
  }
  const bundlePath = join(distRoot, config.default);
  if (!existsSync(bundlePath)) fail(`${exportPath} points to missing bundle ${config.default}.`);
  entryPoints[exportPath] = {
    importPath: exportPath === '.' ? '@ngnova/ui' : `@ngnova/ui${exportPath.slice(1)}`,
    ...size(bundlePath),
  };
}

const themePath = join(distRoot, 'styles', 'theme.css');
if (!existsSync(themePath)) fail('the exported theme stylesheet is missing.');
const assets = {
  './styles/theme.css': {
    importPath: '@ngnova/ui/styles/theme.css',
    ...size(themePath),
  },
};

if (writeBaseline) {
  const baseline = {
    schemaVersion: 1,
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    compression: 'gzip-9',
    entryPoints: Object.fromEntries(
      Object.entries(entryPoints).map(([path, measurement]) => [
        path,
        { ...measurement, budget: budgetFor(measurement) },
      ]),
    ),
    assets: Object.fromEntries(
      Object.entries(assets).map(([path, measurement]) => [
        path,
        { ...measurement, budget: budgetFor(measurement) },
      ]),
    ),
  };
  mkdirSync(dirname(baselineFile), { recursive: true });
  writeFileSync(baselineFile, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(
    `Wrote budgets for ${Object.keys(entryPoints).length} entry points and ${Object.keys(assets).length} asset.`,
  );
  process.exit(0);
}

if (!existsSync(baselineFile)) {
  fail('docs/performance/bundle-budgets.json is missing; create it after bundle review.');
}

const baseline = JSON.parse(readFileSync(baselineFile, 'utf8'));
const failures = [];

function compareGroup(label, current, expected) {
  const currentPaths = new Set(Object.keys(current));
  const expectedPaths = new Set(Object.keys(expected ?? {}));
  for (const path of expectedPaths) {
    if (!currentPaths.has(path)) failures.push(`${label} ${path} was removed`);
  }
  for (const path of currentPaths) {
    if (!expectedPaths.has(path)) failures.push(`${label} ${path} has no reviewed budget`);
  }
  for (const path of [...currentPaths].filter((value) => expectedPaths.has(value))) {
    for (const metric of ['rawBytes', 'gzipBytes']) {
      const actual = current[path][metric];
      const maximum = expected[path].budget?.[metric];
      if (!Number.isFinite(maximum)) {
        failures.push(`${label} ${path} has no ${metric} budget`);
      } else if (actual > maximum) {
        failures.push(`${label} ${path} ${metric} is ${actual} bytes; budget is ${maximum}`);
      }
    }
  }
}

compareGroup('entry point', entryPoints, baseline.entryPoints);
compareGroup('asset', assets, baseline.assets);
if (baseline.packageName !== packageJson.name || baseline.compression !== 'gzip-9') {
  failures.push('package name or compression contract changed');
}

if (failures.length) {
  console.error('Bundle budget check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(
    'Reduce the regression or document and review the cost before intentionally refreshing budgets.',
  );
  process.exit(1);
}

const totalRaw = Object.values(entryPoints).reduce((total, entry) => total + entry.rawBytes, 0);
const totalGzip = Object.values(entryPoints).reduce((total, entry) => total + entry.gzipBytes, 0);
const largest = Object.entries(entryPoints)
  .sort(([, left], [, right]) => right.gzipBytes - left.gzipBytes)
  .slice(0, 5)
  .map(([path, entry]) => `${path} ${entry.gzipBytes} B gzip`)
  .join(', ');
console.log(
  `Bundle budgets passed for ${Object.keys(entryPoints).length} entry points (${totalRaw} B raw, ${totalGzip} B gzip). Largest: ${largest}.`,
);
