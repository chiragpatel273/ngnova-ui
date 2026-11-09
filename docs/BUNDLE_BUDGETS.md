# Bundle measurements and budgets

NgNova UI measures every published JavaScript entry point independently from `dist/ui`, using raw
bytes and deterministic gzip level 9. The machine-readable measurements and ceilings live in
`docs/performance/bundle-budgets.json`.

## Current package

- 43 JavaScript entry points measured.
- 636,472 cumulative raw bytes across isolated entry points.
- 130,618 cumulative gzip bytes across isolated entry points.
- Theme stylesheet: 8,167 raw / 1,692 gzip bytes.

The cumulative number is inventory, not an application bundle estimate: Angular, shared helpers,
and individual entry points are optimized together by the consuming application. Focused imports
remain the supported way to avoid unrelated component code.

## Largest reviewed entry points

| Entry point       |      Raw |    Gzip | Raw budget | Gzip budget |
| ----------------- | -------: | ------: | ---------: | ----------: |
| `date-picker`     | 40,274 B | 7,083 B |   44,302 B |     7,792 B |
| `table`           | 45,346 B | 6,493 B |   49,881 B |     7,143 B |
| `testing`         | 46,355 B | 6,346 B |   50,991 B |     6,981 B |
| `combobox`        | 30,627 B | 5,617 B |   33,690 B |     6,179 B |
| `command-palette` | 29,429 B | 5,352 B |   32,372 B |     5,888 B |
| `confirmation`    | 23,765 B | 4,818 B |   26,142 B |     5,300 B |
| `overlay`         | 26,990 B | 4,803 B |   29,690 B |     5,284 B |
| `input`           | 22,860 B | 4,776 B |   25,147 B |     5,254 B |
| `file-upload`     | 25,561 B | 4,687 B |   28,118 B |     5,156 B |

All other entry points have the same per-entry-point measurement and budget in the JSON baseline.

The 2026-11-09 refresh reviewed the built-in label providers from ADR 0004: about 320 gzip bytes
per labelled entry point (8.3 KB gzip across the package inventory) for a token, a merge provider,
and the English defaults. Entry points without built-in text did not change.

## Budget policy

The initial ceiling is the greater of:

- 10% above the reviewed measurement; or
- 512 additional raw bytes and 256 additional gzip bytes.

This allows small compiler noise without permitting large components to grow invisibly. A new
entry point fails until it has a reviewed budget. Both raw and gzip ceilings must pass.

Run:

```powershell
npm.cmd run build:lib
npm.cmd run check:bundle-budgets
```

If an intentional feature exceeds a ceiling, first attempt to remove duplication, defer optional
behavior, or split the feature into a focused entry point. A budget refresh requires a documented
cost/benefit decision and release note; `npm.cmd run baseline:bundles` is not a routine CI fix.
