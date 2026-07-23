# ADR 0003: Focus-visible Contract

- Status: Accepted
- Date: 2026-07-21

## Context

NgNova UI controls used several keyboard-focus treatments: translucent `focus` rings on form
controls, solid `focus-visible` rings on Button and Tabs, and outline-based treatments on compact
actions. The variation made keyboard navigation feel inconsistent, and `focus` styles could appear
after pointer interaction.

## Decision

All interactive controls follow one keyboard-focus contract:

- use `:focus-visible`, not `:focus`, for the focus indicator;
- remove the browser outline only when the replacement ring is present;
- render a two-pixel blue-600 ring with a two-pixel offset in light mode;
- render a blue-400 ring with a slate-950 offset in dark mode;
- use the same geometry for buttons, links, compact actions, native fields, checks, radios, tabs,
  switches, and sortable table headers;
- use an inset two-pixel blue ring for a full-bleed control inside an overflow-clipped container,
  such as an Accordion trigger;
- keep grouped controls overflow-visible and raise the focused control above adjacent controls so
  the standard outer ring remains complete;
- retain state-colored borders for invalid fields, but keep the keyboard focus ring blue so focus
  location is predictable across states;
- disabled controls do not receive keyboard focus or a focus indicator.

The canonical outer-ring utility sequence is:

```text
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400
dark:focus-visible:ring-offset-slate-950
```

## Consequences

- Keyboard focus has consistent geometry and color throughout the library.
- Pointer interaction does not produce a persistent keyboard ring.
- Consumer applications can recognize NgNova UI focus behavior without learning per-component
  exceptions.
- Full-bleed controls remain visible without forcing overflow changes that alter component shape.
