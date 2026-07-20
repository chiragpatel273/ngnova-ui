# 0001: Focus And Blur Event Contract

- Status: Accepted
- Date: 2026-07-20
- Scope: Button and form-control components with an inner native focus target

## Context

NgNova components such as Button, Input, Textarea, Checkbox, Radio, Select, and Switch wrap a native
focus target. Native `focus` and `blur` events do not bubble from that inner element to the Angular
component host in the same way as ordinary bubbling events.

The existing components solve this in two ways:

- they expose Angular outputs named `focused` and `blurred`;
- they dispatch native `FocusEvent` instances named `focus` and `blur` from the component host.

Some documentation tables incorrectly listed `focus` and `blur` as Angular outputs. This made the
public binding surface ambiguous and caused the documentation to disagree with the implementation.

## Decision

1. Existing `focused` and `blurred` Angular outputs remain supported, semver-sensitive public API.
2. Components that wrap an inner native focus target forward native host `focus` and `blur` events.
3. Angular outputs must not be aliased to `focus` or `blur`.
4. API tables list `focused` and `blurred` under Outputs.
5. Component-specific accessibility or events guidance documents the forwarded native host events
   separately from Angular outputs.
6. New components preserve native host semantics first. They add semantic Angular focus outputs only
   when consistency with an existing component family or a real component-level use case requires
   them.
7. Any future removal or consolidation of `focused` and `blurred` requires a documented deprecation
   period and a major release.

The supported Angular binding form is:

```html
<ui-input (focused)="onFocused($event)" (blurred)="onBlurred($event)" />
```

The supported native host event form is:

```html
<ui-input (focus)="onFocus($event)" (blur)="onBlur($event)" />
```

The second form works because NgNova forwards native host events; `focus` and `blur` are not Angular
outputs declared by the component.

## Consequences

- Existing consumers do not receive a breaking API change.
- Angular output documentation can be checked mechanically against component declarations.
- Consumers can use DOM-friendly focus handling without NgNova declaring outputs that collide with
  native event names.
- Each wrapper component must test both the semantic Angular outputs and native host event
  forwarding.
- Documentation must clearly distinguish component outputs from native host events.
