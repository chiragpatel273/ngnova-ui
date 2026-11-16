// Fails when library component sources use physical left/right utilities or styles instead of
// logical start/end equivalents, so layouts mirror correctly under dir="rtl".
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const libraryRoot = join(root, 'projects/ui');
const skippedDirectories = new Set(['schematics', 'src', 'styles', 'testing']);

// Physical values that are part of an explicit, documented physical API. Logical alternatives
// (`start`/`end`) exist next to each of them.
const allowed = new Map([
  ['drawer/src/drawer.ts', ['left-0', 'right-0', 'border-r', 'border-l']],
  [
    'toast/src/toast.ts',
    [
      'right-0',
      // Safe-area insets are physical by definition.
      'pl-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-left))]',
      'pr-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-right))]',
    ],
  ],
  ['table/src/table.ts', ['text-left', 'text-right']],
  ['tree-table/src/tree-table.ts', ['text-left', 'text-right']],
]);

// `.` also catches Angular class bindings such as [class.left-0].
const boundary = String.raw`(?<=^|[\s'"\x60:.])`;
const end = String.raw`(?=$|[\s'"\x60\]])`;
const value = String.raw`[\w.\[\]()%+,/*-]+`;
const physicalUtility = new RegExp(
  [
    String.raw`${boundary}-?(?:m[lr]|p[lr]|left|right|scroll-m[lr]|scroll-p[lr])-${value}${end}`,
    String.raw`${boundary}rounded-(?:[lr]|[tb][lr])(?:-${value})?${end}`,
    String.raw`${boundary}border-[lr](?:-${value})?${end}`,
    String.raw`${boundary}text-(?:left|right)${end}`,
    String.raw`${boundary}space-x-${value}${end}`,
  ].join('|'),
  'g',
);
const physicalStyle = /\[style\.(?:padding|margin)-(?:left|right)|\[style\.(?:left|right)\b/g;

function* sourceFiles(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      if (directory === libraryRoot && skippedDirectories.has(entry)) continue;
      if (entry === 'node_modules') continue;
      yield* sourceFiles(path);
    } else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts')) {
      yield path;
    }
  }
}

const failures = [];
let scanned = 0;

for (const path of sourceFiles(libraryRoot)) {
  scanned += 1;
  const file = relative(libraryRoot, path).replaceAll('\\', '/');
  const permitted = new Set(allowed.get(file) ?? []);
  const lines = readFileSync(path, 'utf8').split('\n');
  lines.forEach((line, index) => {
    if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
    for (const match of line.matchAll(physicalUtility)) {
      const token = match[0];
      if (permitted.has(token)) continue;
      // Variant-prefixed rtl:/ltr: utilities are intentional direction overrides.
      const prefix = line.slice(0, match.index).match(/\S*$/)?.[0] ?? '';
      if (/(?:^|:)(?:rtl|ltr):$/.test(prefix)) continue;
      failures.push(`${file}:${index + 1} uses physical utility "${token}"`);
    }
    for (const match of line.matchAll(physicalStyle)) {
      failures.push(`${file}:${index + 1} uses physical style binding "${match[0]}"`);
    }
  });
}

if (failures.length > 0) {
  console.error('Direction contract failed. Use logical start/end utilities instead:');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    'Map ml/mr -> ms/me, pl/pr -> ps/pe, left/right -> start/end, text-left/right -> text-start/end,',
  );
  console.error(
    'rounded-l/r -> rounded-s/e, border-l/r -> border-s/e, padding-left -> padding-inline-start.',
  );
  process.exit(1);
}

console.log(`Direction contract passed for ${scanned} library source files.`);
