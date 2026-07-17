# @ngnova/ui

NgNova UI is a small Angular component library built with standalone components and Tailwind CSS utility classes.

## Why NgNova UI

- Angular 22 standalone components with explicit per-component imports.
- Tailwind-native styling with static classes and dark-mode support.
- Production docs with live previews, matching snippets, API tables, accessibility notes, and testing guidance.
- Angular CDK harnesses from `@ngnova/ui/testing`.

## Install

```bash
npm install @ngnova/ui
```

Install and configure Tailwind CSS in the consuming Angular app:

```bash
ng add tailwindcss
```

Tailwind ignores `node_modules` by default. Add the package as an explicit source in the consumer app stylesheet:

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
```

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

## Testing

NgNova UI provides Angular CDK test harnesses from `@ngnova/ui/testing`.

```ts
import { UiButtonHarness, UiInputHarness } from '@ngnova/ui/testing';

const button = await loader.getHarness(UiButtonHarness.with({ text: 'Save' }));
await button.click();

const input = await loader.getHarness(UiInputHarness.with({ label: 'Email' }));
await input.setValue('dev@example.com');
```

Available harnesses:

- `UiButtonHarness`
- `UiInputHarness`
- `UiCheckboxHarness`
- `UiSelectHarness`
- `UiRadioGroupHarness`
- `UiSwitchHarness`
- `UiTextareaHarness`
- `UiModalHarness`
- `UiTabsHarness`

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
