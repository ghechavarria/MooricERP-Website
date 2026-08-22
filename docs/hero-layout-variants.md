# Hero layout

[`Hero.tsx`](../src/components/Hero.tsx) is a **split banner**:

1. **On-photo title** — *Intelligent mortgage platform / Empowering better closings* in Source Serif 4 over the right-hand photo (55% width). Sentence case, medium weight; the second line is italic.
2. **Navy left column** (~45%) — one vertically centered stack: *Less chasing paperwork / More time closing loans* (luminous silver), body, CTAs, then stats. The AI pill sits on the photo under the title.
3. **Straight edge** — photo starts at 45% with an 70% `#0075ff` overlay. See [hero-rip.md](hero-rip.md).

On viewports below 1100px the photo (with the overlay H1) is full-bleed under the session pulse (`aspect-ratio: 5 / 3`, `max-height: 38svh`). Support copy and stats follow, centered, without stretching the hero to full viewport height. The stacked copy cluster is full width (not a nested container). Desktop (`min-width: 1100px`) is the split banner. See [page-spacing.md](./page-spacing.md).

The 1003 / Conditions / Closing track panel lives in Central Loan Memory, not the hero.
