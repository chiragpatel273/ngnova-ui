import {
  type Rule,
  type SchematicContext,
  SchematicsException,
  type Tree,
  chain,
  noop,
} from '@angular-devkit/schematics';
import {
  DependencyType,
  ExistingBehavior,
  InstallBehavior,
  type ProjectDefinition,
  type WorkspaceDefinition,
  addDependency,
  readWorkspace,
  updateWorkspace,
} from '@schematics/angular/utility';
import { posix } from 'node:path';

import type { NgAddOptions } from './schema';

const CDK_VERSION_RANGE = '^22.0.0';
const TAILWIND_DEPENDENCIES: Readonly<Record<string, string>> = {
  tailwindcss: '^4.1.12',
  '@tailwindcss/postcss': '^4.1.12',
  postcss: '^8.5.3',
};
const POSTCSS_CONFIG_FILES = ['.postcssrc.json', 'postcss.config.json'] as const;
const TAILWIND_IMPORT = /@import\s+["']tailwindcss["']/;
const THEME_IMPORT_LINE = `@import '@ngnova/ui/styles/theme.css';`;
const THEME_IMPORT = /@import\s+["']@ngnova\/ui\/styles\/theme\.css["']/;
const DARK_VARIANT_LINE = '@custom-variant dark (&:where(.dark, .dark *));';
const DARK_VARIANT = /@custom-variant\s+dark\b/;
const NGNOVA_SOURCE = /@source\s+["'][^"']*@ngnova\/ui[^"']*["']/;

/**
 * Configures an Angular application for NgNova UI:
 * Tailwind CSS v4 and its PostCSS plugin (when missing),
 * the optional theme token stylesheet, the `.dark` class variant, and the
 * `@source` entry Tailwind needs to scan the published package.
 */
export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree) => {
    assertTailwindV4Compatible(tree);

    const workspace = await readWorkspace(tree);
    const projectName = resolveProjectName(workspace, options.project);
    const project = getApplication(workspace, projectName);
    const tailwindAlreadyConfigured = findTailwindStylesheet(tree, project) !== undefined;

    const install = options.skipInstall ? InstallBehavior.None : InstallBehavior.Auto;

    return chain([
      tailwindAlreadyConfigured ? noop() : addTailwind(projectName, project),
      ...Object.entries(TAILWIND_DEPENDENCIES).map(([name, version]) =>
        addDependency(name, version, {
          type: DependencyType.Dev,
          existing: ExistingBehavior.Skip,
          install,
        }),
      ),
      configurePostCss(project),
      configureStylesheet(projectName, options),
      options.cdk
        ? addDependency('@angular/cdk', CDK_VERSION_RANGE, {
            type: DependencyType.Default,
            existing: ExistingBehavior.Skip,
            install,
          })
        : noop(),
      logNextSteps(options),
    ]);
  };
}

/**
 * Adds `@import 'tailwindcss';` to the first global CSS stylesheet, or creates
 * `tailwind.css` when the application only has Sass/Less global styles.
 */
function addTailwind(projectName: string, project: ProjectDefinition): Rule {
  return (tree: Tree) => {
    const stylesheetPath = getGlobalStylesheets(project).find((path) => tree.exists(path));

    if (stylesheetPath) {
      const content = tree.readText(stylesheetPath);
      tree.overwrite(stylesheetPath, `@import 'tailwindcss';\n${content}`);
      return noop();
    }

    const newStylesheetPath = posix.join(
      project.sourceRoot ?? posix.join(project.root, 'src'),
      'tailwind.css',
    );
    tree.create(newStylesheetPath, `@import 'tailwindcss';\n`);

    return updateWorkspace((workspace) => {
      const buildTarget = workspace.projects.get(projectName)?.targets.get('build');

      if (!buildTarget) {
        throw new SchematicsException(`Project "${projectName}" does not have a build target.`);
      }

      buildTarget.options ??= {};
      const styles = buildTarget.options['styles'];
      buildTarget.options['styles'] = [newStylesheetPath, ...(Array.isArray(styles) ? styles : [])];
    });
  };
}

/** Ensures a PostCSS configuration registers the Tailwind CSS v4 plugin. */
function configurePostCss(project: ProjectDefinition): Rule {
  return (tree: Tree, context: SchematicContext) => {
    for (const dir of ['/', posix.join('/', project.root)]) {
      for (const file of POSTCSS_CONFIG_FILES) {
        const path = posix.join(dir, file);

        if (!tree.exists(path)) {
          continue;
        }

        let config: { plugins?: Record<string, unknown> };

        try {
          config = JSON.parse(tree.readText(path)) as { plugins?: Record<string, unknown> };
        } catch {
          context.logger.warn(
            `Could not parse ${path}. Add "@tailwindcss/postcss": {} to its plugins manually.`,
          );
          return;
        }

        if (!config.plugins?.['@tailwindcss/postcss']) {
          config.plugins = { ...config.plugins, '@tailwindcss/postcss': {} };
          tree.overwrite(path, `${JSON.stringify(config, null, 2)}\n`);
        }

        return;
      }
    }

    tree.create(
      posix.join('/', project.root, '.postcssrc.json'),
      `${JSON.stringify({ plugins: { '@tailwindcss/postcss': {} } }, null, 2)}\n`,
    );
  };
}

function assertTailwindV4Compatible(tree: Tree): void {
  if (!tree.exists('/package.json')) {
    return;
  }

  const manifest = JSON.parse(tree.readText('/package.json')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const tailwindVersion =
    manifest.dependencies?.['tailwindcss'] ?? manifest.devDependencies?.['tailwindcss'];

  if (tailwindVersion && /^\D*[0-3]\./.test(tailwindVersion)) {
    throw new SchematicsException(
      `NgNova UI requires Tailwind CSS v4, but this workspace uses tailwindcss@${tailwindVersion}. ` +
        'Upgrade with "npx @tailwindcss/upgrade" and run "ng add @ngnova/ui" again.',
    );
  }
}

function resolveProjectName(workspace: WorkspaceDefinition, requested?: string): string {
  if (requested) {
    return requested;
  }

  const applications = [...workspace.projects.entries()]
    .filter(([, project]) => project.extensions['projectType'] === 'application')
    .map(([name]) => name);

  if (applications.length === 1) {
    return applications[0];
  }

  throw new SchematicsException(
    applications.length === 0
      ? 'No Angular application was found in this workspace.'
      : `Multiple applications found (${applications.join(', ')}). Re-run with --project <name>.`,
  );
}

function getApplication(workspace: WorkspaceDefinition, projectName: string): ProjectDefinition {
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(`Project "${projectName}" does not exist in this workspace.`);
  }

  if (project.extensions['projectType'] !== 'application') {
    throw new SchematicsException(
      `Project "${projectName}" is not an application. NgNova UI is configured in consuming applications.`,
    );
  }

  return project;
}

function getGlobalStylesheets(project: ProjectDefinition): string[] {
  const styles = project.targets.get('build')?.options?.['styles'];

  if (!Array.isArray(styles)) {
    return [];
  }

  return styles
    .map((entry: unknown) => {
      if (typeof entry === 'string') {
        return entry;
      }

      if (entry && typeof entry === 'object' && 'input' in entry) {
        const input = (entry as { input: unknown }).input;
        return typeof input === 'string' ? input : undefined;
      }

      return undefined;
    })
    .filter((path): path is string => typeof path === 'string' && path.endsWith('.css'));
}

function findTailwindStylesheet(tree: Tree, project: ProjectDefinition): string | undefined {
  return getGlobalStylesheets(project).find(
    (path) => tree.exists(path) && TAILWIND_IMPORT.test(tree.readText(path)),
  );
}

/** Returns the `@source` path from a stylesheet to the installed package. */
export function packageSourcePath(stylesheetPath: string): string {
  const stylesheetDir = posix.dirname(posix.join('/', stylesheetPath));
  const relative = posix.relative(stylesheetDir, '/node_modules/@ngnova/ui');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

/**
 * Adds the NgNova UI lines to a Tailwind stylesheet. Idempotent.
 *
 * The theme import goes directly after the Tailwind import. Directives go after the
 * last `@import`, because CSS requires every `@import` to precede other statements.
 */
export function addNgNovaStyles(
  content: string,
  stylesheetPath: string,
  options: Pick<NgAddOptions, 'theme' | 'darkMode'>,
): string {
  const lines = content.split('\n');
  const tailwindLine = lines.findIndex((line) => TAILWIND_IMPORT.test(line));

  if (tailwindLine === -1) {
    throw new SchematicsException(`${stylesheetPath} does not import Tailwind CSS.`);
  }

  if (options.theme && !THEME_IMPORT.test(content)) {
    lines.splice(tailwindLine + 1, 0, THEME_IMPORT_LINE);
  }

  const directives: string[] = [];

  if (options.darkMode === 'class' && !DARK_VARIANT.test(content)) {
    directives.push(DARK_VARIANT_LINE);
  }

  if (!NGNOVA_SOURCE.test(content)) {
    directives.push(`@source "${packageSourcePath(stylesheetPath)}";`);
  }

  if (directives.length > 0) {
    const lastImport = lines.findLastIndex((line) => /^\s*@import\b/.test(line));
    lines.splice(lastImport + 1, 0, ...directives);
  }

  return lines.join('\n');
}

function configureStylesheet(projectName: string, options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await readWorkspace(tree);
    const project = getApplication(workspace, projectName);
    const stylesheetPath = findTailwindStylesheet(tree, project);

    if (!stylesheetPath) {
      throw new SchematicsException(
        `Could not find a global CSS stylesheet importing Tailwind CSS in project "${projectName}".`,
      );
    }

    const content = tree.readText(stylesheetPath);
    const updated = addNgNovaStyles(content, stylesheetPath, options);

    if (updated === content) {
      context.logger.info(`${stylesheetPath} is already configured for NgNova UI.`);
      return;
    }

    tree.overwrite(stylesheetPath, updated);
    context.logger.info(`Configured NgNova UI styles in ${stylesheetPath}.`);
  };
}

function logNextSteps(options: NgAddOptions): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    const darkModeHint =
      options.darkMode === 'class'
        ? 'Toggle dark mode by adding the "dark" class to <html>.'
        : 'Dark mode follows the operating system color scheme.';

    context.logger.info(
      [
        '',
        'NgNova UI is ready. Import components from focused entry points, for example:',
        "  import { UiButtonComponent } from '@ngnova/ui/button';",
        darkModeHint,
        'Docs: https://chiragpatel273.github.io/ngnova-ui/',
      ].join('\n'),
    );
  };
}
