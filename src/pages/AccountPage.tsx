import { Link, useSearchParams } from "react-router-dom";
import type { AccountStatus } from "../lib/erpApi";
import CheckoutReturnPage from "./CheckoutReturnPage";
import { describeAccount } from "./signup/accountState";
import { AccountGate } from "./signup/AccountGate";
import { Alert, Card, ghostButton, Notice, PageShell, primaryButton } from "./signup/Layout";
import { ContinueToPayment, ErpSignInLink, PortalButton, StatusHeading, SupportLine } from "./signup/StatusParts";
import { useAccountStatus } from "./signup/useAccountStatus";
import { useFocusHeading } from "./signup/useFocusHeading";
import { useNoindex } from "./signup/useNoindex";

const TRANSIENT = ["checking", "signed_in"] as const;

const BILLING_LABELS: Record<string, string> = {
  active: "Active",
  past_due: "Past due",
  canceling: "Canceling",
  canceled: "Canceled",
};

function Details({ status }: { status: AccountStatus }) {
  if (status.billing_status === null) return null;
  const rows: [string, string][] = [
    ["Plan", status.plan ? status.plan.charAt(0).toUpperCase() + status.plan.slice(1) : "-"],
    ["Billing", BILLING_LABELS[status.billing_status] ?? status.billing_status],
    ["Business details", status.verified ? "Verified" : "Pending check"],
  ];
  if (status.loans_included !== null) {
    rows.push(["Loans this period", `${status.loans_used} of ${status.loans_included} loans included`]);
  }
  return (
    <dl className="m-0 mt-6 grid gap-x-8 gap-y-3 border-t border-[#e4ebf4] pt-5 sm:grid-cols-2">
      {rows.map(([name, value]) => (
        <div key={name} className="min-w-0">
          <dt className="text-[13px] font-semibold uppercase tracking-wide text-[#5b6a80]">{name}</dt>
          <dd className="m-0 mt-1 text-[15px] text-[#0a0e14] break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AccountDashboard() {
  useNoindex();
  const { phase, restart, signOut } = useAccountStatus(false);
  const status = phase.kind === "signed_in" ? phase.status : null;
  const view = status ? describeAccount(status) : null;
  const stepRef = useFocusHeading(status ? "status" : phase.kind, TRANSIENT);

  return (
    <PageShell
      testId="page-account"
      kicker="Account"
      title="Your account"
      lead="Your subscription, billing and set-up status."
    >
      <AccountGate phase={phase} onSignedIn={restart} signInHeading="Sign in to your account" />
      {phase.kind === "signed_in" ? (
        <div ref={stepRef} className="grid max-w-[40rem] gap-5" aria-live="polite">
          {phase.error ? <Alert>{phase.error}</Alert> : null}
          {status && view ? (
            <Card>
              <StatusHeading view={view} />
              <Details status={status} />
              <div className="mt-6 flex flex-wrap items-start gap-3">
                <ErpSignInLink status={status} />
                {view.kind === "started" ? <ContinueToPayment /> : null}
                {view.kind === "none" ? (
                  <Link to="/register" className={primaryButton}>
                    Get started
                  </Link>
                ) : null}
                {view.portal ? <PortalButton label={view.portalLabel} /> : null}
              </div>
            </Card>
          ) : (
            !phase.error && <Notice>Loading your account…</Notice>
          )}
          <SupportLine status={status} />
          <div>
            <button type="button" className={ghostButton} onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

/** /account. With ?checkout=success it is the post-payment page instead. */
export default function AccountPage() {
  const [params] = useSearchParams();
  return params.get("checkout") === "success" ? <CheckoutReturnPage /> : <AccountDashboard />;
}
