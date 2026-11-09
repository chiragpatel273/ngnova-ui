import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'projects', 'ui', 'schematics');
const distPackageRoot = join(root, 'dist', 'ui');
const outRoot = join(distPackageRoot, 'schematics');
const require = createRequire(import.meta.url);

if (!existsSync(join(distPackageRoot, 'package.json'))) {
  console.error('dist/ui is missing. Run "ng build ui" before building schematics.');
  process.exit(1);
}

rmSync(outRoot, { recursive: true, force: true });

const tsc = spawnSync(
  process.execPath,
  [require.resolve('typescript/bin/tsc'), '-p', join(sourceRoot, 'tsconfig.json')],
  { stdio: 'inherit' },
);

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

for (const asset of ['collection.json', join('ng-add', 'schema.json')]) {
  const target = join(outRoot, asset);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(sourceRoot, asset), target);
}

// The published package is "type": "module"; the Angular CLI loads schematics as CommonJS.
writeFileSync(join(outRoot, 'package.json'), `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);

// ng-packagr's .npmignore drops every nested package.json; keep the schematics marker.
const npmIgnoreFile = join(distPackageRoot, '.npmignore');
const keepRule = '!schematics/package.json';
const npmIgnore = existsSync(npmIgnoreFile) ? readFileSync(npmIgnoreFile, 'utf8') : '';

if (!npmIgnore.split(/\r?\n/).includes(keepRule)) {
  writeFileSync(npmIgnoreFile, `${npmIgnore.replace(/\s*$/, '\n')}${keepRule}\n`);
}

console.log('Built NgNova UI schematics to dist/ui/schematics.');
