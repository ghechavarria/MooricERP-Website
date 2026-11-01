import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { erpApi, ErpApiError, type AccountConfig } from "../lib/erpApi";
import { friendlyError } from "./signup/errors";
import { formatMoney } from "./signup/format";
import { Alert, Card, ghostButton, linkClass, NotAvailable, Notice, PageShell, primaryButton } from "./signup/Layout";
import { useNoindex } from "./signup/useNoindex";

type Load =
  | { kind: "loading" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string }
  | { kind: "ready"; config: AccountConfig };

/** /pricing. Every number and name comes from the ERP's plan data. */
export default function PricingPage() {
  useNoindex();
  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    erpApi
      .config()
      .then((config) => {
        if (cancelled) return;
        setLoad(config.signup_available ? { kind: "ready", config } : { kind: "unavailable" });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ErpApiError && error.code === "not_available") setLoad({ kind: "unavailable" });
        else setLoad({ kind: "error", message: friendlyError(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setLoad({ kind: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return (
    <PageShell
      testId="page-pricing"
      kicker="Pricing"
      title="Simple pricing for independent loan officers"
      lead="One subscription, with extra loans billed only when you go past what is included."
    >
      {load.kind === "loading" ? <Notice>Loading pricing…</Notice> : null}
      {load.kind === "unavailable" ? <NotAvailable /> : null}
      {load.kind === "error" ? (
        <div className="grid max-w-[34rem] gap-4">
          <Alert>{load.message}</Alert>
          <div>
            <button type="button" className={ghostButton} onClick={retry}>
              Try again
            </button>
          </div>
        </div>
      ) : null}
      {load.kind === "ready" ? <PlanCard plan={load.config.plan} /> : null}
    </PageShell>
  );
}

function PlanCard({ plan }: { plan: AccountConfig["plan"] }) {
  return (
    <Card className="max-w-[34rem]">
      <h2 className="m-0 text-xl font-bold text-[#0a0e14]">{plan.name}</h2>
      <p className="m-0 mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[clamp(2.25rem,8vw,3rem)] font-bold leading-none tracking-tight text-[#0a0e14]">
          {formatMoney(plan.price_cents)}
        </span>
        <span className="text-[15px] text-[#48566b]">per month</span>
        <span className="text-[15px] font-semibold text-[#2b3648]">+ applicable tax</span>
      </p>
      <ul className="m-0 mt-6 grid list-none gap-3 p-0">
        <li className="v4-bullet">
          <span>{plan.included_loans} loans included each month</span>
        </li>
        <li className="v4-bullet">
          <span>{formatMoney(plan.overage_cents)} per additional loan</span>
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link to="/register" className={primaryButton}>
          Get started
        </Link>
        <Link to="/account" className={linkClass}>
          Already subscribed? View your account
        </Link>
      </div>
    </Card>
  );
}
