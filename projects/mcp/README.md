# @ngnova/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI coding assistants
verified [NgNova UI](https://chiragpatel273.github.io/ngnova-ui/) component APIs, examples, and
setup rules, so generated Angular code uses real inputs and focused `@ngnova/ui/<component>`
imports.

The reference data is generated from the same documentation data that the NgNova UI release gate
checks against the component implementations.

## Tools

| Tool                | Purpose                                                                        |
| ------------------- | ------------------------------------------------------------------------------ |
| `get_setup_guide`   | Installation (`ng add` or manual Tailwind CSS v4), coding rules, theme tokens. |
| `list_components`   | Every component with selector, import path, and summary.                       |
| `search_components` | Find components for a UI need, such as "searchable dropdown" or "pagination".  |
| `get_component`     | Full reference: inputs, outputs, examples, accessibility, keyboard, and tests. |

All tools are read-only and work offline; the server makes no network requests.

## Setup

Requires Node.js 20 or later.

### Claude Code

```bash
claude mcp add ngnova -- npx -y @ngnova/mcp
```

### Cursor, VS Code, and other MCP clients

```json
{
  "mcpServers": {
    "ngnova": {
      "command": "npx",
      "args": ["-y", "@ngnova/mcp"]
    }
  }
}
```

Then ask your assistant to build with NgNova UI, for example: "Add a settings form with NgNova UI
inputs, a switch, and a save button."

## Versioning

Each `@ngnova/mcp` release embeds the reference for one `@ngnova/ui` version, reported in the
server instructions. Use the release that matches the `@ngnova/ui` version in your project.

## Development

From this directory:

```bash
npm ci
npm test
```

`npm run build` regenerates `data/reference.json` with `scripts/generate-llms.mjs --json` and
compiles `src/` to `dist/`. Tests start the built server over stdio and call each tool through the
official MCP client.
