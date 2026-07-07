import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const workspace = join(root, '.tmp', 'consumer-smoke');
const distUi = join(root, 'dist', 'ui');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const isWindows = process.platform === 'win32';
const rootPackage = JSON.parse(
  await import('node:fs/promises').then(({ readFile }) =>
    readFile(join(root, 'package.json'), 'utf8'),
  ),
);

function run(label, command, args, options = {}) {
  console.log(`\n> ${label}`);
  const cwd = options.cwd ?? root;
  const timeout = options.timeoutMs ?? 120_000;
  const result = isWindows
    ? spawnSync([command, ...args].join(' '), { cwd, shell: true, stdio: 'inherit', timeout })
    : spawnSync(command, args, { cwd, shell: false, stdio: 'inherit', timeout });

  if (result.status !== 0) {
    if (result.error) {
      console.error(result.error.message);
    }

    console.error(`\nConsumer smoke failed at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

function versionFor(name) {
  return rootPackage.dependencies?.[name] ?? rootPackage.devDependencies?.[name];
}

function dependencySpecFor(name) {
  const installedPackage = join(root, 'node_modules', ...name.split('/'), 'package.json');

  if (existsSync(installedPackage)) {
    return pathToFileURL(join(root, 'node_modules', ...name.split('/'))).href;
  }

  return versionFor(name);
}

rmSync(workspace, { recursive: true, force: true });
mkdirSync(join(workspace, 'src'), { recursive: true });

run(
  'Pack library tarball',
  npm,
  ['pack', '--pack-destination', resolve(workspace), '--cache', '../../.npm-cache'],
  {
    cwd: distUi,
  },
);

writeFileSync(
  join(workspace, 'package.json'),
  `${JSON.stringify(
    {
      name: 'ngnova-consumer-smoke',
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        build: 'ng build',
      },
      dependencies: {
        '@angular/common': dependencySpecFor('@angular/common'),
        '@angular/compiler': dependencySpecFor('@angular/compiler'),
        '@angular/core': dependencySpecFor('@angular/core'),
        '@angular/forms': dependencySpecFor('@angular/forms'),
        '@angular/platform-browser': dependencySpecFor('@angular/platform-browser'),
        '@ngnova/ui': 'file:./ngnova-ui-0.1.0.tgz',
        rxjs: dependencySpecFor('rxjs'),
        tslib: dependencySpecFor('tslib'),
      },
      devDependencies: {
        '@angular/build': dependencySpecFor('@angular/build'),
        '@angular/cli': dependencySpecFor('@angular/cli'),
        '@angular/compiler-cli': dependencySpecFor('@angular/compiler-cli'),
        '@tailwindcss/postcss': dependencySpecFor('@tailwindcss/postcss'),
        tailwindcss: dependencySpecFor('tailwindcss'),
        typescript: dependencySpecFor('typescript'),
      },
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(workspace, 'angular.json'),
  `${JSON.stringify(
    {
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      cli: {
        packageManager: 'npm',
      },
      projects: {
        app: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                tsConfig: 'tsconfig.app.json',
                styles: ['src/styles.css'],
                index: 'src/index.html',
              },
              configurations: {
                production: {
                  outputHashing: 'all',
                },
              },
              defaultConfiguration: 'production',
            },
          },
        },
      },
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(workspace, 'tsconfig.json'),
  `${JSON.stringify(
    {
      compileOnSave: false,
      compilerOptions: {
        strict: true,
        skipLibCheck: true,
        isolatedModules: true,
        experimentalDecorators: true,
        importHelpers: true,
        target: 'ES2022',
        module: 'preserve',
      },
      angularCompilerOptions: {
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
      },
      files: [],
      references: [{ path: './tsconfig.app.json' }],
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(workspace, 'tsconfig.app.json'),
  `${JSON.stringify(
    {
      extends: './tsconfig.json',
      compilerOptions: {
        outDir: './out-tsc/app',
        types: [],
      },
      files: ['src/main.ts'],
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(workspace, 'src', 'index.html'),
  `<html lang="en"><head><title>NgNova Consumer Smoke</title></head><body><app-root></app-root></body></html>\n`,
);

writeFileSync(
  join(workspace, 'src', 'styles.css'),
  `@import 'tailwindcss';\n@source "../node_modules/@ngnova/ui";\n`,
);

writeFileSync(
  join(workspace, 'src', 'main.ts'),
  `import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UiButtonComponent } from '@ngnova/ui/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <main class="p-6">
      <ui-button variant="primary" (click)="count.set(count() + 1)">
        Clicked {{ count() }} times
      </ui-button>
    </main>
  \`,
})
class AppComponent {
  protected readonly count = signal(0);
}

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error: unknown) => console.error(error));
`,
);

run(
  'Install consumer dependencies',
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
  {
    cwd: workspace,
    timeoutMs: 180_000,
  },
);
run('Build consumer app', npm, ['run', 'build'], { cwd: workspace });

console.log('\nConsumer smoke passed.');
