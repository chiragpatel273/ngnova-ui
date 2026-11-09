# NgNova UI Product Roadmap

This roadmap defines how `@ngnova/ui` becomes a distinctive, trustworthy Angular component
library. It turns the product direction into sequenced releases, measurable quality gates, and
issue-sized work.

Use this document to decide **what to do next**. Use
`docs/ANGULAR_22_LIBRARY_STANDARDS.md` for implementation rules,
`docs/NGNOVA_WORLD_CLASS_AGENT.md` for the execution workflow, and
`docs/FIRST_RELEASE_TRACKER.md` for component-level readiness evidence.

## Product Position

NgNova UI will be the Angular-native component library for teams that want:

- polished, neutral defaults without adopting Material, Ant Design, or another product identity;
- accessible behavior and strong testing contracts without copying component source into every app;
- modern Angular 22 architecture, including standalone components, signals, OnPush, SSR safety,
  and zoneless readiness;
- explicit per-component package imports with predictable bundle impact;
- consistent APIs, geometry, icons, focus, motion, light mode, and dark mode;
- documentation that is verified against the actual public API.

The short positioning statement is:

> Premium visual quality, strict API consistency, modern Angular architecture, verifiable
> accessibility, and documentation teams can trust.

## Product Promises

Every public component must uphold six promises.

### 1. Angular-native

- Standalone and `OnPush` by default.
- Typed public APIs designed for Angular rather than ported from another framework.
- Signals and `computed()` where they improve local state and derivation.
- SSR, hydration, and zoneless behavior treated as supported product scenarios.
- Forms components integrate correctly through `ControlValueAccessor`.

### 2. Consistent

- Shared `sm`, `md`, and `lg` sizing where the concept applies.
- Shared semantic intent, appearance, spacing, radius, icon, focus, and motion contracts.
- Predictable input and output naming across component families.
- No component-specific visual invention without a documented system decision.

### 3. Accessible by evidence

- Native semantics first.
- Keyboard behavior documented and tested.
- Visible `focus-visible` treatment follows one token contract.
- ARIA behavior, reduced motion, forced colors, zoom, and assistive-technology status are tracked.
- Interactive components expose user-focused Angular CDK harnesses.

### 4. Beautiful by default

- Neutral product styling suitable for SaaS, dashboards, and business applications.
- Light and dark modes receive equal design attention.
- Typography, icons, borders, shadows, spacing, and state feedback remain restrained and precise.
- Consumer applications inherit typography rather than receiving a forced font.

### 5. Customizable without fighting the library

- Brand, semantic, and component tokens form a documented cascade.
- Tailwind remains supported without requiring consumers to override high-specificity CSS.
- Normal classes and CSS custom properties provide deliberate escape hatches.
- Theme APIs are treated as semver-sensitive public contracts.

### 6. Trustworthy to adopt

- Each component has an isolated secondary entry point.
- Releases publish compatibility, tests, accessibility status, migration notes, and package evidence.
- Documentation examples compile against the public package surface.
- Marketing claims use verifiable project facts, never invented adoption numbers.

## Current Baseline

As of the 1.0 release audit on 2026-08-14:

- The package source is version `1.0.0` and targets Angular 22.
- Forty documented visual components ship through focused secondary entry points.
- Public components are standalone, `OnPush`, tested, documented, dark-mode aware, and packaged
  with intentional exports.
- The release gate covers API/docs consistency, theme and focus contracts, unit tests, production
  builds, package contents, bundle budgets, and clean zoneless and SSR/hydration consumers.
- The reviewed public surface contains 43 TypeScript entry points and 239 exported symbols.
- GitHub Pages serves the maintained documentation at the project root, and `@ngnova/ui@1.0.0` is
  publicly available from npm.

The release evidence source of truth is `docs/FINAL_RELEASE_AUDIT.md`.

## Strategic Decisions

These decisions prevent the roadmap from becoming an unbounded component-count race.

### What NgNova UI will optimize for

1. Quality and consistency of the existing twenty components.
2. Accessibility, forms, overlays, and testing contracts.
3. Excellent documentation and product adoption experience.
4. Theme ownership and predictable customization.
5. High-demand components that complete real application workflows.

### What NgNova UI will not optimize for yet

- Matching PrimeNG's component count.
- Shipping charts, rich text, organization charts, or highly specialized enterprise widgets.
- Supporting multiple unrelated visual design languages.
- Adding a runtime theme engine before the token contract is stable.
- Claiming complete WCAG conformance without manual assistive-technology evidence.
- Supporting old Angular majors before the Angular 22 product experience is stable.

## Release Sequence

The phases are sequential. New feature work does not bypass the exit gate of the active phase.

