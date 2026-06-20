# NgNova UI Angular 22 Library Standards

Use this checklist whenever adding, reviewing, or refactoring NgNova UI components.

## Official References

- Angular style guide: https://angular.dev/style-guide
- Angular signals: https://angular.dev/guide/signals
- Angular inputs: https://angular.dev/guide/components/inputs
- Angular custom outputs: https://angular.dev/guide/components/outputs
- Angular host elements: https://angular.dev/guide/components/host-elements
- Angular library packaging: https://angular.dev/tools/libraries/creating-libraries
- Angular Tailwind setup: https://angular.dev/guide/tailwind
- Google TypeScript style guide: https://google.github.io/styleguide/tsguide.html
- TypeScript strict mode: https://www.typescriptlang.org/tsconfig/strict.html

## Angular 22 Component Standards

- Use standalone components.
- Use `ChangeDetectionStrategy.OnPush` for library components.
- Use signals for internal reactive state when they reduce manual state tracking.
- Prefer `computed()` for derived component state and derived class strings.
- Prefer `inject()` over constructor parameter injection.
- Prefer Angular's `output()` API for new outputs.
- Mark `output()` fields and query fields as `readonly`.
- Keep public component APIs intentional. Mark template-only helpers as `protected`.
- Do not mutate parent-owned `@Input()` state. Emit changes and let the consumer update state.
- Use Angular control flow syntax such as `@if`, `@for`, and `@switch`.
- Keep templates simple. Move non-trivial logic into typed class members.
- Keep one primary component concept per file.
- Prefer the `host` property for host bindings and listeners. Avoid `@HostBinding` and `@HostListener` in new code.
- Implement lifecycle interfaces when using lifecycle hooks.
- Keep lifecycle hooks simple and delegate real work to named methods.

## Signals Standards

- Use `signal()` for component-owned local state, such as open state in an uncontrolled helper, selected item, active index, copied state, or transient UI state.
- Use `computed()` for derived values such as class strings, IDs, display labels, and filtered option lists.
- Keep writable signals private when they represent internal state. Expose read-only signals with `asReadonly()` if consumers need to observe them.
- Read signals in `OnPush` templates normally; Angular tracks those reads and marks the component for update.
- Do not use `effect()` for ordinary derived values. Use `computed()` instead.
- Use `effect()` only for side effects that touch non-reactive APIs, such as logging, storage, focus coordination, or third-party APIs.
- Avoid async work inside signal derivations. Read signals before `await` when using async code.
- Do not deep-mutate objects or arrays stored in signals. Replace with a new object or array using `set()` or `update()`.
- Do not force signal-only APIs on consumers. Public inputs should remain normal Angular inputs unless signal inputs clearly improve the component API.
- If using signal inputs in the future, keep public naming consistent with the existing component API and document the Angular version requirement.
- In docs/demo components, signals are encouraged for local UI state such as `modalOpen`, `copied`, and active examples.

## TypeScript Standards

- Keep TypeScript strictness enabled and fix strictness errors at the source.
- Avoid `any`. Use `unknown` when a value is genuinely unknown, then narrow it.
- Prefer named exports. Do not use default exports for library code.
- Use `import type` / `export type` for type-only imports and re-exports when appropriate.
- Export only intentional public API from `projects/ui/src/public-api.ts`.
- Do not export internal implementation helpers unless they are part of the supported API.
- Use string literal union types for component variants, sizes, and modes.
- Avoid `enum` for simple public component options; prefer literal unions.
- Use `Record<Union, string>` for variant and size class maps so missing cases are compile-time errors.
- Prefer explicit return types for exported functions and public/protected methods that are part of the component contract.
- Use `readonly` for constants, output fields, query fields, injected dependencies, and config objects that should not be reassigned.
- Avoid mutable exports such as `export let`.
- Avoid broad index signatures such as `{ [key: string]: any }`.
- Keep generic types meaningful and constrained.
- Avoid type assertions unless there is no safer option. Prefer narrowing and typed helpers.
- Use `as const` for fixed token maps and config objects when it improves literal type inference.
- Keep helper functions small, pure, and easy to test.
- Treat public exported types as semver-sensitive npm API.

## Input And Output Naming

- Do not prefix outputs with `ui`.
- Prefer HTML-friendly host DOM events such as `click`, `focus`, and `blur` when the component intentionally forwards an inner native control event.
- Do not alias Angular outputs to native DOM event names. Forward native events on the host instead, and keep semantic output fields only when needed for backward compatibility.
- Do not prefix inputs with `ui`.
- Do not choose input names that collide with native HTMLElement properties unless the behavior intentionally mirrors the native property.
- Use input aliases rarely. Prefer stable, clear public names from the start.
- Use required inputs only when a component cannot function without that value.
- Prefer signal-based `input()` for new components when it improves local reactivity and derived state.
- Decorator-based `@Input()` remains acceptable when it keeps the public API simpler or aligns with existing component patterns.
- Use event names that describe component meaning, or HTML-friendly aliases when mirroring native control events:
  - Button: `click`, `focus`, `blur`
  - Input and form controls: `valueChange`, `focus`, `blur`
  - Modal: `openChange`, `opened`, `closed`, `backdropClick`, `escapeKeyDown`
