import { useCallback, useEffect, useState } from "react";
import { ErpApiError, pollStatus, type AccountStatus } from "../../lib/erpApi";
import { currentSession, firebaseAvailable } from "../../lib/firebase";
import { friendlyError } from "./errors";
import { isTransitional } from "./accountState";
import { signOutCompletely } from "./signOut";

export type AccountPhase =
  | { kind: "checking" }
  | { kind: "unavailable" }
  | { kind: "signin" }
  /** Signed in; status may not have arrived yet. */
  | { kind: "signed_in"; status: AccountStatus | null; error: string; email: string | null };

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
      let email: string | null = null;
      let signedIn: boolean;
      try {
        const session = await currentSession();
        signedIn = session !== null;
        email = session?.email ?? null;
      } catch {
        if (!cancelled) setPhase({ kind: "unavailable" });
        return;
      }
      if (cancelled) return;
      if (!signedIn) {
        setPhase({ kind: "signin" });
        return;
      }
      setPhase({ kind: "signed_in", status: null, error: "", email });
      poller = pollStatus({
        onUpdate: (status) => {
          if (!cancelled) setPhase({ kind: "signed_in", status, error: "", email });
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
              email,
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

  /** Signs out of Firebase and reloads the page; on failure, says so and stays signed in. */
  const leave = useCallback(async () => {
    const problem = await signOutCompletely();
    if (problem) setPhase((prev) => (prev.kind === "signed_in" ? { ...prev, error: problem } : prev));
  }, []);

  return { phase, restart, signOut: leave };
}
