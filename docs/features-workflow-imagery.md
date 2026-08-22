# Features & Workflow section

Marketing section in [`Features.tsx`](../src/components/Features.tsx): copy-only intro → four-quadrant process grid.

## Section header

- **Eyebrow:** `02 · Broker-side process` (mono, `text-erp`)
- **Headline:** “The work you do every day — without the manual overhead.”
- Supporting copy covers application → program fit → conditions → closing deadlines

Intro copy spans the full content width (same gutters as the file grid). There is no editorial photo or workspace scribble; see [features-workspace-scribble.md](features-workspace-scribble.md).

## Feature grid

Staggered hanging-file sheets (`sm:grid-cols-2`) with generous gaps. Each file is unique:

- **Offset tabs** (left / inner-right / inner-left / right) like a real hanging-file drawer, Inter labels with a stage icon
- **Stacked sheets** behind a near-white body (`rgb(255 255 255 / 0.92)`) with an ERP-blue hairline
- **Stage marks** — document, search, checklist, calendar — on a stronger ERP wash
- Tabs are solid white with ERP tick and label

| Stage | Headline |
| --- | --- |
| Loan application | Complete loan application, faster |
| Program matching | Fit the borrower to the right program |
| Conditions | Condition tracking |
| Closing deadlines | TRID, Title, HOI, and Appraisal tracking |

Intro copy is capped at `max-w-3xl`; the headline at `max-w-5xl`. Gutters use `.layout-shell` / `.page-gutter-x`. File body padding is a `clamp` on `.glass-folder__body`. Section padding follows `.section-marketing`. See [page-spacing.md](./page-spacing.md) and [section-glass.md](./section-glass.md).
