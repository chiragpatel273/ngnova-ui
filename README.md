# NgNova UI

Production-oriented Angular workspace for **NgNova UI**, a small Angular component library published as `@ngnova/ui`, plus a demo app that previews every component.

## Assumptions

- Angular CLI `22.0.1` was verified during setup.
- Tailwind CSS `4.3.0` was verified during setup through Angular's official Tailwind integration.
- The library is published from `dist/ui`, the ng-packagr package output, not from `projects/ui`.
- `@ngnova/ui` is the intended public package name. Confirm the npm scope is available and that you own it before publishing.

## Official Guidance Followed

- Angular libraries are generated with the Angular CLI and built with `@angular/build:ng-packagr`.
- Public API exports live in `projects/ui/src/public-api.ts`.
- Angular packages used by the library are declared as `peerDependencies`.
- Production library builds are used before publishing.
- The package is partial-Ivy compatible through `projects/ui/tsconfig.lib.prod.json`.
- Scoped public npm packages are published with `npm publish --access public`.
- Tailwind classes are complete static strings so Tailwind can detect them.

See [docs/ANGULAR_22_LIBRARY_STANDARDS.md](docs/ANGULAR_22_LIBRARY_STANDARDS.md) for the project coding standards checklist used for NgNova UI component work.

## Projects

- `projects/ui`: Angular library package source.
- `src/app`: demo/documentation app.

## Components

- `UiButtonComponent`: variants `primary`, `secondary`, `outline`, `ghost`, `danger`; sizes `sm`, `md`, `lg`; disabled/loading states; button groups; `pressed`, `focused`, and `blurred` outputs.
- `UiCardComponent`: header/body/footer content projection, outline/elevated variants, and body padding sizes.
- `UiInputComponent`: label, placeholder, helper/error text, prefix/suffix slots, clear button, character counter, outline/filled appearance, size variants, validation message mapping, native input attributes, disabled/read-only/required states, focus/blur outputs, and Angular forms support through `ControlValueAccessor`.
- `UiBadgeComponent`: variants `default`, `success`, `warning`, `danger`, `info`; sizes `sm`, `md`; optional ARIA role/label.
- `UiModalComponent`: open/close state, sizes, header/body/footer slots, close button, backdrop close, Escape close, focus restore/trap behavior, and dialog ARIA basics.
- `UiCheckboxComponent`: native checkbox with label, helper text, indeterminate/disabled/required states, and Angular forms support.
- `UiSelectComponent`: native select with label, placeholder, helper/error text, size variants, disabled options, and Angular forms support.
- `UiRadioGroupComponent`: native radio group with helper/error text, horizontal/vertical layout, disabled options, and Angular forms support.
- `UiSwitchComponent`: accessible boolean switch with helper text and Angular forms support.
- `UiTextareaComponent`: multi-line text field with helper/error text, character counter, validation message mapping, outline/filled appearance, resize options, and Angular forms support.
- `UiAlertComponent`: semantic feedback alert with `info`, `success`, `warning`, and `danger` variants plus optional dismiss action.
- `UiTabsComponent`: keyboard-friendly tablist with two-way active state and disabled tabs.
- `UiSpinnerComponent`: accessible loading indicator with sizes and decorative mode.

## Why NgNova UI

- **Angular 22 standalone first:** component imports are explicit and work without NgModules.
- **Per-component package paths:** import from paths such as `@ngnova/ui/button`, `@ngnova/ui/input`, and `@ngnova/ui/toast`.
- **Tailwind-native styling:** components use static Tailwind utility classes and support dark mode without a separate theme runtime.
- **Docs as implementation recipes:** each component page pairs a live preview with matching snippets, API tables, accessibility notes, and testing guidance.
- **Testing surface included:** reusable Angular CDK harnesses ship from `@ngnova/ui/testing`.

## Install In A Consumer App

```bash
npm install @ngnova/ui
ng add tailwindcss
```

In the consumer app stylesheet:

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
```

Tailwind v4 ignores `node_modules` by default, so the `@source` line is required for consumers unless you later ship prebuilt CSS.
The `@custom-variant` line makes Tailwind's `dark:` utilities respond to a `.dark` class on the application shell or `html` element.

## Import Example

Use per-component entry points in application code so imports stay explicit and easy to tree-shake:

```ts
import { UiButtonComponent } from '@ngnova/ui/button';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<ui-button variant="primary">Save</ui-button>`,
})
export class SaveButtonExample {}
```

The root `@ngnova/ui` entry point is intentionally minimal. Import components from their
focused package paths, such as `@ngnova/ui/button` or `@ngnova/ui/input`.

## Component Test Harnesses

NgNova UI ships Angular CDK component harnesses from the secondary testing entry point:

```ts
import { UiButtonHarness, UiInputHarness } from '@ngnova/ui/testing';
```

Harnesses are available for:

- `UiButtonHarness`
- `UiInputHarness`
- `UiCheckboxHarness`
- `UiSelectHarness`
- `UiRadioGroupHarness`
- `UiSwitchHarness`
- `UiTextareaHarness`
- `UiModalHarness`
- `UiTabsHarness`

Install Angular CDK in apps that use these harnesses:

```bash
npm install --save-dev @angular/cdk
```

Example:

```ts
const button = await loader.getHarness(UiButtonHarness.with({ text: 'Save' }));
await button.click();

const email = await loader.getHarness(UiInputHarness.with({ label: 'Email' }));
await email.setValue('dev@example.com');
```

## Local Development

```bash
npm install
npm run build:lib
npm start
```

The demo app imports from `@ngnova/ui` through the Angular-generated TypeScript path mapping. Build the library first when testing the package shape.

## Documentation App

Run the docs app:

```bash
npm start
```

Open a component documentation page:

```text
http://localhost:4200/components/button
```

Each component page follows the same pattern with a live preview, import snippet, usage example, copy button, and API table.

## Scripts

```bash
npm run build:lib     # Production ng-packagr build to dist/ui
npm run build:demo    # Production demo app build
npm run test:lib      # Unit tests for the library
npm run pack:lib      # Build then create a local .tgz package in dist/ui
npm run publish:lib   # Build then publish dist/ui with public scoped access
```

## npm Publishing Checklist

1. Confirm the repository URL in `projects/ui/package.json` is correct.
2. Confirm the npm org or user scope `@ngnova` exists and you have publish rights.
3. Run `npm login`.
4. Run `npm run test:lib`.
5. Run `npm run build:lib`.
6. Run `npm run pack:lib` and inspect the `.tgz` contents.
7. Publish the built package output:

```bash
cd dist/ui
npm publish --access public
```

For CI publishing, prefer npm trusted publishing or provenance when available for your host.
