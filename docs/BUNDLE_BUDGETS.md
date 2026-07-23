# Bundle measurements and budgets

NgNova UI measures every published JavaScript entry point independently from `dist/ui`, using raw
bytes and deterministic gzip level 9. The machine-readable measurements and ceilings live in
`docs/performance/bundle-budgets.json`.

## Current package

- 43 JavaScript entry points measured.
- 607,582 cumulative raw bytes across isolated entry points.
- 121,687 cumulative gzip bytes across isolated entry points.
- Theme stylesheet: 7,954 raw / 1,648 gzip bytes.

The cumulative number is inventory, not an application bundle estimate: Angular, shared helpers,
and individual entry points are optimized together by the consuming application. Focused imports
remain the supported way to avoid unrelated component code.

## Largest reviewed entry points

| Entry point       |      Raw |    Gzip | Raw budget | Gzip budget |
| ----------------- | -------: | ------: | ---------: | ----------: |
| `date-picker`     | 38,878 B | 6,659 B |   42,766 B |     7,325 B |
| `testing`         | 46,355 B | 6,346 B |   50,991 B |     6,981 B |
| `table`           | 44,001 B | 6,036 B |   48,402 B |     6,640 B |
| `combobox`        | 29,654 B | 5,288 B |   32,620 B |     5,817 B |
| `command-palette` | 28,314 B | 4,983 B |   31,146 B |     5,482 B |
| `overlay`         | 26,990 B | 4,801 B |   29,690 B |     5,282 B |
| `file-upload`     | 24,321 B | 4,294 B |   26,754 B |     4,724 B |
| `tree-table`      | 24,152 B | 4,081 B |   26,568 B |     4,490 B |
| `button`          | 21,944 B | 3,966 B |   24,139 B |     4,363 B |

All other entry points have the same per-entry-point measurement and budget in the JSON baseline.

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
