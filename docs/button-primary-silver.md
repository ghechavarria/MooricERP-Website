# Primary CTA button (`.btn-primary-silver`)

Defined in [`src/index.css`](../src/index.css) (`@layer components`). Class name is historical; the control uses the same **ERP blue** as the nav wordmark (**`erp`** in [`tailwind.config.js`](../tailwind.config.js), **`#0075FF`**). Used for **Book a demo** in [`Header.tsx`](../src/components/Header.tsx) and submit in [`ContactFormModal.tsx`](../src/components/ContactFormModal.tsx).

**Brand blue** fill (**`bg-erp`**), **`text-white`**, a light blue lift shadow (`0 3px 12px` at 22% opacity), **`ring-erp/40`**, hover **`bg-erp-600`** with a slightly stronger shadow, active **`translateY(1px)`**. Add spacing/size with utilities, e.g. **`px-4 py-2.5 text-sm`**, **`px-8 py-3.5`**.

**`accent`** / **`accent-light`** remain for silver-toned UI; warm **`organ`** neutrals stay on body copy.
