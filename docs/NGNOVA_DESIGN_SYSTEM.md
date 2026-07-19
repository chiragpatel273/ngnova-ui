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

Use these weights consistently:

| Role                  |  Weight | Typical size |
| --------------------- | ------: | -----------: |
| Body and descriptions |     400 |      14–16px |
| Controls and labels   |     500 |      14–16px |
| Section headings      |     600 |      20–30px |
| Page headings         |     700 |      36–48px |
| Code and metadata     | 400–600 |      12–14px |

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
- Pressed controls move down by one pixel and remove elevation; never scale or squash controls.

## Focus And Motion

- Keyboard focus uses a 2px primary ring with a 2px offset.
- Dark mode changes both the ring and ring-offset colors so the gap stays visible.
- Standard interaction duration is 150ms with an ease-out curve.
- Press feedback may use 75ms.
- Respect `prefers-reduced-motion`; motion is never required to understand state.

## Icons

NgNova UI is icon-library agnostic. Documentation examples use Heroicons through `@ng-icons`, but
public Button APIs accept any projected icon marked with `uiButtonIconStart` or `uiButtonIconEnd`.

- Standard button icon: 16px.
- Icon-only button glyph: 18px inside a 32/40/48px square control.
- Outline icons use an approximately 2px stroke at standard size.
- SVGs must fill the marker container and render as blocks to avoid baseline gaps.
- Decorative icons are `aria-hidden`; icon-only controls require an accessible label.
- Do not use emoji, text glyphs, or improvised CSS drawings as production icons.

## Button Metrics

| Size   | Height | Horizontal padding | Icon-only size | Text |
| ------ | -----: | -----------------: | -------------: | ---: |
| Small  |   32px |               12px |           32px | 14px |
| Medium |   40px |               16px |           40px | 14px |
| Large  |   48px |               20px |           48px | 16px |

All Button appearances use the same typography, icon geometry, focus treatment, and interaction
timing. Semantic intent changes color, not layout.

## Implementation Sources

- Demo font, theme, and icon normalization: `src/styles.css`
- Button geometry and state classes: `projects/ui/button/src/button.ts`
- Consumer Tailwind and dark-mode setup: `README.md` and `/theming`

Any new visual primitive should update this document when it changes a shared foundation.
