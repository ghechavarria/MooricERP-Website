# Optimize team photos (`optimize-team-photos.mjs`)

Portraits in [`public/images/team`](../public/images/team) are large source PNGs (some over 5MB) shown at **220px** CSS. The page must not request those files.

## Command

```bash
npm run optimize:team
```

Uses **sharp** to write **440×550** (2× the frame) `{slug}.webp` and `{slug}.jpg` next to each PNG. Re-run after replacing a source PNG.

## Serving

[`TeamSection.tsx`](../src/components/TeamSection.tsx) uses `<picture>`: WebP first, JPEG fallback. First four portraits load eagerly; the rest are lazy.
