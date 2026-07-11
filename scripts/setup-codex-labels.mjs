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

await verifyRepositoryAccess();

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

  if (label.description.length > 100) {
    throw new Error(`Label ${label.name} description must be 100 characters or fewer.`);
  }
}

async function upsertLabel(label) {
  const encodedName = encodeURIComponent(label.name);
  const url = `https://api.github.com/repos/${repository}/labels/${encodedName}`;
  const updateBody = JSON.stringify({
    color: label.color,
    description: label.description,
    new_name: label.name,
  });
  const createBody = JSON.stringify({
    color: label.color,
    description: label.description,
    name: label.name,
  });

  const updateResponse = await request(url, {
    body: updateBody,
    method: 'PATCH',
  });

  if (updateResponse.status === 200) {
    console.log(`updated ${label.name}`);
    return;
  }

  if (updateResponse.status !== 404) {
    throw await responseError(`Failed to update ${label.name}`, updateResponse);
  }

  const createResponse = await request(`https://api.github.com/repos/${repository}/labels`, {
    body: createBody,
    method: 'POST',
  });

  if (createResponse.status !== 201) {
    throw await responseError(`Failed to create ${label.name}`, createResponse);
  }

  console.log(`created ${label.name}`);
}

async function verifyRepositoryAccess() {
  if (dryRun) {
    return;
  }

  const response = await request(`https://api.github.com/repos/${repository}`, {
    method: 'GET',
  });

  if (response.status === 200) {
    return;
  }

  throw await responseError(`Cannot access repository ${repository}`, response);
}

async function responseError(prefix, response) {
  const text = await response.text();
  const hint = errorHint(response.status);
  return new Error(`${prefix}: ${response.status} ${text}${hint ? `\n\n${hint}` : ''}`);
}

function errorHint(status) {
  if (status === 401) {
    return 'Hint: Check that GITHUB_TOKEN is set to the token value, not the token name.';
  }

  if (status === 403) {
    return 'Hint: The token may not have Issues: Read and write permission for this repository.';
  }

  if (status === 404) {
    return 'Hint: Check that the token has access to chiragpatel273/ngnova-ui and that GITHUB_REPOSITORY is not pointing at another repo.';
  }

  return undefined;
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