## Phase 0 — Contract And Documentation Recovery

**Status: Complete (2026-07-21).**

**Goal:** remove the known P0/P1 inconsistencies before presenting the docs as production-ready.

### Work

1. Write a short API decision record for focus and blur behavior:
   - decide when native host `focus`/`blur` events are sufficient;
   - decide whether `focused`/`blurred` Angular outputs remain supported;
   - apply the decision consistently to Button and all form controls;
   - define deprecation behavior before changing any published API.
2. Fix API documentation drift for Checkbox, Radio, Select, and Switch.
3. Add an automated implementation-to-docs API consistency check.
4. Replace the mobile inline sidebar with an accessible navigation drawer or selector.
5. Standardize every component example on one responsive Preview/Code primitive.
6. Make code blocks, copy actions, and tables usable at 320–390px widths.
7. Replace text glyph icons in Accordion, Alert, Modal, Tag, and Toast with the shared icon contract.
8. Define and apply one focus-visible token contract across all interactive controls.
9. Fix Button Group focus clipping.
10. Integrate the Card playground into the shared documentation page structure.
11. Add Toast safe-area and configurable viewport offsets.
12. Replace unverified home-page social proof with package, compatibility, component, and test facts.
13. Synchronize `docs/NGNOVA_DESIGN_SYSTEM.md` with current Button behavior.
14. Reduce or intentionally revise the documentation application's initial bundle budget.

### Exit gate

- No P0 or P1 finding from the 2026-07-19 audit remains open without an accepted decision record.
- API documentation consistency automation passes.
- Component content appears immediately on mobile without traversing the full catalog.
- Preview, code, and copy actions work at 320px, 390px, and desktop widths.
- Keyboard focus is visible and unclipped across the component suite.
- `npm.cmd run release:check` passes without an unexplained bundle warning.

## Phase 1 — First Twenty Release-Ready

**Status: Complete (2026-07-22).** All twenty original components are marked Ready in the
first-release tracker.

**Goal:** make every existing component satisfy one published definition of done.

### Work order

1. Checkbox
2. Radio
3. Switch
4. Select
5. Modal
6. Toast
7. Tabs
8. Accordion
9. Card
10. Table
11. Progress Bar
12. Alert
13. Tag
14. Avatar
15. Badge
16. Skeleton
17. Spinner

Input, Textarea, and Button remain under regression review because they are already marked Ready.

### Audit required for every component

- implementation and public API;
- semantic HTML, keyboard interaction, ARIA, focus, disabled, loading, and error states;
- light mode, dark mode, long content, localization pressure, and responsive layout;
- tests and harness decision;
- docs examples and API table accuracy;
- secondary entry point and packed artifact;
- bundle contribution recorded;
- release tracker updated with evidence.

### Exit gate

- Twenty of twenty components are marked Ready in `docs/FIRST_RELEASE_TRACKER.md`.
- Every interactive component has a harness or a written reason why one is unnecessary.
- Forms and overlays pass dedicated keyboard and accessibility tests.
- No public example imports internal source files.
- Root and secondary imports pass consumer smoke tests.
- Package metadata, npm scope access, README, changelog, and first-release notes are complete.

## Phase 2 — Theme And Design-System Contract

**Status: Complete (2026-07-22).** The optional v1 stylesheet, token bridge, theme playground,
automated mode contract, migration guidance, package export, and clean-consumer verification are
in place.

**Goal:** provide excellent customization without coupling consumers to NgNova's documentation app.

### Work

1. Define versioned token layers:
   - foundation: spacing, typography, radius, elevation, motion;
   - semantic: surface, text, border, primary, success, warning, danger;
   - component: control height, field border, dialog width, toast offset, and similar contracts.
2. Publish light and dark token values as CSS custom properties.
3. Define how Tailwind utilities and CSS variables cooperate.
4. Add forced-colors and reduced-motion foundations.
5. Build a documentation theme playground that previews all component families.
6. Export a minimal theme stylesheet only after consumer setup and tree-shaking behavior are proven.
7. Publish migration guidance for any class or token contract that changes.

### Exit gate

- A consumer can create a coherent brand theme without editing component source.
- Light, dark, reduced-motion, and forced-colors modes have automated coverage.
- Token names, scopes, defaults, and stability policy are documented.
- Theme output is verified in a clean consumer application.

## Phase 3 — Workflow Completion Components

**Status: Complete (2026-07-27).**

**Goal:** add the smallest set of components that lets teams build complete product workflows.

### Priority components

1. Tooltip
2. Popover
3. Drawer
4. Menu and Dropdown Menu
5. Divider
6. Chip
7. Paginator
8. Breadcrumb
9. Stepper
10. Form Field foundation
11. Autocomplete or Combobox
12. Date Picker

