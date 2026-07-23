# Browser and assistive-technology support

NgNova UI supports evergreen browsers through a checked-in Browserslist policy and validates a
fixed set of browser/screen-reader pairings before each stable release. The machine-readable source
is `docs/compatibility/support-matrix.json`.

## Browser tiers

Tier 1 means defects that prevent documented behavior, keyboard use, accessible naming, or content
access are release blockers.

| Browser | Platform            | Supported versions               |
| ------- | ------------------- | -------------------------------- |
| Chrome  | Windows and Android | Latest two stable major versions |
| Edge    | Windows             | Latest two stable major versions |
| Firefox | Windows and macOS   | Latest two stable major versions |
| Safari  | macOS               | Latest two stable major versions |
| Safari  | iOS and iPadOS      | Latest two stable major versions |

The build target is pinned in `.browserslistrc`. Browser Technology Preview, Canary, Beta, embedded
webviews, and end-of-life browsers are best-effort diagnostics rather than supported release
targets.

## Assistive-technology matrix

Use the latest stable screen reader available at release-candidate time.

| Screen reader | Browser | Platform   | Cadence              |
| ------------- | ------- | ---------- | -------------------- |
| NVDA          | Chrome  | Windows    | Every stable release |
| NVDA          | Firefox | Windows    | Every stable release |
| Narrator      | Edge    | Windows    | Every stable release |
| VoiceOver     | Safari  | macOS      | Every stable release |
| VoiceOver     | Safari  | iOS/iPadOS | Every stable release |

A failure in one pairing is not dismissed because another pairing works. The release note records
any confirmed upstream browser or AT limitation and links to the tracked issue.

## Required interaction coverage

For each interactive component, the release review covers:

- keyboard-only traversal, activation, escape/cancel, and focus return;
- screen-reader role, name, state, relationship, announcement, and reading order;
- pointer and touch activation without hover-only dependencies;
- 200% browser zoom and 400% text zoom/reflow;
- Windows forced-colors mode and visible focus;
- reduced-motion behavior;
- light and dark schemes.

Automated unit tests enforce semantic DOM, ARIA state, focus transitions, disabled behavior, and
keyboard contracts. The visual suite compares every documented state in Chromium and WebKit,
including desktop/mobile viewports, light/dark themes, and reduced motion. Firefox presentation is
covered by the Tier 1 manual release matrix; it is not falsely inferred from another engine's
pixels. Real screen-reader output remains a manual release-candidate check because browser
accessibility trees and synthesized speech cannot be validated faithfully by DOM assertions alone.

## Issue severity

- **Blocker:** content or an essential action is unavailable with a Tier 1 browser/AT pairing.
- **Critical:** keyboard trap, lost focus, incorrect destructive-action announcement, or a
  documented state that cannot be perceived.
- **Major:** interaction or presentation materially differs from the documented contract but a
  reliable workaround exists.
- **Minor:** cosmetic or low-impact divergence that does not hide state or block operation.

Blocker and critical accessibility defects prevent a stable release.
