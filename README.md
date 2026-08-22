# NgNova UI

[![npm version](https://img.shields.io/npm/v/%40ngnova%2Fui)](https://www.npmjs.com/package/@ngnova/ui)
[![weekly downloads](https://img.shields.io/npm/dw/%40ngnova%2Fui)](https://www.npmjs.com/package/@ngnova/ui)
[![CI](https://github.com/chiragpatel273/ngnova-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/chiragpatel273/ngnova-ui/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/%40ngnova%2Fui)](LICENSE)

NgNova UI 1.0.1 is an open-source Angular 22 component library built with standalone components,
focused package entry points, accessible interaction contracts, and Tailwind CSS theming.

- [Documentation](https://chiragpatel273.github.io/ngnova-ui/)
- [Component documentation](https://chiragpatel273.github.io/ngnova-ui/#/components/button)
- [Runnable quick start](examples/quick-start/README.md)
- [Getting started](https://chiragpatel273.github.io/ngnova-ui/#/guide)
- [Contributing](https://chiragpatel273.github.io/ngnova-ui/#/contributing)
- [Release notes](docs/RELEASE_NOTES_1_0.md)

## Why NgNova UI

- **Angular-native:** standalone Angular 22 components with typed, explicit APIs.
- **Focused imports:** use entry points such as `@ngnova/ui/button`, `@ngnova/ui/input`, and
  `@ngnova/ui/toast` without pulling unrelated components into the dependency graph.
- **Accessible interactions:** keyboard behavior, focus management, semantics, and ARIA contracts
  are treated as supported product behavior.
- **Tailwind v4 theming:** static utility classes, dark-mode support, and an optional versioned CSS
  token stylesheet without a runtime theme provider.
- **Package-aligned documentation:** live examples, snippets, API tables, accessibility notes, and
  testing guidance are checked against the public package surface.
- **Testing support:** Angular CDK component harnesses are available from `@ngnova/ui/testing`.

## Requirements

| Dependency   | Supported version                                                   |
| ------------ | ------------------------------------------------------------------- |
| NgNova UI    | `1.0.1`                                                             |
| Angular      | `>=22.0.2 <23.0.0`                                                  |
| Tailwind CSS | `4.x`                                                               |
| Angular CDK  | `^22.0.0` when using CDK-backed entry points or component harnesses |

See the complete [Angular compatibility policy](docs/ANGULAR_COMPATIBILITY.md) and
[browser and assistive-technology support matrix](docs/BROWSER_AND_AT_SUPPORT.md).

## Installation

Install NgNova UI:

```bash
npm install @ngnova/ui
```

If the consuming application does not already use Tailwind CSS v4, configure it:

```bash
ng add tailwindcss
```

In the application's global stylesheet, ensure Tailwind is imported once and add NgNova UI as an
explicit source:

```css
@import 'tailwindcss';
@import '@ngnova/ui/styles/theme.css';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
```

- `@source` is required because Tailwind v4 ignores `node_modules` by default.
- `@custom-variant` is required when dark mode is controlled by a `.dark` class on the application
  shell or `html` element.
- If `@import 'tailwindcss'` already exists, do not add it again.

The `@ngnova/ui/styles/theme.css` import is optional but recommended. It provides the supported
`--ui-*` foundation, semantic, and component tokens. Applications can omit it to use only the
component utility styles. Brand and feedback overrides drive the mapped Tailwind color families;
foundation and component tokens apply where their concepts are used, while neutral semantic tokens
support consumer application composition.
See the [theme migration and customization guide](docs/THEME_MIGRATION.md).

### Optional Angular CDK entry points

Angular CDK is an optional peer dependency. Install the matching Angular 22 CDK when using
`@ngnova/ui/overlay` or `@ngnova/ui/table-virtual-scroll`:

```bash
npm install @angular/cdk@^22.0.0
```

All other runtime component entry points remain CDK-free. Applications using the published test
harnesses should install CDK as a development dependency instead:

```bash
npm install --save-dev @angular/cdk@^22.0.0
```

## Usage

Import components from their focused entry points:

```ts
import { Component } from '@angular/core';
import { UiButtonComponent } from '@ngnova/ui/button';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<ui-button variant="primary">Save</ui-button>`,
})
export class SaveButtonExample {}
```

The root `@ngnova/ui` entry point intentionally exposes only the minimal package contract. Public
components are exported from focused paths such as `@ngnova/ui/button` and `@ngnova/ui/input` so
optional integrations do not enter unrelated dependency graphs.

## Components

NgNova UI documents 40 public component surfaces:

| Category                | Components                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Actions and status      | Button, Badge, Tag, Chip, Avatar, Alert, Spinner, Skeleton, Progress Bar                               |
| Forms                   | Form Field, Input, Textarea, Checkbox, Radio Group, Switch, Select, Combobox, Date Picker, File Upload |
| Layout and data         | Card, Divider, Table, Table Virtual Scroll, Data View, Tree, Tree Table                                |
| Navigation and workflow | Breadcrumb, Tabs, Accordion, Stepper, Paginator                                                        |
| Overlays and feedback   | Modal, Drawer, Popover, Tooltip, Menu, Toast, Command Palette, Advanced Overlay, Confirmation          |

Browse the [component documentation](https://chiragpatel273.github.io/ngnova-ui/#/components/button)
for current APIs, live examples, accessibility guidance, and import statements. Headless table
state utilities are also available from `@ngnova/ui/table-state`.

## Component test harnesses

NgNova UI publishes Angular CDK harnesses from the dedicated testing entry point:

```ts
import { UiButtonHarness, UiInputHarness } from '@ngnova/ui/testing';

const button = await loader.getHarness(UiButtonHarness.with({ text: 'Save' }));
await button.click();

const email = await loader.getHarness(UiInputHarness.with({ label: 'Email' }));
await email.setValue('dev@example.com');
```

The testing entry point includes harnesses for interactive controls, forms, overlays, navigation,
feedback, and data components. Treat harness methods as supported public API.

## Local development

The maintainer toolchain uses the Node.js versions documented in
[Angular compatibility](docs/ANGULAR_COMPATIBILITY.md).

```bash
npm install
npm run build:lib
npm start
```

Open the documentation application at:

```text
http://localhost:4200/#/
```

Open a component page directly at:

```text
http://localhost:4200/#/components/button
```

The documentation application imports from the built `@ngnova/ui` package shape. Build the
library before validating focused entry points or package output.

## Repository structure

- `projects/ui`: Angular library source and focused package entry points.
- `projects/ui/README.md`: README included in the published npm package.
- `src/app`: documentation application.
- `docs`: compatibility, design, release, support, and engineering contracts.
- `scripts`: release checks, API validation, package audits, and consumer smoke tests.

## Quality checks

```bash
npm run format:check       # Verify formatting
npm run lint               # Lint the documentation app and library
npm run test:lib           # Run library unit tests
npm run test:docs          # Run documentation application tests
npm run build:lib          # Build the ng-packagr package to dist/ui
npm run build:docs         # Build the library and production documentation app
npm run release:check      # Run the complete release-readiness pipeline
```

The release pipeline also checks documentation/API consistency, accessibility focus contracts,
theme contracts, Angular compatibility, package exports, bundle budgets, SSR, hydration,
zoneless consumers, and the npm tarball.

## Contributing and project policies

Contributions are welcome. Start with the [public contribution guide](https://chiragpatel273.github.io/ngnova-ui/#/contributing)
or the repository's [CONTRIBUTING.md](CONTRIBUTING.md).

- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Support policy](SUPPORT.md)
- [Versioning and deprecation](docs/VERSIONING_AND_DEPRECATION.md)
- [Angular 22 library standards](docs/ANGULAR_22_LIBRARY_STANDARDS.md)
- [Product roadmap](docs/NGNOVA_PRODUCT_ROADMAP.md)

## Publishing

Publish only the ng-packagr output from `dist/ui`, never the source under `projects/ui`:

```bash
npm run release:check
npm run pack:lib
cd dist/ui
npm publish --access public
```

Before publishing, confirm access to the `@ngnova` npm scope and inspect the generated tarball.
For automated releases, prefer npm trusted publishing with provenance.

## License

NgNova UI is available under the [MIT License](LICENSE).

Copyright (c) 2026 Chirag Patel.