Delivery evidence is tracked in `docs/PHASE_3_TRACKER.md`.

Each addition must solve a demonstrated workflow gap. It must not be accepted solely to increase the
component count.

### Exit gate

- Components share existing overlay, focus, token, icon, and form foundations.
- Each component ships implementation, docs, tests, harness, entry point, bundle evidence, and
  accessibility status in the same pull request.
- No new component creates an undocumented visual or API exception.

## Phase 4 — Data And Enterprise Depth

**Status: Complete (2026-07-28).**

**Goal:** support serious data-heavy Angular applications without turning the core into a monolith.

### Candidate work

- Table composition and headless state primitives
- Sorting, selection, pagination, sticky regions, empty/loading/error states
- Virtual scrolling through Angular CDK integration
- Data View
- Tree and Tree Table only after Table contracts are stable
- File Upload
- Command palette
- Advanced overlays and confirmation workflows

### Exit gate

- Data features remain composable and independently importable.
- Keyboard, screen-reader, performance, and large-data tests exist.
- Advanced behavior is optional and does not inflate basic component bundles.

## Phase 5 — 1.0 Stability

**Status: Complete. Published to npm on 2026-08-17.**

**Goal:** publish a stable contract that production teams can adopt confidently.

### Required evidence

- Public API review and compatibility report.
- No undocumented breaking changes since the final pre-1.0 release.
- Angular compatibility and migration policy.
- Browser and assistive-technology support matrix.
- Automated visual regression coverage for all documented states.
- SSR, hydration, and zoneless consumer applications in CI.
- Per-component bundle measurements and regression budgets.
- Complete changesets, changelog, migration guide, and release notes.
- Security, contribution, support, and deprecation policies.
- Hosted documentation with stable versioned URLs.

## Phase 6 - Adoption And Feedback

**Status: Active.**

**Goal:** prove that Angular developers can discover, install, evaluate, and successfully adopt
NgNova UI before expanding the component catalog.

### Work

1. Complete the GitHub launch surface with a release, repository metadata, and discovery topics.
2. Maintain a runnable minimal consumer that installs from npm and reaches a working screen quickly.
3. Collect structured installation, API, theming, accessibility, and workflow feedback.
4. Publish realistic product examples without duplicating component documentation.
5. Track successful onboarding and external usage alongside directional npm download counts.
6. Prepare trusted publishing with provenance before the next npm release.
7. Prioritize patch fixes from observed user friction before planning new components.
8. Deepen the forms foundation with verified Signal Forms compatibility, documented recipes, and
   feedback-driven validation workflows.

### Exit gate

- At least three external developers complete the quick start and provide actionable feedback.
- The quick start builds against the public npm package in CI or an equivalent clean environment.
- No known critical installation, accessibility, or package defect remains unresolved.
- The next release scope is supported by observed adoption needs rather than component-count goals.
- External form examples validate both Signal Forms and existing Reactive Forms adoption paths.

## Phase 7 - Adoption Foundations

**Status: Active (started 2026-11-09).** Runs alongside Phase 6; it removes the adoption barriers
found in the 2026-11-09 product review.

**Goal:** make NgNova UI the easiest Angular 22 library to discover, install, and use correctly,
including through AI coding assistants, before widening the component catalog.

**Evidence that motivated this phase (2026-11-09):** 2 GitHub stars, 0 forks, and 41 npm downloads
in the preceding 30 days. Engineering quality gates were green, so the limiting factor was
discovery and first-run friction, not component quality.

### Work

1. [x] `ng add @ngnova/ui` schematic: Tailwind CSS v4 + PostCSS, theme import, dark-mode variant,
       `@source`, optional CDK; idempotent; Tailwind v3 refusal; unit tests in the release gate and
       a verified end-to-end run in a fresh `ng new` application.
2. [x] `llms.txt`, `llms-full.txt`, and per-component Markdown generated from the verified docs
       data on every documentation build.
3. [x] Run the release gate on Linux and Windows in CI.
4. [ ] Release 1.1.0 with the schematic, then switch the home page and guide install snippets to
       `ng add @ngnova/ui`.
5. [x] Path-based documentation routes with all 53 routes prerendered, per-page titles,
       descriptions, canonical links, Open Graph and Twitter tags, a sitemap, and redirects for
       legacy `#/` links. Follow-up: Open Graph preview images, Search Console sitemap submission.
6. [ ] NgNova UI MCP server exposing component search, API lookup, and examples from the same data
       as `llms-full.txt`.
