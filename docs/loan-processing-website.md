# Mooric ERP marketing site

React application for **Mooric ERP** — mortgage origination software aimed at **independent loan officers and mortgage brokers**. Copy emphasizes day-to-day LO work: completing the 1003, matching programs, tracking conditions, managing pipeline without spreadsheets, and **Central Loan Memory** as the core differentiator.

Routes: **`/`** (homepage) and **`/team`** (Our Team). See [team-page.md](./team-page.md).

## Stack

- **Vite** — dev server and production build
- **React 19** with **TypeScript**
- **React Router** — `/` and `/team`
- **Tailwind CSS** — layout, typography, and theme tokens (`tailwind.config.js`)
- **Framer Motion** — entrance animations, scroll reveals, floating gradients

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

`preview` serves the production build for a quick smoke test.

## Project layout

| Path | Purpose |
|------|---------|
| `index.html` | HTML shell, fonts, page title, meta description, **hidden Netlify form**, **PNG favicon** (`/images/square-logo-blue.png` — see [favicon.md](./favicon.md)) |
| `src/main.tsx` | React bootstrapping + `BrowserRouter` |
| `src/App.tsx` | Routes, homepage section order; **`ContactModalProvider`**; **`ContactFormModal`** at root |
| `src/config/photos.ts` | Editorial photo map — [organic-photo.md](./organic-photo.md) |
| `src/context/ContactModalContext.tsx` | Shared `openContactModal` / `closeContactModal` state |
| `src/index.css` | Tailwind layers; **`#root`** flex column; **`.btn-primary-silver`**, **`.layout-shell`**, **`.layout-header`**, fluid **`--page-gutter`** — [page-spacing.md](./page-spacing.md), [layout-shell.md](./layout-shell.md) |
| `src/components/Header.tsx` | Sticky top navigation; brand tile **`/images/square-logo-blue.svg`** beside wordmark |
| `src/components/Hero.tsx` | Two-column hero (`#top`) with organic photo — [hero-product-preview.md](./hero-product-preview.md) |
| `src/components/HeroCopy.tsx` | Shared hero copy + CTAs — [hero-copy.md](./hero-copy.md) |
| `src/components/HeroSessionPulse.tsx` | Session pulse strip + ticker — [hero-session-pulse.md](./hero-session-pulse.md) |
| `src/components/OrganicPhoto.tsx` | Intro-row photos with a fade into the section; hero uses a 55% photo pane — [organic-photo.md](./organic-photo.md), [hero-rip.md](./hero-rip.md) |
| `src/components/BeforeAfterDemo.tsx` | Unused product mock (kept in repo) — [before-after-demo.md](./before-after-demo.md) |
| `src/components/ZoomableProductView.tsx` | Unused zoom wrapper (kept in repo) — [zoomable-product-view.md](./zoomable-product-view.md) |
| `src/components/ProductionGlanceSection.tsx` | Production glance band — [ProductionGlanceSection.md](./ProductionGlanceSection.md) |
| `src/components/ProblemSection.tsx` | Pain section (`#problem`) — [problem-section.md](./problem-section.md) |
| `src/components/Features.tsx` | Broker-side process (`#features`) — [features-workflow-imagery.md](./features-workflow-imagery.md) |
| `src/components/PipelineSection.tsx` | Pipeline management (`#pipeline`) — [pipeline-section.md](./pipeline-section.md) |
| `src/components/CentralLoanMemorySection.tsx` | Central Loan Memory (`#memory`) — [central-loan-memory-section.md](./central-loan-memory-section.md) |
| `src/components/LOPersonalAssistantSection.tsx` | LO Personal Assistant (`#assistant`) — [lo-personal-assistant-section.md](./lo-personal-assistant-section.md) |
| `src/components/BrokerProcessFlowSection.tsx` | End-to-end process (`#process`) — [broker-process-flow-section.md](./broker-process-flow-section.md) |
| `src/components/LosCompatibilityStrip.tsx` | LOS compatibility (`#los`) — [los-compatibility-strip.md](./los-compatibility-strip.md) |
| `src/components/HeroMotionBand.tsx` | Blueprint / Mooric ERP band — hidden, not mounted — [hero-motion-band.md](./hero-motion-band.md) |
| `src/components/HeroLattice.tsx` | Decorative lattice SVG — [hero-lattice.md](./hero-lattice.md) |
| `src/components/TeamSection.tsx` | Team roster on `/team` (`#team`) — [team-section.md](./team-section.md) |
| `src/components/ContactCTA.tsx` | Early-access bands (`#early-access`, `#contact`) — [contact-cta.md](./contact-cta.md) |
| `src/components/ContactFormModal.tsx` | Netlify contact form popup — [contact-form-modal.md](./contact-form-modal.md) |
| `src/components/Footer.tsx` | Footer branding + social |

## Homepage section order (`App.tsx`)

1. Header
2. Hero (`#top`) — organic photo in the right column
3. Production Glance (`#production-glance`)
4. Problem (`#problem`)
5. Mid-page Contact (`#early-access`)
6. Features (`#features`)
7. Pipeline (`#pipeline`)
8. Central Loan Memory (`#memory`)
9. LO Personal Assistant (`#assistant`)
10. Broker process / end to end (`#process`) — includes LOS copy (`#los`)
11. Contact (`#contact`)
12. Footer

`/team` is Header → Team (`#team`) → Contact (`#contact`) → Footer. See [team-page.md](./team-page.md).

## Header navigation

| Label | Target | Section |
|-------|--------|---------|
| Why switch | `/#problem` | 01 · The problem |
| Process | `/#features` | 02 · Broker-side process |
| Loan Memory | `/#memory` | Central Loan Memory |
| The Team | `/team` | Our team page |

Sales path: pain → mid CTA → broker process → differentiator. Logo links to `/#top`. Hero secondary CTA **See why it's different** → `#features` (02). Pipeline, LO Assistant, and Contact have no dedicated nav item.

Footer is logo + social icons + copyright only (no link row). Header holds section navigation.

CTA: **Get early access** → opens contact modal (see [contact-form-modal.md](./contact-form-modal.md))

## Design notes

- **Brand:** Mooric ERP — **dark** signature bands (hero, problem, pipeline, memory, blueprint band, CTAs) alternating with **mixed** light languages (neumorphism, glass, neo-brutalism, Swiss, print — see [section-glass.md](./section-glass.md)), **brand blue** `#0075FF`.
- **Audience:** Independent LOs and brokers; practitioner tone per [Web 1.docx](./Web 1.docx). Editorial photos fill the intro column and fade into the section ([organic-photo.md](./organic-photo.md)).
- **Motion:** Sections use `whileInView` for scroll-triggered motion; hero strip uses CSS-driven ECG drift and ticker marquee (see [hero-session-pulse.md](./hero-session-pulse.md)).
- **Accessibility:** Landmark sections include headings and `aria-labelledby` where appropriate; decorative layers use `aria-hidden`.

## Lint

```bash
npm run lint
```
