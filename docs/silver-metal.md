# Silver metal text fill

Brushed-metal still used as the **type fill** for the hero benefit lines *Less chasing paperwork* / *More time closing loans*.

## File

[`public/images/silver-metal.jpg`](../public/images/silver-metal.jpg) — 360px-wide silver gradient still.

## How it is applied

In [`src/index.css`](../src/index.css), `.hero-copy--support .hero-copy__headline--tag` lines use `background-image: url("/images/silver-metal.jpg")` with `background-clip: text` and transparent fill. Fallback color is `#d1d5db` if clip is unavailable.

See [hero-copy.md](./hero-copy.md).
