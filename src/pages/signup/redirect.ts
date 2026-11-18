/** The only link schemes we follow: https, or http on localhost in a dev build. */
const isAllowed = (parsed: URL): boolean =>
  parsed.protocol === "https:" ||
  (import.meta.env.DEV === true &&
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname));

/** The URL itself, or null when it is not one we may link to. */
export const safeUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return isAllowed(parsed) ? url : null;
  } catch {
    return null;
  }
};

/** Stripe's hosted Checkout and Customer Portal: the only places redirectTo goes. */
const STRIPE_HOSTS = new Set(["checkout.stripe.com", "billing.stripe.com"]);

/** The URL itself when it is an https link to Stripe Checkout or the portal, else null. */
export const stripeUrl = (url: string | null | undefined): string | null => {
  const safe = safeUrl(url);
  if (!safe) return null;
  const parsed = new URL(safe);
  return parsed.protocol === "https:" && STRIPE_HOSTS.has(parsed.hostname) ? safe : null;
};

/**
 * Sends the browser to a URL the server gave us (Stripe Checkout or the Customer
 * Portal). Kept in its own module so tests can replace it. Only https links to
 * Stripe's own hosts are followed, so a bad server response can't send people
 * anywhere else.
 */
export const redirectTo = (url: string): void => {
  const safe = stripeUrl(url);
  if (!safe) throw new Error("The server sent an invalid link.");
  window.location.assign(safe);
};

/**
 * Full page load of one of our own paths, replacing the current history entry.
 * Used after sign-out so no page state from the old session survives in memory
 * and Back does not return to the signed-in page.
 */
export const reloadAt = (path: string): void => {
  if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Not a site path.");
  window.location.replace(path);
};
