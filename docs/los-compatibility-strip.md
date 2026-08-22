# LOS compatibility strip

Compact copy block rendered **inside** the [broker process-flow section](./broker-process-flow-section.md), directly under the End to end stage cards. Implemented as [`LosCompatibilityStrip.tsx`](../src/components/LosCompatibilityStrip.tsx). Anchor: `#los`.

## Purpose

Addresses the primary buying objection (fear of switching systems). States that Mooric **works alongside** an existing LOS — not that it integrates with or replaces one.

## Copy

> Works alongside your existing LOS. Run your entire process in Mooric, then hand off a clean MISMO 3.4 file when it's time to submit. No migration, no rip-and-replace.

Wording rule: use **alongside** only — never “integrates with.”

## Layout

Centered lockup with matching vertical space on mobile (`mt-10 mb-10`); from `sm` up, `mt-12` and section padding `sm:pb-12`. Circular tilted MISMO 3.4 `.glass-stamp` beside the paragraph. Solid white fill, `2.5px` `#0075ff` outer ring, dashed inner ring, inset blue band, `#0060d6` type — no backdrop blur so the seal stays sharp on white.
