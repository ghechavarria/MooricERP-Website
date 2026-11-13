# Mooric ERP website

The marketing site for **Mooric ERP** at [mooricerp.com](https://mooricerp.com):
the homepage, the team page and the contact form.

- **App**: a single-page app built with Vite 8, React 19, TypeScript, React
  Router 7, Tailwind 3 and Framer Motion (`src/`).
- **Hosting**: Netlify. It builds `dist/` from `main` and serves every path as
  `index.html`. The contact form uses Netlify Forms plus one Netlify Function
  (`netlify/functions/`).

> **`main` is the live site.** Netlify deploys every push to `main`. Work on a
> branch and merge only when the change should go live. To push to `main`
> without a deploy (CI or docs only), put `[skip netlify]` in the commit
> message.

---

## Quick start

Needs Node 22 (see `.nvmrc`; Netlify and CI use the same).

```bash
npm ci
npm run dev        # http://localhost:5173
```

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | `tsc -b`, then `vite build` into `dist/` |
| `npm run preview` | Serves `dist/` locally for a quick check |
| `npm run lint` | ESLint |

CI runs these on every push (see [CI/CD](#cicd)). Running them before you push
saves a round trip.

Dependencies are pinned to exact versions, and `package-lock.json` is
committed. Use `npm ci`, and change a version on purpose with
`npm install <pkg>@<version>`.

## Project layout

| Path | What's there |
|------|--------------|
| `index.html` | HTML shell, fonts, meta tags, and the hidden Netlify form Netlify uses to detect the contact form |
| `src/App.tsx` | Routes (`/` and `/team`) and the homepage section order |
| `src/components/` | Homepage sections, `Header`, `Footer`, `ContactFormModal` |
| `src/config/` | `photos.ts` (hero video and photos), `contactActions.ts` |
| `src/context/` | `ContactModalContext`: opens the contact form from anywhere |
| `netlify/functions/forward-to-sheet.js` | Contact form forwarder (below) |
| `scripts/netlify-contact-Code.gs` | The Google Apps Script that receives contact submissions. A copy; the live version is in Apps Script. |
| `public/` | Images, the hero video, `__forms.html` |
| `docs/` | One note per section or feature. Start with [loan-processing-website.md](docs/loan-processing-website.md). |

## Contact form

1. The form posts to Netlify Forms. A `bot-field` honeypot catches simple
   bots.
2. Netlify's form notification calls `/forward-to-sheet`, a background
   function. It checks Netlify's signed JWT (`NETLIFY_WEBHOOK_SECRET`), adds
   `FORWARD_SHARED_SECRET`, and posts to `APPS_SCRIPT_WEBHOOK_URL`. All three
   are Netlify environment variables, never in the repo.
3. Apps Script refuses requests without the shared secret. It skips
   duplicates and writes a row to the sheet. Values that start with `=`, `+`,
   `-` or `@` get a leading apostrophe, so Sheets treats them as text. Then it
   emails the inbox in its `NOTIFY_TO` script property.

The submission is also kept in Netlify's Forms dashboard, so nothing is lost
if Apps Script fails. Failures show up only in the function's logs. Setup:
[netlify-forward-to-sheet.md](docs/netlify-forward-to-sheet.md) and
[netlify-contact-apps-script.md](docs/netlify-contact-apps-script.md).

## Security headers

`netlify.toml` sets these on every page:
- HSTS
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- a `Permissions-Policy` that turns off camera, microphone, location, payment
  and USB

## CI/CD

`.github/workflows/ci.yml` runs on every push to any branch, and by hand from
the Actions tab.

| Job | What it does |
|-----|--------------|
| **lint** | `npm run lint` |
| **test** | `npm test`, when the branch has tests |
| **build** | `npm run build`. Fails if a source map would ship. |
| **deploy** | Only on `main`, and only after the three jobs above pass. Runs `netlify deploy --build --prod`, which builds with the site's Netlify environment variables. A commit with `[skip netlify]` in its message doesn't deploy. |

**The deploy job is off until you switch it on.** Until then, Netlify keeps
deploying `main` itself on every push, as it always has, and CI only reports.
To move deploys to CI:

1. In Netlify, stop builds from Git: **Site configuration → Build & deploy →
   Continuous deployment → Stop builds**. Otherwise every push deploys twice.
2. Add two GitHub repo secrets:
   - `NETLIFY_AUTH_TOKEN`: a Netlify personal access token.
   - `NETLIFY_SITE_ID`: from **Site configuration → Site details**.
3. Set the repo variable `NETLIFY_DEPLOY_FROM_CI` to `true`.
4. Optional: in GitHub's **production** environment, add required reviewers
   so every deploy waits for an approval.

Once that's done, a broken lint, test or build blocks the deploy. Today,
Netlify would publish it anyway.

## GitHub and GitLab

The repo exists in two places, kept the same:

- **GitHub** `ghechavarria/MooricERP-Website`: public, and what Netlify
  deploys from.
- **GitLab** `mooring_corp/mooric_website`: private, for the team.

How they stay in sync:

- **Pushes from your machine:** add GitLab as a second push URL on `origin`,
  and one push updates both:

  ```bash
  git remote set-url --add --push origin https://github.com/ghechavarria/MooricERP-Website.git
  git remote set-url --add --push origin https://gitlab.com/mooring_corp/mooric_website.git
  ```

- **Changes made on github.com** (a merge, a web edit, a branch delete): the
  workflow `.github/workflows/sync-to-gitlab.yml` copies them to GitLab within
  30 minutes, and at once on `main`.
  - It signs in with the GitHub secret `GITLAB_DEPLOY_KEY`: an SSH deploy key
    with write access to mooric_website and nothing else.
  - If that secret isn't set, it falls back to `GITLAB_TOKEN`, which is a
    personal token. Delete that one once the deploy key works.
- **Changes made on gitlab.com** are **not** copied to GitHub. Push them from
  your machine.

Open each pull request on both sides, with the same title and description.

The GitHub repo is public. Keep anything private (addresses, keys, internal
notes) out of it: secrets go in Netlify, GitHub secrets or Apps Script
properties.
