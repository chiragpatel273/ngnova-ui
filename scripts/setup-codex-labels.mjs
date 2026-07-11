import { readFile } from 'node:fs/promises';

const labelsPath = new URL('../.github/codex/labels/codex-labels.json', import.meta.url);
const packagePath = new URL('../package.json', import.meta.url);

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY ?? (await readRepositoryFromPackageJson());

if (!repository) {
  throw new Error('Set GITHUB_REPOSITORY or add a GitHub repository URL to package.json.');
}

if (!dryRun && !token) {
  throw new Error('Set GITHUB_TOKEN with repo label permissions, or run with --dry-run.');
}

const labels = JSON.parse(await readFile(labelsPath, 'utf8'));

for (const label of labels) {
  validateLabel(label);

  if (dryRun) {
    console.log(`[dry-run] upsert ${label.name}`);
    continue;
  }

  await upsertLabel(label);
}

async function readRepositoryFromPackageJson() {
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  const rawUrl = packageJson.repository?.url;

  if (typeof rawUrl !== 'string') {
    return undefined;
  }

  const match = rawUrl.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/.]+)(?:\.git)?$/);
  return match?.groups ? `${match.groups.owner}/${match.groups.repo}` : undefined;
}

function validateLabel(label) {
  if (!label || typeof label !== 'object') {
    throw new Error('Each label must be an object.');
  }

  if (typeof label.name !== 'string' || label.name.length === 0) {
    throw new Error('Each label must include a name.');
  }

  if (typeof label.color !== 'string' || !/^[0-9A-Fa-f]{6}$/.test(label.color)) {
    throw new Error(`Label ${label.name} must include a six-character hex color.`);
  }

  if (typeof label.description !== 'string') {
    throw new Error(`Label ${label.name} must include a description.`);
  }
}

async function upsertLabel(label) {
  const encodedName = encodeURIComponent(label.name);
  const url = `https://api.github.com/repos/${repository}/labels/${encodedName}`;
  const body = JSON.stringify({
    color: label.color,
    description: label.description,
    name: label.name,
  });

  const updateResponse = await request(url, {
    body,
    method: 'PATCH',
  });

  if (updateResponse.status === 200) {
    console.log(`updated ${label.name}`);
    return;
  }

  if (updateResponse.status !== 404) {
    throw new Error(
      `Failed to update ${label.name}: ${updateResponse.status} ${await updateResponse.text()}`,
    );
  }

  const createResponse = await request(`https://api.github.com/repos/${repository}/labels`, {
    body,
    method: 'POST',
  });

  if (createResponse.status !== 201) {
    throw new Error(
      `Failed to create ${label.name}: ${createResponse.status} ${await createResponse.text()}`,
    );
  }

  console.log(`created ${label.name}`);
}

function request(url, init) {
  return fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ngnova-ui-codex-label-setup',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}
