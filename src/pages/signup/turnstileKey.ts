/** The Turnstile site key (publishable). Blank in dev skips the widget. */
export const turnstileSiteKey = (): string => {
  const value: unknown = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  return typeof value === "string" ? value.trim() : "";
};

/**
 * A production ERP refuses an empty bot-check token, so a production build with no
 * site key could never finish signup: it should say so before anyone fills the form.
 */
export const turnstileReady = (): boolean => !import.meta.env.PROD || turnstileSiteKey() !== "";
