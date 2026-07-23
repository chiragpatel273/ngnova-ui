# Migrating to NgNova UI 1.0

This guide applies to applications using pre-1.0 NgNova UI snapshots. The final `0.1.0` candidate
becomes the stable 1.0 contract; no stable-version compatibility promise existed before this
freeze.

## 1. Align Angular

NgNova UI 1.0 targets Angular 22.

```powershell
ng update @angular/core@22 @angular/cli@22
npm install @ngnova/ui@1
```

Install `@angular/cdk@^22.0.0` only when using CDK-backed entry points such as `overlay` or
`table-virtual-scroll`.

## 2. Replace root component imports

The root package is intentionally minimal.

```ts
// Before
import { UiButtonComponent, UiInputComponent } from '@ngnova/ui';

// After
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiInputComponent } from '@ngnova/ui/input';
```

Import harnesses from `@ngnova/ui/testing` and the opt-in theme from
`@ngnova/ui/styles/theme.css`.

## 3. Rename event outputs

Replace outputs that collided with native DOM events or used legacy prefixes.

| Pre-1.0 pattern                      | 1.0 contract                 |
| ------------------------------------ | ---------------------------- |
| Button `(click)` wrapper output      | `(pressed)`                  |
| Control `(focus)` / `(blur)` outputs | `(focused)` / `(blurred)`    |
| Input-like custom change output      | `(valueChange)`              |
| Controlled visibility mutation       | `[open]` with `(openChange)` |

Native events remain available on native elements and directives where appropriate. Do not
interpret `pressed` as a replacement for form submission; set `type="submit"` for submit actions.

## 4. Migrate Button visuals and icons

Legacy `variant` values remain available for the 1.0 transition, but new code should separate
meaning from visual weight:

```html
<ui-button intent="danger" appearance="outline">Delete</ui-button>
```

Use `uiButtonIconStart` and `uiButtonIconEnd` on projected SVG/icon components. Icon-only buttons
require `iconOnly` and an `ariaLabel`.

```html
<ui-button iconOnly ariaLabel="Create item">
  <ng-icon uiButtonIconStart name="heroPlus" />
</ui-button>
```

Do not add manual negative margins or fixed SVG offsets; Button owns size-specific icon gaps and
geometry.

## 5. Adopt semantic theme tokens

Import the theme once in the application stylesheet:

```css
@import 'tailwindcss';
@import '@ngnova/ui/styles/theme.css';
@source "../node_modules/@ngnova/ui";
```

Replace private colors, radii, shadows, and focus values with public `--ui-*` tokens. Follow
`docs/THEME_MIGRATION.md` for compatibility aliases and mode behavior. Token removals or semantic
changes are breaking API after 1.0.

## 6. Treat inputs as immutable

Components no longer mutate arrays or objects supplied by a parent. Update controlled values from
their emitted change:

```html
<ui-tree [selected]="selected()" (selectedChange)="selected.set($event)" />
```

Apply the same pattern to selection, expansion, sorting, pagination, files, and open state.

## 7. Verify forms, focus, and overlays

- Use typed reactive forms where a component implements ControlValueAccessor.
- Verify label, helper, error, required, disabled, and readonly behavior.
- Remove app-level focus CSS that suppresses NgNova's `:focus-visible` ring.
- For Modal, Drawer, Command Palette, Confirmation, Menu, Popover, and Overlay, verify initial
  focus, Escape policy, backdrop policy, and focus restoration.
- Add accessible names to icon-only actions and unlabeled regions.

## 8. Update tests

Prefer supported harnesses from `@ngnova/ui/testing` over internal class or DOM structure
selectors. Assert roles, names, state, and emitted contracts. Update visual baselines only after
reviewing the corresponding design change.

## 9. Run the migration finish line

```powershell
npm.cmd run test:lib
npm.cmd run test:demo
npm.cmd run build:lib
npm.cmd run build:demo
npm.cmd pack --dry-run
```

Also build every browser, SSR/hydration, and zoneless configuration your application deploys.
