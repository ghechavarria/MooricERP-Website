# Hero copy (`HeroCopy.tsx`)

Left column of the light v4 hero. Badge, sentence-case headline, body, CTAs, and three proof stats.

## Headline

*Less Chasing. / More Closings.* Inter 700, `.v4-h1`, `clamp` so it tracks viewport width without `nowrap` overflow.

## Badge

Pill with pulsing ERP-blue dot (`.v4-dot`; animation off when `prefers-reduced-motion: reduce`): *Built for independent loan officers & brokers*.

## CTAs

**Book a demo** opens the contact modal. **See what it does →** scrolls to `#capabilities`. Primary uses `.v4-btn--primary`; secondary is an outlined `.v4-btn--ghost`.

## Stats

`~1 hr` / `1003` / `0` in a wrapping row under a hairline divider. Hero section (`.v4-hero`) uses extra `padding-bottom` so the stats rule does not sit on the overhead kicker.

The serif overlay (*Intelligent mortgage platform* / *Empowering better closings*) lives on the video card in [`Hero.tsx`](../src/components/Hero.tsx), not in this component.
