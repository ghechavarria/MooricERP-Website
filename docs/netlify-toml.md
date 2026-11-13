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
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | The site uses none of these, so no page or embedded frame (YouTube, Turnstile) can ask for them. Stripe Checkout is a redirect to stripe.com, so `payment=()` does not affect it. |

The Content-Security-Policy cannot live in `netlify.toml`: it depends on environment values (`VITE_ERP_API_URL`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_SIGNUP_ENABLED`), and `netlify.toml` cannot read env vars. Instead [scripts/write-headers.mjs](../scripts/write-headers.mjs) runs after `vite build` (it is part of `npm run build`) and writes `dist/_headers`. Netlify merges that file with the `[[headers]]` block. Only the origin of each URL is used (never a path), and only `https` URLs are accepted. Tests: `scripts/write-headers.test.ts`.

### The policy is enforced

It ships as `Content-Security-Policy`: browsers block anything it doesn't list. It was switched on after a manual check on 2026-11-13. A signup-on build was served with this policy enforced plus a report collector, and the check visited:
- `/`, including playing the YouTube video
- `/team`, `/terms` and `/pricing`
- `/register`: sign in, the create-account form with Turnstile, account creation (Firebase Auth emulator) and the ERP signup call
- the redirect to Stripe Checkout
- `/account?checkout=success`
- `/account`, signed in and signed out

No violation was reported. The ERP API and the Auth emulator ran on http://localhost, so the check added them to `connect-src`; production uses the https ERP origin and Google's endpoints, which are in the policy.

**Adding a third-party host** (a script, font, image, iframe or API) means adding it to `scripts/write-headers.mjs`, or the browser blocks it. Netlify deploy previews inject their own drawer script, which the policy blocks; that affects previews only, not the site.

| Directive | Signup off (live site) | Added when `VITE_SIGNUP_ENABLED=true` |
|-----------|-----------------------|-------------------------------------|
| `default-src` | `'self'` | |
| `script-src` | `'self'` | `https://challenges.cloudflare.com` (Turnstile) |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | |
| `font-src` | `'self' https://fonts.gstatic.com` | |
| `img-src` | `'self' data: https://i.ytimg.com` (video thumbnail) | |
| `media-src` | `'self'` (hero video) | |
| `connect-src` | `'self'` (contact form posts to `/`) | ERP API origin, `https://identitytoolkit.googleapis.com`, `https://securetoken.googleapis.com`, the Firebase auth domain |
| `frame-src` | `https://www.youtube-nocookie.com` (hero video, after a click) | `'self'`, Turnstile, the Firebase auth domain |
| `object-src`, `base-uri`, `form-action`, `frame-ancestors` | `'none'`, `'self'`, `'self'`, `'none'` | |

`'unsafe-inline'` in `style-src` is needed because framer-motion and React `style` props write inline styles. There is no analytics and there are no inline scripts. A new third-party host on the site needs a line in `scripts/write-headers.mjs`.

## See also

- [contact-form-modal.md](./contact-form-modal.md)
- [netlify-forward-to-sheet.md](./netlify-forward-to-sheet.md)
