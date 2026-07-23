import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function readJson(path) {
  if (!existsSync(path)) {
    throw new Error(`${path} is missing.`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readJsonc(path) {
  return JSON.parse(
    readFileSync(path, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, ''),
  );
}

function fail(message) {
  console.error(`Angular compatibility check failed: ${message}`);
  process.exit(1);
}

try {
  const manifest = readJson(join(root, 'docs', 'compatibility', 'angular.json'));
  const libraryPackage = readJson(join(root, 'projects', 'ui', 'package.json'));
  const tsconfig = readJsonc(join(root, 'tsconfig.json'));
  const angularCore = readJson(join(root, 'node_modules', '@angular', 'core', 'package.json'));
  const angularCompilerCli = readJson(
    join(root, 'node_modules', '@angular', 'compiler-cli', 'package.json'),
  );

  if (manifest.libraryVersion !== libraryPackage.version) {
    fail('documented library version does not match projects/ui/package.json.');
  }

  for (const packageName of manifest.angular.packages) {
    if (libraryPackage.peerDependencies?.[packageName] !== manifest.angular.peerRange) {
      fail(`${packageName} does not match the documented Angular peer range.`);
    }
  }

  if (
    libraryPackage.peerDependencies?.['@angular/cdk'] !== manifest.angularCdk.peerRange ||
    libraryPackage.peerDependenciesMeta?.['@angular/cdk']?.optional !== manifest.angularCdk.optional
  ) {
    fail('the Angular CDK peer range or optional status differs from the compatibility matrix.');
  }

  if (angularCompilerCli.peerDependencies?.typescript !== manifest.buildToolchain.typescript) {
    fail('the installed Angular compiler TypeScript range differs from the compatibility matrix.');
  }
  if (angularCore.engines?.node !== manifest.buildToolchain.node) {
    fail('the installed Angular Node range differs from the compatibility matrix.');
  }
  if (tsconfig.compilerOptions?.target !== manifest.buildToolchain.ecmaTarget) {
    fail('the repository ECMAScript target differs from the compatibility matrix.');
  }

  const productionConfig = readFileSync(
    join(root, 'projects', 'ui', 'tsconfig.lib.prod.json'),
    'utf8',
  );
  if (!productionConfig.includes('"compilationMode": "partial"')) {
    fail('the production library build is not configured for partial-Ivy compilation.');
  }

  if (
    angularCore.peerDependencies?.rxjs !== manifest.angularRuntimePeers.rxjs ||
    angularCore.peerDependencies?.['zone.js'] !== manifest.angularRuntimePeers.zoneJs
  ) {
    fail('Angular runtime peer documentation has drifted from the installed Angular package.');
  }

  console.log(
    `Angular compatibility check passed for Angular ${manifest.angular.major}, TypeScript ${manifest.buildToolchain.typescript}, and partial-Ivy ${manifest.buildToolchain.ecmaTarget}.`,
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
