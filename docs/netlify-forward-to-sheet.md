# Netlify forwarder (`/forward-to-sheet`)

A Netlify **background function** that receives the contact form's
submission webhook from Netlify, checks that it really came from Netlify, and
forwards it to the Google Apps Script that writes the sheet row and sends the
email. Code: [`netlify/functions/forward-to-sheet.js`](../netlify/functions/forward-to-sheet.js).
Apps Script side: [netlify-contact-apps-script.md](./netlify-contact-apps-script.md).

## Flow

1. A visitor submits the contact form. Netlify Forms stores it (it stays in
   **Forms** in the Netlify dashboard whatever happens next).
2. Netlify's form notification POSTs it to `https://mooricerp.com/forward-to-sheet`.
   Because this is a background function, Netlify gets **202** at once, so a
   slow Apps Script never makes Netlify disable the hook.
3. The function checks the `x-webhook-signature` header: a JWT signed with
   `NETLIFY_WEBHOOK_SECRET` (HS256, issuer `netlify`) whose `sha256` claim must
   match the request body. Anything else is dropped and logged.
4. It adds `forwardSecret` (the value of `FORWARD_SHARED_SECRET`) to the body
   and POSTs it to `APPS_SCRIPT_WEBHOOK_URL`, following redirects.
5. Apps Script refuses the request unless `forwardSecret` matches its own
   `FORWARD_SHARED_SECRET` script property, then writes the row and emails.

## Environment variables

Netlify → **Project configuration → Environment variables**. None of these
may use the `VITE_` prefix, and none belong in the repo.

| Key | Value |
|-----|-------|
| `NETLIFY_WEBHOOK_SECRET` | The JWS secret set on the form notification webhook (Forms → Form notifications → the `contact` outgoing webhook) |
| `APPS_SCRIPT_WEBHOOK_URL` | The Apps Script web app URL, `https://script.google.com/macros/s/.../exec` |
| `FORWARD_SHARED_SECRET` | A long random value; the same value goes in the Apps Script's script properties |

If `APPS_SCRIPT_WEBHOOK_URL` or `FORWARD_SHARED_SECRET` is missing, or the
signature doesn't verify, the submission is not forwarded. The only trace is
the function log (Netlify → **Logs → Functions → forward-to-sheet**); the entry
is still in Netlify Forms.

## Form notification

1. Deploy the site so `/forward-to-sheet` exists.
2. Netlify → **Forms → Form notifications** → edit the `contact` outgoing
   webhook: URL `https://mooricerp.com/forward-to-sheet`, and a JWS secret
   equal to `NETLIFY_WEBHOOK_SECRET`.
3. Save, and re-enable the hook if it shows **Disabled**.
4. Submit a test from the live site and check: the Forms entry, the sheet row,
   the email, and that the hook is still enabled.

## Build

[`netlify.toml`](../netlify.toml) sets `functions.directory = "netlify/functions"`;
the function sets its own path (`/forward-to-sheet`) and `background: true`.
