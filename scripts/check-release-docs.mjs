import { readFile } from 'node:fs/promises';

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const readText = (path) => readFile(path, 'utf8');

const [
  workspacePackage,
  libraryPackage,
  changesetConfig,
  packageChangelog,
  changelog,
  migration,
  releaseNotes,
] = await Promise.all([
  readJson('package.json'),
  readJson('projects/ui/package.json'),
  readJson('.changeset/config.json'),
  readText('projects/ui/CHANGELOG.md'),
  readText('CHANGELOG.md'),
  readText('docs/MIGRATION_TO_1_0.md'),
  readText('docs/RELEASE_NOTES_1_0.md'),
]);

const errors = [];
const stableVersionMatch = /^(\d+)\.(\d+)\.(\d+)$/.exec(libraryPackage.version);

const requireValue = (condition, message) => {
  if (!condition) {
    errors.push(message);
  }
};

requireValue(
  workspacePackage.workspaces?.includes('projects/ui'),
  'The root workspace must include projects/ui so Changesets can discover @ngnova/ui.',
);
requireValue(
  workspacePackage.private === true,
  'The release workspace must remain private; only the generated library package is publishable.',
);
requireValue(libraryPackage.name === '@ngnova/ui', 'The release package must be named @ngnova/ui.');
requireValue(
  stableVersionMatch !== null && Number(stableVersionMatch[1]) >= 1,
  'The release package must declare a stable semantic version at or above 1.0.0.',
);
requireValue(
  changesetConfig.baseBranch === 'main' && changesetConfig.access === 'public',
  'Changesets must target main and publish with public access.',
);
requireValue(
  packageChangelog.includes('## 1.0.0') && packageChangelog.includes('### Major Changes'),
  'The package changelog must contain the applied 1.0.0 major release.',
);
requireValue(
  packageChangelog.includes(`## ${libraryPackage.version}`),
  `The package changelog must contain the current ${libraryPackage.version} release.`,
);

for (const heading of ['Added', 'Changed', 'Fixed', 'Security']) {
  requireValue(
    changelog.includes(`### ${heading}`),
    `CHANGELOG.md must include a ${heading} section.`,
  );
}
requireValue(
  /## 1\.0\.0 .* Unreleased/.test(changelog),
  'CHANGELOG.md must document the unreleased 1.0.0 release.',
);

const migrationEvidence = [
  '@ngnova/ui/button',
  '(pressed)',
  '@ngnova/ui/styles/theme.css',
  '--ui-*',
  'immutable',
  '@ngnova/ui/testing',
  'npm.cmd run test:lib',
];
for (const evidence of migrationEvidence) {
  requireValue(
    migration.includes(evidence),
    `The 1.0 migration guide is missing required evidence: ${evidence}`,
  );
}

const releaseEvidence = [
  '40 documented visual components',
  'Angular 22',
  '@ngnova/ui/<component>',
  '196 reviewed images',
  'zoneless',
  'SSR',
  'hydration',
  'MIGRATION_TO_1_0.md',
];
for (const evidence of releaseEvidence) {
  requireValue(
    releaseNotes.includes(evidence),
    `The 1.0 release notes are missing required evidence: ${evidence}`,
  );
}

if (errors.length > 0) {
  console.error('Release documentation check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Release documentation check passed for ${libraryPackage.version}: workspace, changelogs, migration guide, and 1.0 release notes agree.`,
);
