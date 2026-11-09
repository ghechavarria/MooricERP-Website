import { signOut } from "../../lib/firebase";
import { reloadAt } from "./redirect";

/** Query flag the account page reads to say "You're signed out." */
export const SIGNED_OUT_PARAM = "signed_out";

/**
 * Signs out completely, then loads `to` fresh (the account page by default). Resolves
 * with an error message if Firebase could not sign out, in which case nothing reloads.
 */
export const signOutCompletely = async (to = `/account?${SIGNED_OUT_PARAM}=1`): Promise<string> => {
  try {
    await signOut();
  } catch {
    return "We couldn't sign you out. Check your connection and try again.";
  }
  reloadAt(to);
  return "";
};
