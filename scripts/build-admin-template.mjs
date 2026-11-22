// Builds the Northstar admin template (templates/admin) against the library in dist/ui, so the
// live demo always matches the code on main, and writes the static site to --out.
//
//   node scripts/build-admin-template.mjs --base /ngnova-ui/templates/admin/ --out dist/versioned-docs/templates/admin
//
// The template's own package.json keeps depending on the published @ngnova/ui release; that
// combination is verified separately in CI.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const root = process.cwd();
const templateRoot = join(root, 'templates', 'admin');
const workspace = join(root, '.tmp', 'admin-template');
const distUi = join(root, 'dist', 'ui');
const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';
const npx = isWindows ? 'npx.cmd' : 'npx';

function option(name) {
  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error(`Pass --${name}.`);
  return value;
}

const base = option('base');
const out = resolve(option('out'));
if (!base.startsWith('/') || !base.endsWith('/'))
  throw new Error('--base must start and end with "/".');
if (!out.startsWith(`${root}${sep}`))
  throw new Error(`--out must stay inside the workspace: ${out}`);
if (!existsSync(join(distUi, 'package.json'))) {
  throw new Error('dist/ui is missing; run npm run build:lib first.');
}

function run(label, command, args, cwd) {
  console.log(`\n> ${label}`);
  const result = isWindows
    ? spawnSync([command, ...args].join(' '), { cwd, shell: true, stdio: 'inherit' })
    : spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${label} failed.`);
}

// 1. Copy the template without local build output or dependencies.
rmSync(workspace, { recursive: true, force: true });
mkdirSync(workspace, { recursive: true });
const skipped = new Set(['node_modules', 'dist', '.angular', 'out-tsc', 'coverage']);
cpSync(templateRoot, workspace, {
  recursive: true,
  filter: (source) => !skipped.has(relative(templateRoot, source).split(sep)[0]),
});

// 2. Point @ngnova/ui at a tarball of the current library build.
const { version } = JSON.parse(readFileSync(join(distUi, 'package.json'), 'utf8'));
run('Pack @ngnova/ui', npm, ['pack', '--pack-destination', workspace], distUi);
const packagePath = join(workspace, 'package.json');
const templatePackage = JSON.parse(readFileSync(packagePath, 'utf8'));
templatePackage.dependencies['@ngnova/ui'] = `file:./ngnova-ui-${version}.tgz`;
writeFileSync(packagePath, `${JSON.stringify(templatePackage, null, 2)}\n`);

// 3. Install and build.
run(
  'Install template dependencies',
  npm,
  ['install', '--no-audit', '--no-fund', '--prefer-offline'],
  workspace,
);
run(
  'Build admin template',
  npx,
  ['ng', 'build', '--base-href', base, '--output-path', 'dist/site'],
  workspace,
);

// 4. Publish the browser build and give every known route its own index.html so static hosts
// such as GitHub Pages answer deep links with 200. Unknown paths fall back through 404.html.
const browser = join(workspace, 'dist', 'site', 'browser');
rmSync(out, { recursive: true, force: true });
mkdirSync(dirname(out), { recursive: true });
cpSync(browser, out, { recursive: true });

const index = readFileSync(join(out, 'index.html'), 'utf8');
const mockData = readFileSync(join(templateRoot, 'src', 'app', 'core', 'mock-data.ts'), 'utf8');
const firstOrder = Number(/id: `NS-\$\{(\d+) - index\}`/.exec(mockData)?.[1]);
const orderCount = Number(/MOCK_ORDERS[^=]*= Array\.from\(\{ length: (\d+) \}/.exec(mockData)?.[1]);
if (!firstOrder || !orderCount) throw new Error('Could not read order ids from mock-data.ts.');

const routes = ['customers', 'orders', 'settings', 'sign-in'];
for (let index = 0; index < orderCount; index += 1) routes.push(`orders/NS-${firstOrder - index}`);
for (const route of routes) {
  mkdirSync(join(out, route), { recursive: true });
  writeFileSync(join(out, route, 'index.html'), index);
}

console.log(
  `\nAdmin template built for ${base} at ${relative(root, out)} (${routes.length} routes).`,
);
