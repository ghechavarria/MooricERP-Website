# Terms of Use and Privacy Policy pages

`/terms` and `/privacy` show the Terms of Use and Privacy Policy from the Word documents legal provided. Unlike the signup pages, they are **always routed**, whatever the signup switches say. They are lazy chunks, so the home page's bundle doesn't change. The footer links to them only while `VITE_SIGNUP_NAV_ENABLED=true`, so the live footer stays as it is until signup launches.

| Route | File | Content |
|-------|------|---------|
| `/terms` | `src/pages/legal/TermsPage.tsx` | `src/pages/legal/termsContent.ts`, from `Mooric_Terms_of_Use Updated.docx` |
| `/privacy` | `src/pages/legal/PrivacyPage.tsx` | `src/pages/legal/privacyContent.ts`, from `Mooric_Privacy_Policy.docx` |

`LegalPage.tsx` renders both: a heading band, an "On this page" list (sticky beside the text from 1024px up, a collapsible box above it on phones and tablets), then the document. Tables are real tables from 768px up and one card per row below that. Each page links to the other at the bottom.

## Content filled in from legal (James, 2026-11-18)

The placeholders were filled in the content files directly. The Word documents still have the brackets, so update them too before regenerating, or the placeholders come back.

- **Both:** effective date and last updated June 23, 2026. Address 22943 Sandalfoot Blvd, Boca Raton, FL 33428.
- **Terms:** security@, billing@, legal@ (3 places) and support@mooricerp.com. Arbitration by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, in Wilmington, Delaware. Courts of New Castle County, Delaware. Section 5.6 now gives the Privacy Policy as `https://www.mooricerp.com/privacy`.
- **Privacy:** the Site is `www.mooricerp.com`, email privacy@mooricerp.com (2 places), requests at `www.mooricerp.com/privacypolicy` (redirects to `/privacy`, see `netlify.toml`), phone (561) 613-7333.

Still open:

- **Privacy request form:** the Privacy Policy says "use the form at www.mooricerp.com/privacypolicy", but that page is the policy itself and has no form. Legal should either drop "the form at" or have a request form built.
- **Cookie banner:** Privacy section 5 says visitors can turn off analytics and marketing cookies "through our cookie banner". The site has no cookie banner today.
- **`TERMS_VERSION`** on the ERP should match the effective date, `2026-06`.

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
