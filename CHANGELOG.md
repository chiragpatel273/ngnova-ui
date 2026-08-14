# Changelog

All notable changes to `@ngnova/ui` are recorded here. NgNova UI follows Semantic Versioning from
1.0 onward and uses Changesets to connect each user-facing change to the package version.

## 1.0.0 — Unreleased

### Added

- 40 documented Angular 22 standalone components across foundations, forms, navigation, data,
  overlays, feedback, and workflow categories.
- MIT licensing with the complete license notice included in the repository and published package.
- Focused `@ngnova/ui/<component>` entry points, optional CDK integrations, an exported semantic
  theme stylesheet, and a supported `@ngnova/ui/testing` harness surface.
- Headless table state, advanced table composition, virtual scrolling, Data View, Tree, Tree Table,
  File Upload, Command Palette, connected Overlay, and Promise-based confirmation workflows.
- Intent/appearance Button API, icon marker directives, icon-only actions, link directives, Button
  groups, loading states, and semantic interaction outputs.
- Segmented, underline, and pills Tabs variants with horizontal and vertical layouts and
  axis-specific overflow behavior.
- Light/dark semantic design tokens, Inter variable typography, forced-colors and reduced-motion
  contracts, and keyboard/focus-visible standards.
- Public API, compatibility, browser/AT, visual regression, consumer-runtime, and bundle-budget
  release gates.

### Changed

- Package imports use focused secondary entry points; the root intentionally exports only
  `NGNOVA_UI_VERSION`.
- Outputs use semantic names such as `pressed`, `focused`, `blurred`, `valueChange`, and
  `openChange` instead of native-event collisions.
- Parent-owned state is immutable and controlled components emit requested changes.
- Theme customization uses the documented `--ui-*` semantic token contract.

### Fixed

- Button typography, per-size height/padding/font metrics, icon alignment and clarity, click
  feedback, focus treatment, and documentation preview/code presentation.
- Consistent spacing, typography, icons, dark mode, disabled/loading states, and accessible names
  across the full component catalog.
- Packaging now validates generated exports, npm contents, clean consumer installation, SSR,
  hydration, zoneless builds, and per-entry-point size ceilings.

### Security

- SSR runtime validation keeps Angular host checks enabled with explicit allowed hosts.
- Components avoid unsafe HTML APIs and direct unguarded browser globals; dependency and
  vulnerability handling follows `SECURITY.md`.
