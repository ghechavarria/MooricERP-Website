# Hero photo pane

The hero is a **split banner**: navy copy on the left (~45%), looping desk **video** on the right (**55%**). There is no torn-paper seam — a straight edge.

## Layout

- **Video** — right pane (`inset: 0 0 0 45%`), full-bleed in that 55%. File: `853840-hd_1920_1080_25fps.mp4`. See [hero-video.md](./hero-video.md).
- **Neon blue wash** — a `#0075ff` panel at **70% opacity** over the video. A light radial scrim sits behind the title
- **Headline** — “Intelligent mortgage platform / Empowering better closings” over the photo in Source Serif 4 (sentence case, medium weight, italic second line)
- **Support copy** — left column is `max-width: 45%` and stays on the navy

Below `1100px` the photo is full-bleed under the session pulse (`aspect-ratio: 5 / 3`, `max-height: 38svh`); support copy follows, centered.

[`ripped-border.svg`](../public/images/photos/ripped-border.svg) and the vertical sibling remain on disk unused.

## Markup

[`Hero.tsx`](../src/components/Hero.tsx) renders `.hero-photo-stack` (video + on-photo headline). [`OrganicPhoto`](../src/components/OrganicPhoto.tsx) uses `videoSrc` plus `rip` for the tint overlay.
