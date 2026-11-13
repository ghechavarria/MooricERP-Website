# Mooric ERP website

The marketing site for **Mooric ERP** at [mooricerp.com](https://mooricerp.com):
the homepage, the team page, the contact form and the legal pages. It is also
where new customers sign up: they pick the plan, create an account, and pay
through Stripe. When payment clears, the ERP creates their organization.

- **App**: a single-page app built with Vite 8, React 19, TypeScript, React
  Router 7, Tailwind 3 and Framer Motion (`src/`).
- **Hosting**: Netlify. It builds `dist/` from `main` and serves every path as
  `index.html`. The contact form uses Netlify Forms plus one Netlify Function
  (`netlify/functions/`).
- **Signup backend**: the ERP's `/api/account/*` API, in the mooric_erp repo
  (`backend/routes_billing.py`). The site signs people in with Firebase Auth,
  checks for bots with Cloudflare Turnstile, and hands payment to Stripe
  Checkout. It never holds a Stripe key.

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

With no `.env.local`, you get the live site: signup off, no Firebase, nothing
calls the ERP.

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | `tsc -b`, then `vite build`, then `scripts/write-headers.mjs` (writes `dist/_headers`) |
| `npm run preview` | Serves `dist/` locally for a quick check |
| `npm run lint` | ESLint |
| `npm test` | Vitest, including the page tests and the `_headers` generator tests |

CI runs these on every push (see [CI/CD](#cicd)). Running them before you push
saves a round trip.

Dependencies are pinned to exact versions, and `package-lock.json` is
committed. Use `npm ci`, and change a version on purpose with
`npm install <pkg>@<version>`.

## Configuration

The variables live in `.env.local` locally, and in Netlify under **Project
configuration → Environment variables** for the live build. `.env.example`
lists every one.

**Every `VITE_*` value is built into the public JavaScript.** Only publishable
values may use that prefix. Secrets belong to the Netlify Function (below) or
to the ERP, never to `VITE_*`.

| Variable | Used for |
|----------|----------|
| `VITE_SIGNUP_ENABLED` | `"true"` adds the routes `/pricing`, `/register` and `/account` (`/account?checkout=success` is where Stripe returns). Off: they aren't routed and their code, Firebase included, isn't built. |
| `VITE_SIGNUP_NAV_ENABLED` | `"true"` turns on the header Pricing, Get started and account links, plus the footer's legal links. It has no effect unless `VITE_SIGNUP_ENABLED` is also on. |
| `VITE_ERP_URL` | The ERP sign-in page (the "Sign in" link) |
| `VITE_ERP_API_URL` | Base URL of the ERP API that signup calls (`/api/account/...`). Must be https, and the site's origin must be listed in the ERP's `WEBSITE_ALLOWED_ORIGINS`. |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` | Firebase web app config (public client values). Must be the same Firebase project the ERP verifies tokens against. |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (public). The ERP holds the secret key and checks the token, including its hostname. |
| `VITE_FIREBASE_EMULATOR` | Firebase Auth emulator URL. Only `npm run dev` uses it; production builds ignore it. |

Both switches are on only for the exact string `"true"`. With nav off, the
header and footer render the same HTML as the live site, and a test
(`src/test/signupSwitches.test.tsx`) checks them against saved copies.

Server-side values for the contact form (Netlify environment, not `VITE_`):
`NETLIFY_WEBHOOK_SECRET`, `APPS_SCRIPT_WEBHOOK_URL` and
`FORWARD_SHARED_SECRET`. See [Contact form](#contact-form).

## Running signup locally

1. Run the ERP backend with billing on and Stripe in **test mode**. It needs
   `WEBSITE_ALLOWED_ORIGINS=http://localhost:5173`. See the mooric_erp README
   and `docs/signup-billing-*.md` there.
2. Start the Firebase Auth emulator, or use a test Firebase project.
3. Set up `.env.local`:
   - `VITE_SIGNUP_ENABLED=true` and `VITE_SIGNUP_NAV_ENABLED=true`
   - `VITE_ERP_API_URL=http://127.0.0.1:8000`
   - the four Firebase values
   - `VITE_FIREBASE_EMULATOR` if you use the emulator
4. Leave `VITE_TURNSTILE_SITE_KEY` blank: dev builds skip the widget, and the
   ERP accepts an empty token only in dev.
5. Forward Stripe's test webhooks to the ERP, for example:

   ```bash
   stripe listen --events checkout.session.completed,invoice.paid --forward-to localhost:8000/api/stripe/webhook
   ```

   The ERP repo lists the full set of events.

The flow, step by step, is in [docs/signup-pages.md](docs/signup-pages.md).

## Project layout

| Path | What's there |
|------|--------------|
| `index.html` | HTML shell, fonts, meta tags, and the hidden Netlify form Netlify uses to detect the contact form |
| `src/App.tsx` | Routes. The signup and legal pages load lazily. |
| `src/components/` | Homepage sections, `Header`, `Footer`, `ContactFormModal` |
| `src/config/` | `signup.ts` (switches, ERP URLs, routes), `photos.ts`, `contactActions.ts` |
| `src/context/` | `ContactModalContext`: opens the contact form from anywhere |
| `src/lib/` | `erpApi.ts` (typed client for `/api/account/*`), `firebase.ts` (the Auth wrapper, imported only by signup code), `sessionHint.ts` (the header's "signed in" hint) |
| `src/pages/` | `PricingPage`, `RegisterPage`, `AccountPage`, `CheckoutReturnPage` |
| `src/pages/signup/` | Shared signup parts: layout, Turnstile, the sign-in form, account state, errors, redirects |
| `src/pages/legal/` | Terms of Use and Privacy Policy. The `*Content.ts` files are generated from the Word documents by `scripts/legal/`. |
| `netlify/functions/forward-to-sheet.js` | Contact form forwarder (below) |
| `scripts/write-headers.mjs` | Builds the Content-Security-Policy into `dist/_headers` |
| `scripts/netlify-contact-Code.gs` | The Google Apps Script that receives contact submissions. A copy; the live version is in Apps Script. |
| `public/` | Images, the hero video, `__forms.html` |
| `docs/` | One note per section or feature (see below) |

## Contact form

1. The form posts to Netlify Forms. A `bot-field` honeypot catches simple
   bots.
2. Netlify's form notification calls `/forward-to-sheet`, a background
   function. It checks Netlify's signed JWT (`NETLIFY_WEBHOOK_SECRET`), adds
   `FORWARD_SHARED_SECRET`, and posts to `APPS_SCRIPT_WEBHOOK_URL`.
3. Apps Script refuses requests without the shared secret. It skips
   duplicates and writes a row to the sheet. Values that start with `=`, `+`,
   `-` or `@` get a leading apostrophe, so Sheets treats them as text. Then it
   emails the inbox in its `NOTIFY_TO` script property.

The submission is also kept in Netlify's Forms dashboard, so nothing is lost
if Apps Script fails. Failures show up only in the function's logs. Setup:
[docs/netlify-contact-apps-script.md](docs/netlify-contact-apps-script.md).

## Security headers

- **`netlify.toml`** sets the static headers: HSTS, `nosniff`,
  `Referrer-Policy`, `X-Frame-Options: DENY` and `Permissions-Policy`.
- **`scripts/write-headers.mjs`** builds the Content-Security-Policy from the
  `VITE_*` values. With signup on, it adds the ERP API, Firebase and
  Turnstile.
- **The policy is report-only for now.** Turn it on for real once the signup
  flow runs clean with it in a browser. See
  [docs/netlify-toml.md](docs/netlify-toml.md).

## CI/CD

`.github/workflows/ci.yml` runs on every push to any branch, and by hand from
the Actions tab.

| Job | What it does |
|-----|--------------|
| **lint** | `npm run lint` |
| **test** | `npm test` (Vitest) |
| **build** | `npm run build` twice. With signup **off** (the live site), it checks that no signup page and no Firebase code is in the bundle, and that the CSP allows no outside connections. With signup **on** (placeholder public values), it checks that the signup pages build and that the CSP lists the ERP API and Turnstile. Both runs fail if a source map ships. |
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

## Docs

The `docs/` folder has a note for most parts of the site. Start with:

| Doc | Covers |
|-----|--------|
| [signup-pages.md](docs/signup-pages.md) | The signup pages, the flow, errors, password rules, sign-out, Turnstile |
| [legal-pages.md](docs/legal-pages.md) | How the Terms and Privacy pages are generated from the Word files |
| [netlify-toml.md](docs/netlify-toml.md) | Headers and the CSP |
| [netlify-forward-to-sheet.md](docs/netlify-forward-to-sheet.md) | The contact form forwarder and its environment variables |
| [netlify-contact-apps-script.md](docs/netlify-contact-apps-script.md) | Contact form → Apps Script setup |
| [v4-homepage.md](docs/v4-homepage.md) | The current homepage design system |
| [mobile-nav-and-layout.md](docs/mobile-nav-and-layout.md) | Mobile layout rules |

The ERP side of signup and billing (API, Stripe, webhooks, go-live checklist)
is documented in the mooric_erp repo under `docs/signup-billing-*.md`.
