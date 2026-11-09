import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { type NgNovaReference, findComponent, searchComponents } from './reference.js';

const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

function text(value: string): { content: { type: 'text'; text: string }[] } {
  return { content: [{ type: 'text', text: value }] };
}

export function createNgNovaServer(reference: NgNovaReference, version: string): McpServer {
  const server = new McpServer(
    { name: 'ngnova-ui', title: 'NgNova UI', version },
    {
      instructions:
        `Reference for ${reference.packageName} ${reference.packageVersion} (Angular ${reference.angularRange}). ` +
        'Call get_setup_guide before writing NgNova UI code, then get_component for each component you use. ' +
        'Only use inputs and outputs listed in the reference, and import from the focused @ngnova/ui/<component> entry points.',
    },
  );

  server.registerTool(
    'list_components',
    {
      title: 'List NgNova UI components',
      description:
        'Lists every NgNova UI component with its selector, import path, and one-line summary.',
      annotations: READ_ONLY,
    },
    () =>
      text(
        reference.components
          .map(
            (component) =>
              `- ${component.name} (\`${component.selector}\`, \`${component.importPath}\`): ${component.summary}`,
          )
          .join('\n'),
      ),
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get an NgNova UI component reference',
      description:
        'Returns the full reference for one component: import, selector, inputs, outputs, examples, accessibility, keyboard, forms, and testing notes. Accepts a name ("Date Picker"), slug ("date-picker"), selector ("ui-date-picker"), or class name ("UiDatePickerComponent").',
      inputSchema: { name: z.string().min(1).describe('Component name, slug, selector, or class') },
      annotations: READ_ONLY,
    },
    ({ name }) => {
      const component = findComponent(reference, name);

      if (component) {
        return text(component.markdown);
      }

      const suggestions = searchComponents(reference, name, 3).map(
        (result) => result.component.name,
      );
      return {
        ...text(
          `No NgNova UI component matches "${name}".` +
            (suggestions.length ? ` Did you mean: ${suggestions.join(', ')}?` : '') +
            ' Call list_components to see every component.',
        ),
        isError: true,
      };
    },
  );

  server.registerTool(
    'search_components',
    {
      title: 'Search NgNova UI components',
      description:
        'Finds components for a UI need, such as "searchable dropdown", "file drag and drop", or "pagination", ranked by relevance.',
      inputSchema: {
        query: z.string().min(1).describe('What the UI needs to do'),
        limit: z.number().int().min(1).max(20).optional().describe('Maximum results (default 5)'),
      },
      annotations: READ_ONLY,
    },
    ({ query, limit }) => {
      const results = searchComponents(reference, query, limit ?? 5);

      return text(
        results.length
          ? results
              .map(
                ({ component }) =>
                  `- ${component.name} (\`${component.importPath}\`): ${component.summary}`,
              )
              .join('\n')
          : `No NgNova UI component matches "${query}". Call list_components to see every component.`,
      );
    },
  );

  server.registerTool(
    'get_setup_guide',
    {
      title: 'Get NgNova UI setup and coding rules',
      description:
        'Returns installation steps (ng add or manual Tailwind CSS v4 setup), rules for writing correct NgNova UI code, and the theme token names.',
      annotations: READ_ONLY,
    },
    () =>
      text(
        [
          reference.rules,
          reference.setup,
          `## Theme tokens\n\n${reference.themeTokens.map((token) => `\`${token}\``).join(', ')}`,
          `Documentation: ${reference.siteUrl}`,
        ].join('\n\n'),
      ),
  );

  return server;
}
