import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = readFileSync(join(root, 'projects', 'ui', 'styles', 'theme.css'), 'utf8');
const requiredTokens = [
  '--ui-font-family',
  '--ui-space-4',
  '--ui-radius-md',
  '--ui-shadow-sm',
  '--ui-duration-normal',
  '--ui-color-canvas',
  '--ui-color-surface',
  '--ui-color-text',
  '--ui-color-border',
  '--ui-color-primary',
  '--ui-color-success',
  '--ui-color-warning',
  '--ui-color-danger',
  '--ui-color-focus',
  '--ui-control-height-md',
  '--ui-button-height-sm',
  '--ui-button-height-md',
  '--ui-button-height-lg',
  '--ui-control-radius',
  '--ui-focus-ring-color',
  '--ui-dialog-width-md',
  '--ui-drawer-width-md',
  '--ui-drawer-height-md',
  '--ui-toast-offset',
];

const failures = [];
for (const token of requiredTokens) {
  if (!source.includes(`${token}:`)) {
    failures.push(`missing required token ${token}`);
  }
}

for (const contract of [
  ":root,\n[data-ui-theme='light']",
  ".dark,\n[data-ui-theme='dark']",
  '@media (prefers-reduced-motion: reduce)',
  '@media (forced-colors: active)',
]) {
  if (!source.includes(contract)) {
    failures.push(`missing mode contract ${contract.replaceAll('\n', ' ')}`);
  }
}

if (!source.includes('--ui-font-family: inherit')) {
  failures.push('theme stylesheet must not force a consumer font');
}

if (failures.length > 0) {
  console.error('Theme contract check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Theme contract check passed for ${requiredTokens.length} required tokens and 4 modes.`,
);
