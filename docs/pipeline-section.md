# Pipeline section

Pipeline management section (`#pipeline`) in [PipelineSection.tsx](../src/components/PipelineSection.tsx). Replaces the former **Workflow** component. Rendered after **Features** and before **LO Personal Assistant**.

## Purpose

Speaks to independent LOs and broker shops who manage pipelines across spreadsheets and sticky notes. Framed as **CLOSED — Pipeline & production** (stage label from the broker-side process). Three timeline steps plus a closed-loan performance callout.

## Content blocks

| Block | Message |
|-------|---------|
| Full pipeline visibility | Prospect → funded, one screen, no manual spreadsheet date columns |
| Daily summary | Overdue conditions, TRID deadlines, stale files — start day with focus |
| Closed loan performance | Volume, avg loan size, time to close by month/quarter/year |
| Dark callout card | Example production metrics (illustrative) — **light** card with **`text-erp`** accents |

## Layout

- **Surface:** dark `#0a1626`. Below **1440px** the section keeps its original top inset so the intro photo does not meet Features. From **1440px** up, section padding-top is `0` so the photo meets Features; copy keeps the inset via `.pipeline-intro-copy`. Bottom padding is `0` so it meets Memory. Copy and the step grid use `--page-gutter`.
- **Header:** Eyebrow `03 · Closed` (mono, normal weight) + display headline `CLOSED — Pipeline & production` + intro
- Intro row: copy left, [organic photo](./organic-photo.md) on the right (“Every file, one view”)
- Three numbered steps in a grid under the intro. Below `sm` the heading and body sit beside the numeral with tighter padding and type; from `sm` up they stack under it in three columns.

## Navigation

Reached by scrolling past **Features** — no dedicated header link. Anchor: `#pipeline`.

## Content source

Web4 repositioning + earlier pipeline copy — stage-framed as Closed within the broker-side process.
