# Broker process-flow section

Four-stage loan journey (`#process`) in [`BrokerProcessFlowSection.tsx`](../src/components/BrokerProcessFlowSection.tsx). The [LOS compatibility strip](./los-compatibility-strip.md) sits directly under the stage cards in the same section.

## Purpose

Positions Mooric as **one workspace for the entire broker-side process** — stages inside one system, not standalone features.

## Stages

| Stage | Mark | Line |
|-------|------|------|
| Prospect | Person + | Every lead and conversation logged, ready to become a file. |
| Application & Setup | Inbox download | Upload borrower docs — AI completes the 1003, you review side by side. |
| Processing | Cog | Conditions, TRID deadlines, title, HOI, appraisal — tracked on one screen, updated as things come in. |
| Closed | Key | Clean handoff, full file history, audit-ready records. |

Stage marks are unique across the site (not reused from Features, Assistant, Production Glance, or other process columns).

## Layout

- Eyebrow `End to end` + serif headline + short intro
- Horizontal numbered stage tiles on `lg+` (4 columns); stacked on smaller viewports. Below `lg`, the stage name sits beside the numeral and column padding is tighter.
- Each column pairs the stage mark with the numeral at the same size (icon `1em` of `.swiss-num`). Closed uses a check-in-circle (pipeline complete), not a house key.
- Surface: Swiss white with hairline `.swiss-rail` (see [section-glass.md](./section-glass.md)); padding `pb-0 pt-16 sm:pb-12 sm:pt-20`. On mobile the LOS strip’s `mt-10 mb-10` is the equal space above and below that lockup.
- LOS copy sits under the rail with a circular MISMO 3.4 `.glass-stamp` (`#los`)

## Related framing

Feature cards and the pipeline section reuse these stage names as labels (see Features / Pipeline docs).
