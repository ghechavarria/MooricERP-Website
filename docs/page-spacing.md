# Page spacing (grow / shrink)

Horizontal inset, section padding, and display type scale with the viewport instead of jumping at `sm` / `lg` / `xl`. Header, hero, and body sections share one gutter so the rail stays aligned while resizing.

## Gutter

`--page-gutter` on `html`: `clamp(1rem, 0.4rem + 3.6vw, 6rem)`.

| Class | Use |
| --- | --- |
| `.layout-shell` | Section rail (`padding-inline: var(--page-gutter)`) |
| `.layout-header-px` / `.layout-header` | Nav — same inset |

## Vertical rhythm

`.v4-section` / `.v4-section--tight` pad **top and bottom** so product-mock shadows do not overlap the next kicker. `.v4-pipeline` uses `padding-block` only (no stacked `margin-top`). Hash offset is `5rem` (`html` `scroll-padding-top` and section `scroll-margin-top`).

See [layout-shell.md](./layout-shell.md) and [hero-copy.md](./hero-copy.md).
