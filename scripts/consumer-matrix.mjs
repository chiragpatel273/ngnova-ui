import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const workspace = join(root, '.tmp', 'consumer-matrix');
const distUi = join(root, 'dist', 'ui');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const isWindows = process.platform === 'win32';
const packageTarball = 'ngnova-ui-0.1.0.tgz';
const rootPackage = JSON.parse(
  await import('node:fs/promises').then(({ readFile }) =>
    readFile(join(root, 'package.json'), 'utf8'),
  ),
);

function run(label, command, args, options = {}) {
  console.log(`\n> ${label}`);
  const cwd = options.cwd ?? root;
  const timeout = options.timeoutMs ?? 180_000;
  const result = isWindows
    ? spawnSync([command, ...args].join(' '), { cwd, shell: true, stdio: 'inherit', timeout })
    : spawnSync(command, args, { cwd, shell: false, stdio: 'inherit', timeout });

  if (result.status !== 0) {
    if (result.error) console.error(result.error.message);
    throw new Error(`${label} failed.`);
  }
}

function dependencySpecFor(name) {
  const installedPackage = join(root, 'node_modules', ...name.split('/'), 'package.json');
  if (existsSync(installedPackage)) {
    return pathToFileURL(join(root, 'node_modules', ...name.split('/'))).href;
  }
  return rootPackage.dependencies?.[name] ?? rootPackage.devDependencies?.[name];
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeProjectFile(project, relativePath, contents) {
  const directory = join(workspace, project, 'src');
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, relativePath), contents);
}

function appTsconfig(project, files) {
  writeJson(join(workspace, project, 'tsconfig.app.json'), {
    extends: '../tsconfig.json',
    compilerOptions: {
      outDir: `../out-tsc/${project}`,
      types: project === 'ssr' ? ['node'] : [],
    },
    files,
  });
}

