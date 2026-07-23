# Consumer runtime matrix

NgNova UI verifies the generated npm tarball in applications that do not inherit workspace path
mappings or source files. `npm.cmd run smoke:consumer` creates a clean temporary workspace, installs
the tarball, and exercises the matrix below.

| Consumer         | Evidence                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Zoneless browser | Angular production build using `provideZonelessChangeDetection()` and a signal-driven NgNova Button         |
| SSR server       | Production browser and server bundles generated from the packed package                                     |
| Hydration        | `provideClientHydration()` in the browser config and hydration annotations in the live server-rendered HTML |
| SSR runtime      | Generated Node/Express server starts, renders an NgNova Button, and returns expected application content    |

## What the gate catches

- missing or invalid package entry points after `npm pack`;
- accidental dependence on repository TypeScript path mappings;
- browser-only globals reached during server rendering;
- Zone.js assumptions in a component interaction;
- missing Angular SSR peers or server compilation failures;
- a build that claims hydration but emits no hydration annotations;
- broken theme stylesheet exports in a clean Tailwind consumer.

The SSR probe explicitly allows only `127.0.0.1` in `AngularNodeAppEngine`; it does not disable
Angular's host validation to make the test pass.

## CI contract

The matrix is part of `npm.cmd run release:check`, which is the Windows CI verification job. It runs
after the library build, package audit, and npm dry run so the tested artifact is the same generated
package shape intended for publication.

The temporary consumers live under `.tmp/consumer-matrix` and are recreated on every run. They are
not workspaces and cannot resolve NgNova UI source directly.
