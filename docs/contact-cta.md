# Contact CTA (`ContactCTA.tsx`)

Three placements share the contact modal. Blues and wording differ so they don’t read as the same block.

| Placement | `sectionId` | `headingId` | `tone` | `page` | Surface | Headline |
|-----------|-------------|-------------|--------|--------|---------|----------|
| After Problem (homepage) | `#early-access` | `early-access-heading` | `bright` | `home` | ERP blue `#0075FF` | Get early access — first month free. |
| Above footer (homepage) | `#contact` | `cta-heading` | `deep` | `home` (default) | Navy `#082F7C` | See Mooric ERP on a real file — first month free. |
| Above footer (`/team`) | `#contact` | `cta-heading` | `teal` | `team` | `#0053b5` | Talk with the team — first month free. |

Props default to the homepage footer band (`sectionId="contact"`, `headingId="cta-heading"`, `tone="deep"`, `page="home"`).

## Mid-page (`bright`)

- Eyebrow: `Let's talk`
- Body: one workspace for the broker-side process; leave info, personal follow-up
- Button: filled white **Get early access** (same invert-on-hover as the footer band)

## Homepage footer (`deep`)

- Eyebrow: `Your next step`
- Body: you've seen the stages; one workspace from prospect to closed
- Button: filled white **Request a walkthrough**

## Team page (`page="team"`)

- Eyebrow: `The people behind it`
- Body: questions about Mooric, working with independent LOs, or early access
- Surface: `#0053b5` (`tone="teal"`), filled white **Get in touch**

All three open the contact modal (`walkthrough`). Hidden when `SHOW_CONTACT_ACTIONS` is false.

Vertical padding is a larger fluid band than `.section-marketing` (`clamp(5rem, 3rem + 5.5vw, 9rem)`). The inner rail is `.layout-shell`. The title uses `.display-heading`. See [page-spacing.md](./page-spacing.md).
