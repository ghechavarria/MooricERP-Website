# Team page (`/team`)

Our Team is a dedicated route, not a homepage section. React Router (`react-router-dom`) serves `/` and `/team`.

## Routes

Wired in [`src/main.tsx`](../src/main.tsx) (`BrowserRouter`) and [`src/App.tsx`](../src/App.tsx):

| Path | Content |
|------|---------|
| `/` | Marketing homepage (no team roster) |
| `/team` | [`TeamSection`](../src/components/TeamSection.tsx) → footer [`ContactCTA`](../src/components/ContactCTA.tsx) (`#contact`, `page="team"`, `tone="teal"`) |

Shared shell: Header, Footer, `ContactFormModal`. `ScrollToHash` scrolls to `#problem` / `#features` / `#memory` / `#top` after client navigation.

## Navigation

[`Header.tsx`](../src/components/Header.tsx):

| Label | Target |
|-------|--------|
| Logo | `/#top` |
| Why switch | `/#problem` |
| Process | `/#features` |
| Loan Memory | `/#memory` |
| The Team | `/team` |

Hash links work from the team page because they go through `/` first.

## Deploy

Netlify SPA fallback in [`netlify.toml`](../netlify.toml) rewrites `/*` → `/index.html` (`200`) so `/team` does not 404. See [netlify-toml.md](./netlify-toml.md).

## Related

- [hero-motion-band.md](./hero-motion-band.md) — blueprint band (kept in repo, not mounted)
- [team-section.md](./team-section.md) — roster layout and portraits
- [contact-cta.md](./contact-cta.md) — early-access bands
