# Organic photos (`OrganicPhoto.tsx`)

Editorial stock photos from [`public/images/photos`](../public/images/photos). Each sits in its section’s **intro row** and argues that section’s claim.

On two-column layouts, outer corners are rounded (`1.5rem`) except the Pipeline intro photo (`.organic-photo--square`); the faded inner edge stays square. Below `lg` (one column), non-hero photos go square-cornered and full page width (break out of `.layout-shell` via `--page-gutter`). The inner-edge fade stays.

## Component

[`src/components/OrganicPhoto.tsx`](../src/components/OrganicPhoto.tsx) renders:

- `side: "left" | "right"` — inner edge fades toward the copy (non-hero)
- `rip` — hero only: `#0075ff` overlay at 70% opacity
- `videoSrc` — hero only: muted looping MP4; `src` is the poster still
- Optional `caption` — mono / uppercase, white over the photo
- `object-cover` + per-photo `objectPosition`
- `eager` for the hero (LCP); others lazy-load

Styles: `.organic-photo`, `--left` / `--right` masks, `.organic-photo--hero`, `.organic-photo__caption` in [`src/index.css`](../src/index.css).

## Photo map

Paths and captions are in [`src/config/photos.ts`](../src/config/photos.ts).

| Slot | File | Side | Caption |
|------|------|------|---------|
| Hero intro | `premium_photo-1722945721854-7f3ab4035a89.jpg` (poster) + `853840-hd_1920_1080_25fps.mp4` | right | One desk. One file. |
| Problem intro | `vitaly-gariev-sziDbsUZsok-unsplash.jpg` | right | The overhead between deals |

Problem crop: `object-position: right 28%` so the man on the right stays in frame as the photo is covered.
| Pipeline intro | `premium_photo-1661440102417-fe9ea01d0518.jpg` | right | Every file, one view |
| Memory intro | `vitaly-gariev-dMiw0B4v6iQ-unsplash.jpg` | left | The workspace already knows |

`SITE_PHOTOS.features` (`premium_photo-1752380337760-aa62cbe74b15.png`) remains in config and on disk unused. Features is copy-only. `vitaly-gariev-Q0EHZjM8gvk-unsplash.jpg`, `vitaly-gariev-oui8D2QGQcQ-unsplash.jpg` and `vitaly-gariev-272ClcPZ2Qs-unsplash.jpg` also remain unused.

Product mock components (`BeforeAfterDemo`, `MooricLoanExamplePanel`, `MooricPipelineExamplePanel`, `ZoomableProductView`) remain in the repo but are not mounted.
