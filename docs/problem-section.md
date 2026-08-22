# Problem section (`ProblemSection.tsx`)

Dark “The problem” slab that sits between the hero and Central Loan Memory. Ported from the standalone Mooric ERP landing page (`#problem`).

## Purpose

One job: name the overhead that eats an independent LO’s day, then point into **Central Loan Memory** as the answer.

## Placement

Wired in [`src/App.tsx`](../src/App.tsx):

`Hero` → **`ProblemSection`** → mid-page `ContactCTA` (`#early-access`) → `Features` → …

An [organic photo](./organic-photo.md) sits beside the intro and fades into the navy. Crop is `object-position: right 28%` so the man on the right edge stays the focus as the frame narrows.

## Content

- **Eyebrow:** `01 · The problem` (mono, `text-erp`)
- **Headline:** Where does your day actually go? (`.display-heading`, white)
- **Support:** Overhead between borrowers / guidelines / deals; same file handled five ways in five places
- **Four metric cards** (silver-gray tabular stats, `text-slate-500`):
  - **3×** — The same data, re-typed
  - **17** — Emails to clear one condition
  - **5+** — Tools that don't talk
  - **9 PM** — When you find out something slipped
- **CTA bar:** “None of this is loan officer work…” + **See how ↓** → `#features` (02 · Broker-side process)

## Surface

- Section: `.section-marketing`, `scroll-mt-8`, navy
- Metric tiles: `.problem-metric-grid` — inner hairlines only. 1 col → 2 col (`sm`) → 4 col (`lg`). Below `sm`, the title sits beside the stat (same pattern as Pipeline steps) with tighter padding. Right-edge borders are omitted on the last cell of each row (`odd` at 2-col, `4n` at 4-col) so a stray outer rule does not appear while resizing.
- Layout: `.layout-shell`
- Motion: Framer `whileInView`

## Files

- [`src/components/ProblemSection.tsx`](../src/components/ProblemSection.tsx)
- [`src/App.tsx`](../src/App.tsx)
