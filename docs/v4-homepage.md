# v4 homepage look

Light SaaS homepage ported from the standalone v4 page. Header chrome and footer logo are unchanged.

## Frozen

- **Header bar:** sticky white, square logo, Mooric ERP wordmark, `h-[4.25rem]`, hamburger below 1440px.
- **Footer:** white band, header square logo + **Mooric ERP** with **Corporation** underneath. Social icons and copyright stay.

## Nav contents

Explore dropdown (Capabilities through Personal assistant), Pricing (`/#contact` — no pricing route in this repo), Team, Contact (`/#contact` on home, `/team#contact` on `/team`), **Book a demo** (contact modal). Link type is Inter 13.5px / `#3d4757`.

## Home order

Hero → Overhead (`#problem`) → Capabilities → Intake → Income → Conditions → Pipeline → Memory → Assistant → Closed → LOS banner → Contact.

Tokens and layout helpers live in [`src/index.css`](../src/index.css) (`.v4-*`). Content shares `--page-gutter` / `.layout-shell` with the header.

## Vertical rhythm

`.v4-section` uses matching `padding-top` and `padding-bottom` (`clamp(4.5rem … 7.5rem)`) so mock shadows and capability hover-lift stay inside the section instead of sitting on the next kicker. `.v4-section--tight` uses a slightly smaller clamp. `.v4-pipeline` uses `padding-block` only (no extra `margin-top`). Hash targets use `scroll-margin-top: 5rem` (header is `4.25rem`) with `html { scroll-padding-top: 5rem }`.

`<main>` uses `overflow-x: clip` so horizontal overflow is clipped without creating a nested vertical scroller that fights sticky/hash.

## Breakpoints

| Width | Behavior |
|-------|----------|
| ≥1100px | Two-column splits, 4-up rails, 5 pipeline stages |
| 720–1099px | Stacked splits, 2-up cards, 3 pipeline stages |
| &lt;720px | Single column, condition-row wrap |
| &lt;1440px | Header drawer (not v4’s shrinking inline nav) |
