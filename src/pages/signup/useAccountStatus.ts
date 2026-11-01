import { useCallback, useEffect, useState } from "react";
import { ErpApiError, pollStatus, type AccountStatus } from "../../lib/erpApi";
import { currentSession, firebaseAvailable, signOut } from "../../lib/firebase";
import { friendlyError } from "./errors";
import { isTransitional } from "./accountState";

export type AccountPhase =
  | { kind: "checking" }
  | { kind: "unavailable" }
  | { kind: "signin" }
  /** Signed in; status may not have arrived yet. */
  | { kind: "signed_in"; status: AccountStatus | null; error: string };

/**
 * Sign-in gate plus status polling for the account and checkout-return pages.
 * Polls /status only while the state is still moving (see isTransitional) and
 * stops on its own, when the page closes, or when the person signs out.
 */
export function useAccountStatus(awaitingPayment: boolean) {
  const [phase, setPhase] = useState<AccountPhase>({ kind: "checking" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let poller: { stop: () => void } | undefined;

    const start = async () => {
      if (!firebaseAvailable()) {
        setPhase({ kind: "unavailable" });
        return;
      }
      let signedIn: boolean;
      try {
        signedIn = (await currentSession()) !== null;
      } catch {
        if (!cancelled) setPhase({ kind: "unavailable" });
        return;
      }
      if (cancelled) return;
      if (!signedIn) {
        setPhase({ kind: "signin" });
        return;
      }
      setPhase({ kind: "signed_in", status: null, error: "" });
      poller = pollStatus({
        onUpdate: (status) => {
          if (!cancelled) setPhase({ kind: "signed_in", status, error: "" });
        },
        onError: (error: ErpApiError) => {
          if (cancelled) return;
          if (error.code === "not_available") setPhase({ kind: "unavailable" });
          else if (error.code === "not_signed_in" || error.status === 401) setPhase({ kind: "signin" });
          else
            setPhase((prev) => ({
              kind: "signed_in",
              status: prev.kind === "signed_in" ? prev.status : null,
              error: friendlyError(error),
            }));
        },
        isDone: (status) => !isTransitional(status, awaitingPayment),
      });
    };

    void start();
    return () => {
      cancelled = true;
      poller?.stop();
    };
  }, [attempt, awaitingPayment]);

  /** Re-checks the session and starts a fresh poll (after sign-in or a failed load). */
  const restart = useCallback(() => {
    setPhase({ kind: "checking" });
    setAttempt((n) => n + 1);
  }, []);

  const leave = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setPhase({ kind: "checking" });
      setAttempt((n) => n + 1);
    }
  }, []);

  return { phase, restart, signOut: leave };
}
