import { useEffect, useState } from "react";

/**
 * A small "signed in on this browser" marker the header can read without
 * loading Firebase (which stays out of the main bundle). The signup pages keep
 * it in step with Firebase's own sign-in state. It is only a hint for which
 * button to show: /account still asks Firebase, and signs in if the session ended.
 */
const KEY = "mooric.signedIn";
const EVENT = "mooric:session-hint";

export const readSessionHint = (): boolean => {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

export const writeSessionHint = (signedIn: boolean): void => {
  try {
    if (signedIn) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    // storage blocked: the header just keeps showing Get started
  }
  window.dispatchEvent(new Event(EVENT));
};

/** True while the browser was last seen signed in; follows changes in this tab and others. */
export const useSessionHint = (): boolean => {
  const [signedIn, setSignedIn] = useState(readSessionHint);
  useEffect(() => {
    const update = () => setSignedIn(readSessionHint());
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return signedIn;
};
