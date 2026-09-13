import { readFileSync } from 'node:fs';

const packageManifestUrl = new URL('../projects/ui/package.json', import.meta.url);
const packageManifest = JSON.parse(readFileSync(packageManifestUrl, 'utf8'));
const releaseTag = process.argv[2] ?? process.env['RELEASE_TAG'];

if (!releaseTag) {
  console.error('Provide a release tag as an argument or through RELEASE_TAG.');
  process.exit(1);
}

if (typeof packageManifest.version !== 'string') {
  console.error('projects/ui/package.json does not contain a valid version.');
  process.exit(1);
}

const expectedTag = `v${packageManifest.version}`;
if (releaseTag !== expectedTag) {
  console.error(`Release tag ${releaseTag} does not match package version ${expectedTag}.`);
  process.exit(1);
}

console.log(`Release tag ${releaseTag} matches @ngnova/ui ${packageManifest.version}.`);
