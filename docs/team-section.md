# Team section (`TeamSection.tsx`)

Renders **`#team`** on **[`/team`](./team-page.md)** (not on the homepage). Seven people on a **light v4** band.

## Layout

- Surface: white page; portraits in rounded `#e4ebf4` frames; name plates as light wash cards
- Desktop content rail capped at **`max-w-5xl`**
- Intro kicker + **Our team** centered; subtitle spans the team rail
- Subtitle line break after **“platform”** when the team rail is too narrow (`@container/team`)
- Single `flex-wrap` row; section padding comes from `.v4-section` (top and bottom)
- Mobile: two columns (`calc(50% - 0.75rem)`)
- Portraits **4:5**, capped at 220px, 5px ERP bar along the bottom edge
- Photos served as WebP with JPEG fallback from [`public/images/team`](../public/images/team) (`{slug}.webp` / `{slug}.jpg`)
