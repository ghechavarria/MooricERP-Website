import { useEffect, useRef } from "react";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

const api = (): TurnstileApi | undefined => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

const loadScript = (): Promise<TurnstileApi> =>
  new Promise((resolve, reject) => {
    const ready = api();
    if (ready) {
      resolve(ready);
      return;
    }
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => {
      const loaded = api();
      if (loaded) resolve(loaded);
      else reject(new Error("Bot check did not load."));
    });
    script.addEventListener("error", () => reject(new Error("Bot check did not load.")));
  });

/**
 * Cloudflare Turnstile widget. The script is loaded here, so it is fetched only on
 * the page that renders this component. Bump resetSignal to get a fresh token
 * (tokens are single-use).
 */
export function Turnstile({
  siteKey,
  onToken,
  resetSignal,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  resetSignal: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then((turnstile) => {
        if (cancelled || !host.current) return;
        widgetId.current = turnstile.render(host.current, {
          sitekey: siteKey,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch(() => onTokenRef.current(""));
    return () => {
      cancelled = true;
      if (widgetId.current !== undefined) api()?.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetSignal === 0 || widgetId.current === undefined) return;
    api()?.reset(widgetId.current);
    onTokenRef.current("");
  }, [resetSignal]);

  return <div ref={host} className="min-h-[65px] max-w-full overflow-hidden" data-testid="turnstile" />;
}
