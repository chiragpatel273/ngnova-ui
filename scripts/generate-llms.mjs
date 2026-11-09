// Generates llms.txt, llms-full.txt, and per-component Markdown for AI coding assistants.
//
// Source of truth is the documentation data (src/app/docs/docs-data.ts), which
// `check:docs-api` already verifies against the component implementations, so the
// generated reference cannot describe inputs or outputs that do not exist.
//
// Usage: node scripts/generate-llms.mjs [--out <dir>]   (default: dist/docs/browser)

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const outArgIndex = process.argv.indexOf('--out');
const outDir = resolve(outArgIndex === -1 ? 'dist/docs/browser' : process.argv[outArgIndex + 1]);

const { componentDocs, componentDocDetailsBySlug, getComponentImportPath } = await import(
  pathToFileURL(join(root, 'src', 'app', 'docs', 'docs-data.ts')).href
);

const packageJson = JSON.parse(readFileSync(join(root, 'projects', 'ui', 'package.json'), 'utf8'));
const hosting = JSON.parse(readFileSync(join(root, 'docs', 'hosting', 'versions.json'), 'utf8'));
const siteUrl = `${hosting.canonicalOrigin}${hosting.projectPath}/`;
const pageUrl = (route) => `${siteUrl}#/${route}`;
const angularRange = packageJson.peerDependencies['@angular/core'];
const [major, minor] = packageJson.version.split('.').map(Number);
const ngAddNote =
  major > 1 || (major === 1 && minor >= 1)
    ? '`ng add` configures everything below. Manual setup:'
    : '`ng add` (available from 1.1.0) configures everything below. Manual setup:';

const failures = [];

function harnessesFor(slug) {
  const dir = join(root, 'projects', 'ui', 'testing', slug);

  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { recursive: true })
    .filter((file) => String(file).endsWith('.ts') && !String(file).endsWith('.spec.ts'))
    .flatMap((file) => [
      ...readFileSync(join(dir, String(file)), 'utf8').matchAll(/export class (Ui\w+Harness)\b/g),
    ])
    .map((match) => match[1])
    .sort();
}

function themeTokens() {
  const css = readFileSync(join(root, 'projects', 'ui', 'styles', 'theme.css'), 'utf8');
  return [...new Set([...css.matchAll(/^\s*(--ui-[a-z0-9-]+)\s*:/gm)].map((match) => match[1]))];
}

const cell = (value) =>
  String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim() || '—';

const bullets = (items) => items.map((item) => `- ${item}`).join('\n');

function section(title, items) {
  return items?.length ? `### ${title}\n\n${bullets(items)}\n` : '';
}

