# World-Class Angular Component Library Prompt

Use this prompt when asking Codex or another AI assistant to plan or build NgNova UI components.

```text
You are a senior Angular 22 component library architect.

Build NgNova UI, a world-class standalone Angular component library published as @ngnova/ui.

Before making code changes, follow docs/ANGULAR_22_LIBRARY_STANDARDS.md.

Core rules:
- Use Angular 22 standalone components.
- Use ChangeDetectionStrategy.OnPush.
- Prefer inject() over constructor injection.
- Prefer output() for new outputs and mark output/query fields readonly.
- Use signal() for component-owned local state.
- Use computed() for derived class strings, labels, IDs, and filtered lists.
- Do not mutate parent-owned inputs. Emit changes instead.
- Do not use output names like click, focus, or blur.
- Use semantic outputs like pressed, valueChange, openChange, opened, closed, focused, blurred, backdropClick, escapeKeyDown.
- Use strict TypeScript. Avoid any.
- Use Tailwind static class strings, class bindings, and dark: classes.
- Avoid NgClass and ::ng-deep.
- Export public APIs from projects/ui/src/public-api.ts.
- Treat selectors, inputs, outputs, and exported types as semver-sensitive.

Benchmark:
Use PrimeNG as a product-quality benchmark for breadth, docs, examples, accessibility, theming, and enterprise usefulness. Do not copy PrimeNG APIs blindly. Design NgNova APIs to be modern, Angular 22-native, typed, accessible, and stable.

Component roadmap:

Foundations:
- Button, IconButton, ButtonGroup, Badge, Tag, Chip, Avatar, Divider, Skeleton, ProgressBar, Spinner, Tooltip.

Forms:
- InputText, Textarea, Password, Checkbox, RadioButton, ToggleSwitch, Select, MultiSelect, Autocomplete, DatePicker, InputNumber, Slider, Rating, ColorPicker, InputOtp, InputGroup, IconField, FloatLabel.

Overlays:
- Modal/Dialog, Drawer, Popover, ConfirmDialog, Toast, MenuOverlay, Tooltip.

Data:
- Table, DataView, Paginator, Tree, TreeTable, VirtualScroller, Timeline, PickList, OrderList, OrganizationChart.

Navigation:
- Tabs, Accordion, Breadcrumb, Menu, Menubar, ContextMenu, MegaMenu, PanelMenu, Steps, Stepper.

Layout:
- Card, Panel, Fieldset, Toolbar, Splitter, ScrollPanel, BlockUI, Inplace.

Media:
- Image, ImageCompare, Carousel, Galleria, FileUpload.

Later/advanced:
- Chart, RichTextEditor, Terminal, DragDrop helpers, AnimateOnScroll.

For every component, create in-depth docs with:
- Overview: what it does, when to use it, when not to use it.
- Import example from @ngnova/ui.
- Basic example.
- Variant examples.
- Disabled, loading, invalid, empty, and long-content examples.
- Dark mode example.
- Forms examples for CVA components.
- Accessibility section with ARIA, roles, focus behavior, and keyboard table.
- API tables for inputs, outputs, templates/content projection, exported types.
- Real-world example.
- Testing notes and expected harness methods.

Quality requirements:
- Add focused unit tests for public inputs, outputs, states, keyboard behavior, accessibility attributes, and CVA behavior.
- Add Angular CDK harnesses for reusable interactive components through @ngnova/ui/testing when appropriate.
- Keep docs demos importing from @ngnova/ui, not internal source paths.
- Update README and public-api.ts for public components.

Required verification:
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test:lib
npm.cmd run build:lib
npm.cmd run build:demo
npm.cmd pack --dry-run

First milestone:
Build Button, Badge, Tag, Avatar, Skeleton, ProgressBar, Spinner, InputText, Textarea, Checkbox, RadioButton, ToggleSwitch, Select, Modal, Toast, Card, Tabs, Accordion, and Table first.
```

## Short Paste-Friendly Version

```text
Build NgNova UI, a world-class Angular 22 standalone component library like a modern PrimeNG-quality competitor, but follow docs/ANGULAR_22_LIBRARY_STANDARDS.md exactly.

Use standalone components, OnPush, inject(), output(), readonly outputs/queries, signals for local state, computed() for derived state/classes, strict TypeScript, Tailwind static classes, dark mode, accessible keyboard behavior, and clean semver-stable public APIs exported from projects/ui/src/public-api.ts.

Create components across foundations, forms, overlays, data, navigation, layout, and media. Prioritize first: Button, Badge, Tag, Avatar, Skeleton, ProgressBar, Spinner, InputText, Textarea, Checkbox, RadioButton, ToggleSwitch, Select, Modal, Toast, Card, Tabs, Accordion, Table.

For every component, include production-quality implementation, tests, public API exports, and in-depth docs with overview, import, basic usage, variants, real-world examples, accessibility, keyboard behavior, API tables, forms/CVA examples where relevant, dark mode, edge cases, and testing notes.

Run: npm.cmd run format:check, lint, test:lib, build:lib, build:demo, and npm.cmd pack --dry-run.
```
