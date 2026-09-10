# Angular compatibility and migration policy

NgNova UI releases align their major version support with an Angular major and publish partial-Ivy
libraries. The machine-readable source for this page is
`docs/compatibility/angular.json`.

## Supported matrix

| Surface                              | Supported contract                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| NgNova UI                            | `1.0.2`                                                                           |
| Angular                              | `>=22.0.2 <23.0.0` for `@angular/core`, `@angular/common`, and `@angular/forms`   |
| Angular CDK                          | `^22.0.0`, optional; required only by CDK-backed entry points                     |
| TypeScript used to build the package | `>=6.0 <6.1`                                                                      |
| Maintainer Node.js toolchain         | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0`                                            |
| Emitted JavaScript                   | ES2022, partial Ivy                                                               |
| Angular runtime peers                | RxJS `^6.5.3 \|\| ^7.4.0`; Zone.js `~0.15.0 \|\| ~0.16.0` when the app uses zones |

The Node and TypeScript rows constrain building and contributing to this repository. They do not
add unnecessary runtime requirements to a browser application consuming the already-built npm
package.

## Major-version policy

- A stable NgNova UI release supports exactly the Angular major declared in its peer dependency.
- A new Angular major is validated in a dedicated compatibility branch before the peer range is
  widened or a matching NgNova UI major is released.
- Angular prereleases are experimental and are not in the supported matrix unless release notes
  explicitly opt in.
- Older Angular majors are not claimed compatible merely because an install happens to compile.
- Angular CDK remains an optional peer. Consumers that import `overlay` or
  `table-virtual-scroll` install the matching CDK major; all other entry points remain CDK-free.

## Angular forms compatibility

NgNova UI supports Angular 22 Signal Forms, Reactive Forms, and template-driven forms for Input,
Textarea, Checkbox, Switch, Radio Group, Select, Combobox, and Date Picker. Signal Forms
compatibility is verified with Angular's `FormField` directive across initial model values,
user-to-model updates, touched state, blur debouncing, validation, disabled state, and constraint
metadata.

The current stable controls retain their `ControlValueAccessor` contracts so existing Reactive
Forms and template-driven consumers are not broken. Angular Signal Forms supports these controls
through its documented CVA interoperability path. NgNova UI does not also implement
`FormValueControl` or `FormCheckboxControl` on the same components because Angular explicitly
discourages combining the native Signal Forms contract with CVA on one control. A future move to
native model-signal controls would therefore be planned as a semver-major migration.

File Upload is modeled as a file-selection and upload-workflow component rather than a scalar
Angular form value control.

## Consumer upgrade sequence

1. Read the NgNova UI release notes and migration guide for the target version.
2. Upgrade Angular and its first-party packages together with `ng update`.
3. If the application uses a CDK-backed NgNova UI entry point, upgrade Angular CDK to the same
   major.
4. Upgrade `@ngnova/ui`.
5. Apply documented selector, input/output, token, import-path, and behavior migrations.
6. Build the browser, SSR/hydration, and zoneless configurations the application supports.
7. Run interaction, accessibility, and visual-regression tests before deployment.

NgNova UI does not currently ship migrations or schematics. Every required migration must
therefore have deterministic manual steps and before/after examples. A release must not claim an
automatic migration that the package does not provide.

## Compatibility evidence

The release gate verifies that:

- published Angular and CDK peer ranges match the compatibility manifest;
- CDK is optional and limited to the documented entry points;
- the package remains partial-Ivy and targets ES2022;
- the repository's installed Angular compiler and Node engine requirements match the published
  matrix;
- a clean Angular 22 consumer can install the packed tarball and build.
- the form-control suite binds to an Angular 22 Signal Forms model and preserves form state.

SSR, hydration, and zoneless execution are separately tested by the consumer matrix rather than
inferred from compilation.
