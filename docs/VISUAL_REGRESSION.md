# Visual regression

NgNova UI compares the rendered documentation examples against reviewed Playwright screenshots.
The suite is a release artifact, not a screenshot-generation smoke test: CI runs without
`--update-snapshots` and fails when pixels move beyond the narrow configured tolerance.

## Coverage

`docs/visual-regression-manifest.json` is the machine-readable inventory:

- all 40 documented component routes;
- 48 static documented states, including all nine Button preview canvases;
- 10 open or visible interaction states for dialogs, listboxes, menus, overlays, drawers,
  popovers, and tooltips;
- light and dark desktop rendering in Chromium;
- desktop rendering in WebKit;
- a 390 × 844 mobile rendering for every component;
- reduced-motion rendering and local Inter font files for deterministic capture.

The checked-in baseline contains 194 images:

| Project          | Baselines | Contract                                                 |
| ---------------- | --------: | -------------------------------------------------------- |
| Chromium desktop |       106 | 48 light + 48 dark static states + 10 interactive states |
| WebKit desktop   |        48 | Every static documented state                            |
| Chromium mobile  |        40 | One responsive state for every documented component      |

Firefox remains a Tier 1 browser in the manual support matrix. Its pixels are not treated as
equivalent to Chromium or WebKit, and this repository does not claim a Firefox screenshot baseline
that the current Windows Playwright runtime cannot reliably produce.

## Commands

Install the pinned browser engines once:

```powershell
npx.cmd playwright install chromium webkit
```

Compare current output:

```powershell
npm.cmd run test:visual
```

After an intentional, reviewed design change:

```powershell
npm.cmd run test:visual:update
npm.cmd run test:visual
```

Review changed images individually. A baseline update must accompany the component change,
changeset/release note when user-facing, and relevant accessibility verification. Never update
snapshots merely to make CI green.

## Determinism and diagnostics

The visual runner first builds the published library and production documentation app, serves the
static result in-process, waits for local fonts, disables animation, hides carets, and applies
reduced motion. The CI job uploads the HTML report, traces, actual images, and diffs on failure for
14 days.

`npm.cmd run check:visual-manifest` prevents a new docs component, missing visual ID, missing theme,
viewport, engine, or required open-state scenario from silently escaping the suite.
