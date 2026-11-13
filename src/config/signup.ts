/**
 * Build-time switches for the signup and billing pages.
 *
 * Both flags are off unless the variable is exactly the string "true".
 * - SIGNUP_ENABLED: /pricing, /register and /account exist.
 * - SIGNUP_NAV_ENABLED: header links (and any homepage or /team buttons) lead to them.
 *   Needs SIGNUP_ENABLED too: nav on its own would link to pages that aren't routed.
 *
 * ERP_URL is the sign-in page. ERP_API_URL is the API the signup flow calls; it can
 * differ from ERP_URL (staging's API is the public portal service).
 */
type SignupEnv = Partial<Record<string, string | boolean | undefined>>;

const isTrue = (value: unknown) => value === "true";
const text = (value: unknown) => (typeof value === "string" ? value : "");

export const readSignupConfig = (env: SignupEnv) => ({
  SIGNUP_ENABLED: isTrue(env.VITE_SIGNUP_ENABLED),
  SIGNUP_NAV_ENABLED: isTrue(env.VITE_SIGNUP_NAV_ENABLED) && isTrue(env.VITE_SIGNUP_ENABLED),
  ERP_URL: text(env.VITE_ERP_URL),
  ERP_API_URL: text(env.VITE_ERP_API_URL),
});

// Each variable is named on its own: passing import.meta.env whole makes Vite copy
// every VITE_* value into the bundle, including ones this module never reads.
export const { SIGNUP_ENABLED, SIGNUP_NAV_ENABLED, ERP_URL, ERP_API_URL } = readSignupConfig({
  VITE_SIGNUP_ENABLED: import.meta.env.VITE_SIGNUP_ENABLED,
  VITE_SIGNUP_NAV_ENABLED: import.meta.env.VITE_SIGNUP_NAV_ENABLED,
  VITE_ERP_URL: import.meta.env.VITE_ERP_URL,
  VITE_ERP_API_URL: import.meta.env.VITE_ERP_API_URL,
});

export const ROUTES = {
  pricing: "/pricing",
  register: "/register",
  account: "/account",
  terms: "/terms",
  privacy: "/privacy",
} as const;
