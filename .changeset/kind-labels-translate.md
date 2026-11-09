---
'@ngnova/ui': minor
---

Add translatable built-in labels. Twenty-six components with built-in text (accessible names,
status messages, and button text) now export a typed labels provider from their own entry point,
for example `provideUiModalLabels({ close: 'Fermer' })`, plus a matching `UI_<NAME>_LABELS` token
and `Ui<Name>Labels` interface. Providers merge partial overrides and can be scoped to routes or
components; explicit inputs still win. Formerly fixed English text in Stepper, Table, Spinner,
Combobox, File Upload, Input, and Textarea is now replaceable, with label functions for ranges,
counts, step positions, and file sizes. English output is unchanged when no provider is used.
