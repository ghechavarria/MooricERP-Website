# Hero video

The hero right pane plays [`public/videos/853840-hd_1920_1080_25fps.mp4`](../public/videos/853840-hd_1920_1080_25fps.mp4). Path is `SITE_PHOTOS.hero.video` in [`src/config/photos.ts`](../src/config/photos.ts). Markup is in [`Hero.tsx`](../src/components/Hero.tsx) (`.v4-hero-video`).

## Behavior

Muted, looping, autoplaying `playsInline` video with `preload="auto"`. There is no `poster` image — the first decoded frame of the MP4 fills the card until playback starts. Overlay copy and the blue veil sit on top.

Decorative (`aria-hidden`).
