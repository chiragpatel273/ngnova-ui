# ADR 0002: Built-in Icon Contract

- Status: Accepted
- Date: 2026-07-20

## Context

Accordion, Alert, Modal, Tag, and Toast originally rendered disclosure or dismiss actions with text
characters such as `+`, `-`, `x`, and `×`. Their geometry varied with the active font, operating
system, weight, and line-height, so the controls did not remain visually consistent.

NgNova UI secondary entry points are intentionally isolated. Importing one private Angular icon
component across those entry points breaks partial compilation, while requiring an external icon
package would add a runtime peer dependency for fixed internal controls.

## Decision

Built-in component icons use small inline SVGs that follow one contract:

- a `0 0 24 24` view box;
- `currentColor` strokes and no fill;
- a two-unit round stroke with round joins;
- `1rem` geometry for compact dismiss controls and `1.25rem` for standard controls;
- `shrink-0` sizing so surrounding content cannot distort the icon;
- `aria-hidden="true"` and `focusable="false"` because the enclosing button supplies the accessible
  name;
- no emoji, font glyph, icon font, or platform-dependent symbol for built-in actions.

The SVG path is repeated inside isolated secondary bundles deliberately. Tests assert the shared
geometry and accessibility contract to prevent drift.

Consumer-provided icons remain separate. Button marker directives normalize projected icon content,
and Tag's `icon` input continues to render consumer-owned decorative content.

## Consequences

- Built-in icons remain crisp and stable across fonts and platforms.
- Consumers do not install an icon dependency to use Accordion, Alert, Modal, Tag, or Toast.
- Each secondary entry point stays independently compilable and tree-shakable.
- New built-in action icons must follow this ADR and include behavior plus SVG-contract coverage.
