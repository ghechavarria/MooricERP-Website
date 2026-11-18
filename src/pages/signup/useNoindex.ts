import { useEffect } from "react";
import { SIGNUP_NAV_ENABLED } from "../../config/signup";

/**
 * While the signup nav switch is off the pages are reachable only by direct link,
 * so they ask search engines not to index them. The tag lives in document.head and
 * is removed when the page unmounts.
 */
export function useNoindex(): void {
  useEffect(() => {
    if (SIGNUP_NAV_ENABLED) return;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}
