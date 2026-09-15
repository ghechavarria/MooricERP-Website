# Product feature splits (`ProductFeatureSections.tsx`)

Three two-column homepage sections with product UI mocks: **Intake** (`#intake`), **Income** (`#income`), **Conditions** (`#conditions`).

## Shared layout

`.v4-split` (copy left, mock right) or `.v4-split--flip` (mock left). Both share the same column gap. Under 1100px both stack to one column; flipped rows send the mock below the copy (`.v4-split--flip > :first-child { order: 2 }`).

Mocks use `.v4-mock` / `.v4-mock-panel`. Split columns use `minmax(0, …fr)` so photos and mocks cannot overflow into the copy column. Intake progress bar fills on view (Framer Motion; respects `viewport.once`).

## Copy

- **Intake** — *From Documents to Application — Powered by AI.* Portal, 1003 fill, flagged gaps.
- **Income** — *Get Income Right the First Time.* Qualifying worksheet + program fit.
- **Conditions** — *See Your Files at a Glance.* Six-category tiles + chase list.

Condition rows (`.v4-condition-row`) give the title cell `min-width: 0` so status chips do not overlap wrapped names. Under 720px the trailing status drops to the second grid line.
