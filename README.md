# NgNova UI

Production-oriented Angular workspace for **NgNova UI**, a small Angular component library published as `@ngnova/ui`, plus a demo app that previews every component.

## Assumptions

- Angular CLI `22.0.1` was verified during setup.
- Tailwind CSS `4.3.0` was verified during setup through Angular's official Tailwind integration.
- The library is published from `dist/ui`, the ng-packagr package output, not from `projects/ui`.
- `@ngnova/ui` is the intended public package name. Confirm the npm scope is available and that you own it before publishing.

## Official Guidance Followed

- Angular libraries are generated with the Angular CLI and built with `@angular/build:ng-packagr`.
- Public component exports live in focused `projects/ui/<component>/public-api.ts` entry points;
  `projects/ui/src/public-api.ts` holds only the minimal package-root contract.
- Angular packages used by the library are declared as `peerDependencies`.
- Production library builds are used before publishing.
- The package is partial-Ivy compatible through `projects/ui/tsconfig.lib.prod.json`.
- Scoped public npm packages are published with `npm publish --access public`.
- Tailwind classes are complete static strings so Tailwind can detect them.

See [docs/ANGULAR_22_LIBRARY_STANDARDS.md](docs/ANGULAR_22_LIBRARY_STANDARDS.md) for the project coding standards checklist used for NgNova UI component work.

See [docs/NGNOVA_PRODUCT_ROADMAP.md](docs/NGNOVA_PRODUCT_ROADMAP.md) for the product position,
release phases, measurable quality gates, and prioritized execution backlog.

## Project Policies

- [Contributing](CONTRIBUTING.md)
- [Support](SUPPORT.md)
- [Security](SECURITY.md)
- [Versioning and deprecation](docs/VERSIONING_AND_DEPRECATION.md)
- [Code of conduct](CODE_OF_CONDUCT.md)

## Projects

- `projects/ui`: Angular library package source.
- `src/app`: demo/documentation app.

## Components

- `UiButtonComponent`: variants `primary`, `secondary`, `outline`, `ghost`, `danger`; compact `sm`, `md`, `lg` sizes; `intent`/`appearance` visual API; dedicated icon-only geometry and icon markers; disabled/loading states; `pressed`, `focused`, and `blurred` outputs.
- `UiCardComponent`: header/body/footer content projection, outline/elevated variants, and body padding sizes.
- `UiFormFieldComponent`: composable label, helper/error messaging, prefix/suffix slots, sizing, appearance, and ARIA wiring for projected native or custom controls.
- `UiComboboxComponent`: filterable or server-driven suggestions with active-descendant keyboard navigation, Angular Forms, loading/empty states, and localization.
- `UiDatePickerComponent`: localized calendar-grid date selection with ISO Angular Forms values, min/max and disabled dates, clearing, and full keyboard navigation.
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
- `UiTooltipDirective`: delayed hover/focus descriptions, Escape dismissal, collision-aware body overlay, and preserved ARIA relationships.
- `UiPopoverComponent`: collision-aware interactive floating panel with controlled state, outside/Escape dismissal, focus restoration, and native top-layer enhancement.
- `UiDrawerComponent`: accessible modal panel for side-sheet and bottom-sheet workflows with focus trapping, scroll lock, dismissal policy, and four edge positions.
- `UiMenuComponent`: accessible dropdown actions with roving focus, typeahead, links, disabled items, separators, and destructive styling.
- `UiDividerComponent`: semantic horizontal and vertical separators with labelled and decorative modes plus consistent insets.
- `UiChipComponent`: compact selectable and removable values with controlled state, semantic variants, sizes, and disabled behavior.
- `UiBreadcrumbComponent`: semantic hierarchy navigation with current-page state, link selection events, and compact middle collapsing.
- `UiStepperComponent`: controlled horizontal or vertical workflow progress with complete, current, error, optional, and disabled states.
- `UiPaginatorComponent`: localized controlled collection navigation with page-size selection and compact ellipsis ranges.
- `UiTableComponent`: responsive semantic data grids with typed templates, controlled sorting and
  selection, sticky regions, compact pagination, and loading/error/empty state orchestration.
