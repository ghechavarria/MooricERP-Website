import { useEffect, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { erpApi, type AccountStatus } from "../lib/erpApi";
import CheckoutReturnPage from "./CheckoutReturnPage";
import { describeAccount } from "./signup/accountState";
import { AccountGate } from "./signup/AccountGate";
import { Alert, Card, ghostButton, Notice, PageShell, primaryButton } from "./signup/Layout";
import { formatMoney, formatShortDate } from "./signup/format";
import { SIGNED_OUT_PARAM } from "./signup/signOut";
import { ContinueToPayment, ErpSignInLink, PortalButton, StatusHeading, SupportLine } from "./signup/StatusParts";
import { useAccountStatus } from "./signup/useAccountStatus";
import { useFocusHeading } from "./signup/useFocusHeading";
import { useNoindex } from "./signup/useNoindex";

const TRANSIENT = ["checking", "signed_in"] as const;

const BILLING: Record<string, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "ok" },
  past_due: { label: "Payment past due", tone: "warn" },
  canceling: { label: "Canceling", tone: "warn" },
  canceled: { label: "Canceled", tone: "muted" },
};

type Tone = "ok" | "warn" | "danger" | "info" | "muted";

const PILL: Record<Tone, string> = {
  ok: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  warn: "bg-amber-50 text-amber-900 ring-amber-200",
  danger: "bg-red-50 text-red-800 ring-red-200",
  info: "bg-[#eef5ff] text-[#0b4fa8] ring-[#cfe0f7]",
  muted: "bg-[#f1f4f8] text-[#48566b] ring-[#dde4ee]",
};

