import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const standardRing = [
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-blue-600',
  'focus-visible:ring-offset-2',
  'dark:focus-visible:ring-blue-400',
  'dark:focus-visible:ring-offset-slate-950',
];

const contracts = [
  ['button', [...standardRing, 'focus-visible:[--tw-ring-inset:initial]']],
  ['checkbox', standardRing],
  ['radio', standardRing],
  ['select', standardRing],
  ['textarea', standardRing],
  ['tabs', standardRing],
  ['alert', standardRing],
  ['modal', standardRing],
  ['toast', standardRing],
  ['tag', standardRing],
  ['table', standardRing],
  [
    'accordion',
    [
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-inset',
      'focus-visible:ring-blue-600',
      'dark:focus-visible:ring-blue-400',
    ],
  ],
  [
    'input',
    [
      'has-[:focus-visible]:ring-2',
      'has-[:focus-visible]:ring-blue-600',
      'has-[:focus-visible]:ring-offset-2',
      'dark:has-[:focus-visible]:ring-blue-400',
      'dark:has-[:focus-visible]:ring-offset-slate-950',
    ],
  ],
  [
    'switch',
    [
      'peer-focus-visible:ring-2',
      'peer-focus-visible:ring-blue-600',
      'peer-focus-visible:ring-offset-2',
      'dark:peer-focus-visible:ring-blue-400',
      'dark:peer-focus-visible:ring-offset-slate-950',
    ],
  ],
];

const legacyPatterns = [
  /(?<!-)focus:ring-/,
  /(?<!-)focus:outline-/,
  /peer-focus-visible:outline-/,
  /focus-visible:outline-(?:2|current|offset)/,
  /focus-within:ring-2/,
];
const failures = [];

for (const [slug, requiredClasses] of contracts) {
  const file = join(root, 'projects', 'ui', slug, 'src', `${slug}.ts`);
  const source = readFileSync(file, 'utf8');

  for (const requiredClass of requiredClasses) {
    if (!source.includes(requiredClass)) {
      failures.push(`${slug}: missing ${requiredClass}`);
    }
  }

  for (const pattern of legacyPatterns) {
    if (pattern.test(source)) {
      failures.push(`${slug}: contains legacy focus styling matching ${pattern}`);
    }
  }
}

const buttonSource = readFileSync(
  join(root, 'projects', 'ui', 'button', 'src', 'button.ts'),
  'utf8',
);
const buttonGroupClasses = ['isolate', 'overflow-visible', 'focus-visible:z-10'];

for (const requiredClass of buttonGroupClasses) {
  if (!buttonSource.includes(requiredClass)) {
    failures.push(`button group: missing ${requiredClass}`);
  }
}

if (buttonSource.includes('overflow-hidden')) {
  failures.push('button group: overflow-hidden clips outer focus rings');
}

if (failures.length) {
  console.error('Focus-visible contract check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Focus-visible contract check passed for ${contracts.length} interactive components.`);