7. [x] Internationalization: per-entry-point typed labels providers (ADR 0004) for 26
       components, making every built-in English string replaceable, including formerly fixed
       Stepper, Table, Spinner, Combobox, File Upload, Input, and Textarea text. Date Picker keeps
       its `locale` input for Intl formatting.
8. [ ] Right-to-left support: logical properties, `Directionality`-aware keyboard handling, and RTL
       visual regression states.
9. [ ] Public launch: release post, Angular community channels, and the Phase 6 external quick-start
       feedback round.

### Candidate components (demand-gated)

Promote only with recorded user requests or a template that needs them: Slider, Date Range Picker,
Time Picker, Input OTP, Toggle Group, Number Input, Sidebar/App Shell, Context Menu, Hover Card,
Resizable panels, Carousel.

### Exit gate

- `ng add @ngnova/ui` works against the published package in CI on Linux and Windows.
- Every documented component page has a crawlable URL, title, and description.
- Built-in accessible names can be translated without forking components.
- At least one RTL locale passes keyboard and visual checks for form and overlay components.
- npm downloads and GitHub stars are reported per release as directional, not vanity, signals.

## Quality Scorecard

Track these metrics per release. Do not replace them with vanity metrics.

| Area                  | Release target                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| Component readiness   | 100% of the active milestone marked Ready                               |
| API/docs consistency  | Zero undocumented inputs or outputs                                     |
| Automated tests       | All public states and interaction paths covered proportionally to risk  |
| Harness coverage      | Every reusable interactive component covered or explicitly waived       |
| Accessibility         | Zero known critical keyboard/ARIA defects; manual test status published |
| Responsive docs       | No horizontal page overflow at 320px, 390px, 768px, or desktop          |
| Dark mode             | Every public component and documented state reviewed                    |
| Packaging             | Every public entry point present in the packed artifact                 |
| Consumer verification | Clean app builds with root and secondary imports                        |
| Bundle health         | Per-component budgets recorded; docs budget warning resolved            |
| Release health        | `npm.cmd run release:check` passes                                      |

## Documentation Contract

Every component page follows one order:

1. Purpose and when to use it.
2. Installation and focused secondary import.
3. Smallest correct example.
4. Meaningful variants, sizes, and states.
5. Forms or controlled-state integration where relevant.
6. Long content, responsive behavior, and dark mode.
7. Accessibility semantics and keyboard table.
8. Typed API generated or checked against implementation.
9. Testing guidance and harness example.
10. Related components and migration notes.

All examples use the shared responsive Preview/Code primitive. Documentation claims must be backed
by implementation, tests, package output, or named manual verification.

## Execution Model

### One issue, one outcome, one pull request

Every issue must contain:

- a user or release problem;
- explicit scope and non-goals;
- implementation, documentation, test, and package acceptance criteria;
- accessibility and responsive checks;
- required verification commands;
- release tracker updates where readiness changes.

### Priority labels

- `priority:p0`: release or usability blocker;
- `priority:p1`: cross-component consistency or accessibility risk;
- `priority:p2`: component hardening or important missing capability;
- `priority:p3`: expansion after the active milestone is healthy.

`codex-ready` means the issue is sufficiently specified to implement without inventing product
decisions. Work follows `docs/CODEX_GITHUB_ISSUE_WORKFLOW.md`.

### Pull request rule

No public behavior change merges without matching documentation and tests. No component is marked
Ready from code inspection alone; package and consumer evidence are required.

## Immediate Backlog

Create and execute these issues in order:

- [x] Decide and document the cross-component focus/blur event contract.
- [x] Fix Checkbox, Radio, Select, and Switch API documentation from that decision.
- [x] Add automated docs/API consistency validation.
- [x] Replace mobile component navigation with an accessible drawer.
- [x] Build the shared responsive Preview/Code primitive and migrate all generic pages.
- [x] Integrate the Card playground into the shared documentation layout.
- [x] Replace all improvised glyph icons with the shared icon contract.
- [x] Implement and test the common focus-visible token contract.
- [x] Fix Button Group focus clipping.
- [x] Add Toast viewport offset and safe-area support.
- [x] Replace unverified trust claims and synchronize the design-system document.
- [x] Resolve the documentation bundle-budget warning.
- [x] Complete the remaining component release audits in the Phase 1 order.
- [x] Publish and verify the Phase 2 theme and design-system contract.

## Roadmap Governance

- Review this roadmap after each milestone, not after every small pull request.
- Record changes in priority with evidence from user needs, audits, adoption, or maintenance cost.
- Keep speculative components in Phase 4 or later until a real workflow requires them.
- Treat public API, CSS tokens, selectors, entry points, and accessibility behavior as semver-sensitive.
- Prefer completing the current milestone over starting the next one.
