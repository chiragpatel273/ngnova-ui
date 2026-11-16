# ADR 0005: Right-to-Left Direction Contract

- Status: Accepted
- Date: 2026-11-16

## Context

Components positioned and spaced content with physical Tailwind utilities (`ml-*`, `pr-*`, `left-*`,
`text-left`, `border-l`, `rounded-r-*`) and physical style bindings (`padding-left`). Under
`dir="rtl"` labels, icons, sticky columns, connectors, switch thumbs, and popups stayed on the wrong
side. Horizontal arrow keys in Tabs, Tree, Tree Table, and Date Picker always moved in the
left-to-right direction, which contradicts the WAI-ARIA Authoring Practices for right-to-left
layouts. Table's `sticky: 'start' | 'end'` and Menu's `align: 'start' | 'end'` already used logical
names but were implemented physically.

Angular CDK's `Directionality` is the usual source of direction in Angular, but `@angular/cdk` is an
optional peer dependency used only by the overlay, virtual-scroll, and testing entry points
(ADR 0002), and `Directionality` only reflects the document root, not a `dir` attribute on a
container.

## Decision

- Library components lay out with logical utilities: `ms-*`/`me-*`, `ps-*`/`pe-*`,
  `start-*`/`end-*`, `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s-*`/`rounded-e-*`,
  and `padding-inline-start`. Transforms that cannot be logical (`translate-x`, transform origin,
  directional chevrons) add an explicit `rtl:` override.
- Keyboard handlers resolve direction from the event target: its computed `direction`, falling back
  to the nearest `dir` attribute. ArrowLeft and ArrowRight swap meaning when the target is
  right-to-left. No provider, CDK dependency, or shared entry point is required, and a single
  right-to-left region inside a left-to-right page works.
- Options that place content on an inline edge offer logical values next to the existing physical
  ones: Drawer `position: 'start' | 'end'`, Toast `position: 'top-end' | 'bottom-end'`, and Table and
  Tree Table column `align: 'start' | 'end'`. Physical values keep their meaning and remain the
  defaults where they already were, so existing layouts do not move.
- Column alignment defaults to `start`, which renders identically to the previous `left` default in
  left-to-right layouts.
- `npm run check:direction-contract` fails the release gate when a component source introduces a
  physical utility or style binding outside a short, documented allowlist (the physical option
  values above and safe-area insets).

## Consequences

- Applications get mirrored layouts and keyboard behavior by setting `dir="rtl"`, on `<html>` or on
  any container.
- Left-to-right rendering is unchanged.
- New components must use logical utilities; the release gate enforces it.
- Tooltip and Popover `position` stay physical (`left`/`right`), matching their explicit placement
  semantics.
