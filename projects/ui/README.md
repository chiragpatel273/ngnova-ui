# @ngnova/ui

NgNova UI is a small Angular component library built with standalone components and Tailwind CSS utility classes.

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
@source "../node_modules/@ngnova/ui";
```

## Usage

```ts
import { UiButtonComponent } from '@ngnova/ui';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<ui-button variant="primary">Save</ui-button>`,
})
export class ExampleComponent {}
```

## Components

```html
<ui-button variant="danger" size="lg" [loading]="saving" loadingLabel="Deleting item">
  Delete
</ui-button>

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
/>

<ui-badge variant="success" ariaRole="status">Active</ui-badge>

<ui-modal [(open)]="open" size="lg" descriptionId="confirm-description">
  <span uiModalHeader>Confirm</span>
  <p id="confirm-description">Modal body</p>
  <button uiModalFooter type="button">Confirm</button>
</ui-modal>
```

## Publishing

Build and publish the generated Angular package output, not the library source:

```bash
npm run build:lib
cd dist/ui
npm publish --access public
```
