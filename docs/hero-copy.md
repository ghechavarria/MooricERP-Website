# Hero copy (`HeroCopy.tsx`)

Left navy column is one conversion stack. Support order: benefit headline → body → CTAs → stats. The AI pill sits on the photo under *Empowering better closings* at every breakpoint.

## Headline

The main title (`Intelligent mortgage platform` / `Empowering better closings`) sits **on the hero photo** in Source Serif 4 (`.hero-copy--on-photo`), sentence case, medium weight, italic second line. Size uses a smaller `cqi` clamp under 1100px and a larger one from 1100px up. The left column’s benefit line (`Less chasing paperwork` / `More time closing loans`) is white Montserrat. Under 1100px the photo is full-bleed (`aspect-ratio: 5 / 3`, `max-height: 38svh`) with the same title overlaid.

## Stacked cluster

`.hero-copy__cluster` is `width: 100%` below 1100px and is not a size container. Nested `container-type` plus `nowrap` headlines collapsed the stack to zero width. Benefit type reads `cqi` from `.hero-copy`. Body uses the full copy column (`width: 100%`); the `36rem` cap is desktop-only.

## Badge

On the photo, centered under *Empowering better closings*, all viewports. `inline-flex`, `width: fit-content`, blue dot, hairline border, translucent fill.

## Platform line

Benefit claim in the left column, both lines filled with the silver metal photo (`/images/silver-metal.jpg`) via `background-clip: text`. Same treatment on the stacked layout (centered).

## CTAs

Primary is the only filled button. Hover matches the other marketing CTAs: fill drops out to a white outline, type stays white. The ghost link **See why it's different** uses logo ERP blue (`#0075FF`) and sits under the button with a trailing `↓`; hover goes white. Extra space above the actions (`--hc-space * 2.15` from 1100px up; a looser clamp under 1100px).

`align` (`left` \| `center`) and `mode` (`full` \| `lead` \| `support`). **lead** is the on-photo title; **support** is the left-column copy. See [hero-layout-variants.md](hero-layout-variants.md).
