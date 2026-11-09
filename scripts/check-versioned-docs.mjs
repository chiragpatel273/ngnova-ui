import { readFile } from 'node:fs/promises';

const [
  manifest,
  schema,
  workflow,
  packageJson,
  guide,
  appConfig,
  angularJson,
  serverRoutes,
  indexHtml,
] = await Promise.all([
  readFile('docs/hosting/versions.json', 'utf8').then(JSON.parse),
  readFile('docs/hosting/versions.schema.json', 'utf8').then(JSON.parse),
  readFile('.github/workflows/docs.yml', 'utf8'),
  readFile('package.json', 'utf8').then(JSON.parse),
  readFile('docs/HOSTED_DOCUMENTATION.md', 'utf8'),
  readFile('src/app/app.config.ts', 'utf8'),
  readFile('angular.json', 'utf8').then(JSON.parse),
  readFile('src/app/app.routes.server.ts', 'utf8'),
  readFile('src/index.html', 'utf8'),
]);

const errors = [];
const requireValue = (condition, message) => {
  if (!condition) {
    errors.push(message);
  }
};

requireValue(manifest.schemaVersion === 1, 'Documentation manifest schemaVersion must be 1.');
requireValue(
  schema.properties?.schemaVersion?.const === manifest.schemaVersion,
  'Documentation manifest and schema versions must agree.',
);
requireValue(
  manifest.provider === 'github-pages',
  'The documented hosting provider must be github-pages.',
);
requireValue(
  /^https:\/\/[^/]+$/.test(manifest.canonicalOrigin),
  'canonicalOrigin must be an HTTPS origin without a trailing slash.',
);
requireValue(
  /^\/[a-z0-9-]+$/.test(manifest.projectPath),
  'projectPath must be a single lowercase URL segment.',
);

const ids = new Set();
for (const version of manifest.versions) {
  requireValue(!ids.has(version.id), `Duplicate documentation version: ${version.id}`);
  ids.add(version.id);
  requireValue(
    version.basePath === `${manifest.projectPath}/${version.id}/`,
    `${version.id} basePath must match projectPath and version id.`,
  );
  requireValue(
    version.packageRange === `${version.id.slice(1)}.x`,
    `${version.id} packageRange must describe the same major.`,
  );
  requireValue(
    version.routeMode === 'path',
    `${version.id} must use prerendered path routing so every route is reload-safe and indexable.`,
  );
}

requireValue(
  ids.has(manifest.defaultVersion),
  'defaultVersion must reference a declared documentation version.',
);
requireValue(
  !appConfig.includes('withHashLocation'),
  'The documentation app must use path routing; hash URLs cannot be indexed or prerendered.',
);
requireValue(
  angularJson.projects?.docs?.architect?.build?.options?.outputMode === 'static',
  'The documentation app must prerender every route (outputMode: static) for GitHub Pages.',
);
requireValue(
  /getPrerenderParams/.test(serverRoutes) && /RenderMode\.Prerender/.test(serverRoutes),
  'Server routes must prerender every component page.',
);
requireValue(
  indexHtml.includes("hash.indexOf('#/') === 0"),
  'index.html must redirect legacy #/ hash links to path routes.',
);
requireValue(
  packageJson.scripts?.['build:docs:versioned']?.includes('prepare-versioned-docs.mjs'),
  'build:docs:versioned must assemble the validated Pages artifact.',
);
requireValue(
  packageJson.scripts?.['build:docs:versioned']?.includes(`--base-href ${manifest.projectPath}/`),
  'build:docs:versioned must serve the latest documentation from the project root.',
);

for (const evidence of [
  'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v4',
  'actions/deploy-pages@v4',
  'pages: write',
  'id-token: write',
  'dist/versioned-docs',
  'npm run build:docs:versioned',
]) {
  requireValue(
    workflow.includes(evidence),
    `Pages workflow is missing required evidence: ${evidence}`,
  );
}

const latestButtonUrl = `${manifest.canonicalOrigin}${manifest.projectPath}/components/button/`;
requireValue(
  guide.includes(latestButtonUrl),
  `Hosting guide must publish the latest Button URL: ${latestButtonUrl}`,
);
requireValue(
  guide.includes(`/${manifest.defaultVersion}/`) && guide.includes('redirect'),
  `Hosting guide must describe the /${manifest.defaultVersion}/ compatibility redirect.`,
);

if (errors.length > 0) {
  console.error('Versioned documentation check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Hosted documentation check passed: ${latestButtonUrl}`);
