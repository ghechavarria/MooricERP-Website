# Hero video

The hero right pane plays [`public/videos/853840-hd_1920_1080_25fps.mp4`](../public/videos/853840-hd_1920_1080_25fps.mp4). Path is `SITE_PHOTOS.hero.video` in [`src/config/photos.ts`](../src/config/photos.ts). Markup is in [`Hero.tsx`](../src/components/Hero.tsx) (`.v4-hero-video`).

## Behavior

Muted, looping, autoplaying `playsInline` video with `preload="auto"`. There is no `poster` image — the first decoded frame of the MP4 fills the card until playback starts. Overlay copy and the blue veil sit on top.

Decorative (`aria-hidden`).

## Hero carousel (YouTube slide)

The hero is a two-slide carousel (`src/components/Hero.tsx`): slide 1 is the overview above (copy plus the looping background video), slide 2 is the YouTube video `BI5DlHQgo5w` at full rail width, 16:9. It never moves on its own; arrows, dots, swipe (touch and pen) and the Left/Right keys move it, and the frame takes the visible slide's height. The hidden slide is `inert` and `aria-hidden`.

Slide 2 shows the YouTube thumbnail (`i.ytimg.com`) with a play button. Nothing loads from YouTube until someone presses play, then the video plays in the privacy-enhanced player (`www.youtube-nocookie.com`). Leaving the slide stops it. `scripts/write-headers.mjs` allows both hosts in the CSP (`img-src`, `frame-src`). To change the video, change `HERO_YOUTUBE_ID`.
