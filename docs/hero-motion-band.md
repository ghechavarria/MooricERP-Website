# Hero motion band (`HeroMotionBand.tsx`)

Full-bleed **dark navy** strip with a **blueprint** ground and the **Mooric ERP** wordmark. **Hidden** — the component remains in the repo but is not mounted. `/team` starts at [`TeamSection`](../src/components/TeamSection.tsx).

## Visual ingredients

- **Base:** Near-black navy (`#050A14`)
- **Corner glow:** Teal top-right, royal blue bottom-left, soft dark center wash
- **Ground:** Dashed orbits around the wordmark, crosshair, corner ticks (`text-accent/40`)
- **Scan:** Thin silver gradient line moves vertically when motion is allowed; static mid-line when reduced motion is preferred
- **Word:** **Mooric ERP** — shimmering `accent` → white gradient, uppercase
- **Copy cluster:** centered `sm:w-[55%]` so the label, wordmark, and body are 45% narrower than the shell
- **Inner rail:** `py-36 sm:py-48 lg:py-56`

## Motion safety

`useReducedMotion()` disables the scan line and title glow.

## Tokens

Uses **`accent`**, navy/teal/blue radials, `shimmer-slow`.
