import { useEffect, useState } from "react";

/**
 * Small "signed in on this browser" markers the header can read without
 * loading Firebase (which stays out of the main bundle). The signup pages keep
 * them in step: Firebase's sign-in state sets the first, and the account
 * status (which carries the ERP link only when the account is ready and active)
 * sets the second. They only decide which links the header shows: /account
 * still asks Firebase, and the ERP checks access itself.
 */
const SIGNED_IN = "mooric.signedIn";
const ERP_ACCESS = "mooric.erpAccess";
const EVENT = "mooric:session-hint";

const read = (key: string): boolean => {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const write = (key: string, on: boolean): void => {
  try {
    if (on) window.localStorage.setItem(key, "1");
    else window.localStorage.removeItem(key);
  } catch {
    // storage blocked: the header just shows the signed-out links
  }
};

export const readSessionHint = (): boolean => read(SIGNED_IN);
export const readErpAccessHint = (): boolean => read(SIGNED_IN) && read(ERP_ACCESS);

export const writeSessionHint = (signedIn: boolean): void => {
  write(SIGNED_IN, signedIn);
  // Access belongs to whoever was signed in; a sign-out forgets it.
  if (!signedIn) write(ERP_ACCESS, false);
  window.dispatchEvent(new Event(EVENT));
};

/** Set from the account status: true only while the server gives an ERP link. */
export const writeErpAccessHint = (access: boolean): void => {
  write(ERP_ACCESS, access);
  window.dispatchEvent(new Event(EVENT));
};

const useHint = (readHint: () => boolean): boolean => {
  const [on, setOn] = useState(readHint);
  useEffect(() => {
    const update = () => setOn(readHint());
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [readHint]);
  return on;
};

/** True while the browser was last seen signed in; follows changes in this tab and others. */
export const useSessionHint = (): boolean => useHint(readSessionHint);

/** True while signed in and the last account status gave access to the ERP. */
export const useErpAccessHint = (): boolean => useHint(readErpAccessHint);
