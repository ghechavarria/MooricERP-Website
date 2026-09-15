# Silver-toned accent (Tailwind `accent` / `accent-light`)

The UI uses a **cool metallic** look to match the logo tile. In [`tailwind.config.js`](../tailwind.config.js) this is implemented as **`theme.extend.colors.accent`** (nested **`DEFAULT`** + **`light`**) so utilities are **`bg-accent`**, **`text-accent/90`**, **`from-accent-light/25`**, etc.

**Why not `silver`?** The literal token name **`silver`** clashes with how Tailwind / PostCSS resolve utilities (CSS named color / generation), which broke **`@apply bg-silver`** in [`src/index.css`](../src/index.css). **`accent`** avoids that while keeping a **bright, logo-adjacent** cool silver (`#BFD3E6` / `#F4F9FC`).

Primary CTAs and light-section eyebrows use the **`erp`** brand blue (**`#0075FF`**; see [`tailwind.config.js`](../tailwind.config.js) and [button-primary-silver.md](./button-primary-silver.md)).

On **light** sections, prefer **`text-erp`** / **`border-erp`** for eyebrows, dividers, and step badges. **`accent-light`** is used on the team portrait initials fallback.
