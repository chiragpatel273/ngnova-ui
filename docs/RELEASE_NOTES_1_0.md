# NgNova UI 1.0 release notes

NgNova UI 1.0 is the first stable contract for an Angular 22 standalone component library designed
around focused imports, accessible interactions, semantic theming, and evidence-backed releases.
These notes describe the release candidate; publication occurs only after every Phase 5 gate is
green. The source and published package are available under the MIT License.

## Component catalog

- **Actions and status:** Button, Badge, Tag, Chip, Avatar, Alert, Spinner, Skeleton, Progress Bar.
- **Forms:** Form Field, Input, Textarea, Checkbox, Radio Group, Switch, Select, Combobox, Date
  Picker, File Upload.
- **Layout and data:** Card, Divider, Table, virtual Table, Data View, Tree, Tree Table, Paginator.
- **Navigation and workflow:** Breadcrumb, Tabs, Accordion, Stepper.
- **Overlays and feedback:** Modal, Drawer, Menu, Popover, Tooltip, Toast, Command Palette,
  connected Overlay, Confirmation.

The package contains 40 documented visual components, a headless Table state entry point, focused
optional-CDK integrations, and supported component harnesses.

## Design and accessibility

- Inter variable typography and calibrated control metrics establish a consistent visual rhythm.
- Semantic intent/appearance APIs keep meaning separate from emphasis.
- Light/dark tokens, forced-colors behavior, reduced motion, and focus-visible rings are public
  design-system contracts.
- Keyboard behavior, accessible names, roles, state, focus entry/return, disabled semantics, and
  Angular Forms behavior are documented per component.
- The browser/AT release matrix covers Chrome, Edge, Firefox, desktop/mobile Safari, NVDA,
  Narrator, and VoiceOver.

## Package and performance

- Import components from `@ngnova/ui/<component>`; the root stays minimal.
- Angular CDK is optional and only required by CDK-backed entry points.
- The package is partial-Ivy, targets ES2022, and supports Angular `^22.0.0`.
- All 43 JavaScript entry points and the theme asset have raw/gzip regression budgets.
- A clean tarball consumer proves focused exports and Tailwind theme scanning.

## Release evidence

- Public declaration compatibility baseline: 43 TypeScript entry points and 237 exported symbols.
- Visual regression: 194 reviewed images across Chromium desktop/mobile and WebKit, including 10
  open/visible interaction states.
- Runtime consumers: zoneless build, SSR browser/server builds, live server rendering, and Angular
  hydration annotations.
- Release gate: format, lint, docs/API contracts, accessibility/focus/theme policies, tests,
  builds, package audit, npm dry run, and clean consumers.

## Upgrade

Pre-1.0 users should follow `docs/MIGRATION_TO_1_0.md`, especially for focused imports, semantic
outputs, controlled state, Button icon directives, and `--ui-*` theme tokens.

## Known boundaries

- NgNova UI 1.0 supports Angular 22 only.
- Angular CDK-backed entry points require a matching CDK 22 peer.
- Automated migrations/schematics are not included; every required change has manual steps.
- Real screen-reader speech output remains a release-candidate manual check.
