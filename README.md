# Angular Library Workspace

Production-oriented Angular workspace for **NgNova UI**, a small Angular component library published as `@ngnova/ui`, plus a demo app that previews every component.

## Assumptions

- Angular CLI `22.0.1` is the latest stable CLI verified for this setup.
- Tailwind CSS `4.3.0` is used through Angular's official Tailwind integration.
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

- `UiButtonComponent`: variants `primary`, `secondary`, `outline`, `ghost`, `danger`; sizes `sm`, `md`, `lg`; disabled/loading states; `pressed`, `focused`, and `blurred` outputs.
- `UiCardComponent`: header/body/footer content projection, outline/elevated variants, and body padding sizes.
- `UiInputComponent`: label, placeholder, helper text, error text, size, native input attributes, disabled/read-only/required states, focus/blur outputs, and Angular forms support through `ControlValueAccessor`.
- `UiBadgeComponent`: variants `default`, `success`, `warning`, `danger`, `info`; sizes `sm`, `md`; optional ARIA role/label.
- `UiModalComponent`: open/close state, sizes, header/body/footer slots, close button, backdrop close, Escape close, focus restore/trap behavior, and dialog ARIA basics.

## Install In A Consumer App

```bash
npm install @ngnova/ui
ng add tailwindcss
```

In the consumer app stylesheet:

```css
@import 'tailwindcss';
@source "../node_modules/@ngnova/ui";
```

Tailwind v4 ignores `node_modules` by default, so the `@source` line is required for consumers unless you later ship prebuilt CSS.

## Import Example

```ts
import { UiButtonComponent } from '@ngnova/ui';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<ui-button variant="primary">Save</ui-button>`,
})
export class SaveButtonExample {}
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

Open the component documentation pages:

```text
http://127.0.0.1:4200/components/button
http://127.0.0.1:4200/components/card
http://127.0.0.1:4200/components/input
http://127.0.0.1:4200/components/badge
http://127.0.0.1:4200/components/modal
```

Each page includes a live preview, import snippet, usage example, copy button, and API table.

## Scripts

```bash
npm run build:lib     # Production ng-packagr build to dist/ui
npm run build:demo    # Production demo app build
npm run test:lib      # Unit tests for the library
npm run pack:lib      # Build then create a local .tgz package in dist/ui
npm run publish:lib   # Build then publish dist/ui with public scoped access
```

## npm Publishing Checklist

1. Replace the placeholder repository URL in `projects/ui/package.json`.
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