function Pill({ tone, children }: { tone: Tone; children: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] font-semibold ring-1 ring-inset ${PILL[tone]}`}>
      {children}
    </span>
  );
}

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#e4ebf4] bg-white p-5 shadow-card">
      <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5b6a80]">{label}</dt>
      <dd className="m-0 mt-2 text-[17px] font-semibold text-[#0a0e14] break-words">{children}</dd>
    </div>
  );
}

function LoansTile({ used, included }: { used: number; included: number }) {
  const extra = Math.max(0, used - included);
  const pct = included > 0 ? Math.min(100, Math.round((used / included) * 100)) : 0;
  return (
    <Tile label="Loans this period">
      <span>
        {used} of {included} loans used
      </span>
      <span
        role="progressbar"
        aria-label="Included loans used"
        aria-valuemin={0}
        aria-valuemax={included}
        aria-valuenow={Math.min(used, included)}
        className="mt-3 block h-2 overflow-hidden rounded-full bg-[#e8eef6]"
      >
        <span className={`block h-full rounded-full ${extra ? "bg-amber-500" : "bg-erp"}`} style={{ width: `${pct}%` }} />
      </span>
    </Tile>
  );
}

/** Loans past the plan's allowance this period, and what they add at the plan's overage price. */
function ExtraLoansTile({ used, included, overageCents }: { used: number; included: number; overageCents: number | null }) {
  const extra = Math.max(0, used - included);
  const price = overageCents !== null ? formatMoney(overageCents) : null;
  let note: string;
  if (price === null) note = `Billed per loan after the first ${included}`;
  else if (extra === 0) note = `${price} each after the first ${included}`;
  else note = `${price} each, ${formatMoney(extra * (overageCents ?? 0))} so far this period`;
  return (
    <Tile label="Extra loans">
      <span className={extra ? "text-amber-800" : undefined}>
        {extra} extra {extra === 1 ? "loan" : "loans"}
      </span>
      <span className="mt-1 block text-[13px] font-medium text-[#5b6a80]">{note}</span>
    </Tile>
  );
}

/** Active users on the subscription and, for a per-user plan, what they add up to each month. */
function UsersTile({ seats, plan }: { seats: number; plan: PlanPrices | null }) {
  const each = plan?.per_user ? formatMoney(plan.price_cents) : null;
  return (
    <Tile label="Users">
      {seats} {seats === 1 ? "user" : "users"}
      {each && plan ? (
        <span className="mt-1 block text-[13px] font-medium text-[#5b6a80]">
          {each} each, {formatMoney(plan.price_cents * seats)} a month
        </span>
      ) : null}
    </Tile>
  );
}

function Details({ status, plan }: { status: AccountStatus; plan: PlanPrices | null }) {
  const overageCents = plan?.overage_cents ?? null;
  if (status.billing_status === null) return null;
  const known = BILLING[status.billing_status] ?? { label: status.billing_status, tone: "muted" as Tone };
  const ends = status.billing_status === "canceling" ? formatShortDate(status.ends_at, status.timezone) : "";
  const billing = ends ? { ...known, label: `Ends ${ends}` } : known;
  return (
    <dl className="m-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Tile label="Plan">{status.plan ? status.plan.charAt(0).toUpperCase() + status.plan.slice(1) : "-"}</Tile>
      <Tile label="Billing">
        <Pill tone={billing.tone}>{billing.label}</Pill>
      </Tile>
      <Tile label="Business details">
        <Pill tone={status.verified ? "ok" : "info"}>{status.verified ? "NMLS verified" : "Pending NMLS check"}</Pill>
      </Tile>
      {typeof status.seats === "number" ? <UsersTile seats={status.seats} plan={plan} /> : null}
      {status.loans_included !== null ? (
        <>
          <LoansTile used={status.loans_used} included={status.loans_included} />
          <ExtraLoansTile used={status.loans_used} included={status.loans_included} overageCents={overageCents} />
        </>
      ) : null}
    </dl>
  );
}

type PlanPrices = { price_cents: number; overage_cents: number; per_user?: boolean };

/** The plan's prices, from the public plan config. Null until loaded or if it fails. */
function usePlanPrices(enabled: boolean): PlanPrices | null {
  const [prices, setPrices] = useState<PlanPrices | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    erpApi
      .config()
      .then((config) => {
        if (!cancelled) setPrices(config.plan);
      })
      .catch(() => {
        // The tile falls back to wording without a price.
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return prices;
}

function AccountBar({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4ebf4] bg-[#f8fafd] px-4 py-3 sm:px-5">
      <p className="m-0 min-w-0 text-[15px] text-[#48566b]">
        Signed in as <strong className="break-all font-semibold text-[#0a0e14]">{email ?? "your account"}</strong>
      </p>
      <button type="button" className={`${ghostButton} !px-4 !py-2 text-[14px]`} onClick={onSignOut}>
        Sign out
      </button>
    </div>
  );
}

function AccountDashboard() {
  useNoindex();
  const [params] = useSearchParams();
  const signedOut = params.get(SIGNED_OUT_PARAM) === "1";
  const { phase, restart, signOut } = useAccountStatus(false);
  const status = phase.kind === "signed_in" ? phase.status : null;
  const view = status ? describeAccount(status) : null;
  const stepRef = useFocusHeading(status ? "status" : phase.kind, TRANSIENT);
  const plan = usePlanPrices(phase.kind === "signed_in");

  return (
    <PageShell
      testId="page-account"
      kicker="Account"
      title="Your account"
      lead="Your subscription, billing and set-up status."
      centered={phase.kind !== "signed_in"}
    >
      {phase.kind !== "signed_in" ? (
        // Signing in: one centred column, like /register.
        <div className="mx-auto grid w-full max-w-[28rem] gap-5">
          {signedOut && phase.kind === "signin" ? <Notice>You're signed out.</Notice> : null}
          <AccountGate phase={phase} onSignedIn={restart} signInHeading="Sign in to your account" />
        </div>
      ) : null}
      {phase.kind === "signed_in" ? (
        <div ref={stepRef} className="grid w-full gap-5" aria-live="polite">
          <AccountBar email={phase.email} onSignOut={() => void signOut()} />
          {phase.error ? <Alert>{phase.error}</Alert> : null}
          {status && view ? (
            <>
              <Card className="!p-6 sm:!p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                  <div className="min-w-0 lg:max-w-[40rem]">
                    <StatusHeading view={view} />
                  </div>
                  <div className="flex shrink-0 flex-wrap items-start gap-3">
                    <ErpSignInLink status={status} />
                    {view.kind === "started" ? <ContinueToPayment /> : null}
                    {view.kind === "none" ? (
                      <Link to="/register" className={primaryButton}>
                        Get started
                      </Link>
                    ) : null}
                    {view.portal ? <PortalButton label={view.portalLabel} /> : null}
                  </div>
                </div>
              </Card>
              <Details status={status} plan={plan} />
            </>
          ) : (
            !phase.error && <Notice>Loading your account…</Notice>
          )}
          <SupportLine status={status} />
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