async function verifySsrRuntime() {
  const port = 43123;
  const serverEntry = join(workspace, 'dist', 'ssr', 'server', 'server.mjs');
  if (!existsSync(serverEntry)) {
    throw new Error(`SSR server bundle is missing: ${serverEntry}`);
  }

  console.log('\n> Render SSR and hydration response');
  const child = spawn(process.execPath, [serverEntry], {
    cwd: workspace,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', (chunk) => (logs += chunk.toString()));
  child.stderr.on('data', (chunk) => (logs += chunk.toString()));

  try {
    let response;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (child.exitCode !== null) {
        throw new Error(`SSR server exited early with code ${child.exitCode}.\n${logs}`);
      }
      try {
        response = await fetch(`http://127.0.0.1:${port}/`);
        if (response.ok) break;
      } catch {
        // The server is still starting.
      }
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }

    if (!response?.ok) {
      throw new Error(`SSR server did not become ready.\n${logs}`);
    }
    const html = await response.text();
    if (!html.includes('SSR hydration consumer')) {
      throw new Error('SSR response did not contain the server-rendered application content.');
    }
    if (!/\sngh=/.test(html)) {
      throw new Error('SSR response did not contain Angular hydration annotations.');
    }
    console.log('SSR runtime returned rendered content with Angular hydration annotations.');
  } finally {
    child.kill();
  }
}

rmSync(workspace, { recursive: true, force: true });
mkdirSync(workspace, { recursive: true });

run(
  'Pack library tarball',
  npm,
  ['pack', '--pack-destination', resolve(workspace), '--cache', '../../.npm-cache'],
  { cwd: distUi },
);

writeJson(join(workspace, 'package.json'), {
  name: 'ngnova-consumer-matrix',
  version: '0.0.0',
  private: true,
  type: 'module',
  scripts: {
    'build:zoneless': 'ng build zoneless',
    'build:ssr': 'ng build ssr',
  },
  dependencies: {
    '@angular/common': dependencySpecFor('@angular/common'),
    '@angular/compiler': dependencySpecFor('@angular/compiler'),
    '@angular/core': dependencySpecFor('@angular/core'),
    '@angular/forms': dependencySpecFor('@angular/forms'),
    '@angular/platform-browser': dependencySpecFor('@angular/platform-browser'),
    '@angular/platform-server': dependencySpecFor('@angular/platform-server'),
    '@angular/router': dependencySpecFor('@angular/router'),
    '@angular/ssr': dependencySpecFor('@angular/ssr'),
    '@ngnova/ui': `file:./${packageTarball}`,
    express: dependencySpecFor('express'),
    rxjs: dependencySpecFor('rxjs'),
    tslib: dependencySpecFor('tslib'),
  },
  devDependencies: {
    '@angular/build': dependencySpecFor('@angular/build'),
    '@angular/cli': dependencySpecFor('@angular/cli'),
    '@angular/compiler-cli': dependencySpecFor('@angular/compiler-cli'),
    '@tailwindcss/postcss': dependencySpecFor('@tailwindcss/postcss'),
    '@types/express': dependencySpecFor('@types/express'),
    tailwindcss: dependencySpecFor('tailwindcss'),
    typescript: dependencySpecFor('typescript'),
  },
});

writeJson(join(workspace, 'angular.json'), {
  $schema: './node_modules/@angular/cli/lib/config/schema.json',
  version: 1,
  cli: { packageManager: 'npm' },
  projects: {
    zoneless: {
      projectType: 'application',
      root: 'zoneless',
      sourceRoot: 'zoneless/src',
      prefix: 'app',
      architect: {
        build: {
          builder: '@angular/build:application',
          options: {
            browser: 'zoneless/src/main.ts',
            tsConfig: 'zoneless/tsconfig.app.json',
            styles: ['zoneless/src/styles.css'],
            index: 'zoneless/src/index.html',
            outputPath: 'dist/zoneless',
          },
          configurations: { production: {} },
          defaultConfiguration: 'production',
        },
      },
    },
    ssr: {
      projectType: 'application',
      root: 'ssr',
      sourceRoot: 'ssr/src',
      prefix: 'app',
      architect: {
        build: {
          builder: '@angular/build:application',
          options: {
            browser: 'ssr/src/main.ts',
            server: 'ssr/src/main.server.ts',
            ssr: { entry: 'ssr/src/server.ts' },
            outputMode: 'server',
            tsConfig: 'ssr/tsconfig.app.json',
            styles: ['ssr/src/styles.css'],
            index: 'ssr/src/index.html',
            outputPath: 'dist/ssr',
          },
          configurations: { production: {} },
          defaultConfiguration: 'production',
        },
      },
    },
  },
});

writeJson(join(workspace, 'tsconfig.json'), {
  compileOnSave: false,
  compilerOptions: {
    strict: true,
    skipLibCheck: true,
    isolatedModules: true,
    experimentalDecorators: true,
    importHelpers: true,
    target: 'ES2022',
    module: 'preserve',
    moduleResolution: 'bundler',
  },
  angularCompilerOptions: {
    strictInjectionParameters: true,
    strictInputAccessModifiers: true,
  },
  files: [],
});

for (const project of ['zoneless', 'ssr']) {
  writeProjectFile(
    project,
    'index.html',
    `<html lang="en"><head><title>NgNova ${project} consumer</title></head><body><app-root></app-root></body></html>\n`,
  );
  writeProjectFile(
    project,
    'styles.css',
    `@import 'tailwindcss';\n@import '@ngnova/ui/styles/theme.css';\n@source "../../node_modules/@ngnova/ui";\n`,
  );
}

appTsconfig('zoneless', ['src/main.ts']);
writeProjectFile(
  'zoneless',
  'main.ts',
  `import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UiButtonComponent } from '@ngnova/ui/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<ui-button (pressed)="count.update(value => value + 1)">Clicked {{ count() }} times</ui-button>\`,
})
class AppComponent {
  protected readonly count = signal(0);
}

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error: unknown) => console.error(error));
`,
);

appTsconfig('ssr', ['src/main.ts', 'src/main.server.ts', 'src/server.ts']);
writeProjectFile(
  'ssr',
  'app.ts',
  `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButtonComponent } from '@ngnova/ui/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <main>
      <h1>SSR hydration consumer</h1>
      <ui-button (pressed)="count.update(value => value + 1)">Hydrated {{ count() }}</ui-button>
    </main>
  \`,
})
export class AppComponent {
  protected readonly count = signal(0);
}
`,
);
writeProjectFile(
  'ssr',
  'app.config.ts',
  `import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(), provideRouter([])],
};
`,
);
writeProjectFile(
  'ssr',
  'app.config.server.ts',
  `import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, RenderMode, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Server }])),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
`,
);
writeProjectFile(
  'ssr',
  'main.ts',
  `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => console.error(error));
`,
);
writeProjectFile(
  'ssr',
  'main.server.ts',
  `import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app';
import { config } from './app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);
export default bootstrap;
`,
);
writeProjectFile(
  'ssr',
  'server.ts',
  `import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine({ allowedHosts: ['127.0.0.1'] });

app.use(express.static(browserDistFolder, { index: false, redirect: false }));
app.use((request, response, next) => {
  angularApp
    .handle(request)
    .then((result) => (result ? writeResponseToNodeResponse(result, response) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(\`SSR consumer listening on http://127.0.0.1:\${port}\`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
`,
);

run(
  'Install clean consumer dependencies',
  npm,
  [
    'install',
    '--cache',
    '../.npm-cache',
    '--prefer-offline',
    '--no-audit',
    '--no-fund',
    '--fetch-retries',
    '1',
    '--fetch-timeout',
    '60000',
    '--loglevel',
    'warn',
  ],
  { cwd: workspace, timeoutMs: 240_000 },
);
run('Build zoneless browser consumer', npm, ['run', 'build:zoneless'], { cwd: workspace });
run('Build SSR and hydration consumer', npm, ['run', 'build:ssr'], {
  cwd: workspace,
  timeoutMs: 240_000,
});
await verifySsrRuntime();

console.log(
  '\nConsumer matrix passed: zoneless build, SSR build/runtime, and hydration annotations.',
);
