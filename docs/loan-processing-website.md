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
| `src/config/photos.ts` | Hero video + Closed section photo — [photos.md](./photos.md) |
| `src/context/ContactModalContext.tsx` | Shared `openContactModal` / `closeContactModal` state |
| `src/index.css` | Tailwind layers; **`#root`** flex column; **`.btn-primary-silver`**, **`.layout-shell`**, **`.v4-*`** light homepage system, fluid **`--page-gutter`** — [page-spacing.md](./page-spacing.md), [v4-homepage.md](./v4-homepage.md) |
| `src/components/Header.tsx` | Sticky top navigation; brand tile unchanged; Explore dropdown + Pricing / Team / Contact — [mobile-nav-and-layout.md](./mobile-nav-and-layout.md) |
| `src/components/Hero.tsx` | Light two-column hero (`#top`) with video card — [hero-copy.md](./hero-copy.md), [hero-video.md](./hero-video.md) |
| `src/components/HeroCopy.tsx` | Hero left-column copy + CTAs — [hero-copy.md](./hero-copy.md) |
| `src/components/ProblemSection.tsx` | Overhead tiles (`#problem`) — [problem-section.md](./problem-section.md) |
| `src/components/CapabilityRailSection.tsx` | Four capability jump cards (`#capabilities`) — [capability-rail-section.md](./capability-rail-section.md) |
| `src/components/ProductFeatureSections.tsx` | Intake / Income / Conditions splits + mocks — [product-feature-sections.md](./product-feature-sections.md) |
| `src/components/PipelineSection.tsx` | Pipeline board (`#pipeline`) — [pipeline-section.md](./pipeline-section.md) |
| `src/components/CentralLoanMemorySection.tsx` | Central Loan Memory (`#memory`) — [central-loan-memory-section.md](./central-loan-memory-section.md) |
| `src/components/LOPersonalAssistantSection.tsx` | LO Personal Assistant (`#assistant`) — [lo-personal-assistant-section.md](./lo-personal-assistant-section.md) |
| `src/components/ClosedSection.tsx` | Closed production history (`#closed`) — [closed-section.md](./closed-section.md) |
| `src/components/LosCompatibilityStrip.tsx` | LOS compatibility banner — [los-compatibility-strip.md](./los-compatibility-strip.md) |
| `src/components/TeamSection.tsx` | Team roster on `/team` (`#team`) — [team-section.md](./team-section.md) |
| `src/components/ContactCTA.tsx` | Bottom CTA band (`#contact`) — [contact-cta.md](./contact-cta.md) |
| `src/components/ContactFormModal.tsx` | Netlify contact form popup — [contact-form-modal.md](./contact-form-modal.md) |
| `src/components/Footer.tsx` | Footer branding + social — [footer.md](./footer.md) |

## Homepage section order (`App.tsx`)

See [v4-homepage.md](./v4-homepage.md).

1. Header
2. Hero (`#top`) — light two-column + video card
3. Overhead (`#problem`)
4. Capabilities (`#capabilities`)
5. Intake (`#intake`)
6. Income (`#income`)
7. Conditions (`#conditions`)
8. Pipeline (`#pipeline`)
9. Central Loan Memory (`#memory`)
10. LO Personal Assistant (`#assistant`)
11. Closed (`#closed`)
12. LOS banner
13. Contact (`#contact`)
14. Footer

`/team` is Header → Team (`#team`) → Contact (`#contact`) → Footer. See [team-page.md](./team-page.md).

## Header navigation

| Label | Target | Notes |
|-------|--------|-------|
| Explore | dropdown | Capabilities, Intake, Income, Conditions, Pipeline, Memory, Assistant |
| Pricing | `/#contact` | No `/pricing` route in this repo |
| Team | `/team` | Our team page |
| Contact | `/#contact` on home; `/team#contact` on `/team` | Home: See Mooric ERP in Action. Team: Talk with the team. |
| Book a demo | contact modal | Header chrome / `.btn-primary-silver` unchanged |

Logo links to `/#top`. Hero secondary CTA **See what it does** → `#capabilities`.

Footer is a white band with the header square logo, **Mooric ERP** / **Corporation** wordmark, social icons, and copyright. See [footer.md](./footer.md).

CTA: **Book a demo** → opens contact modal (see [contact-form-modal.md](./contact-form-modal.md))

## Design notes

- **Brand:** Light v4 SaaS page (white, `#f8fafd` / `#f4f8ff` washes, hairline `#e4ebf4`, brand blue `#0075FF`). Header chrome stays. Footer is white with the square nav logo.
- **Audience:** Independent LOs and brokers; practitioner tone.
- **Motion:** Sections use `whileInView`; capability tiles lift on hover unless `prefers-reduced-motion`.
- **Accessibility:** Landmark sections include headings and `aria-labelledby` where appropriate; decorative layers use `aria-hidden`.

## Lint

```bash
npm run lint
```
