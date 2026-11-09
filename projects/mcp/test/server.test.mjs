import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Drives the built server over stdio, exactly as an MCP client such as Claude Code would.
const serverEntry = fileURLToPath(new URL('../dist/index.js', import.meta.url));
let client;

async function callText(name, args = {}) {
  const result = await client.callTool({ name, arguments: args });
  return { text: result.content.map((part) => part.text).join('\n'), isError: !!result.isError };
}

describe('@ngnova/mcp server', () => {
  before(async () => {
    client = new Client({ name: 'ngnova-mcp-test', version: '1.0.0' });
    await client.connect(
      new StdioClientTransport({ command: process.execPath, args: [serverEntry] }),
    );
  });

  after(async () => {
    await client.close();
  });

  it('identifies itself and gives usage instructions', () => {
    assert.equal(client.getServerVersion().name, 'ngnova-ui');
    assert.match(client.getInstructions(), /get_setup_guide/);
  });

  it('exposes four read-only tools', async () => {
    const { tools } = await client.listTools();

    assert.deepEqual(tools.map((tool) => tool.name).sort(), [
      'get_component',
      'get_setup_guide',
      'list_components',
      'search_components',
    ]);
    assert.ok(tools.every((tool) => tool.annotations?.readOnlyHint === true));
  });

  it('lists every documented component', async () => {
    const { text } = await callText('list_components');
    const lines = text.split('\n');

    assert.equal(lines.length, 40);
    assert.ok(lines.some((line) => line.includes('Button (`ui-button`, `@ngnova/ui/button`)')));
  });

  it('resolves a component by name, slug, selector, or class name', async () => {
    for (const name of ['Date Picker', 'date-picker', 'ui-date-picker', 'UiDatePickerComponent']) {
      const { text, isError } = await callText('get_component', { name });

      assert.equal(isError, false, name);
      assert.match(text, /^## Date Picker/, name);
      assert.match(text, /from '@ngnova\/ui\/date-picker'/, name);
      assert.match(text, /### Inputs/, name);
    }
  });

  it('reports unknown components as errors with suggestions', async () => {
    const { text, isError } = await callText('get_component', { name: 'modal dialog box' });

    assert.equal(isError, true);
    assert.match(text, /No NgNova UI component matches/);
    assert.match(text, /Did you mean: .*Modal/);
  });

  it('searches by UI need', async () => {
    const pagination = await callText('search_components', { query: 'pagination', limit: 3 });
    assert.match(pagination.text.split('\n')[0], /Paginator/);

    const upload = await callText('search_components', { query: 'drag and drop files' });
    assert.match(upload.text, /File Upload/);
  });

  it('returns setup steps, coding rules, and theme tokens', async () => {
    const { text } = await callText('get_setup_guide');

    assert.match(text, /ng add @ngnova\/ui/);
    assert.match(text, /## Rules for generating NgNova UI code/);
    assert.match(text, /@source "\.\.\/node_modules\/@ngnova\/ui";/);
    assert.match(text, /`--ui-[a-z-]+`/);
  });
});
