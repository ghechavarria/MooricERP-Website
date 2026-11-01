/** The Turnstile site key (publishable). Blank in dev skips the widget. */
export const turnstileSiteKey = (): string => {
  const value: unknown = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  return typeof value === "string" ? value.trim() : "";
};
