# Hero video

The hero right pane plays [`public/videos/853840-hd_1920_1080_25fps.mp4`](../public/videos/853840-hd_1920_1080_25fps.mp4) instead of a still. Path is `SITE_PHOTOS.hero.video` in [`src/config/photos.ts`](../src/config/photos.ts).

## Behavior

[`OrganicPhoto`](../src/components/OrganicPhoto.tsx) takes `videoSrc`. When set, it renders a muted, looping, autoplaying `playsInline` video with the same `.organic-photo__img` crop/cover styles as the stills. The former hero JPEG is the `poster` so the frame is filled before the file starts. The 70% `#0075ff` wash and on-photo headline are unchanged — see [hero-rip.md](./hero-rip.md).

Decorative (`aria-hidden`). The still remains on disk for the poster.
