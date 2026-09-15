# Team page (`/team`)

Our Team is a dedicated route, not a homepage section. React Router (`react-router-dom`) serves `/` and `/team`.

## Routes

Wired in [`src/main.tsx`](../src/main.tsx) (`BrowserRouter`) and [`src/App.tsx`](../src/App.tsx):

| Path | Content |
|------|---------|
| `/` | Marketing homepage (no team roster) |
| `/team` | [`TeamSection`](../src/components/TeamSection.tsx) → footer [`ContactCTA`](../src/components/ContactCTA.tsx) (`#contact`, `page="team"`) |

Shared shell: Header, Footer, `ContactFormModal`. `ScrollToHash` scrolls to homepage hashes after client navigation, or to the top of `/team`.

## Navigation

[`Header.tsx`](../src/components/Header.tsx):

| Label | Target |
|-------|--------|
| Logo | `/#top` |
| Explore | homepage section hashes |
| Pricing | `/#contact` |
| Team | `/team` |
| Contact | `/team#contact` while on this page; `/#contact` on home |

`ScrollToHash` in [`App.tsx`](../src/App.tsx) scrolls to the Talk with the team band (`#contact`) after that hash change.

## Deploy

Netlify SPA fallback in [`netlify.toml`](../netlify.toml) rewrites `/*` → `/index.html` (`200`) so `/team` does not 404. See [netlify-toml.md](./netlify-toml.md).

## Related

- [team-section.md](./team-section.md) — roster layout and portraits
- [contact-cta.md](./contact-cta.md) — early-access bands
