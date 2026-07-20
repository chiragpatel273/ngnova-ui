import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const isWindows = process.platform === 'win32';
const steps = [
  ['Format check', npm, ['run', 'format:check']],
  ['Lint', npm, ['run', 'lint']],
  ['Docs API consistency', npm, ['run', 'check:docs-api']],
  ['Library tests', npm, ['run', 'test:lib']],
  ['Docs app tests', npm, ['run', 'test:demo']],
  ['Library build', npm, ['run', 'build:lib']],
  ['Docs app build', npm, ['run', 'build:demo:app']],
  ['Package audit', npm, ['run', 'audit:package']],
  [
    'Package dry run',
    npm,
    ['pack', '--dry-run', '--cache', '../../.npm-cache'],
    { cwd: 'dist/ui' },
  ],
  ['Consumer smoke', npm, ['run', 'smoke:consumer']],
];

for (const [label, command, args, options = {}] of steps) {
  console.log(`\n> ${label}`);
  const result = isWindows
    ? spawnSync([command, ...args].join(' '), {
        cwd: options.cwd ?? process.cwd(),
        shell: true,
        stdio: 'inherit',
      })
    : spawnSync(command, args, {
        cwd: options.cwd ?? process.cwd(),
        shell: false,
        stdio: 'inherit',
      });

  if (result.status !== 0) {
    console.error(`\nRelease check failed at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nRelease check passed.');
