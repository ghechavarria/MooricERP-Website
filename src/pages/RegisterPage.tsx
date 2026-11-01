import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ERP_URL } from "../config/signup";
import { erpApi, ErpApiError, type AccountConfig } from "../lib/erpApi";
import {
  currentSession,
  firebaseAvailable,
  refreshVerification,
  registerUser,
  sendVerification,
} from "../lib/firebase";
import { friendlyError, isApiCode } from "./signup/errors";
import { formatMoney } from "./signup/format";
import {
  Alert,
  Card,
  ghostButton,
  linkClass,
  NotAvailable,
  Notice,
  PageShell,
  primaryButton,
  TextField,
} from "./signup/Layout";
import { redirectTo } from "./signup/redirect";
import { SignInForm } from "./signup/SignInForm";
import { Turnstile } from "./signup/Turnstile";
import { turnstileSiteKey } from "./signup/turnstileKey";
import { useNoindex } from "./signup/useNoindex";

type Session = { email: string | null; emailVerified: boolean };

type Phase =
  | { kind: "loading" }
  | { kind: "unavailable" }
  | { kind: "load_error"; message: string }
  | { kind: "form" }
  | { kind: "signin" }
  | { kind: "resume" }
  | { kind: "verify" }
  | { kind: "paid" };

const PAID_STATES = new Set(["paid", "review", "provisioned", "claims_set", "email_sending", "ready"]);
const NMLS_PATTERN = /^[0-9]{1,12}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<"first" | "last" | "email" | "password" | "nmls" | "terms" | "bot", string>>;

/** /register: account, details, email check, then Stripe Checkout. */
export default function RegisterPage() {
  useNoindex();
  const [params] = useSearchParams();
  const cancelled = params.get("checkout") === "cancelled";

  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [config, setConfig] = useState<AccountConfig | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    if (!firebaseAvailable()) {
      setPhase({ kind: "unavailable" });
      return;
    }
    try {
      const [cfg, current] = await Promise.all([erpApi.config(), currentSession()]);
      if (!cfg.signup_available || !cfg.terms_version) {
        setPhase({ kind: "unavailable" });
        return;
      }
      setConfig(cfg);
      setSession(current);
      if (!current) {
        setPhase({ kind: "form" });
        return;
      }
      // Someone already signed in: skip steps they have finished.
      let state = "none";
      try {
        state = (await erpApi.status()).state;
      } catch {
        // No status yet is the same as a fresh start.
      }
      if (PAID_STATES.has(state)) setPhase({ kind: "paid" });
      else setPhase({ kind: state === "started" ? "resume" : "form" });
    } catch (error) {
      if (error instanceof ErpApiError && error.code === "not_available") setPhase({ kind: "unavailable" });
      else if ((error as { name?: string } | null)?.name === "FirebaseUnavailableError")
        setPhase({ kind: "unavailable" });
      else setPhase({ kind: "load_error", message: friendlyError(error) });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, attempt]);

  const reload = () => {
    setPhase({ kind: "loading" });
    setAttempt((n) => n + 1);
  };

  return (
    <PageShell
      testId="page-register"
      kicker="Get started"
      title="Create your account"
      lead="Set up your account, confirm your email, then pay securely through Stripe."
    >
      <div className="grid max-w-[34rem] gap-5">
        {cancelled && ["form", "resume", "verify"].includes(phase.kind) ? (
          <Notice>Checkout was cancelled and nothing was charged. You can pick up where you left off.</Notice>
        ) : null}
        {phase.kind === "loading" ? <Notice>Loading…</Notice> : null}
        {phase.kind === "unavailable" ? <NotAvailable /> : null}
        {phase.kind === "load_error" ? (
          <>
            <Alert>{phase.message}</Alert>
            <div>
              <button type="button" className={ghostButton} onClick={reload}>
                Try again
              </button>
            </div>
          </>
        ) : null}
        {phase.kind === "paid" ? (
          <Card>
            <h2 className="m-0 text-xl font-bold text-[#0a0e14]">You have already signed up</h2>
            <p className="mb-5 mt-2 text-[15px] leading-6 text-[#48566b]">
              Your payment is on file. Check your account for the latest status.
            </p>
            <Link to="/account" className={primaryButton}>
              Go to your account
            </Link>
          </Card>
        ) : null}
        {phase.kind === "signin" && config ? (
          <Card>
            <h2 className="m-0 mb-5 text-xl font-bold text-[#0a0e14]">Sign in to continue</h2>
            <SignInForm onSignedIn={reload} />
            <p className="mb-0 mt-5">
              <button type="button" className={`${linkClass} bg-transparent p-0`} onClick={() => setPhase({ kind: "form" })}>
                Back to create account
              </button>
            </p>
          </Card>
        ) : null}
        {phase.kind === "form" && config ? (
          <DetailsForm
            config={config}
            session={session}
            onSession={setSession}
            onSignIn={() => setPhase({ kind: "signin" })}
            onVerify={() => setPhase({ kind: "verify" })}
            onPaid={() => setPhase({ kind: "paid" })}
          />
        ) : null}
        {phase.kind === "resume" && config ? (
          <ResumeCard
            session={session}
            onVerify={() => setPhase({ kind: "verify" })}
            onBack={() => setPhase({ kind: "form" })}
            onPaid={() => setPhase({ kind: "paid" })}
            onNeedDetails={() => setPhase({ kind: "form" })}
          />
        ) : null}
        {phase.kind === "verify" ? (
          <VerifyCard
            session={session}
            onSession={setSession}
            onPaid={() => setPhase({ kind: "paid" })}
            onNeedDetails={() => setPhase({ kind: "form" })}
          />
        ) : null}
      </div>
    </PageShell>
  );
}

