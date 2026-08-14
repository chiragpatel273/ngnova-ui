# Bundle measurements and budgets

NgNova UI measures every published JavaScript entry point independently from `dist/ui`, using raw
bytes and deterministic gzip level 9. The machine-readable measurements and ceilings live in
`docs/performance/bundle-budgets.json`.

## Current package

- 43 JavaScript entry points measured.
- 611,909 cumulative raw bytes across isolated entry points.
- 122,254 cumulative gzip bytes across isolated entry points.
- Theme stylesheet: 8,361 raw / 1,702 gzip bytes.

The cumulative number is inventory, not an application bundle estimate: Angular, shared helpers,
and individual entry points are optimized together by the consuming application. Focused imports
remain the supported way to avoid unrelated component code.

## Largest reviewed entry points

| Entry point       |      Raw |    Gzip | Raw budget | Gzip budget |
| ----------------- | -------: | ------: | ---------: | ----------: |
| `date-picker`     | 38,878 B | 6,661 B |   42,766 B |     7,328 B |
| `testing`         | 46,355 B | 6,346 B |   50,991 B |     6,981 B |
| `table`           | 44,001 B | 6,038 B |   48,402 B |     6,642 B |
| `combobox`        | 29,654 B | 5,290 B |   32,620 B |     5,820 B |
| `command-palette` | 28,314 B | 4,985 B |   31,146 B |     5,484 B |
| `overlay`         | 26,990 B | 4,803 B |   29,690 B |     5,284 B |
| `input`           | 21,538 B | 4,442 B |   23,692 B |     4,887 B |
| `confirmation`    | 22,021 B | 4,320 B |   24,224 B |     4,752 B |
| `file-upload`     | 24,421 B | 4,297 B |   26,864 B |     4,727 B |

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
