# Phase 5 1.0 Stability Tracker

This tracker records the evidence required before NgNova UI can claim a stable 1.0 contract. An
item is Ready only when its policy, automation, documentation, and release-gate evidence agree.

Local implementation and verification are complete. Public hosting remains Ready to deploy until
the GitHub Pages workflow is published and its live URL is verified. See `FINAL_RELEASE_AUDIT.md`.

| Order | Stability evidence                              | Status          | Primary evidence                   | Automated gate                         |
| ----: | ----------------------------------------------- | --------------- | ---------------------------------- | -------------------------------------- |
|     1 | Public API review and compatibility report      | Ready           | `PUBLIC_API_COMPATIBILITY.md`      | `check:public-api`                     |
|     2 | No undocumented pre-1.0 breaking changes        | Ready           | `PRE_1_0_BREAKING_CHANGE_AUDIT.md` | `check:public-api`                     |
|     3 | Angular compatibility and migration policy      | Ready           | `ANGULAR_COMPATIBILITY.md`         | `check:angular-compatibility`          |
|     4 | Browser and assistive-technology support matrix | Ready           | `BROWSER_AND_AT_SUPPORT.md`        | `check:support-matrix`                 |
|     5 | Automated visual regression coverage            | Ready           | `VISUAL_REGRESSION.md`             | `check:visual-manifest`, `test:visual` |
|     6 | SSR, hydration, and zoneless consumers in CI    | Ready           | `CONSUMER_RUNTIME_MATRIX.md`       | `smoke:consumer`                       |
|     7 | Bundle measurements and regression budgets      | Ready           | `BUNDLE_BUDGETS.md`                | `check:bundle-budgets`                 |
|     8 | Changesets, changelog, migration, release notes | Ready           | `RELEASE_NOTES_1_0.md`             | `check:release-docs`                   |
|     9 | Security, contribution, support, deprecation    | Ready           | `VERSIONING_AND_DEPRECATION.md`    | `check:project-policies`               |
|    10 | Hosted versioned documentation                  | Ready to deploy | `HOSTED_DOCUMENTATION.md`          | `check:versioned-docs`                 |

## 1. Public API review and compatibility report

- Reviewed the root, 40 visual component entry points, the headless Table state entry point, and
  the testing surface from the generated npm package.
- Confirmed the minimal root policy after a full-root experiment failed ng-packagr compilation and
  would have pulled optional CDK integrations into the default dependency graph.
- Added a normalized declaration baseline covering 43 TypeScript entry points and 237 exported
  symbols, with explicit added/removed entry-point, symbol, signature, Angular-peer, and root-policy
  failures.
- Added the compatibility report and baseline refresh process; intentional changes require semver,
  migration, release-note, and baseline review.

## 2. No undocumented pre-1.0 breaking changes

- Froze the final 0.1.0 candidate declarations as the pre-1.0 compatibility baseline.
- Recorded the pre-freeze API decisions and confirmed zero undocumented breaking changes.
- Added a separately reviewed SHA-256 digest so a baseline regeneration cannot silently redefine
  compatibility.
- Made changesets, migration notes, release notes, ledger updates, and digest review explicit
  requirements for intentional compatibility changes.

## 3. Angular compatibility and migration policy

- Published the supported Angular, optional CDK, TypeScript, Node, RxJS, Zone.js, partial-Ivy, and
  ECMAScript matrix in human- and machine-readable forms.
- Defined the supported-major policy, consumer upgrade order, prerelease position, and manual
  migration requirement.
- Added a release gate that compares the matrix with the actual library package, Angular
  compiler/runtime packages, production compiler mode, and TypeScript target.

## 4. Browser and assistive-technology support matrix

- Pinned the latest-two-major evergreen browser policy in `.browserslistrc` and a
  machine-readable support manifest.
- Defined the release-candidate matrix for NVDA, Narrator, and VoiceOver across Chrome, Firefox,
  Edge, desktop Safari, and mobile Safari.
- Documented required keyboard, screen-reader, touch, zoom/reflow, forced-colors, reduced-motion,
  and theme checks plus release-blocking severity.
- Added a drift gate that validates the browser targets, AT pairings, and interaction modes.

## 5. Automated visual regression coverage

- Added Playwright comparison for all 40 component routes, 48 static states, and 10 interactive
  open/visible states.
- Committed 194 reviewed baselines: 106 Chromium desktop, 48 WebKit desktop, and 40 Chromium
  mobile images.
- Covered light/dark, desktop/mobile, reduced motion, local fonts, and deterministic static
  production-doc serving.
- Added a dedicated Windows CI job with browser installation and failure artifacts, plus a
  release-gated manifest that prevents undocumented coverage gaps.
- Verified 50 Chromium desktop tests, 40 Chromium mobile tests, and 40 WebKit tests against the
  committed baselines.

## 6. SSR, hydration, and zoneless consumers in CI

- Replaced the single compile smoke with a clean packed-package consumer matrix.
- Built a signal-driven zoneless browser app with no Zone.js dependency.
- Built browser and server bundles for an Angular SSR application using client hydration.
- Started the generated Node server, rendered NgNova UI at runtime, and asserted both application
  content and Angular hydration annotations.
- Kept Angular SSR host validation enabled with an explicit loopback allowlist.

## 7. Per-entry-point bundle measurements and budgets

- Measured all 43 published JavaScript entry points plus the exported theme stylesheet in raw and
  deterministic gzip-9 bytes.
- Published the complete machine-readable baseline and the largest reviewed entry points.
- Added individual raw and gzip ceilings with 10%/minimum-byte headroom.
- Made missing entry points, missing budgets, and either raw or compressed regressions fail the
  release gate.

## 8. Changesets, changelog, migration guide, and release notes

- Registered `projects/ui` as the publishable npm workspace so Changesets discovers
  `@ngnova/ui`.
- Added the reviewed major changeset that promotes the final pre-1.0 candidate to the stable 1.0
  contract.
- Published a categorized changelog, a step-by-step pre-1.0 migration guide, and evidence-backed
  1.0 release notes.
- Added a release gate that keeps workspace metadata, Changesets configuration, migration
  requirements, release evidence, and changelog sections aligned.

## 9. Security, contribution, support, and deprecation policies

- Added private vulnerability reporting, supported-version boundaries, coordinated disclosure,
  and security-release expectations.
- Defined supported help channels, actionable reproduction evidence, triage priorities, and
  unsupported support requests.
- Expanded contribution requirements for Angular standards, accessibility, documentation,
  harnesses, visual evidence, Changesets, and the complete release gate.
- Published the stable semver surface and a deprecation window of at least one minor release and
  90 days, with narrowly defined emergency exceptions.
- Linked conduct and governance policies from the repository landing page and added an automated
  completeness gate.

## 10. Hosted versioned documentation

- Defined the GitHub Pages major-version contract and the stable
  `/ngnova-ui/v1/#/components/<slug>` route shape.
- Added a machine-readable version manifest and schema, with v1 marked as a release candidate
  until the 1.0 package is published.
- Built and validated the static v1 artifact with hash routing, root/latest redirects, a GitHub
  Pages fallback, and the correct project base path.
- Added the least-privilege Pages artifact/deployment workflow and an automated drift gate.
- Local evidence is complete. Public hosting becomes Ready after the workflow is committed to
  `main`, GitHub Pages uses GitHub Actions as its source, and the deployment URL is verified.