- `UiTableStateController`: independently importable headless sorting, immutable key selection, and pagination state from `@ngnova/ui/table-state`.
- `UiTableVirtualScrollComponent`: optional Angular CDK fixed-size virtualization for large datasets,
  typed row templates, stable tracking, and bounded DOM rendering from
  `@ngnova/ui/table-virtual-scroll`.
- `UiDataViewComponent`: typed responsive grid/list catalogs with controlled layout switching,
  stable identity, and complete loading/error/empty state handling.
- `UiTreeComponent`: accessible controlled hierarchy navigation with roving focus, complete arrow-key
  behavior, typeahead, stable expansion, and single selection.
- `UiTreeTableComponent`: controlled hierarchical treegrid with expandable rows, sortable columns,
  row selection, complete async states, and row keyboard navigation.
- `UiFileUploadComponent`: accessible controlled selection/drop zone with client-side validation,
  progress presentation, immutable file changes, and explicit consumer-owned upload requests.
- `UiCommandPaletteComponent`: controlled searchable command dialog with grouped results, global
  Ctrl/Cmd+K invocation, complete keyboard navigation, focus management, and typed selection events.
- `UiOverlayComponent`: optional Angular CDK connected-overlay primitive with fallback placement,
  scroll strategies, dismissal policy, focus entry/restore, backdrop, and lifecycle events.
- `UiConfirmationDialogComponent` and `UiConfirmationService`: queued Promise-based confirmation
  workflows with typed results, safe focus, exact-text guards, dismissal policy, and localization.

## Why NgNova UI

- **Angular 22 standalone first:** component imports are explicit and work without NgModules.
- **Per-component package paths:** import from paths such as `@ngnova/ui/button`, `@ngnova/ui/input`, and `@ngnova/ui/toast`.
- **Tailwind-native styling:** components use static Tailwind utility classes, with an optional versioned CSS-token stylesheet and no theme runtime.
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
@import '@ngnova/ui/styles/theme.css';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
```

Tailwind v4 ignores `node_modules` by default, so the `@source` line is required for consumers unless you later ship prebuilt CSS.
The `@custom-variant` line makes Tailwind's `dark:` utilities respond to a `.dark` class on the application shell or `html` element.
The optional theme stylesheet publishes stable `--ui-*` foundation, semantic, and component token layers. Override semantic tokens after the import to brand an application without a JavaScript provider.

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

The root `@ngnova/ui` entry point is intentionally minimal. Public components are exported from
their focused public entry points such as `@ngnova/ui/button` or `@ngnova/ui/input`. This prevents
optional Angular CDK integrations from entering unrelated dependency graphs.

## Component Test Harnesses

NgNova UI ships Angular CDK component harnesses from the secondary testing entry point:

```ts
import { UiButtonHarness, UiInputHarness } from '@ngnova/ui/testing';
```

Harnesses are available for:

- `UiAccordionHarness`
- `UiAlertHarness`
- `UiButtonHarness`
- `UiFormFieldHarness`
- `UiFileUploadHarness`
- `UiComboboxHarness`
- `UiDatePickerHarness`
- `UiDataViewHarness`
- `UiInputHarness`
- `UiCheckboxHarness`
- `UiSelectHarness`
- `UiRadioGroupHarness`
- `UiSwitchHarness`
- `UiTextareaHarness`
- `UiModalHarness`
- `UiPopoverHarness`
- `UiDrawerHarness`
- `UiMenuHarness`
- `UiChipHarness`
- `UiBreadcrumbHarness`
- `UiStepperHarness`
- `UiPaginatorHarness`
- `UiTableHarness`
- `UiTabsHarness`
- `UiTagHarness`
- `UiToastHarness`
- `UiTooltipHarness`
- `UiTreeHarness`
- `UiTreeTableHarness`

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

The documentation always shows the latest release at
[`/ngnova-ui/`](https://chiragpatel273.github.io/ngnova-ui/), with component routes such as the
[Button documentation](https://chiragpatel273.github.io/ngnova-ui/#/components/button).
See [the hosting contract](docs/HOSTED_DOCUMENTATION.md) for build and deployment details.

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

## License

NgNova UI is available under the [MIT License](LICENSE).

Copyright (c) 2026 Chirag Patel.
