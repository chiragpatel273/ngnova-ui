import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, relative } from 'node:path';

const host = '127.0.0.1';
const port = 4200;
const root = join(process.cwd(), 'dist', 'demo', 'browser');
const contentTypes: Readonly<Record<string, string>> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

export default async function globalSetup(): Promise<() => Promise<void>> {
  if (!existsSync(join(root, 'index.html'))) {
    throw new Error('Visual tests require dist/demo/browser; run npm.cmd run build:demo first.');
  }

  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? '/', `http://${host}:${port}`).pathname;
    const requestedPath = normalize(join(root, decodeURIComponent(pathname)));
    const insideRoot = relative(root, requestedPath);
    const safePath =
      insideRoot && !insideRoot.startsWith('..') && !insideRoot.includes(':')
        ? requestedPath
        : join(root, 'index.html');
    const filePath =
      existsSync(safePath) && statSync(safePath).isFile() ? safePath : join(root, 'index.html');

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  return async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  };
}
