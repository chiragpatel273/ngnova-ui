# NgNova UI World-Class Agent

Use this workflow when Codex, a human maintainer, or another coding agent is asked to improve NgNova UI as a serious npm component library.

The agent's job is not to make isolated edits. Its job is to move one scoped task to release-quality completion, with implementation, documentation, tests, and package verification aligned.

## Mission

Make `@ngnova/ui` a dependable Angular 22 standalone component library that teams can install, import component-by-component, document confidently, and use in production Angular apps.

The agent should continuously improve the library through small, reviewable tasks:

- Harden component APIs.
- Keep docs accurate to the implementation.
- Improve accessibility and keyboard behavior.
- Preserve light and dark mode support.
- Maintain per-component package entry points.
- Keep examples realistic and copy-pasteable.
- Keep release checks green.

## Always Read First

Before editing files, read:

1. `AGENTS.md`
2. `docs/ANGULAR_22_LIBRARY_STANDARDS.md`
3. The component implementation and tests for the current task.
4. The matching docs data/page for the current component.

Do not rely on the docs as truth until the implementation has been inspected.

## Operating Principles

- Work one component, route, or release concern at a time.
- Prefer Angular 22 standalone components and `ChangeDetectionStrategy.OnPush`.
- Prefer `inject()`, signals for local state, and `computed()` for derived values.
- Keep public inputs, outputs, selectors, and exported types semver-sensitive.
- Do not document a behavior that does not exist.
- Do not add broad abstractions unless they clearly reduce real duplication.
- Keep Tailwind class strings static and complete.
- Keep dark mode coverage in component classes with `dark:` variants.
- Keep examples small enough to copy, but realistic enough to teach product usage.
- Run the required checks before marking a task complete.

## Task Intake

Every task should start with a concrete target and a release reason.

Good task shapes:

- `Audit UiButtonComponent for first npm release.`
- `Fix Button docs so preview and snippets match.`
- `Add missing accessibility tests for UiModalComponent.`
- `Verify per-component entry point for UiTableComponent.`
- `Review theming docs for Tailwind v4 consumers.`

Avoid vague tasks such as:

- `Make everything better.`
- `Improve design.`
- `Review all files.`

If a broad task is requested, split it into a checklist and complete the highest-risk item first.

## Component Definition Of Done

A public component is first-release ready only when all items below are true.

### Implementation

- Component is standalone and exported intentionally.
- Uses `ChangeDetectionStrategy.OnPush`.
- Uses stable selector naming with `ui-`.
- Public inputs and outputs are typed and documented.
- Outputs do not collide with native DOM event names unless implemented as actual forwarded native host events.
- Inputs do not mutate parent-owned state.
- Variants, sizes, and modes use literal union types.
- Class maps use typed `Record<Union, string>` where useful.
- Tailwind classes are static and discoverable.
- Dark mode classes exist for surfaces, borders, text, focus, and state colors.
- Browser APIs are avoided in library components or guarded through Angular APIs.
- Forms components implement `ControlValueAccessor` correctly.

### Accessibility

- Native semantics are preserved when possible.
- Labels, helper text, errors, and descriptions are wired with ARIA where needed.
- Keyboard behavior is covered for interactive patterns.
- Focus styles are visible.
- Disabled and loading states are understandable to assistive technology.
- Dialog-like components handle role, labeling, Escape, backdrop, focus trap, and focus restore.

### Package Surface

- Component is exported from its `projects/ui/<component>/public-api.ts` secondary entry point.
- The root `projects/ui/src/public-api.ts` stays minimal because ng-packagr cannot safely compile
  the same Angular declaration graph into both primary and secondary entry points, and a full root
  barrel would make optional integrations part of the default dependency graph.
- Component has a secondary entry point under `projects/ui/<component>/`.
- Docs use per-component imports such as `@ngnova/ui/button`.
- Package build emits the entry point under `dist/ui`.
- No docs or README examples import from internal source paths.

### Documentation

- Component has a docs page.
- Header explains purpose clearly.
- Setup/import section is concise and not redundant.
- Usage examples have separate preview and code blocks.
- Preview and code snippets match exactly.
- Events examples use real supported APIs.
- API table matches implementation.
- Accessibility notes are component-specific.
- Testing guidance tells users what to verify.
- Dark mode behavior is either shown or explicitly mentioned.

