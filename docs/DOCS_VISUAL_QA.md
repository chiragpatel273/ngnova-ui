# NgNova UI Docs Visual QA

Use this checklist before calling a documentation design task complete. The goal is a premium, scannable component-library experience that holds up against PrimeNG, Angular Material, NG-ZORRO, and modern design-system docs.

## Reference Routes

Check these first because they exercise the main docs patterns:

- `/#/components/button` - primary reference page for hero, live preview, usage, guidance, examples, API tables, and section navigation.
- `/#/components/input` - form field layout, helper/error states, and CVA examples.
- `/#/components/modal` - overlay workflow and interaction notes.
- `/#/components/table` - dense API/data surface and horizontal overflow behavior.
- `/#/components/toast` - service-driven feedback and viewport behavior.
- `/#/components/not-found` or an invalid component slug - empty/not-found state.

## Desktop QA

- First viewport shows useful component information, navigation, and live preview without excessive blank space.
- Docs sidebar remains readable, scrollable, and visually quieter than the main content.
- Component hero metadata is compact: selector, category, import, inputs, outputs, maturity, and quality checklist should not feel like separate competing cards.
- Sticky section navigation stays aligned with the content column and does not cover headings or controls.
- Live preview looks like a real product scenario, not a raw variant dump.
- Usage and example code blocks show filename/language metadata and are readable at normal zoom.
- API tables are dense but legible, with type/default values easy to scan.
- Section rhythm is consistent: preview, usage, guidance, examples, API, accessibility, and testing should feel related, not like unrelated cards.

## Tablet QA

- Sidebar and content do not create horizontal page overflow.
- Component previews wrap into stable grids without clipping controls.
- Code blocks and API tables scroll internally when needed.
- Sticky navigation remains useful without consuming too much vertical space.
- Breadcrumb, badges, and hero metadata wrap without awkward gaps.

## Mobile QA

- No text, buttons, tables, or preview panels overflow the viewport.
- The component sidebar/navigation collapses into a usable horizontal flow where applicable.
- Section navigation can scroll horizontally and does not trap focus.
- Live previews remain useful with one-column layouts.
- Code blocks and API tables have horizontal scrolling and do not force page width.
- Touch targets remain at least comfortably tappable.

## Dark Mode QA

- Text contrast remains strong in hero, preview, cards, code blocks, tables, and side navigation.
- Borders and backgrounds separate sections without creating heavy visual noise.
- Status treatments for success, warning, danger, and info remain distinguishable.
- Code blocks retain readable syntax-like contrast even without syntax highlighting.

## Component Preview Quality Bar

- Each preview should answer: where would this component appear in a real product?
- Prefer compact scenarios: release workflows, settings forms, account rows, status panels, data tables, loading states, and feedback flows.
- Show the most important states, but avoid displaying every variant in one flat row.
- Keep component examples imported from `@ngnova/ui` and aligned with the public API.
- Do not use fake controls that imply unsupported behavior.
- Do not add decorative wrappers that make the component harder to inspect.

## API And Code QA

- Inputs and outputs are sorted or grouped in a way that is easy to scan.
- Types use monospace styling and do not dominate the description column.
- Tables keep sticky headers only where they do not conflict with page sticky navigation.
- Long type strings and code samples scroll inside their containers.
- Copy buttons, labels, and language hints are visible without crowding content.

## Accessibility QA

- Heading order remains logical.
- Link text and button text are meaningful.
- Focus states are visible in light and dark mode.
- Keyboard-only users can reach section navigation, code copy actions, previews, and interactive components.
- Modal, toast, tabs, accordion, table sorting, and form-control examples still demonstrate documented keyboard behavior.

## Regression Rules

- No `::ng-deep`.
- No negative letter spacing.
- No dynamic Tailwind class construction.
- No overlapping right rail or floating card that competes with content.
- No nested cards unless the component itself is demonstrating card composition.
- No large empty hero areas for component pages.
- No route should require a full page reload when using hash routing.

## Verification Commands

Run the standard repo checks after structural docs work:

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:docs
cd dist/ui
npm.cmd pack --dry-run
```

If browser verification is available, also inspect desktop, tablet, and mobile widths for `/#/components/button` before closing the task.
