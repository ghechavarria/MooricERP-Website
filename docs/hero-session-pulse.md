# Hero session pulse (`HeroSessionPulse.tsx`)

Decorative **session pulse** for the marketing hero: a **live-styled** monitor strip (not connected to real tenant telemetry).

## Theme

**Top session strip:** calm silver/light-gray (`bg-organ-100`, `border-organ-200`) with dark organ text, soft gray ECG wave, and **Live** pill on white — intentionally **not** restyled when the hero went dark. **Children block** is transparent so the dark hero gradient shows through. **Bottom strip** is the scrolling product ticker on ERP blue (`bg-erp`, `border-erp-600`, `text-white/90`).

## Layout (current)

Used from [Hero.tsx](../src/components/Hero.tsx) as a full-bleed slab:

1. **Session pulse bar** — Live pill, “Session pulse” label, rotating status (shortened below `sm`, hidden below 400px), ECG wave. Instrument chrome is **`aria-hidden`**.
2. **Children** — transparent stack band between the pulse and ticker. Hero copy applies `layout-header` padding; the editorial photo is an absolute right pane (`.organic-photo--hero`).
3. **Hero ticker** — seamless marquee of product phrases (see below).

`.layout-header-px` aligns pulse/ticker content with the sticky header rail.

## Bottom ticker

- Phrases: Built for independent loan officers · 1003 auto-filled from documents · Conditions tracked in one place · TRID · Title · HOI · Appraisal deadlines · Central Loan Memory on every file · No more Excel pipelines
- Colors: `bg-erp`, `border-erp-600`, phrase text `text-white/90`, separator dots `bg-white/55`
- Animation: **`.hero-ticker-track`** / `@keyframes hero-ticker-marquee` in [index.css](../src/index.css) — **160s** linear crawl, duplicated track for seamlessness; **pause on hover**
- Type: mono `text-[11px]`, tracking `0.14em`; strip padding **`py-2.5`**
- Compositor hints: `backface-visibility: hidden`, `transform: translateZ(0)` to reduce blur/jitter
- `prefers-reduced-motion`: static first phrase only (no scroll)

## Behavior

- **Heartbeat / ECG:** ECG drift runs at **25 BPM** (~2.4s per beat) via `--ecg-beat`. Status lines rotate on their own **2.5s** timer (independent of the wave). Compact wave below `sm`.
- **Status lines:** Mortgage-operations teaser copy. Below `sm`, shortened copy + compact `7rem` wave so Live / Session pulse / status / wave stay one line. Below 400px, status is hidden.

## Ethics / UX

The **pulse chrome** and ticker are decorative and **`aria-hidden`**. The hero **`children`** carry the real message; an **`sr-only`** line in `Hero.tsx` notes that the strip above is illustrative.
