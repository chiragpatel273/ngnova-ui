# @ngnova/ui

NgNova UI 1.0.0 is an Angular 22 component library built with standalone components, focused
entry points, accessible interaction contracts, and Tailwind CSS theming.

## Why NgNova UI

- Angular 22 standalone components with explicit per-component imports.
- Tailwind-native styling with static classes and dark-mode support.
- Production docs with live previews, matching snippets, API tables, accessibility notes, and testing guidance.
- Angular CDK harnesses from `@ngnova/ui/testing`.

## Install

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

The `@ngnova/ui/styles/theme.css` import is optional but recommended. It provides NgNova UI's
supported design tokens and customization contract.

## Usage

Use per-component entry points in application code:

```ts
import { UiButtonComponent, UiButtonGroupComponent } from '@ngnova/ui/button';

@Component({
  standalone: true,
  imports: [UiButtonComponent, UiButtonGroupComponent],
  template: `<ui-button variant="primary">Save</ui-button>`,
})
export class ExampleComponent {}
```

The root `@ngnova/ui` entry point is intentionally minimal. Import components from their focused package paths, such as `@ngnova/ui/button` or `@ngnova/ui/input`.

Button icons are library-agnostic. Mark an icon-only glyph with `uiButtonIcon`, set
`iconOnly`, and choose `size="sm"`, `"md"`, or `"lg"`; use `uiButtonIconStart` and
`uiButtonIconEnd` for icons beside visible labels.

## Testing

NgNova UI provides Angular CDK test harnesses from `@ngnova/ui/testing`.

```ts
import { UiButtonHarness, UiInputHarness } from '@ngnova/ui/testing';

const button = await loader.getHarness(UiButtonHarness.with({ text: 'Save' }));
await button.click();

const input = await loader.getHarness(UiInputHarness.with({ label: 'Email' }));
await input.setValue('dev@example.com');
```

The testing entry point covers 32 interactive component surfaces across actions, forms, overlays,
navigation, feedback, and data workflows. Import harnesses by name from `@ngnova/ui/testing`; the
generated testing declarations and API documentation are the source of truth for the complete
current export list.

## Components

```html
<ui-button variant="danger" size="lg" [loading]="saving" loadingLabel="Deleting item">
  Delete
</ui-button>

<ui-button-group ariaLabel="View density">
  <ui-button variant="outline">Compact</ui-button>
  <ui-button variant="outline">Comfortable</ui-button>
</ui-button-group>

<ui-card variant="elevated" padding="lg">
  <div uiCardHeader>Settings</div>
  Card body
  <div uiCardFooter>Footer actions</div>
</ui-card>

<ui-tabs variant="underline" [tabs]="tabs" [(active)]="activeTab"> Current panel content </ui-tabs>

<ui-input
  label="Email"
  type="email"
  autocomplete="email"
  helperText="Use your work email"
  required
  [formControl]="email"
  [validationMessages]="{ required: 'Email is required.', email: 'Use a valid email address.' }"
>
  <span uiInputPrefix>@</span>
</ui-input>

<ui-input label="Username" maxLength="24" clearable [formControl]="username">
  <span uiInputPrefix>user/</span>
  <ui-badge uiInputSuffix variant="info" size="sm">public</ui-badge>
</ui-input>

<ui-badge variant="success" ariaRole="status">Active</ui-badge>

<ui-modal [(open)]="open" size="lg" descriptionId="confirm-description">
  <span uiModalHeader>Confirm</span>
  <p id="confirm-description">Modal body</p>
  <button uiModalFooter type="button">Confirm</button>
</ui-modal>

<ui-checkbox label="Email updates" [formControl]="newsletter" />

<ui-select label="Plan" [options]="planOptions" [formControl]="plan" />

<ui-radio-group label="Contact preference" [options]="contactOptions" [formControl]="contact" />

<ui-switch label="Release notifications" [formControl]="notifications" />

<ui-textarea label="Release notes" maxLength="240" [formControl]="releaseNotes" />

<ui-alert variant="success" title="Saved" dismissible> Your changes are ready. </ui-alert>

<ui-tabs [tabs]="tabs" [(active)]="activeTab"> Current tab content </ui-tabs>

<ui-spinner label="Loading components" />
```

## Publishing

Build and publish the generated Angular package output, not the library source:

```bash
npm run build:lib
cd dist/ui
npm publish --access public
```

## Contributing

Read the [public contribution guide](https://chiragpatel273.github.io/ngnova-ui/#/contributing) for
the fork-to-pull-request workflow, engineering expectations, release checks, security reporting,
and contribution-license terms.

## License

NgNova UI is available under the [MIT License](LICENSE).

Copyright (c) 2026 Chirag Patel.
