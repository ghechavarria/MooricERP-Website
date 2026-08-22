# ProductionGlanceSection

**Your production at a glance** band — sits under the hero’s blue ticker.

Stats sit in clay `.neu-pad` tiles with unique marks: bars (volume), house (loan size), hourglass (days). Vertical padding follows the shared fluid band (`clamp` on `#production-glance`). The inner grid uses `.layout-shell` so it tracks `--page-gutter` with the rest of the page.

Mono eyebrows / labels use **`text-[13px]`** (eyebrow) and **`text-[12px]`** (stat labels), **`font-normal`** — slightly larger for readability, not bold. Matching section eyebrows elsewhere use the same **`13px` / normal** treatment.

## File

[`src/components/ProductionGlanceSection.tsx`](../src/components/ProductionGlanceSection.tsx)
