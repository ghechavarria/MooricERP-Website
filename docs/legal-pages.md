# Terms of Use and Privacy Policy pages

`/terms` and `/privacy` show the Terms of Use and Privacy Policy from the Word documents legal provided. Unlike the signup pages, they are **always routed**, whatever the signup switches say. They are lazy chunks, so the home page's bundle doesn't change. The footer links to them only while `VITE_SIGNUP_NAV_ENABLED=true`, so the live footer stays as it is until signup launches.

| Route | File | Content |
|-------|------|---------|
| `/terms` | `src/pages/legal/TermsPage.tsx` | `src/pages/legal/termsContent.ts`, from `Mooric_Terms_of_Use Updated.docx` |
| `/privacy` | `src/pages/legal/PrivacyPage.tsx` | `src/pages/legal/privacyContent.ts`, from `Mooric_Privacy_Policy.docx` |

`LegalPage.tsx` renders both: a heading band, an "On this page" list (sticky beside the text from 1024px up, a collapsible box above it on phones and tablets), then the document. Tables are real tables from 768px up and one card per row below that. Each page links to the other at the bottom.

## Content still to fill in before they go live

The Word documents still contain placeholders, and the pages show them exactly as written. Fix them in the Word files, then regenerate (below):

- **Both:** `[Insert Effective Date]`, `[Insert Date]`, `[Street Address]`, `[City, State ZIP]`
- **Terms:** `[security@mooric.com]`, `[billing@mooric.com]`, `[legal@mooric.com]` (3 places), `[support@mooric.com]`, `[the American Arbitration Association under its Commercial Arbitration Rules]`, `[Wilmington, Delaware]`, `[New Castle County, Delaware]`
- **Privacy:** `[www.mooric.com]`, `[privacy@mooric.com]` (2 places), `[privacy request page URL]`, `[phone number]`
- **Domain:** Terms section 5.6 gives the Privacy Policy address as `https://www.mooric.com/privacy`, and both documents use `mooric.com` email addresses. The site is `mooricerp.com`, so the Privacy Policy is at `https://mooricerp.com/privacy`. Legal should confirm which domain is meant.
- **Cookie banner:** Privacy section 5 says visitors can turn off analytics and marketing cookies "through our cookie banner". The site has no cookie banner today.

The Terms' "New User Acknowledgment" keeps its list but drops the paper signature lines (name, company, signature, date). On the website, the checkbox on `/register` is the acceptance.

## Updating the text

1. Edit the Word document.
2. Regenerate the content file (Python 3, no packages needed):

   ```bash
   python -I scripts/legal/docx_to_blocks.py "path/to/Mooric_Terms_of_Use.docx" terms.json
   python -I scripts/legal/blocks_to_ts.py terms.json src/pages/legal/termsContent.ts TERMS "Mooric_Terms_of_Use.docx"
   python -I scripts/legal/docx_to_blocks.py "path/to/Mooric_Privacy_Policy.docx" privacy.json
   python -I scripts/legal/blocks_to_ts.py privacy.json src/pages/legal/privacyContent.ts PRIVACY "Mooric_Privacy_Policy.docx"
   ```

   Word's Title style becomes the page heading, Heading 1 and Heading 2 become section headings, bulleted and numbered paragraphs become lists, tables stay tables, and fully bold paragraphs become notices (long ones get a box).
3. Run `npx vitest run src/pages/legal` and look at both pages with `npm run dev`.
4. When the Terms change in a way people must accept again, also raise `TERMS_VERSION` on the ERP. Signup only accepts the current version.

## Putting the pages on mooricerp.com (Netlify)

Netlify needs no new setting. `netlify.toml` already sends every path to `index.html` (`from = "/*"`), so `/terms` and `/privacy` load directly and survive a refresh. The pages go live when the branch that has them is published.

**To check them first (no change to the live site):**

1. Push `feature/website-signup` to GitHub.
2. Run `npm run build` then `npx vite preview`, and open `http://localhost:4173/terms` and `/privacy`.

**During the live test** (see `docs/signup-billing-live-test-setup.md` in the ERP repo): once the production branch is switched to `feature/website-signup`, open `https://mooricerp.com/terms` and `https://mooricerp.com/privacy`. Switching back to `main` removes them again.

**To publish them for good:**

1. Fill in the placeholders above and regenerate.
2. Merge the website PR into `main`. Netlify publishes `main` automatically. With the signup switches off, the pages are reachable by their address, but nothing on the site links to them yet.
3. Open `https://mooricerp.com/terms` and `https://mooricerp.com/privacy`, and refresh each one to confirm the direct link works.
4. Set on the ERP: `TERMS_URL=https://mooricerp.com/terms`, `PRIVACY_URL=https://mooricerp.com/privacy`, and `TERMS_VERSION` to the Terms' effective date (for example `2026-11`). The signup checkbox links to these, and signup shows "not available" while either is blank.
5. The footer links appear when `VITE_SIGNUP_NAV_ENABLED=true` is set in Netlify (Site configuration → Environment variables) and the site is redeployed (Deploys → Trigger deploy).

To publish the legal pages *before* signup is ready, without merging the whole signup branch, cherry-pick the legal-page commit onto a branch from `main` and open a PR with just that.