- Use camelCase output names.
- Use boolean transforms for boolean inputs: `@Input({ transform: booleanAttribute })`.
- Use number transforms for numeric inputs where appropriate: `@Input({ transform: numberAttribute })`.

## Styling Standards

- Use Tailwind CSS utility classes.
- Prefer static, complete class strings so Tailwind can detect classes.
- Prefer `[class]` and class bindings over `NgClass`.
- Avoid `::ng-deep`.
- Support dark mode with `dark:` classes.
- Keep shared class composition small and typed.
- Avoid shipping source-only Angular code. Publish ng-packagr output from `dist/ui`.

## Accessibility Standards

- Components must be keyboard-friendly.
- Preserve native semantics whenever possible.
- Provide ARIA inputs only where needed, such as `ariaLabel`, `ariaRole`, `descriptionId`, and `titleId`.
- Button loading state should expose screen-reader text.
- Inputs should wire labels, helper/error text, `aria-invalid`, and `aria-describedby`.
- Modal/dialog must include `role="dialog"`, `aria-modal="true"`, labeling, Escape close, focus management, and focus restore.

## DOM, SSR, And Browser API Standards

- Avoid direct `window`, `document`, `localStorage`, and browser-only globals in library components.
- Prefer Angular `DOCUMENT` injection for document access.
- Guard browser-only behavior so Angular SSR/hydration consumers do not crash.
- Keep direct DOM work focused and minimal. Prefer Angular templates, bindings, and queries first.
- Do not perform DOM reads/writes in constructors.
- Prefer host bindings through the `host` component metadata when binding host attributes, classes, styles, or host events.

## Forms And ControlValueAccessor Standards

- Components that integrate with Angular forms should implement `ControlValueAccessor`.
- Implement `writeValue`, `registerOnChange`, `registerOnTouched`, and `setDisabledState`.
- Do not emit value-change outputs or call registered change callbacks from `writeValue`.
- Call the registered touched callback on blur or equivalent user interaction.
- Keep disabled state synced between the CVA API and the native control.
- Support native form attributes where useful, such as `name`, `required`, `readonly`, `autocomplete`, `minlength`, and `maxlength`.
- Preserve ARIA wiring for helper text, error text, and invalid state.

## Library Packaging Standards

- Build with Angular CLI library workflow and ng-packagr.
- Keep `@angular/core`, `@angular/common`, and `@angular/forms` in `peerDependencies` when used by library code.
- Keep `sideEffects: false` unless adding global styles or side-effectful entry points.
- Export public components from `projects/ui/src/public-api.ts`.
- Build before publishing with `npm run build:lib`.
- Publish from `dist/ui`, not `projects/ui`.
- Verify package contents with `npm pack --dry-run` from `dist/ui`.

## Tailwind Consumer Setup

Consumers must configure Tailwind and include NgNova UI as a source when using Tailwind v4:

```css
@import 'tailwindcss';
@source "../node_modules/@ngnova/ui";
```

If NgNova UI later ships prebuilt CSS, document the CSS import clearly and reassess `sideEffects`.

## Documentation Standards

- Every public component needs a docs page with live preview, install/import usage, API table, and accessibility notes.
- Docs examples must match the current public API exactly.
- The docs app should import from `@ngnova/ui`, not from internal library source paths.
- README usage examples must be updated in the same change as public API changes.
- Document Tailwind consumer setup for any component that relies on Tailwind-detected classes.

## Testing Standards

- Test public inputs, outputs, and important class/state combinations.
- Test accessibility attributes and keyboard behavior.
- Test disabled and loading states.
- Test `ControlValueAccessor` behavior for form controls.
- Test modal/dialog close paths, focus behavior, and generated IDs.
- Provide Angular CDK component harnesses for reusable interactive components.
- Publish harnesses from the `@ngnova/ui/testing` secondary entry point, not from the main runtime entry point.
- Keep harness APIs user-focused, such as `click`, `setValue`, `isDisabled`, `selectTab`, and `isOpen`.
- Do not expose internal DOM nodes from harnesses unless the element is consumer-provided content.
- Prefer behavior assertions over brittle DOM structure assertions.
- Keep tests next to the component under test with `.spec.ts` suffix.

## Versioning And Release Standards

- Use semantic versioning for `@ngnova/ui`.
- Use Changesets for public package changes.
- Treat public component inputs, outputs, selectors, exported types, and CSS entry points as semver-sensitive API.
- Update README/docs and release notes for every public API change.
- Verify npm scope/package availability before first publish.
- Run `npm pack --dry-run` from `dist/ui` before publishing.
- Publish with `npm publish --access public` from `dist/ui`.

## Automation Standards

- Keep ESLint enabled for both the demo app and library.
- Keep Prettier format checks enabled.
- CI must run install, format check, lint, library tests, library build, docs app build, and package dry-run.
- Do not merge changes that fail CI.

## Required Verification

Run these before considering component work complete:

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:demo
npm.cmd pack --dry-run
```

If `npm pack --dry-run` hits the Windows npm cache permission issue in this managed environment, rerun it with approved elevated access.
