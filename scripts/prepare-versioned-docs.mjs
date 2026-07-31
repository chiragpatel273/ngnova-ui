import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const workspaceRoot = resolve('.');
const sourceRoot = resolve('dist/demo/browser');
const outputRoot = resolve('dist/versioned-docs');
const manifestPath = resolve('docs/hosting/versions.json');

const assertWorkspacePath = (path, label) => {
  if (!path.startsWith(`${workspaceRoot}${sep}`)) {
    throw new Error(`${label} resolved outside the workspace: ${path}`);
  }
};

assertWorkspacePath(sourceRoot, 'Documentation build');
assertWorkspacePath(outputRoot, 'Versioned documentation output');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const activeVersion = manifest.versions.find((version) => version.id === manifest.defaultVersion);

if (!activeVersion) {
  throw new Error(`Default documentation version ${manifest.defaultVersion} is not declared.`);
}

const builtIndex = await readFile(resolve(sourceRoot, 'index.html'), 'utf8');
const latestBasePath = `${manifest.projectPath}/`;
const expectedBase = `<base href="${latestBasePath}">`;

if (!builtIndex.includes(expectedBase)) {
  throw new Error(
    `Documentation build must contain ${expectedBase}. Build with the latest documentation base href first.`,
  );
}

await rm(outputRoot, { force: true, recursive: true });
await cp(sourceRoot, outputRoot, { recursive: true });

const targetUrl = `${manifest.projectPath}/`;
const redirectDocument = (target) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${target}">
    <meta name="robots" content="noindex">
    <link rel="canonical" href="${manifest.canonicalOrigin}${target}">
    <title>NgNova UI documentation</title>
  </head>
  <body>
    <p><a href="${target}">Open NgNova UI documentation</a></p>
  </body>
</html>
`;

await mkdir(resolve(outputRoot, activeVersion.id));
await writeFile(resolve(outputRoot, activeVersion.id, 'index.html'), redirectDocument(targetUrl));
await mkdir(resolve(outputRoot, 'latest'));
await writeFile(resolve(outputRoot, 'latest/index.html'), redirectDocument(targetUrl));
await writeFile(resolve(outputRoot, '404.html'), redirectDocument(targetUrl));
await writeFile(resolve(outputRoot, '.nojekyll'), '');
await writeFile(resolve(outputRoot, 'versions.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log('Prepared latest documentation at dist/versioned-docs.');
console.log(
  `Latest component route: ${manifest.canonicalOrigin}${latestBasePath}#/components/button`,
);
