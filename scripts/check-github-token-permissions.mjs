import { readFile } from 'node:fs/promises';

const envPath = new URL('../.env', import.meta.url);
const packagePath = new URL('../package.json', import.meta.url);
const token = process.env.GITHUB_TOKEN ?? (await readDotEnv()).GITHUB_TOKEN;
const repository =
  process.env.GITHUB_REPOSITORY ??
  (await readDotEnv()).GITHUB_REPOSITORY ??
  (await readRepositoryFromPackageJson());
const checkBranch = `codex-token-permission-check-${Date.now()}`;

if (!token) {
  throw new Error('No GITHUB_TOKEN found in .env or the current environment.');
}

if (!repository) {
  throw new Error('Set GITHUB_REPOSITORY or add a GitHub repository URL to package.json.');
}

const report = {
  branchCreate: false,
  branchCleanup: false,
  pullRequestEndpoint: false,
  repoAccess: false,
  repository,
};

let createdBranch = false;

try {
  const repoResponse = await request(`https://api.github.com/repos/${repository}`);
  const repoBody = await responseBody(repoResponse);
  report.repoAccess = repoResponse.status === 200;
  report.repoStatus = repoResponse.status;
  report.repoPushPermission = Boolean(repoBody.permissions?.push);

  if (repoResponse.status !== 200) {
    report.repoMessage = repoBody.message;
    printReport();
    process.exit(0);
  }

  const mainRefResponse = await request(
    `https://api.github.com/repos/${repository}/git/ref/heads/main`,
  );
  const mainRefBody = await responseBody(mainRefResponse);
  report.mainRefStatus = mainRefResponse.status;

  if (mainRefResponse.status !== 200) {
    report.mainRefMessage = mainRefBody.message;
    printReport();
    process.exit(0);
  }

  const createBranchResponse = await request(
    `https://api.github.com/repos/${repository}/git/refs`,
    {
      body: JSON.stringify({
        ref: `refs/heads/${checkBranch}`,
        sha: mainRefBody.object.sha,
      }),
      method: 'POST',
    },
  );
  const createBranchBody = await responseBody(createBranchResponse);
  report.branchCreate = createBranchResponse.status === 201;
  report.branchCreateStatus = createBranchResponse.status;
  report.branchCreateMessage = createBranchBody.message;
  createdBranch = createBranchResponse.status === 201;

  if (!createdBranch) {
    printReport();
    process.exit(0);
  }

  const pullRequestResponse = await request(`https://api.github.com/repos/${repository}/pulls`, {
    body: JSON.stringify({
      base: 'main',
      body: 'Temporary permission check. This should not create a useful PR because the branch has no diff.',
      draft: true,
      head: checkBranch,
      title: 'Codex token permission check',
    }),
    method: 'POST',
  });
  const pullRequestBody = await responseBody(pullRequestResponse);
  report.pullRequestEndpoint =
    pullRequestResponse.status === 201 || pullRequestResponse.status === 422;
  report.pullRequestStatus = pullRequestResponse.status;
  report.pullRequestMessage = pullRequestBody.message;
  report.createdPullRequestUrl = pullRequestBody.html_url;
} finally {
  if (createdBranch) {
    const cleanupResponse = await request(
      `https://api.github.com/repos/${repository}/git/refs/heads/${checkBranch}`,
      { method: 'DELETE' },
    );
    report.branchCleanup = cleanupResponse.status === 204;
    report.branchCleanupStatus = cleanupResponse.status;
  }
}

printReport();

async function readRepositoryFromPackageJson() {
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  const rawUrl = packageJson.repository?.url;

  if (typeof rawUrl !== 'string') {
    return undefined;
  }

  const match = rawUrl.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/.]+)(?:\.git)?$/);
  return match?.groups ? `${match.groups.owner}/${match.groups.repo}` : undefined;
}

async function readDotEnv() {
  try {
    return parseDotEnv(await readFile(envPath, 'utf8'));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return {};
    }

    throw error;
  }
}

function parseDotEnv(contents) {
  const values = {};

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = unquoteDotEnvValue(rawValue);
  }

  return values;
}

function unquoteDotEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

async function request(url, init = {}) {
  return fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ngnova-ui-token-permission-check',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

async function responseBody(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function printReport() {
  console.log(JSON.stringify(report, null, 2));
}
