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

/**
 * Sends the browser to a URL the server gave us (Stripe Checkout or the Customer
 * Portal). Kept in its own module so tests can replace it, and so only https
 * destinations are ever followed.
 */
export const redirectTo = (url: string): void => {
  const safe = safeUrl(url);
  if (!safe) throw new Error("The server sent an invalid link.");
  window.location.assign(safe);
};
