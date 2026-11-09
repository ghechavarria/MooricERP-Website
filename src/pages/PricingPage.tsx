import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { erpApi, ErpApiError, type AccountConfig } from "../lib/erpApi";
import { friendlyError } from "./signup/errors";
import { formatMoney } from "./signup/format";
import { Alert, ghostButton, linkClass, NotAvailable, Notice, primaryButton } from "./signup/Layout";
import { useNoindex } from "./signup/useNoindex";

type Load =
  | { kind: "loading" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string }
  | { kind: "ready"; config: AccountConfig };

type Plan = AccountConfig["plan"];

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
    <div data-testid="page-pricing">
      <section className="layout-shell pb-10 pt-12 text-center sm:pb-14 sm:pt-16" aria-labelledby="pricing-heading">
        <div className="v4-rail min-w-0">
          <p className="v4-kicker">Pricing</p>
          <h1 id="pricing-heading" className="v4-h2 mx-auto break-words">
            Simple pricing for independent loan officers
          </h1>
          <p className="v4-lead mx-auto">
            One subscription with peace of mind included.
          </p>
        </div>
      </section>

      {load.kind === "ready" ? (
        <PlanSection plan={load.config.plan} />
      ) : (
        <section className="layout-shell pb-16">
          <div className="v4-rail mx-auto grid max-w-[34rem] min-w-0 gap-4">
            {load.kind === "loading" ? <Notice>Loading pricing…</Notice> : null}
            {load.kind === "unavailable" ? <NotAvailable /> : null}
            {load.kind === "error" ? (
              <>
                <Alert>{load.message}</Alert>
                <div>
                  <button type="button" className={ghostButton} onClick={retry}>
                    Try again
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

function PlanSection({ plan }: { plan: Plan }) {
  return (
    <>
      <section className="border-y border-[#e4ebf4] bg-[#f8fafd]" aria-label={`${plan.name} plan`}>
        <div className="layout-shell py-12 sm:py-16">
          <div className="v4-rail min-w-0">
            <PlanCard plan={plan} />
          </div>
        </div>
      </section>
      <Questions included={plan.included_loans} overage={formatMoney(plan.overage_cents)} />
    </>
  );
}

/**
 * The plan across the full rail. Wide screens: plan and price | what's included |
 * action, side by side. Tablet: price and list side by side, action below. Phone: stacked.
 */
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="grid min-w-0 gap-8 rounded-[1.125rem] border border-[#e4ebf4] bg-white p-6 shadow-card-md sm:p-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:gap-10 lg:p-10 xl:gap-14">
      <div className="min-w-0">
        <p className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-erp-600">{plan.name}</p>
        <p className="m-0 mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[clamp(2.75rem,8vw,3.75rem)] font-bold leading-none tracking-tight text-[#0a0e14]">
            {formatMoney(plan.price_cents)}
          </span>
          <span className="text-[15px] text-[#48566b]">per month</span>
        </p>
        <p className="m-0 mt-2 text-[15px] font-semibold text-[#2b3648]">+ applicable tax</p>
      </div>
      <ul className="m-0 grid min-w-0 list-none gap-3 border-t border-[#e4ebf4] p-0 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-10">
        <li className="v4-bullet">
          <span>{plan.included_loans} loans included each month</span>
        </li>
        <li className="v4-bullet">
          <span>{formatMoney(plan.overage_cents)} per additional loan</span>
        </li>
        <li className="v4-bullet">
          <span>Billed monthly</span>
        </li>
      </ul>
      <div className="min-w-0 md:col-span-2 lg:col-span-1">
        <Link to="/register" className={`${primaryButton} w-full`}>
          Get started
        </Link>
        <p className="m-0 mt-4 text-center text-[15px]">
          <Link to="/account" className={linkClass}>
            Already subscribed? View your account
          </Link>
        </p>
      </div>
    </div>
  );
}

function Questions({ included, overage }: { included: number; overage: string }) {
  const items = [
    {
      q: "What counts toward my monthly loans?",
      a: `Each loan counts once, in the billing period of its application date. The first ${included} in each period are part of your plan.`,
    },
    {
      q: "When am I charged for extra loans?",
      a: `Each loan over your allowance adds ${overage} to your next monthly invoice, so you see it with your regular bill.`,
    },
    {
      q: "How do I update my card or cancel?",
      a: "Open Manage billing from your account page. If you cancel, you keep access until the end of the period you've paid for.",
    },
    {
      q: "What happens if a payment fails?",
      a: "You keep full access for 30 days while you update your card. If the balance is still unpaid after that, access pauses until it's paid. Your data is kept.",
    },
    {
      q: "Who can sign up?",
      a: "Licensed mortgage loan officers. You'll need your individual NMLS ID, and we check it after you sign up.",
    },
    {
      q: "Can I talk to someone first?",
      a: "Yes. Use Book a demo or Contact at the top of this page and we'll walk you through it.",
    },
  ];
  return (
    <section className="layout-shell py-14 sm:py-20" aria-labelledby="pricing-faq-heading">
      <div className="v4-rail min-w-0">
        <h2 id="pricing-faq-heading" className="v4-h2-sm mx-auto text-center">
          Questions
        </h2>
        <dl className="m-0 mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.q} className="min-w-0 border-t border-[#e4ebf4] pt-5">
              <dt className="text-[17px] font-semibold text-[#0a0e14]">{item.q}</dt>
              <dd className="m-0 mt-2 text-[15px] leading-6 text-[#48566b]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
