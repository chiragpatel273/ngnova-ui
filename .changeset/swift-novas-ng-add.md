---
'@ngnova/ui': minor
---

Add an `ng add @ngnova/ui` schematic. It installs Tailwind CSS v4 and its PostCSS plugin when they
are missing, imports the optional theme stylesheet, configures class-based or media dark mode, adds
the `@source` entry Tailwind needs to scan the package, and can install `@angular/cdk` with
`--cdk`. Re-running the schematic is safe, and Tailwind CSS v3 workspaces receive an upgrade hint
instead of being modified.
