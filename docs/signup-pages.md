# Signup pages

Pricing, register, account and checkout-return pages. They exist only when `VITE_SIGNUP_ENABLED=true`; with it off they are not routed and their code is not in the JavaScript bundle (the flag-off `dist` has only `index-*.css` and `index-*.js`). The CSS is the exception: Tailwind scans `src/`, so the flag-off stylesheet carries about 71 unused rules from these pages. They affect nothing on screen. Header links to them need `VITE_SIGNUP_NAV_ENABLED=true`. While nav is off the pages carry `<meta name="robots" content="noindex">`, added to `document.head` on mount and removed on unmount (`src/pages/signup/useNoindex.ts`).

Visual system is the v4 homepage ([v4-homepage.md](v4-homepage.md)): `.layout-shell` rail, `.v4-kicker`, `.v4-h2` heading, `.v4-lead`, `.v4-btn` buttons, `.v4-bullet` list, white cards with the `#e4ebf4` hairline. Mobile rules follow [mobile-nav-and-layout.md](mobile-nav-and-layout.md): single column below 720px, 16px inputs (no iOS zoom), no horizontal scroll (checked at 375px).

Only these pages import `src/lib/firebase.ts` and `src/lib/erpApi.ts`, and all four are lazy chunks (see `App.tsx`).

## Pages

| Route | File | What it does |
|-------|------|--------------|
| `/pricing` | `PricingPage.tsx` | `GET /config`. Shows the plan name, price from `price_cents` as "$X per month + applicable tax", included loans, and the overage per loan. Nothing is hardcoded; the amount is formatted from plan data. |
| `/register` | `RegisterPage.tsx` | Opens on sign-in, centred. "Create an account" switches to the form: a subscription card (plan, price, included loans, overage), first and last name, email, password (rules below), NMLS ID (digits, 1 to 12), Terms and Privacy checkbox (links from `/config`), Turnstile. |
| `/account` | `AccountPage.tsx` | Sign-in (with authenticator-app challenge) then status. |
| `/account?checkout=success` | `CheckoutReturnPage.tsx` | Post-payment page. Also routed at `/checkout/return`. |

### Register flow

1. Load `/config` and any saved Firebase session. Not available if Firebase is not configured, the API says `not_available` or `signup_available` is false, or `/config` has no `terms_version`.
2. Nobody signed in: the page opens on "Sign in to get started" (TOTP if enrolled). After sign-in, `GET /status` decides: already paid shows "You're all set" with a link to `/account`; `started` shows "Welcome back" with Continue to payment; otherwise the details form without email and password.
3. New person: "Create an account" opens the form ("Already have an account? Sign in" goes back). Submitting creates the Firebase account, calls `POST /signup` (with `terms_version` from `/config` and the Turnstile token), sends the verification email, and shows "Check your email".
4. "I've verified my email" calls `refreshVerification()`; only when true does it call `POST /checkout` and redirect to Stripe. "Resend email" sends another.
5. `/register?checkout=cancelled` (Stripe's cancel URL) shows a banner above whichever step applies.
6. Every signed-in step shows "Signed in as …" with **Sign out** (see Sign-out below).

### Password rules

`src/pages/signup/password.ts`: at least 12 characters (at most 128), an upper-case letter, a lower-case letter, a number, a symbol, and not containing the part of the email before the `@`. The field has Show/Hide and a live checklist. These rules are only checked in the browser, so **set the same policy in Firebase** to enforce them on the server: Firebase console → Authentication → Settings → Password policy → Require enforcement, minimum length 12, and require upper case, lower case, numeric and non-alphanumeric characters. Firebase's `auth/password-does-not-meet-requirements` error has friendly copy.

### Sign-out

`signOutCompletely` (`src/pages/signup/signOut.ts`) calls Firebase `signOut`, which clears the user from memory and from the browser's saved session (IndexedDB), and fails if a user is still signed in afterwards. It then does a full page load (`reloadAt`, which replaces the history entry) so no page state from the old session stays in memory and Back doesn't return to it. The account page reloads to `/account?signed_out=1`, which says "You're signed out." above the sign-in form; the register page reloads to `/register`. If Firebase can't sign out, the page says so and nothing reloads. This signs out of the website only; the ERP app keeps its own session on its own domain.

Error handling: `account_exists` links to ERP sign-in (`VITE_ERP_URL`); `signup_locked`, `nmls_in_use`, `rate_limited`, `bot_check_failed`, `email_not_verified`, `billing_unavailable` and the common Firebase codes have friendly copy (`src/pages/signup/errors.ts`). Field errors are tied to inputs with `aria-invalid` and `aria-describedby`, and focus moves to the first invalid field.

### Bot protection

`Turnstile.tsx` loads `https://challenges.cloudflare.com/turnstile/v0/api.js` only when `/register` renders the widget and `VITE_TURNSTILE_SITE_KEY` is set. A blank key in dev skips the widget and sends an empty token, which the ERP accepts only in dev. A production build with a blank key shows "not available" on `/register`, because the ERP would refuse every signup. The token is reset after each server attempt because tokens are single-use. If a Content-Security-Policy is added in `netlify.toml`, it must allow `script-src`, `frame-src` and `connect-src` for `https://challenges.cloudflare.com`.

### Account states

`describeAccount` (`src/pages/signup/accountState.ts`) maps `/status` to what the person sees. Suspension and billing flags win over the signup state.

| Status | Shown |
|--------|-------|
| `none` | No subscription yet, Get started |
| `started` | Payment hasn't been completed, Continue to payment |
| `paid` | Payment received, creating your account (polls) |
| `provisioned`, `claims_set`, `email_sending` | Setting up your account (polls) |
| `ready` | Your account is ready, ERP sign-in link if `erp_url` is set |
| `review` | Payment received, account under review |
| `billing_status = past_due` | Last payment failed, with the cutoff date from `access_cutoff_at` |
| `suspended_reason = billing` | Suspended because of a payment problem, Update payment method |
| `suspended_reason = verification` | Suspended, business details could not be verified, contact support |
| `billing_status = canceling` | Cancellation is scheduled, access unchanged |
| `canceled` | Subscription has been canceled, data kept |

The ERP sign-in link is built only from `status.erp_url`. The Manage billing / Update payment method button opens the Stripe Customer Portal and is shown for every state after payment, including suspended and canceled, so a suspended customer can always pay. The support email comes from `status.support_email`.

### Polling

`useAccountStatus` uses `pollStatus` (5 second base, backoff on errors, stops on fatal errors). It polls only while the state is transitional: `paid`, `provisioned`, `claims_set`, `email_sending`. On the checkout-return page `started` and `none` also count, because the webhook can be a few seconds behind the redirect. Polling stops on its own once the state settles, on sign-out, and on unmount.

### Checkout return

The success URL proves nothing. The page says "Confirming your payment" until `/status` shows a paid state, never shows the ERP link before the server says `ready`, and never says access is granted from the URL alone.

## Environment

See `.env.example`: `VITE_SIGNUP_ENABLED`, `VITE_SIGNUP_NAV_ENABLED`, `VITE_ERP_URL`, `VITE_ERP_API_URL`, `VITE_FIREBASE_*`, `VITE_TURNSTILE_SITE_KEY`.

## Tests

`src/pages/*.test.tsx` mock `src/lib/erpApi` and `src/lib/firebase` at the module boundary (and `src/pages/signup/redirect`). Run `npx vitest run`.
