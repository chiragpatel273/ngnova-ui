import { readFile } from 'node:fs/promises';

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const readText = (path) => readFile(path, 'utf8');

const [
  workspacePackage,
  libraryPackage,
  changesetConfig,
  changeset,
  changelog,
  migration,
  releaseNotes,
] = await Promise.all([
  readJson('package.json'),
  readJson('projects/ui/package.json'),
  readJson('.changeset/config.json'),
  readText('.changeset/bright-novas-launch.md'),
  readText('CHANGELOG.md'),
  readText('docs/MIGRATION_TO_1_0.md'),
  readText('docs/RELEASE_NOTES_1_0.md'),
]);

const errors = [];

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
  changesetConfig.baseBranch === 'main' && changesetConfig.access === 'public',
  'Changesets must target main and publish with public access.',
);
requireValue(
  /^---\s*\r?\n['"]@ngnova\/ui['"]: major\s*\r?\n---/m.test(changeset),
  'The 1.0 changeset must declare a major release for @ngnova/ui.',
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
  '194 reviewed images',
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
  'Release documentation check passed: workspace, changeset, changelog, migration guide, and 1.0 release notes agree.',
);
