import { useState } from "react";
import { Link } from "react-router-dom";
import { erpApi, type AccountStatus } from "../../lib/erpApi";
import type { AccountView } from "./accountState";
import { friendlyError } from "./errors";
import { Alert, ghostButton, linkClass, primaryButton } from "./Layout";
import { redirectTo, safeUrl } from "./redirect";

const toneClasses: Record<AccountView["tone"], string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  danger: "bg-red-600",
  info: "bg-erp",
  progress: "bg-erp",
};

export function StatusHeading({ view }: { view: AccountView }) {
  return (
    <div className="flex items-start gap-3">
      {view.tone === "progress" ? (
        <span
          aria-hidden
          className="mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-erp border-t-transparent motion-safe:animate-spin"
        />
      ) : (
        <span aria-hidden className={`mt-2 h-3 w-3 shrink-0 rounded-full ${toneClasses[view.tone]}`} />
      )}
      <div className="min-w-0">
        <h2 tabIndex={-1} className="outline-none m-0 text-xl font-bold leading-snug text-[#0a0e14] break-words">{view.title}</h2>
        <p className="mb-0 mt-2 text-[15px] leading-6 text-[#48566b]">{view.body}</p>
      </div>
    </div>
  );
}

/** Opens the Stripe Customer Portal. Works for suspended customers too. */
export function PortalButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const open = async () => {
    setBusy(true);
    setError("");
    try {
      const { url } = await erpApi.portal();
      redirectTo(url);
    } catch (e) {
      setError(friendlyError(e));
      setBusy(false);
    }
  };
  return (
    <div className="grid gap-3">
      <button type="button" className={ghostButton} onClick={open} disabled={busy}>
        {busy ? "Opening…" : label}
      </button>
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}

/** The ERP sign-in link. Only ever built from the server's status.erp_url. */
export function ErpSignInLink({ status }: { status: AccountStatus }) {
  const href = safeUrl(status.erp_url);
  if (!href) return null;
  return (
    <a href={href} className={primaryButton}>
      Sign in to Mooric ERP
    </a>
  );
}

export function SupportLine({ status }: { status: AccountStatus | null }) {
  if (!status?.support_email) return null;
  return (
    <p className="m-0 text-[14px] leading-6 text-[#5b6a80]">
      Need help? Contact{" "}
      <a href={`mailto:${status.support_email}`} className={linkClass}>
        {status.support_email}
      </a>
      .
    </p>
  );
}

export function ContinueToPayment() {
  return (
    <Link to="/register" className={primaryButton}>
      Continue to payment
    </Link>
  );
}
