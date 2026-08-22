# Hero visual (organic photo)

The hero (`#top`) is a split banner: copy on the navy left (~45%), editorial photo on the right (55%), neon-blue wash on the photo. See [hero-rip.md](./hero-rip.md).

## Layout

Implemented in [Hero.tsx](../src/components/Hero.tsx):

1. Session pulse strip + bottom tagline ([HeroSessionPulse.tsx](../src/components/HeroSessionPulse.tsx))
2. **Desktop:** support copy + CTAs left ([HeroCopy.tsx](../src/components/HeroCopy.tsx)); photo right (55%) with a neon-blue tint and the main headline in Source Serif 4 on the photo. Below 1100px: stacked copy then photo with the headline on the photo. Soft ERP-blue stack wash behind the band on one-column only — see [hero-section-background.md](./hero-section-background.md).
3. Silver/light-gray session pulse strip at top; brand-blue tagline strip at the bottom of the hero

The **1003 / Conditions / Closing** track panel lives in [Central Loan Memory](../src/components/CentralLoanMemorySection.tsx) (`#memory`) — see [central-loan-memory-section.md](./central-loan-memory-section.md).

## Navigation

- **See why it's different** CTA in hero copy links to `#features` (02 · Broker-side process).

## Related

- [organic-photo.md](./organic-photo.md) — column photos, fade mask, captions
- [hero-rip.md](./hero-rip.md) — 55% photo pane, overlay title
- [hero-section-background.md](./hero-section-background.md) — hero surface and pulse strip
- [before-after-demo.md](./before-after-demo.md) — unused mock (kept in repo)
- [zoomable-product-view.md](./zoomable-product-view.md) — unused zoom wrapper (kept in repo)
