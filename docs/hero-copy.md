# Hero copy (`HeroCopy.tsx`)

Left navy column is one conversion stack. Desktop support order: AI badge → benefit headline → body → CTAs → stats. One-column (`<1100px`): full-bleed photo + on-photo title first, then a centered, tighter support stack (AI line, Montserrat benefit headline, body, CTAs, stats). The stacked hero is content-height — it does not stretch to the viewport. Gutters follow `--page-gutter`; see [page-spacing.md](./page-spacing.md).

## Headline

The main title (`Intelligent mortgage platform` / `Empowering better closings`) sits **on the hero photo** in Source Serif 4 (`.hero-copy--on-photo`), sentence case, medium weight, italic second line. Size uses a smaller `cqi` clamp under 1100px and a larger one from 1100px up. The left column’s benefit line (`Less chasing paperwork` / `More time closing loans`) is white Montserrat. Under 1100px the photo is full-bleed (`aspect-ratio: 5 / 3`, `max-height: 38svh`) with the same title overlaid.

## Stacked cluster

`.hero-copy__cluster` is `width: 100%` below 1100px and is not a size container. Nested `container-type` plus `nowrap` headlines collapsed the stack to zero width. Benefit type reads `cqi` from `.hero-copy`. Body uses the full copy column (`width: 100%`); the `36rem` cap is desktop-only.

## Badge

Same pill on every viewport: `inline-flex`, `width: fit-content`, blue dot, hairline border, translucent fill, nowrap label. Desktop: left-aligned above the benefit headline. Under 1100px: centered, a hair smaller than desktop.

## Platform line

Benefit claim in the left column, both lines white, Montserrat 800 uppercase. Same treatment on the stacked layout (centered).

## CTAs

Under 1100px the stack opens up: more space under the pill, between headline and body, above the CTA, and between the copy block and stats. Pane gap and rail padding also scale up on tablet.

`align` (`left` \| `center`) and `mode` (`full` \| `lead` \| `support`). **lead** is the on-photo title; **support** is the left-column copy. See [hero-layout-variants.md](hero-layout-variants.md).
