# Layout shell (wide rail)

The React mount (`#root`) is a flex column with `min-h-dvh`, `w-full`, and `min-w-0` so the page shell and sticky header share the viewport width with full-bleed sections (see [`src/index.css`](../src/index.css) `@layer base`).

Most page sections use `.layout-shell` for shared horizontal padding. The sticky header uses `.layout-header` (same gutter).

## Gutter

`--page-gutter` on `html` scales continuously: `clamp(1rem, 0.4rem + 3.6vw, 6rem)`. Header, hero copy, and body sections use this value so the left rail does not jump when the window is resized. See [page-spacing.md](./page-spacing.md).

## `.layout-shell`

Full-width rail (`max-w-none`) with `padding-inline: var(--page-gutter)`.

Used by Features, Memory, Pipeline (copy + steps), Assistant, Process, Team, Contact CTA, Footer, Production Glance, Problem, and similar sections.

## `.layout-header` / `.layout-header-px` / `.page-gutter-x`

| Class | Behavior |
| --- | --- |
| `.layout-header` | `max-w-none` + `--page-gutter` |
| `.layout-header-px` | Same padding without `mx-auto` — session pulse, etc. |
| `.page-gutter-x` | Same padding when a wrapper is not a full shell |

Applied in [`Header.tsx`](../src/components/Header.tsx), the session pulse bar in [`HeroSessionPulse.tsx`](../src/components/HeroSessionPulse.tsx), and the hero copy wrapper in [`Hero.tsx`](../src/components/Hero.tsx). The hero photo is full-bleed on the right and is not padded.
