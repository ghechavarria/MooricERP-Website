# `netlify.toml`

Build and functions settings for the Mooring site on Netlify ([netlify.toml](../netlify.toml)).

## Settings

| Key | Value |
|-----|--------|
| `command` | `npm run build` |
| `publish` | `dist` |
| `functions.directory` | `netlify/functions` |

Locks publish directory so form detection always scans Vite’s output (including [index.html](../index.html) and [public/__forms.html](../public/__forms.html)). No secrets or webhook URLs belong in this file — put `APPS_SCRIPT_WEBHOOK_URL` in the Netlify UI ([forwarder docs](./netlify-forward-to-sheet.md)).

## SPA fallback

`[[redirects]]` rewrites `/*` → `/index.html` with status `200` so client routes such as [`/team`](./team-page.md) resolve on a static host. Netlify functions are still served before this catch-all.

## Security headers

Static headers are set in `netlify.toml` under `[[headers]]` for `/*`:

| Header | Value | Why |
|--------|-------|-----|
| `Strict-Transport-Security` | `max-age=31536000` | One year. No `preload` and no `includeSubDomains`: the Mooric subdomains are not all confirmed HTTPS-only. Add `includeSubDomains` only after checking every subdomain. |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | |
| `X-Frame-Options` | `DENY` | Frame protection (the CSP also carries `frame-ancestors 'none'`). |

The Content-Security-Policy cannot live in `netlify.toml`: it depends on environment values (`VITE_ERP_API_URL`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_SIGNUP_ENABLED`), and `netlify.toml` cannot read env vars. Instead [scripts/write-headers.mjs](../scripts/write-headers.mjs) runs after `vite build` (it is part of `npm run build`) and writes `dist/_headers`. Netlify merges that file with the `[[headers]]` block. Only the origin of each URL is used (never a path), and only `https` URLs are accepted. Tests: `scripts/write-headers.test.ts`.

### The policy is report-only

It ships as `Content-Security-Policy-Report-Only`, like the ERP (`backend/security_headers.py`). Browsers log violations to the console and block nothing. Enforcing is a later step in the go-live checklist: watch the console on the staging site (`/`, `/team`, the contact form, and with signup on `/pricing`, `/register`, `/account`) and drop or add hosts before switching the header name to `Content-Security-Policy`.

| Directive | Signup off (live site) | Added when `VITE_SIGNUP_ENABLED=true` |
|-----------|-----------------------|-------------------------------------|
| `default-src` | `'self'` | |
| `script-src` | `'self'` | `https://challenges.cloudflare.com` (Turnstile) |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | |
| `font-src` | `'self' https://fonts.gstatic.com` | |
| `img-src` | `'self' data:` | |
| `media-src` | `'self'` (hero video) | |
| `connect-src` | `'self'` (contact form posts to `/`) | ERP API origin, `https://identitytoolkit.googleapis.com`, `https://securetoken.googleapis.com`, the Firebase auth domain |
| `frame-src` | `'none'` | `'self'`, Turnstile, the Firebase auth domain |
| `object-src`, `base-uri`, `form-action`, `frame-ancestors` | `'none'`, `'self'`, `'self'`, `'none'` | |

`'unsafe-inline'` in `style-src` is needed because framer-motion and React `style` props write inline styles. There is no analytics and there are no inline scripts. Netlify deploy previews may inject their own script (the preview drawer); expect report-only noise there, not on production. A new third-party host on the site needs a line in `scripts/write-headers.mjs`.

## See also

- [contact-form-modal.md](./contact-form-modal.md)
- [netlify-forward-to-sheet.md](./netlify-forward-to-sheet.md)
