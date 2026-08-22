# Page spacing (grow / shrink)

Horizontal inset, section padding, and display type scale with the viewport instead of jumping at `sm` / `lg` / `xl`. Header, hero, and body sections share one gutter so the rail stays aligned while resizing.

## Gutter

`--page-gutter` on `html`: `clamp(1rem, 0.4rem + 3.6vw, 6rem)`.

| Class | Use |
| --- | --- |
| `.layout-shell` | Section rail (`padding-inline: var(--page-gutter)`) |
| `.layout-header-px` / `.layout-header` | Nav and hero copy — same inset |
| `.page-gutter-x` | Horizontal inset only (pipeline steps, feature grid) |

## Vertical rhythm

`.section-marketing` uses `padding-block: clamp(4rem, 2.5rem + 4.8vw, 8rem)`. Early-access / contact bands are a step larger. Pipeline keeps `padding-bottom: 0` so it meets Memory.

## Type

`.display-heading` — problem, features, pipeline, contact titles: `clamp(2rem, 1.1rem + 3.4vw, 4.5rem)`.

`.section-heading` — assistant, memory, team: `clamp(1.85rem, 1.15rem + 2.8vw, 3.75rem)`.

## Hero (stacked, `<1100px`)

`.hero-copy__cluster` is `width: 100%` and is **not** a container. Nested `container-type` plus `nowrap` headlines collapsed the cluster to `0` width (body squeezed, benefit line clipped). Type uses the parent `.hero-copy` container.

See [layout-shell.md](./layout-shell.md) and [hero-copy.md](./hero-copy.md).
