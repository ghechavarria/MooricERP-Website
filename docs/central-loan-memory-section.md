# Central Loan Memory section

Dedicated marketing section (`#memory`) in [CentralLoanMemorySection.tsx](../src/components/CentralLoanMemorySection.tsx). Rendered in [App.tsx](../src/App.tsx) after **PipelineSection** and before **LOPersonalAssistantSection**.

## Purpose

Presents **Central Loan Memory** as Mooric ERP’s core differentiator — not buried in the feature grid. Copy explains how the system retains full borrower context as documents arrive, contrasts with step-by-step task tools, and highlights the practical outcome (~1 hr saved per file) plus compliance logging.

## Layout

Locked to the **Lanes** comparison: two real columns (without | with). On `sm+` they sit side by side. Below `sm`, the **without** copy still shows, then the **with** column (copy, solid cards, **Full borrower context — retained**). The dashed without-memory track cards and **Borrower context — lost** outcome are hidden on mobile. A second card holds the recommendations band and `MemoryPayoffFooter`.

Shared pieces:

- `MemoryIntro` — eyebrow, headline, lead paragraph, with an [organic photo](./organic-photo.md) on large screens
- `MemoryPayoffFooter` — `~1 hr` stat + compliance note
- Same copy constants (`contrasts`, `tracks`, `memoryStat`, `complianceNote`)

## Look

- Section surface: dark `#0a1626`; padding `pb-16 pt-28 sm:pb-24 sm:pt-36`; intro type in white / slate-300
- Comparison card: white with `#e7ebf1` borders, cool slate type, blue accent `#2563eb`
- Fragmented side: dashed borders, muted slate, “reset” / “lost” language
- **Lanes:** comparison card ends at the outcome row. Recommendations fill the **full top band** of a second card; `MemoryPayoffFooter` sits below.

## Shared content

- **Eyebrow:** `04 · Core differentiator`
- **Headline:** Central Loan Memory
- **Contrasts:** separate tasks → Central Loan Memory → full-file recommendations
- **Tracks:** 1003, Conditions, Closing
- **Stat:** `~1 hr` saved per file on loan structuring

## Navigation

Reached via **Loan Memory** in the nav (`#memory`). Problem section **See how ↓** → `#memory`.

## Content source

Standalone Mooric ERP landing (`#memory` / Core differentiator).
