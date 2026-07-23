import { readFile } from 'node:fs/promises';

const policyPaths = [
  'SECURITY.md',
  'SUPPORT.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'docs/VERSIONING_AND_DEPRECATION.md',
];

const policies = Object.fromEntries(
  await Promise.all(policyPaths.map(async (path) => [path, await readFile(path, 'utf8')])),
);
const readme = await readFile('README.md', 'utf8');
const errors = [];

const requireValue = (condition, message) => {
  if (!condition) {
    errors.push(message);
  }
};

for (const [path, content] of Object.entries(policies)) {
  requireValue(content.length >= 500, `${path} is too short to define an actionable policy.`);
  requireValue(readme.includes(path), `README.md must link to ${path}.`);
}

const security = policies['SECURITY.md'];
requireValue(
  security.includes('/security/advisories/new'),
  'SECURITY.md must provide a private vulnerability-reporting route.',
);
requireValue(
  /Do not open a public issue/i.test(security),
  'SECURITY.md must explicitly prevent public vulnerability disclosure.',
);
requireValue(/Supported versions/i.test(security), 'SECURITY.md must define supported versions.');

const support = policies['SUPPORT.md'];
for (const evidence of [
  'ANGULAR_COMPATIBILITY.md',
  'BROWSER_AND_AT_SUPPORT.md',
  'security/advisories/new',
  'Bug report checklist',
]) {
  requireValue(support.includes(evidence), `SUPPORT.md is missing required evidence: ${evidence}`);
}

const contributing = policies['CONTRIBUTING.md'];
for (const evidence of [
  'release:check',
  'test:visual',
  'Changesets and compatibility',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
]) {
  requireValue(
    contributing.includes(evidence),
    `CONTRIBUTING.md is missing required evidence: ${evidence}`,
  );
}

const versioning = policies['docs/VERSIONING_AND_DEPRECATION.md'];
for (const evidence of [
  'Semantic Versioning',
  'Patch:',
  'Minor:',
  'Major:',
  'at least one minor release and 90 days',
  'Security',
  'release:check',
]) {
  requireValue(
    versioning.includes(evidence),
    `VERSIONING_AND_DEPRECATION.md is missing required evidence: ${evidence}`,
  );
}

const conduct = policies['CODE_OF_CONDUCT.md'];
requireValue(
  /Expected behavior/.test(conduct) && /Enforcement/.test(conduct),
  'CODE_OF_CONDUCT.md must define both expectations and enforcement.',
);

if (errors.length > 0) {
  console.error('Project policy check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  'Project policy check passed: security, support, contribution, conduct, versioning, and deprecation contracts are linked and actionable.',
);
