# Agent Instructions

This repository contains **NgNova UI**, an Angular 22 standalone component library published as `@ngnova/ui`.

Before making code changes, read and follow:

- `docs/ANGULAR_22_LIBRARY_STANDARDS.md`

## Core Rules

- Use Angular 22 standalone components.
- Use `ChangeDetectionStrategy.OnPush` for library components.
- Prefer `inject()` over constructor parameter injection.
- Prefer Angular `output()` for new outputs and mark output/query fields `readonly`.
- Use signals for component-owned local state when they simplify state handling.
- Use `computed()` for derived values such as class strings, labels, IDs, and filtered lists.
- Do not use output names that collide with native DOM events such as `click`, `focus`, or `blur`.
- Do not prefix outputs with `ui`.
- Do not mutate parent-owned `@Input()` state; emit changes instead.
- Use Tailwind CSS static, complete class strings.
- Prefer `[class]` and class bindings over `NgClass`.
- Avoid `::ng-deep`.
- Support dark mode with Tailwind `dark:` classes.
- Keep TypeScript strict and avoid `any`.
- Use named exports and export only intentional public API.
- Use literal union types and typed `Record<Union, string>` maps for variants, sizes, and class maps.
- Treat exported types, inputs, outputs, and selectors as semver-sensitive API.
- Export public components from `projects/ui/src/public-api.ts`.
- Build and publish only the ng-packagr output from `dist/ui`, never the source under `projects/ui`.

## Preferred Output Names

- Button: `pressed`, `focused`, `blurred`
- Input: `valueChange`, `focused`, `blurred`
- Modal: `openChange`, `opened`, `closed`, `backdropClick`, `escapeKeyDown`

## Required Checks

Run these before considering component or library work complete:

```bash
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:demo
npm.cmd pack --dry-run
```

If `npm.cmd pack --dry-run` hits the Windows npm cache permission issue in this managed environment, rerun it with approved elevated access.
