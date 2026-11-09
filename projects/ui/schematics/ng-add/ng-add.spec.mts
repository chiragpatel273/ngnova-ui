import {
  SchematicTestRunner,
  type UnitTestTree,
} from '@angular-devkit/schematics/testing/index.js';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { beforeEach, describe, it } from 'node:test';

// Tests run against the compiled, published schematics in dist/ui (npm run test:schematics).
const require = createRequire(import.meta.url);
const collectionPath = join(process.cwd(), 'dist', 'ui', 'schematics', 'collection.json');
const helpers = require(join(process.cwd(), 'dist', 'ui', 'schematics', 'ng-add', 'index.js')) as {
  packageSourcePath(stylesheetPath: string): string;
  addNgNovaStyles(
    content: string,
    stylesheetPath: string,
    options: { theme: boolean; darkMode: 'class' | 'media' },
  ): string;
};

const runner = new SchematicTestRunner('@ngnova/ui', collectionPath);

async function createApp(style: 'css' | 'scss' = 'css'): Promise<UnitTestTree> {
  const workspace = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '22.0.0',
  });

  return runner.runExternalSchematic(
    '@schematics/angular',
    'application',
    { name: 'app', style, skipInstall: true },
    workspace,
  );
}

function readJson(tree: UnitTestTree, path: string): Record<string, Record<string, string>> {
  return JSON.parse(tree.readContent(path)) as Record<string, Record<string, string>>;
}

describe('ng-add', () => {
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createApp();
  });

  it('installs Tailwind CSS v4 and configures the NgNova UI stylesheet', async () => {
    const tree = await runner.runSchematic('ng-add', { project: 'app' }, appTree);
    const styles = tree.readContent('/projects/app/src/styles.css');

    assert.match(styles, /@import 'tailwindcss';/);
    assert.match(styles, /@import '@ngnova\/ui\/styles\/theme\.css';/);
    assert.match(styles, /@custom-variant dark \(&:where\(\.dark, \.dark \*\)\);/);
    assert.match(styles, /@source "\.\.\/\.\.\/\.\.\/node_modules\/@ngnova\/ui";/);
    assert.ok(
      styles.indexOf("@import 'tailwindcss'") < styles.indexOf('@ngnova/ui/styles/theme.css'),
      'theme import must follow the Tailwind import',
    );

    const manifest = readJson(tree, '/package.json');
    assert.ok(manifest['devDependencies']['tailwindcss']);
    assert.ok(manifest['devDependencies']['@tailwindcss/postcss']);
    assert.ok(tree.exists('/projects/app/.postcssrc.json') || tree.exists('/.postcssrc.json'));
  });

  it('defaults to the only application when no project is given', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);

    assert.match(tree.readContent('/projects/app/src/styles.css'), /@source ".*@ngnova\/ui";/);
  });

  it('is idempotent', async () => {
    const once = await runner.runSchematic('ng-add', { project: 'app' }, appTree);
    const first = once.readContent('/projects/app/src/styles.css');
    const twice = await runner.runSchematic('ng-add', { project: 'app' }, once);

    assert.equal(twice.readContent('/projects/app/src/styles.css'), first);
  });

  it('respects theme: false and darkMode: media', async () => {
    const tree = await runner.runSchematic(
      'ng-add',
      { project: 'app', theme: false, darkMode: 'media' },
      appTree,
    );
    const styles = tree.readContent('/projects/app/src/styles.css');

    assert.doesNotMatch(styles, /theme\.css/);
    assert.doesNotMatch(styles, /@custom-variant/);
    assert.match(styles, /@source ".*@ngnova\/ui";/);
  });

  it('adds @angular/cdk only when requested', async () => {
    const without = await runner.runSchematic('ng-add', { project: 'app' }, appTree);
    assert.equal(readJson(without, '/package.json')['dependencies']['@angular/cdk'], undefined);

    const withCdk = await runner.runSchematic('ng-add', { project: 'app', cdk: true }, appTree);
    assert.equal(readJson(withCdk, '/package.json')['dependencies']['@angular/cdk'], '^22.0.0');
  });

  it('keeps an existing customized Tailwind import instead of adding another', async () => {
    appTree.overwrite('/projects/app/src/styles.css', `@import "tailwindcss";\n\nbody {}\n`);

    const tree = await runner.runSchematic('ng-add', { project: 'app' }, appTree);
    const styles = tree.readContent('/projects/app/src/styles.css');

    assert.equal(styles.match(/@import ["']tailwindcss["']/g)?.length, 1);
    assert.match(styles, /@import "tailwindcss";\n@import '@ngnova\/ui\/styles\/theme\.css';/);
  });

  it('places directives after every @import so the stylesheet stays valid CSS', async () => {
    appTree.overwrite(
      '/projects/app/src/styles.css',
      `@import 'tailwindcss';\n@import './fonts.css';\n\nbody {}\n`,
    );

    const tree = await runner.runSchematic('ng-add', { project: 'app' }, appTree);
    const lines = tree.readContent('/projects/app/src/styles.css').split('\n');
    const lastImport = lines.findLastIndex((line) => line.startsWith('@import'));

    assert.ok(lines.indexOf("@import '@ngnova/ui/styles/theme.css';") < lastImport);
    assert.ok(lines.findIndex((line) => line.startsWith('@custom-variant')) > lastImport);
    assert.ok(lines.findIndex((line) => line.startsWith('@source')) > lastImport);
  });

  it('creates a Tailwind stylesheet for Sass applications', async () => {
    const scssTree = await createApp('scss');
    const tree = await runner.runSchematic('ng-add', { project: 'app' }, scssTree);
    const tailwind = tree.readContent('/projects/app/src/tailwind.css');

    assert.match(tailwind, /@import 'tailwindcss';/);
    assert.match(tailwind, /@source "\.\.\/\.\.\/\.\.\/node_modules\/@ngnova\/ui";/);
  });

  it('refuses Tailwind CSS v3 workspaces with an upgrade hint', async () => {
    const manifest = readJson(appTree, '/package.json');
    manifest['devDependencies']['tailwindcss'] = '^3.4.0';
    appTree.overwrite('/package.json', JSON.stringify(manifest));

    await assert.rejects(
      runner.runSchematic('ng-add', { project: 'app' }, appTree),
      /requires Tailwind CSS v4.*@tailwindcss\/upgrade/,
    );
  });

  it('rejects unknown projects', async () => {
    await assert.rejects(
      runner.runSchematic('ng-add', { project: 'missing' }, appTree),
      /Project "missing" does not exist/,
    );
  });
});

describe('ng-add helpers', () => {
  it('computes @source paths relative to the stylesheet', () => {
    assert.equal(helpers.packageSourcePath('src/styles.css'), '../node_modules/@ngnova/ui');
    assert.equal(
      helpers.packageSourcePath('projects/app/src/styles.css'),
      '../../../node_modules/@ngnova/ui',
    );
    assert.equal(helpers.packageSourcePath('styles.css'), './node_modules/@ngnova/ui');
  });

  it('does not duplicate existing NgNova lines', () => {
    const configured = [
      "@import 'tailwindcss';",
      "@import '@ngnova/ui/styles/theme.css';",
      '@custom-variant dark (&:where(.dark, .dark *));',
      '@source "../node_modules/@ngnova/ui";',
      '',
    ].join('\n');

    assert.equal(
      helpers.addNgNovaStyles(configured, 'src/styles.css', { theme: true, darkMode: 'class' }),
      configured,
    );
  });
});
