# Mooric ERP static assets

## Logo lockups (SVG)

All logo files under [`public/images`](../public/images) are kept on disk.

| File | Use |
| --- | --- |
| [square-logo-blue.svg](../public/images/square-logo-blue.svg) | **Header** and **footer** tile beside the **Mooric ERP** wordmark |
| [square-logo-blue.png](../public/images/square-logo-blue.png) | **Favicon** / tab icon via `index.html` (see [favicon.md](./favicon.md)) |
| [square-logo-black.svg](../public/images/square-logo-black.svg) | Kept on disk |
| [square-logo-white.svg](../public/images/square-logo-white.svg) | Kept on disk |
| [square-logo-color.svg](../public/images/square-logo-color.svg) | Kept on disk |
| [square-logo-color-bkgrnd.svg](../public/images/square-logo-color-bkgrnd.svg) | Kept on disk |
| [full-logo.svg](../public/images/full-logo.svg) | Kept on disk |
| [full-logo-no-background.svg](../public/images/full-logo-no-background.svg) | Kept on disk |
| [short-logo.svg](../public/images/short-logo.svg) | Kept on disk |
| [short-logo-black.svg](../public/images/short-logo-black.svg) | Kept on disk |
| [short-logo-white.svg](../public/images/short-logo-white.svg) | Kept on disk |
| [short-logo-no-background.svg](../public/images/short-logo-no-background.svg) | Kept on disk |

Header and footer both use **`square-logo-blue.svg`** in a square tile with **`object-cover`**. Footer adds **Corporation** under the **Mooric ERP** wordmark on a white band. Main sections use **`.layout-shell`**; the sticky header uses fluid **`.layout-header`** — see [layout-shell.md](./layout-shell.md).

## Other live assets

| File | Use |
| --- | --- |
| [`public/videos/853840-hd_1920_1080_25fps.mp4`](../public/videos/853840-hd_1920_1080_25fps.mp4) | Hero video — [hero-video.md](./hero-video.md) |
| [`public/images/photos/premium_photo-1661440102417-fe9ea01d0518.jpg`](../public/images/photos/premium_photo-1661440102417-fe9ea01d0518.jpg) | Closed section photo |
| [`public/images/team/*.webp`](../public/images/team) + `.jpg` | Team portraits — [team-section.md](./team-section.md) |

## Theme reference

- [silver-accent-palette.md](./silver-accent-palette.md) — `accent` / `accent-light` silver tokens
- [button-primary-silver.md](./button-primary-silver.md) — primary CTA class (`erp` blue)
- [favicon.md](./favicon.md) — tab icon
