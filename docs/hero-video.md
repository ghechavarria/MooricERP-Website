# Hero video

The hero right pane plays [`public/videos/853840-hd_1920_1080_25fps.mp4`](../public/videos/853840-hd_1920_1080_25fps.mp4). Path is `SITE_PHOTOS.hero.video` in [`src/config/photos.ts`](../src/config/photos.ts). Markup is in [`Hero.tsx`](../src/components/Hero.tsx) (`.v4-hero-video`).

## Behavior

Muted, looping, autoplaying `playsInline` video with `preload="auto"`. There is no `poster` image — the first decoded frame of the MP4 fills the card until playback starts. Overlay copy and the blue veil sit on top.

Decorative (`aria-hidden`).

## Hero carousel (YouTube slide)

`src/components/Hero.tsx`. The YouTube video is `BI5DlHQgo5w` (`HERO_YOUTUBE_ID`).

- **Side by side (wider than 1099px):** the whole hero is a two-slide carousel. Slide 1 is the overview (copy and the blue card); slide 2 is the YouTube video filling the same box, both columns wide and the overview's height, so nothing jumps.
- **Stacked (1099px and narrower, `HERO_STACKED_QUERY`):** the copy stays in place and only the blue card carousels, to the YouTube video at the card's size.

It never moves on its own; arrows, dots, swipe (touch and pen) and the Left/Right keys move it. Hidden slides are `inert` and `aria-hidden`, and only the visible slide takes clicks (the transformed strip paints above the controls otherwise).

Before play, slide 2 shows the YouTube thumbnail (largest available, 1280x720) under a brand gradient with "See Mooric ERP in action" and a **Watch the video** button (phones get the button only). Nothing loads from YouTube until someone presses it; then the video plays in the privacy-enhanced player (`www.youtube-nocookie.com`), and leaving the slide stops it. `scripts/write-headers.mjs` allows both hosts in the CSP (`img-src`, `frame-src`).