function componentMarkdown(doc) {
  const details = componentDocDetailsBySlug.get(doc.slug);

  if (!details) {
    failures.push(`${doc.slug}: missing component documentation details`);
    return '';
  }

  const importPath = getComponentImportPath(doc.slug);
  const harnesses = harnessesFor(doc.slug);
  const parts = [
    `## ${doc.name}`,
    '',
    doc.summary,
    '',
    `- Import: \`import { ${doc.importName} } from '${importPath}';\``,
    `- Selector: \`${doc.selector}\``,
    `- Docs: ${pageUrl(`components/${doc.slug}`)}`,
    harnesses.length
      ? `- Test harnesses: \`${harnesses.join('`, `')}\` from \`@ngnova/ui/testing\``
      : '',
    '',
    details.overview.join('\n\n'),
    '',
    section('When to use', details.whenToUse),
  ];

  if (doc.inputs.length) {
    parts.push(
      '### Inputs',
      '',
      '| Name | Type | Default | Description |',
      '| --- | --- | --- | --- |',
      ...doc.inputs.map(
        (input) =>
          `| \`${cell(input.name)}\` | \`${cell(input.type)}\` | ${cell(input.defaultValue)} | ${cell(input.description)} |`,
      ),
      '',
    );
  }

  if (doc.outputs.length) {
    parts.push(
      '### Outputs',
      '',
      '| Name | Type | Description |',
      '| --- | --- | --- |',
      ...doc.outputs.map(
        (output) =>
          `| \`${cell(output.name)}\` | \`${cell(output.type)}\` | ${cell(output.description)} |`,
      ),
      '',
    );
  }

  parts.push('### Basic usage', '', '```html', doc.usage.trim(), '```', '');

  for (const example of details.examples) {
    parts.push(
      `### Example: ${example.title}`,
      '',
      example.description,
      '',
      '```' + (/^\s*(import|@Component|export)\b/m.test(example.code) ? 'ts' : 'html'),
      example.code.trim(),
      '```',
      '',
    );
  }

  parts.push(
    section('Forms', details.forms),
    section('Accessibility', details.accessibility),
    section('Keyboard', details.keyboard),
    section('Edge cases', details.edgeCases),
    section('Testing', details.testing),
  );

  return `${parts
    .filter((part) => part !== undefined)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

const rules = `## Rules for generating NgNova UI code

- Import every component from its focused entry point, \`@ngnova/ui/<component>\` (for example
  \`import { UiButtonComponent } from '@ngnova/ui/button';\`). The root \`@ngnova/ui\` entry point
  exports only \`NGNOVA_UI_VERSION\`; never import components from it.
- Components are standalone. Add them to the \`imports\` array of a standalone component; there are
  no NgModules.
- Element selectors use the \`ui-\` prefix (for example \`<ui-button>\`). Some features are attribute
  directives, such as \`<a uiButton href="...">\` for links styled as buttons.
- Use only the inputs and outputs documented in this reference. Do not invent props.
- Outputs use semantic names such as \`pressed\`, \`valueChange\`, \`focused\`, \`blurred\`,
  \`openChange\`, \`opened\`, and \`closed\`. Wrappers also forward native host \`focus\` and \`blur\`.
- Form controls implement \`ControlValueAccessor\` and support Angular Signal Forms
  (\`[formField]\`), Reactive Forms, and template-driven forms.
- Styling uses Tailwind CSS v4 utility classes. Dark mode follows a \`.dark\` class on \`<html>\`
  when the app is configured with the class-based custom variant.
- \`@ngnova/ui/overlay\` and \`@ngnova/ui/table-virtual-scroll\` require \`@angular/cdk\`. Test
  harnesses come from \`@ngnova/ui/testing\` and require \`@angular/cdk\` as a dev dependency.
`;

const setup = `## Setup

Requires Angular \`${angularRange}\` and Tailwind CSS v4.

\`\`\`bash
ng add @ngnova/ui
\`\`\`

${ngAddNote}

\`\`\`bash
npm install @ngnova/ui
\`\`\`

Global stylesheet (for example \`src/styles.css\`):

\`\`\`css
@import 'tailwindcss';
@import '@ngnova/ui/styles/theme.css';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
\`\`\`

\`@source\` is required because Tailwind v4 does not scan \`node_modules\` by default. The theme
stylesheet is optional and provides the \`--ui-*\` design tokens.
`;

const header = `# NgNova UI

> NgNova UI (\`@ngnova/ui\` ${packageJson.version}) is an open-source, MIT-licensed Angular 22
> component library: ${componentDocs.length} standalone, OnPush components with focused
> per-component entry points, Tailwind CSS v4 styling, dark mode, Signal Forms and Reactive Forms
> support, and Angular CDK test harnesses.
`;

const tokens = themeTokens();
const componentPages = componentDocs.map((doc) => ({ doc, markdown: componentMarkdown(doc) }));

if (failures.length > 0) {
  console.error('LLM documentation generation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const llmsTxt = `${header}
${rules}
${setup}
## Documentation

- [Complete reference](${siteUrl}llms-full.txt): every component's API, examples, accessibility,
  keyboard, forms, and testing notes in one file
- [Getting started](${pageUrl('guide')})
- [Angular Forms and Signal Forms](${pageUrl('forms')})
- [Theming and design tokens](${pageUrl('theming')})

## Components

${componentDocs
  .map(
    (doc) =>
      `- [${doc.name}](${siteUrl}llms/${doc.slug}.md): ${doc.summary} Import from \`${getComponentImportPath(doc.slug)}\`.`,
  )
  .join('\n')}

## Optional

- [GitHub repository](https://github.com/chiragpatel273/ngnova-ui)
- [npm package](https://www.npmjs.com/package/@ngnova/ui)
- [Changelog](https://github.com/chiragpatel273/ngnova-ui/blob/main/projects/ui/CHANGELOG.md)
`;

const llmsFullTxt = `${header}
${rules}
${setup}
## Theme tokens

The optional \`@ngnova/ui/styles/theme.css\` stylesheet defines these CSS custom properties.
Override them in your own stylesheet to brand the components.

${tokens.map((token) => `\`${token}\``).join(', ')}

# Components

${componentPages.map((page) => page.markdown).join('\n')}`;

if (!existsSync(outDir)) {
  console.error(`${outDir} does not exist. Build the documentation app first.`);
  process.exit(1);
}

const componentDir = join(outDir, 'llms');
rmSync(componentDir, { recursive: true, force: true });
mkdirSync(componentDir, { recursive: true });

writeFileSync(join(outDir, 'llms.txt'), llmsTxt);
writeFileSync(join(outDir, 'llms-full.txt'), llmsFullTxt);

for (const page of componentPages) {
  writeFileSync(join(componentDir, `${page.doc.slug}.md`), `${header}\n${page.markdown}`);
}

console.log(
  `Generated llms.txt, llms-full.txt, and ${componentPages.length} component references in ${outDir}.`,
);
