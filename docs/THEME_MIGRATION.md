# NgNova UI Theme Contract Migration

## Adopting theme tokens in 0.1

The token stylesheet is opt-in. Existing consumers keep the original component appearance until
they import it after Tailwind:

```css
@import 'tailwindcss';
@import '@ngnova/ui/styles/theme.css';
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@ngnova/ui";
```

Import order matters. The NgNova stylesheet deliberately maps Tailwind's blue, emerald, amber, and
red utility palettes to the public brand and feedback tokens, so it must follow the Tailwind import.
Foundation and component tokens are consumed directly where their concepts apply. Neutral semantic
tokens remain stable composition primitives for consumer application surfaces; built-in components
retain NgNova's slate neutral palette.

## Branding

Override the smallest semantic layer that expresses the product brand:

```css
:root {
  --ui-color-primary: #7c3aed;
  --ui-color-success: #15803d;
  --ui-control-radius: 0.625rem;
}

[data-ui-theme='dark'] {
  --ui-color-primary: #a78bfa;
}
```

Primary and feedback tonal families are derived with `color-mix()`. Applications that require
precise art-directed shades can override individual `--ui-color-primary-*` tokens after the base
token.

## Stability

- Adding a token is backward-compatible.
- Removing, renaming, or changing the meaning of a token requires release-note and migration-guide
  coverage plus the appropriate semantic-version change.
- Internal Tailwind class names are not theme API. Customize through documented `--ui-*` tokens.
- The stylesheet does not set the application font or body styles.

There is no runtime provider to migrate. Light and dark themes may be scoped with `.dark`,
`[data-ui-theme='light']`, or `[data-ui-theme='dark']`.