### Tests

- Inputs, variants, sizes, disabled, and loading states are tested where applicable.
- Outputs or forwarded DOM events are tested.
- Accessibility attributes are tested.
- Keyboard behavior is tested for non-trivial interactions.
- Forms components test CVA behavior.
- Harnesses exist for reusable interactive components when appropriate.

## First Release Component Order

Work through components in risk order, not visual order.

1. Forms: `input`, `textarea`, `checkbox`, `radio`, `switch`, `select`
2. Actions: `button`
3. Overlays: `modal`, `toast`
4. Navigation: `tabs`, `accordion`
5. Data and layout: `card`, `table`, `progress-bar`
6. Feedback and display: `alert`, `badge`, `tag`, `avatar`, `skeleton`, `spinner`
7. Test harnesses and package exports
8. README, theme docs, release checklist, npm package dry run

## Documentation Quality Bar

Documentation should feel like product documentation, not a scaffold demo.

Each component page should answer:

- Why would a product team use this?
- What should they import?
- What is the smallest correct example?
- What are the meaningful variants?
- How do events and state work?
- What must they know for accessibility?
- What should they test?

Examples should be split into focused blocks:

- Basic usage
- Variants or states
- Events or forms integration
- Accessibility-sensitive pattern if applicable

Avoid one giant example block that forces horizontal scrolling or mixes unrelated concepts.

## Theme And Styling Contract

NgNova UI supports light and dark mode through Tailwind classes and publishes an optional versioned CSS token contract from `@ngnova/ui/styles/theme.css`. It intentionally does not require a runtime theme provider.

Consumer setup must remain documented:

```css
@import 'tailwindcss';
@import '@ngnova/ui/styles/theme.css';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
```

The agent should preserve this distinction:

- Supported now: light mode, dark mode, Tailwind-native styling, static utility classes, and foundation/semantic/component CSS variables.
- Not supported: Material-style runtime providers or arbitrary JavaScript theme mutation APIs.

Theme tokens are public semver-sensitive API. Additions are minor; renames, removals, and meaning changes require migration guidance and the appropriate semver change.

## Release Gates

Before calling any component or release task complete, run the smallest relevant check set. For component work, run the full set whenever feasible:

```bash
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run test:demo
npm.cmd run build:lib
npm.cmd run build:demo
```

Before npm release, also run:

```bash
npm.cmd pack --dry-run
```

If `npm.cmd pack --dry-run` fails with the known Windows npm cache permission issue in this managed environment, rerun it with approved elevated access and report the environment-specific reason.

## Continuous Work Loop

Use this loop for every task:

1. Read the standards and the relevant code.
2. Identify the gap between implementation, docs, tests, and package surface.
3. Make the smallest complete change.
4. Update docs and README if public behavior changed.
5. Add or update tests for changed behavior.
6. Run verification.
7. Report done, pending, and blockers.

If verification fails, fix the failure before moving on. If the failure is unrelated and pre-existing, document it clearly with command output summary.

## GitHub Issue Template

Use this shape for component audit issues:

```md
## Target

Ui<Component>Name for first npm release.

## Checks

- [ ] Implementation follows Angular 22 standards.
- [ ] Public API is stable and typed.
- [ ] Per-component import works.
- [ ] Docs examples match implementation.
- [ ] Light and dark mode covered.
- [ ] Accessibility behavior documented and tested.
- [ ] Harness exists or is intentionally not needed.
- [ ] Required verification passes.

## Notes

Known risks, design decisions, or release blockers.
```

## Pull Request Checklist

Every PR should answer:

- What component or release area changed?
- What public API changed, if any?
- What docs changed?
- What tests changed?
- Which commands passed?
- What remains pending?

Do not merge a PR that changes public API without matching docs and tests.

## Completion Report Format

When an agent finishes a task, use this format:

```md
Done:

- ...

Verified:

- `npm.cmd run format:check`
- `npm.cmd run lint`
- ...

Pending:

- ...

Blockers:

- ...
```

Keep the report factual and short. The source of truth is the code, docs, and verification results.
