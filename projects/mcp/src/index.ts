#!/usr/bin/env node
import { readFileSync } from 'node:fs';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { loadReference } from './reference.js';
import { createNgNovaServer } from './server.js';

const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { version: string };
const reference = loadReference(new URL('../data/reference.json', import.meta.url));
const server = createNgNovaServer(reference, packageJson.version);

await server.connect(new StdioServerTransport());
