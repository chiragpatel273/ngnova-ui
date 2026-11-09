// Writes sitemap.xml for the prerendered documentation site. (A project-site robots.txt
// under /ngnova-ui/ is ignored by crawlers, so submit the sitemap in Search Console instead.)
//
// Routes come from Angular's prerender manifest (dist/docs/prerendered-routes.json), so the
// sitemap always matches the pages that were actually generated. Redirect pages are skipped.
//
// Usage: node scripts/generate-sitemap.mjs [--out <dir>]   (default: dist/docs/browser)

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const outArgIndex = process.argv.indexOf('--out');
const outDir = resolve(outArgIndex === -1 ? 'dist/docs/browser' : process.argv[outArgIndex + 1]);
const manifestFile = join(root, 'dist', 'docs', 'prerendered-routes.json');
const hosting = JSON.parse(readFileSync(join(root, 'docs', 'hosting', 'versions.json'), 'utf8'));
const siteUrl = `${hosting.canonicalOrigin}${hosting.projectPath}`;

if (!existsSync(manifestFile)) {
  console.error('dist/docs/prerendered-routes.json is missing. Build the documentation app first.');
  process.exit(1);
}

const isRedirectPage = (route) => {
  const page = join(outDir, route, 'index.html');
  return existsSync(page) && /http-equiv="refresh"/i.test(readFileSync(page, 'utf8'));
};

// Builds with --base-href /ngnova-ui/ record routes with the base path; normalize them.
const withoutBasePath = (route) =>
  route === hosting.projectPath || route.startsWith(`${hosting.projectPath}/`)
    ? route.slice(hosting.projectPath.length) || '/'
    : route;

const routes = Object.keys(JSON.parse(readFileSync(manifestFile, 'utf8')).routes)
  .map(withoutBasePath)
  .filter((route) => !isRedirectPage(route))
  .sort();

const lastmod = new Date().toISOString().slice(0, 10);
const urlFor = (route) => `${siteUrl}${route === '/' ? '/' : `${route}/`}`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url><loc>${urlFor(route)}</loc><lastmod>${lastmod}</lastmod><priority>${
        route === '/' ? '1.0' : route.startsWith('/components/') ? '0.8' : '0.6'
      }</priority></url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(outDir, 'sitemap.xml'), sitemap);

console.log(`Generated sitemap.xml with ${routes.length} routes in ${outDir}.`);
