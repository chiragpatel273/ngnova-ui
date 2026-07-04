import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const uiRoot = join(root, 'projects', 'ui');
const distRoot = join(root, 'dist', 'ui');
const distPackageFile = join(distRoot, 'package.json');
const componentDirs = readdirSync(uiRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !['src', 'testing'].includes(name))
  .sort();

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function requireFile(path, message) {
  if (!existsSync(path)) {
    fail(message);
    return false;
  }

  return true;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkTsFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return ['.angular', 'coverage', 'dist', 'node_modules'].includes(entry.name)
        ? []
        : walkTsFiles(path);
    }

    return entry.isFile() && path.endsWith('.ts') ? [path] : [];
  });
}

for (const slug of componentDirs) {
  const sourceFile = join(uiRoot, slug, 'src', `${slug}.ts`);
  const publicApiFile = join(uiRoot, slug, 'public-api.ts');

  if (requireFile(sourceFile, `${slug}: missing secondary source file`)) {
    const source = read(sourceFile);

    if (!source.includes('ChangeDetectionStrategy.OnPush')) {
      fail(`${slug}: component source does not include OnPush change detection`);
    }
  }

  if (requireFile(publicApiFile, `${slug}: missing secondary public-api.ts`)) {
    const publicApi = read(publicApiFile);
    const expectedExport = new RegExp(`from ['"]\\./src/${escapeRegExp(slug)}['"]`);

    if (!expectedExport.test(publicApi)) {
      fail(`${slug}: public-api.ts must export from ./src/${slug}`);
    }

    if (publicApi.includes('../src/lib')) {
      fail(`${slug}: public-api.ts still references the old root implementation path`);
    }
  }

  if (existsSync(distRoot)) {
    requireFile(
      join(distRoot, slug, 'package.json'),
      `${slug}: missing generated package.json in dist/ui`,
    );
    requireFile(
      join(distRoot, 'fesm2022', `ngnova-ui-${slug}.mjs`),
      `${slug}: missing generated FESM bundle in dist/ui`,
    );
    requireFile(
      join(distRoot, 'types', `ngnova-ui-${slug}.d.ts`),
      `${slug}: missing generated declaration bundle in dist/ui`,
    );
  }
}

const rootPublicApi = join(uiRoot, 'src', 'public-api.ts');

if (requireFile(rootPublicApi, 'root public-api.ts is missing')) {
  const rootApi = read(rootPublicApi);

  if (/Ui[A-Z]\w+/.test(rootApi)) {
    fail('root @ngnova/ui public API must not re-export components');
  }
}

const docsDataFile = join(root, 'src', 'app', 'docs', 'docs-data.ts');

if (requireFile(docsDataFile, 'docs-data.ts is missing')) {
  const docsData = read(docsDataFile);

  for (const slug of componentDirs) {
    if (!new RegExp(`slug:\\s*['"]${escapeRegExp(slug)}['"]`).test(docsData)) {
      fail(`${slug}: missing component docs metadata`);
    }
  }

  if (!docsData.includes('return `@ngnova/ui/${slug}`;')) {
    fail('docs import helper must return per-component @ngnova/ui/<slug> paths');
  }
}

for (const file of [...walkTsFiles(join(root, 'src')), ...walkTsFiles(uiRoot)]) {
  const contents = read(file);

  if (/from\s+['"]@ngnova\/ui['"]/.test(contents)) {
    fail(
      `${file.replace(`${root}\\`, '')}: imports from root @ngnova/ui instead of a secondary entry point`,
    );
  }
}

if (existsSync(distRoot)) {
  if (requireFile(distPackageFile, 'dist/ui/package.json is missing')) {
    const packageJson = JSON.parse(read(distPackageFile));

    if (packageJson.name !== '@ngnova/ui') {
      fail('dist package name must be @ngnova/ui');
    }

    if (packageJson.sideEffects !== false) {
      fail('dist package sideEffects must be false');
    }

    if (packageJson.publishConfig?.access !== 'public') {
      fail('dist package publishConfig.access must be public');
    }

    for (const peer of ['@angular/common', '@angular/core', '@angular/forms']) {
      if (!packageJson.peerDependencies?.[peer]) {
        fail(`dist package missing ${peer} peer dependency`);
      }
    }

    for (const slug of componentDirs) {
      const exportPath = `./${slug}`;
      const exportConfig = packageJson.exports?.[exportPath];

      if (!exportConfig) {
        fail(`dist package missing ${exportPath} export`);
        continue;
      }

      if (exportConfig.types !== `./types/ngnova-ui-${slug}.d.ts`) {
        fail(`dist package ${exportPath} export has incorrect types path`);
      }

      if (exportConfig.default !== `./fesm2022/ngnova-ui-${slug}.mjs`) {
        fail(`dist package ${exportPath} export has incorrect default path`);
      }
    }
  }

  const distFiles = [
    ...walkTsFiles(join(distRoot, 'types')),
    ...readdirSync(join(distRoot, 'fesm2022'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.mjs'))
      .map((entry) => join(distRoot, 'fesm2022', entry.name)),
  ];

  for (const file of distFiles) {
    const contents = read(file);

    if (contents.includes('@ngnova/ui')) {
      fail(`${file.replace(`${root}\\`, '')}: generated output references root @ngnova/ui`);
    }
  }
}

if (failures.length > 0) {
  console.error('Package audit failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Package audit passed for ${componentDirs.length} component entry points.`);
