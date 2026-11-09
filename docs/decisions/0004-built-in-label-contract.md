# ADR 0004: Built-in Label Contract

- Status: Accepted
- Date: 2026-11-09

## Context

Components ship English accessible names, status messages, and button text such as "Close dialog",
"Next page", "Clear date", and "No records found.". Most can be replaced per instance through inputs,
but an application translating its UI had to repeat those inputs on every instance. A few strings
could not be replaced at all: Stepper's "Optional" marker and step announcement, Table's pagination
summary and page status, Spinner's empty-label fallback, Combobox's listbox fallback name, File
Upload's size units, and the Input and Textarea fallback validation message.

Secondary entry points are intentionally isolated (see ADR 0002): a shared `@ngnova/ui/i18n` entry
point imported by every component would couple their compilation and dependency graphs.

## Decision

Every component with built-in text owns a labels contract inside its own entry point:

```ts
export interface UiModalLabels {
  readonly close: string;
}
export const UI_MODAL_LABELS: InjectionToken<UiModalLabels>;
export function provideUiModalLabels(labels: Partial<UiModalLabels>): Provider;
```

- The token is `providedIn: 'root'` and defaults to the English labels, so nothing changes for
  applications that do not provide it.
- `provideUi<Name>Labels()` merges a partial override over the nearest parent value, so it can be
  used in `bootstrapApplication`, a route, or a component `providers` array, and nested overrides
  compose.
- Existing text inputs keep their names and now default to the provided label. An explicit input on
  an instance still wins.
- Text that combines words with values (ranges, counts, step positions, file sizes) is a label
  function, so translations control word order and pluralization.
- Labels are read once when the component is created; switching language at runtime means
  re-creating the component or binding the inputs.

## Consequences

- Applications translate built-in text once per component type, with type-checked keys.
- Every previously fixed English string is now replaceable.
- Entry points remain independently compilable; each adds one interface, one token, and one provider
  function to its public API.
- New components with built-in text must add a labels contract and a test that a provided label
  replaces the default.
