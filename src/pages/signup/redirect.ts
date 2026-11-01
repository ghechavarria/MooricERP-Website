/**
 * Sends the browser to a URL the server gave us (Stripe Checkout or the Customer
 * Portal). Kept in its own module so tests can replace it, and so only https
 * destinations are ever followed.
 */
export const redirectTo = (url: string): void => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("The server sent an invalid link.");
  }
  if (parsed.protocol !== "https:") throw new Error("The server sent an invalid link.");
  window.location.assign(parsed.toString());
};
