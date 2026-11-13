import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AccountStatus } from "../lib/erpApi";
import { describeAccount, type AccountView } from "./signup/accountState";
import { AccountGate } from "./signup/AccountGate";
import { Alert, Card, linkClass, PageShell } from "./signup/Layout";
import { ErpSignInLink, PortalButton, StatusHeading, SupportLine } from "./signup/StatusParts";
import { useAccountStatus } from "./signup/useAccountStatus";
import { useNoindex } from "./signup/useNoindex";

const WAITING: AccountView = {
  kind: "started",
  tone: "progress",
  title: "Confirming your payment",
  body: "We are waiting for our payment provider to confirm it. This usually takes a few seconds. Keep this page open; it updates on its own.",
  portal: false,
  portalLabel: "Manage billing",
};

/** How long to wait for Stripe's confirmation before telling the person to check in. */
const WAIT_LIMIT_MS = 120_000;

const STILL_WAITING: AccountView = {
  kind: "started",
  tone: "warn",
  title: "Payment still not confirmed",
  body: "We have not received confirmation yet. Check your account page, or contact support if you were charged.",
  portal: false,
  portalLabel: "Manage billing",
};

const stepsFor = (status: AccountStatus | null) => {
  const state = status?.state ?? "none";
  const paid = !["none", "started"].includes(state);
  const ready = state === "ready";
  return [
    { label: "Payment confirmed", done: paid },
    { label: "Account created", done: ready },
    { label: "Ready to sign in", done: ready },
  ];
};

/**
 * Where Stripe sends people after paying (/account?checkout=success). The URL
 * proves nothing, so this page only reports what /status says and never grants
 * access: the sign-in link appears only when the server says the account is ready.
 */
export default function CheckoutReturnPage() {
  useNoindex();
  const { phase, restart, stopPolling } = useAccountStatus(true);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), WAIT_LIMIT_MS);
    return () => clearTimeout(timer);
  }, []);
  // Once we have told the person to check their account page, stop asking:
  // that page checks again when they open it.
  useEffect(() => {
    if (timedOut) stopPolling();
  }, [timedOut, stopPolling, phase.kind]);
  const status = phase.kind === "signed_in" ? phase.status : null;
  const described = status ? describeAccount(status) : null;
  const waiting = !described || described.kind === "started" || described.kind === "none";
  const view = waiting ? (timedOut ? STILL_WAITING : WAITING) : described;

  return (
    <PageShell
      testId="page-checkout-return"
      kicker="Checkout"
      title="Thanks for signing up"
      lead="Your payment is checked with our payment provider before anything is set up."
      centered
    >
      {phase.kind !== "signed_in" ? (
        <div className="mx-auto grid w-full max-w-[28rem] gap-5">
          <AccountGate phase={phase} onSignedIn={restart} signInHeading="Sign in to see your order" />
        </div>
      ) : null}
      {phase.kind === "signed_in" ? (
        <div className="mx-auto grid w-full max-w-[40rem] gap-5" aria-live="polite">
          <Card>
            <StatusHeading view={view} />
            <ol className="m-0 mt-6 grid list-none gap-2.5 p-0">
              {stepsFor(status).map((step) => (
                <li key={step.label} className="flex items-center gap-2.5 text-[15px] text-[#2b3648]">
                  <span
                    aria-hidden
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                      step.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#cfd9e6] text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span>{step.label}</span>
                  <span className="sr-only">{step.done ? "(done)" : "(not yet)"}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap items-start gap-3">
              {status && view.kind === "ready" ? <ErpSignInLink status={status} /> : null}
              {status && view.portal ? <PortalButton label={view.portalLabel} /> : null}
            </div>
            {waiting && timedOut ? (
              <p className="mb-0 mt-5 text-[15px]">
                <Link to="/account" className={linkClass}>
                  Check your account
                </Link>
              </p>
            ) : null}
            {status && view.kind === "ready" ? (
              <p className="mb-0 mt-5 text-[15px]">
                <Link to="/account" className={linkClass}>
                  View your account
                </Link>
              </p>
            ) : null}
          </Card>
          {phase.error ? <Alert>{phase.error}</Alert> : null}
          <SupportLine status={status} />
        </div>
      ) : null}
    </PageShell>
  );
}
