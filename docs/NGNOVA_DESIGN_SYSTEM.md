# NgNova Design System Foundations

This document is the visual baseline for the NgNova UI documentation app and public components.
It prevents component styling from drifting into unrelated colors, radii, type scales, icon sizes,
and interaction treatments.

## Design Principles

1. **Precise before decorative.** Alignment, spacing, readable type, and state clarity come before
   shadows or visual effects.
2. **Native before simulated.** Preserve native HTML semantics and interaction behavior.
3. **One hierarchy.** Primary, secondary, quiet, and destructive actions must remain visually
   distinguishable in light and dark mode.
4. **Consistent geometry.** Text buttons and icon buttons share the same height, radius, focus ring,
   and pressed behavior.
5. **Consumer friendly.** Library components inherit the application's font. NgNova does not force
   a web font into consuming products.

## Typography

The documentation app uses **Inter Variable** for product UI and the following system monospace
stack for code:

```css
--font-sans:
  'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
  sans-serif;
--font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', 'Roboto Mono', ui-monospace, monospace;
```

The variable font is self-hosted through the combined weight and optical-size build from
`@fontsource-variable/inter`; the docs do not depend on a remote font CDN. Optical sizing remains
enabled so Inter adapts its glyph construction to small UI text and large headings. Components use
inherited typography so they integrate with consumer applications.

Use this compact documentation scale consistently:

| Documentation role         |  Weight | Size | Line height |
| -------------------------- | ------: | ---: | ----------: |
| Page title                 |     700 | 24px |        32px |
| Section heading            | 600–700 | 18px |        28px |
| Card and example title     | 600–700 | 16px |        24px |
| Body and descriptions      |     400 | 14px |        20px |
| Controls and labels        | 500–600 | 12px |        16px |
| Compact sidebar navigation | 400–600 | 13px |        20px |
| Code and metadata          | 400–600 | 12px |        20px |

Metrics inside product examples may use 20–24px values when their hierarchy requires it. Component
previews may also demonstrate consumer-defined typography; those examples do not redefine the
documentation chrome scale. Avoid text below 12px in documentation and templates.

Avoid synthetic bold or italic faces. Use tight letter spacing only for short controls and large
headings; body copy should keep normal tracking.

## Color

- **Primary:** Blue. Used for primary actions, selection, navigation emphasis, and focus.
- **Neutral:** Slate. Used for text, borders, surfaces, and secondary actions.
- **Success:** Emerald.
- **Warning:** Amber.
- **Danger:** Red.
- **Documentation accents:** must follow the same semantic palette instead of introducing a second
  unrelated brand color.

Color must never be the only state indicator. Focus, disabled, loading, selected, and error states
also require shape, text, icon, border, or ARIA information.

## Shape, Spacing, And Elevation

- Use the Tailwind 4px spacing rhythm.
- Default control radius: 8px (`rounded-lg`).
- Small tags and dense elements may use 6px (`rounded-md`).
- Circular controls and avatars use `rounded-full` only when the geometry is actually circular.
- Resting controls use no shadow or a one-pixel/subtle small shadow.
- Hover may increase elevation by one restrained level.
- Pressed buttons use a brief brightness change without translation, scaling, or layout movement.

## Focus And Motion

- Keyboard focus uses the shared 2px blue-600 ring with a 2px offset.
- Dark mode uses a blue-400 ring and slate-950 offset so the gap stays visible.
- Button clears its decorative inset-ring state during keyboard focus so the focus ring remains
  outside the control; Button Group keeps overflow visible and raises the focused button.
- Standard interaction duration is 150ms with an ease-out curve.
- Press feedback may use 75ms.
- Respect `prefers-reduced-motion`; motion is never required to understand state.

## Icons

NgNova UI is icon-library agnostic. Documentation examples use Heroicons through `@ng-icons`, but
public Button APIs accept any projected icon marked with `uiButtonIconStart` or `uiButtonIconEnd`.

- Standard button markers default to 16px and scale with the component-owned icon-size variable.
- Icon-only glyphs are 16/18/20px inside 30/36/42px square controls.
- Outline icons use an approximately 2px stroke at standard size.
- SVGs must fill the marker container and render as blocks to avoid baseline gaps.
- Decorative icons are `aria-hidden`; icon-only controls require an accessible label.
- Do not use emoji, text glyphs, or improvised CSS drawings as production icons.

## Button Metrics

| Size   | Height | Horizontal padding | Icon-only size | Text |
| ------ | -----: | -----------------: | -------------: | ---: |
| Small  |   30px |               10px |           30px | 13px |
| Medium |   36px |               14px |           36px | 14px |
| Large  |   42px |               18px |           42px | 15px |

All Button appearances use the same typography, icon geometry, focus treatment, and interaction
timing. Semantic intent changes color, not layout.

The compact 30px small control remains above the WCAG 2.5.8 minimum target size. For touch-first
surfaces, prefer medium or large buttons, or provide additional spacing around small controls.

The modern visual API combines `appearance` (`solid`, `outline`, `ghost`, `text`, or `tonal`) with
`intent` (`primary`, `secondary`, `success`, `warning`, `danger`, or `neutral`). The legacy
`variant` input remains supported for compatibility. Buttons use a 150ms ease-out color, border,
shadow, and filter transition; pointer press feedback is a 75ms brightness change. Disabled and
loading buttons do not activate, and loading replaces decorative icons with a labelled spinner.

Button Group connects adjacent corners without clipping the shared outer focus ring. The focused
button receives a raised stacking layer so its ring remains visible over neighboring controls.

## Implementation Sources

- Demo font, theme, and icon normalization: `src/styles.css`
- Public theme tokens: `projects/ui/styles/theme.css`
- Theme adoption and stability guidance: `docs/THEME_MIGRATION.md`
- Button geometry and state classes: `projects/ui/button/src/button.ts`
- Consumer Tailwind and dark-mode setup: `README.md` and `/theming`

Any new visual primitive should update this document when it changes a shared foundation.

## Public Theme Token Contract

Consumers may opt into `@ngnova/ui/styles/theme.css`. The stylesheet defines three stable layers:

1. Foundation tokens cover type scales, spacing, radii, elevation, and motion.
2. Semantic tokens describe canvas, surfaces, text, borders, brand, feedback, focus, and backdrop.
3. Component tokens describe shared control heights/radius, focus geometry, dialog widths, and toast offset.

The stylesheet never sets the consumer's body font. `--ui-font-family` defaults to `inherit`.
Light values live on `:root` and `[data-ui-theme='light']`; dark values respond to either `.dark`
or `[data-ui-theme='dark']`. Reduced-motion and forced-colors media queries adjust the same token
contract. Token removals, renames, or semantic changes require migration guidance because `--ui-*`
names are public API.