type CheckoutResult = "redirected" | "need_verify" | "paid" | "need_details" | { error: string };

/** Asks the ERP for a Checkout Session and sends the browser to it. */
const startCheckout = async (): Promise<CheckoutResult> => {
  try {
    const { url } = await erpApi.checkout();
    redirectTo(url);
    return "redirected";
  } catch (error) {
    if (isApiCode(error, "email_not_verified")) return "need_verify";
    if (isApiCode(error, "already_paid")) return "paid";
    if (isApiCode(error, "signup_required")) return "need_details";
    return { error: friendlyError(error) };
  }
};

function PlanSummary({ plan }: { plan: AccountConfig["plan"] }) {
  return (
    <p className="m-0 text-[15px] leading-6 text-[#48566b]">
      {plan.name} plan: {formatMoney(plan.price_cents)} per month + applicable tax, with {plan.included_loans} loans
      included and {formatMoney(plan.overage_cents)} for each additional loan.
    </p>
  );
}

function ResumeCard({
  session,
  onVerify,
  onBack,
  onPaid,
  onNeedDetails,
}: {
  session: Session | null;
  onVerify: () => void;
  onBack: () => void;
  onPaid: () => void;
  onNeedDetails: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const proceed = async () => {
    if (!session?.emailVerified) {
      onVerify();
      return;
    }
    setBusy(true);
    setError("");
    const result = await startCheckout();
    if (result === "redirected") return;
    setBusy(false);
    if (result === "need_verify") onVerify();
    else if (result === "paid") onPaid();
    else if (result === "need_details") onNeedDetails();
    else setError(result.error);
  };

  return (
    <Card>
      <h2 className="m-0 text-xl font-bold text-[#0a0e14]">Welcome back</h2>
      <p className="mb-5 mt-2 text-[15px] leading-6 text-[#48566b]">
        Your details are saved. Continue to payment to finish signing up.
      </p>
      {error ? <Alert>{error}</Alert> : null}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" className={primaryButton} onClick={proceed} disabled={busy}>
          {busy ? "Redirecting…" : "Continue to payment"}
        </button>
        <button type="button" className={`${linkClass} bg-transparent p-0`} onClick={onBack}>
          Change my details
        </button>
      </div>
    </Card>
  );
}

function VerifyCard({
  session,
  onSession,
  onPaid,
  onNeedDetails,
}: {
  session: Session | null;
  onSession: (s: Session) => void;
  onPaid: () => void;
  onNeedDetails: () => void;
}) {
  const [busy, setBusy] = useState<"" | "check" | "resend">("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const resend = async () => {
    setBusy("resend");
    setError("");
    setNotice("");
    try {
      await sendVerification();
      setNotice("We sent the email again. Check your inbox and spam folder.");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy("");
    }
  };

  const check = async () => {
    setBusy("check");
    setError("");
    setNotice("");
    try {
      const verified = await refreshVerification();
      if (!verified) {
        setError("Your email is not verified yet. Click the link in the email we sent, then try again.");
        setBusy("");
        return;
      }
      if (session) onSession({ ...session, emailVerified: true });
      const result = await startCheckout();
      if (result === "redirected") return;
      setBusy("");
      if (result === "paid") onPaid();
      else if (result === "need_details") onNeedDetails();
      else if (result === "need_verify") setError(friendlyError(new ErpApiError(403, "email_not_verified", "")));
      else setError(result.error);
    } catch (e) {
      setError(friendlyError(e));
      setBusy("");
    }
  };

  return (
    <Card>
      <h2 className="m-0 text-xl font-bold text-[#0a0e14]">Check your email</h2>
      <p className="mb-0 mt-2 text-[15px] leading-6 text-[#48566b]">
        We sent a verification link{session?.email ? ` to ${session.email}` : ""}. Click it, then come back here to
        continue to payment.
      </p>
      <div className="mt-5 grid gap-4">
        {notice ? <Notice>{notice}</Notice> : null}
        {error ? <Alert>{error}</Alert> : null}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={primaryButton} onClick={check} disabled={busy !== ""}>
            {busy === "check" ? "Checking…" : "I've verified my email"}
          </button>
          <button type="button" className={ghostButton} onClick={resend} disabled={busy !== ""}>
            {busy === "resend" ? "Sending…" : "Resend email"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function DetailsForm({
  config,
  session,
  onSession,
  onSignIn,
  onVerify,
  onPaid,
}: {
  config: AccountConfig;
  session: Session | null;
  onSession: (s: Session) => void;
  onSignIn: () => void;
  onVerify: () => void;
  onPaid: () => void;
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nmls, setNmls] = useState("");
  const [terms, setTerms] = useState(false);
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = turnstileSiteKey();

  const validate = (): FieldErrors => {
    const found: FieldErrors = {};
    if (!first.trim()) found.first = "Enter your first name.";
    if (!last.trim()) found.last = "Enter your last name.";
    if (!session) {
      if (!EMAIL_PATTERN.test(email.trim())) found.email = "Enter a valid email address.";
      if (password.length < 8) found.password = "Use at least 8 characters.";
    }
    if (!NMLS_PATTERN.test(nmls.trim())) found.nmls = "NMLS ID must be 1 to 12 digits.";
    if (!terms) found.terms = "You need to agree to the Terms of Service and Privacy Policy to continue.";
    if (siteKey && !token) found.bot = "Please complete the bot check.";
    return found;
  };

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    setAccountExists(false);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError();
      return;
    }
    setBusy(true);
    const verified = session?.emailVerified ?? false;
    try {
      if (!session) {
        await registerUser(email.trim(), password);
        // From here the person is signed in, so a retry must not create the account again.
        onSession({ email: email.trim(), emailVerified: false });
      }
      await erpApi.signup({
        first_name: first.trim(),
        last_name: last.trim(),
        nmls_id: nmls.trim(),
        terms_version: config.terms_version,
        turnstile_token: token,
      });
      if (siteKey) setResetSignal((n) => n + 1);
      if (!verified) {
        await sendVerification();
        onVerify();
        return;
      }
      const result = await startCheckout();
      if (result === "redirected") return;
      if (result === "need_verify") onVerify();
      else if (result === "paid") onPaid();
      else if (result === "need_details") setFormError("Please check your details and try again.");
      else setFormError(result.error);
    } catch (e) {
      if (siteKey) setResetSignal((n) => n + 1);
      if (isApiCode(e, "account_exists")) setAccountExists(true);
      else if (isApiCode(e, "already_paid")) onPaid();
      else setFormError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <form ref={formRef} onSubmit={submit} noValidate className="grid gap-5" aria-label="Create your account">
        <PlanSummary plan={config.plan} />
        {session ? (
          <p className="m-0 text-[15px] text-[#2b3648]">
            Signed in as <strong className="break-all">{session.email}</strong>
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="reg-first" label="First name" value={first} onChange={setFirst} autoComplete="given-name" error={errors.first} />
          <TextField id="reg-last" label="Last name" value={last} onChange={setLast} autoComplete="family-name" error={errors.last} />
        </div>
        {!session ? (
          <>
            <TextField
              id="reg-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              inputMode="email"
              error={errors.email}
            />
            <TextField
              id="reg-password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              hint="At least 8 characters."
              error={errors.password}
            />
          </>
        ) : null}
        <TextField
          id="reg-nmls"
          label="NMLS ID"
          value={nmls}
          onChange={setNmls}
          inputMode="numeric"
          maxLength={20}
          hint="Your individual NMLS ID: digits only, up to 12."
          error={errors.nmls}
        />
        <div className="min-w-0">
          <label className="flex items-start gap-3 text-[15px] leading-6 text-[#2b3648]">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? "reg-terms-error" : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-erp"
            />
            <span>
              I agree to the <LegalLink href={config.terms_url}>Terms of Service</LegalLink> and{" "}
              <LegalLink href={config.privacy_url}>Privacy Policy</LegalLink>
            </span>
          </label>
          {errors.terms ? (
            <p id="reg-terms-error" className="m-0 mt-1.5 text-[13px] font-medium leading-5 text-red-700">
              {errors.terms}
            </p>
          ) : null}
        </div>
        {siteKey ? (
          <div>
            <Turnstile siteKey={siteKey} onToken={setToken} resetSignal={resetSignal} />
            {errors.bot ? <p className="m-0 mt-1.5 text-[13px] font-medium leading-5 text-red-700">{errors.bot}</p> : null}
          </div>
        ) : null}
        {formError ? <Alert>{formError}</Alert> : null}
        {accountExists ? (
          <Alert>
            An ERP account already exists for this email.{" "}
            {ERP_URL ? (
              <a href={ERP_URL} className={linkClass}>
                Sign in to Mooric ERP
              </a>
            ) : (
              "Use the sign-in page for Mooric ERP."
            )}
          </Alert>
        ) : null}
        <button type="submit" className={primaryButton} disabled={busy}>
          {busy ? "Working…" : session ? "Save and continue to payment" : "Create account and continue"}
        </button>
        {!session ? (
          <p className="m-0 text-[15px] text-[#48566b]">
            <button type="button" className={`${linkClass} bg-transparent p-0`} onClick={onSignIn}>
              I already have an account
            </button>
          </p>
        ) : null}
      </form>
    </Card>
  );
}

function LegalLink({ href, children }: { href: string; children: string }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}
