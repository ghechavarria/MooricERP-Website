import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ERP_URL, ROUTES } from "../config/signup";
import { erpApi, ErpApiError, type AccountConfig } from "../lib/erpApi";
import {
  currentSession,
  firebaseAvailable,
  refreshVerification,
  registerUser,
  sendVerification,
} from "../lib/firebase";
import { friendlyError, isApiCode } from "./signup/errors";
import { formatMoney, includedLoans, priceUnit, trialLabel } from "./signup/format";
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
import { passwordProblem } from "./signup/password";
import { PasswordField } from "./signup/PasswordField";
import { redirectTo, safeUrl } from "./signup/redirect";
import { signOutCompletely } from "./signup/signOut";
import { SignInForm } from "./signup/SignInForm";
import { Turnstile } from "./signup/Turnstile";
import { turnstileReady, turnstileSiteKey } from "./signup/turnstileKey";
import { useFocusHeading } from "./signup/useFocusHeading";
import { useNoindex } from "./signup/useNoindex";

const TRANSIENT = ["loading"] as const;

type Session = { email: string | null; emailVerified: boolean };

type Phase =
  | { kind: "loading" }
  | { kind: "unavailable" }
  | { kind: "load_error"; message: string }
  | { kind: "form" }
  | { kind: "signin" }
  | { kind: "resume" }
  | { kind: "verify"; message?: string }
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
  const stepRef = useFocusHeading(phase.kind, TRANSIENT);

  const load = useCallback(async () => {
    if (!firebaseAvailable() || !turnstileReady()) {
      setPhase({ kind: "unavailable" });
      return;
    }
    try {
      const [cfg, current] = await Promise.all([erpApi.config(), currentSession()]);
      if (
        !cfg.signup_available ||
        !cfg.terms_version ||
        !safeUrl(cfg.terms_url) ||
        !safeUrl(cfg.privacy_url)
      ) {
        setPhase({ kind: "unavailable" });
        return;
      }
      setConfig(cfg);
      setSession(current);
      if (!current) {
        // Sign in first; "Create an account" switches to the form.
        setPhase({ kind: "signin" });
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

  // Someone who has already paid has nothing to do here: go straight to the account page.
  const navigate = useNavigate();
  useEffect(() => {
    if (phase.kind === "paid") navigate(ROUTES.account, { replace: true });
  }, [phase.kind, navigate]);

  const reload = () => {
    setPhase({ kind: "loading" });
    setAttempt((n) => n + 1);
  };

  const heading =
    phase.kind === "signin"
      ? {
          title: "Sign in to get started",
          lead: "Sign in to pick up where you left off.",
        }
      : phase.kind === "form" && !session
        ? {
            title: "Create your account",
            lead: "Get set up in minutes.",
          }
        : phase.kind === "paid"
          ? { title: "You're all set", lead: "Taking you to your account…" }
          : { title: "Finish signing up", lead: "Almost there." };

  return (
    <PageShell testId="page-register" kicker="Get started" title={heading.title} lead={heading.lead} centered>
      <div ref={stepRef} className="mx-auto grid w-full max-w-[34rem] gap-5">
        {cancelled && ["signin", "form", "resume", "verify"].includes(phase.kind) ? (
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
        {phase.kind === "signin" && config ? (
          <Card>
            <h2 tabIndex={-1} className="outline-none m-0 mb-5 text-xl font-bold text-[#0a0e14]">Sign in</h2>
            <SignInForm onSignedIn={reload} />
            <div className="mt-6 border-t border-[#e4ebf4] pt-5 text-center">
              <p className="m-0 text-[15px] text-[#48566b]">New to Mooric ERP?</p>
              <button
                type="button"
                className={`${ghostButton} mt-3 w-full`}
                onClick={() => setPhase({ kind: "form" })}
              >
                Create an account
              </button>
            </div>
          </Card>
        ) : null}
        {phase.kind === "form" && config ? (
          <DetailsForm
            config={config}
            session={session}
            onSession={setSession}
            onSignIn={() => setPhase({ kind: "signin" })}
            onVerify={(message) => setPhase({ kind: "verify", message })}
            onPaid={() => setPhase({ kind: "paid" })}
          />
        ) : null}
        {phase.kind === "resume" && config ? (
          <ResumeCard
            session={session}
            onVerify={(message) => setPhase({ kind: "verify", message })}
            onBack={() => setPhase({ kind: "form" })}
            onPaid={() => setPhase({ kind: "paid" })}
            onNeedDetails={() => setPhase({ kind: "form" })}
          />
        ) : null}
        {phase.kind === "verify" ? (
          <VerifyCard
            initialError={phase.message}
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

/** "Signed in as …" with a Sign out link that ends the session and starts /register fresh. */
function SignedInAs({ email }: { email: string | null }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const leave = async () => {
    setBusy(true);
    setError("");
    const problem = await signOutCompletely("/register");
    if (problem) {
      setError(problem);
      setBusy(false);
    }
  };
  return (
    <div className="grid gap-2">
      <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px] text-[#2b3648]">
        <span>
          Signed in as <strong className="break-all">{email ?? "your account"}</strong>
        </span>
        <button type="button" className={`${linkClass} bg-transparent p-0 text-[14px]`} onClick={leave} disabled={busy}>
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </p>
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}

/** The subscription being signed up for, as a small card at the top of the form. */
function PlanSummary({ plan }: { plan: AccountConfig["plan"] }) {
  return (
    <section
      aria-label="Your subscription"
      className="rounded-xl border border-[#cfe0f7] bg-[#f4f9fc] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-erp-600">Your subscription</p>
          <p className="m-0 mt-1 text-lg font-bold text-[#0a0e14]">{plan.name} plan</p>
        </div>
        <p className="m-0 text-right">
          <span className="text-2xl font-bold tracking-tight text-[#0a0e14]">{formatMoney(plan.price_cents)}</span>
          <span className="text-[14px] text-[#48566b]"> {priceUnit(plan)}</span>
          <span className="block text-[13px] text-[#5b6a80]">+ applicable tax</span>
        </p>
      </div>
      <ul className="m-0 mt-3 grid list-none gap-1.5 border-t border-[#d9e6f5] p-0 pt-3 text-[14px] text-[#2b3648] sm:grid-cols-2">
        {trialLabel(plan.trial_days) ? <li>{trialLabel(plan.trial_days)}</li> : null}
        <li>{includedLoans(plan)}</li>
        <li>{formatMoney(plan.overage_cents)} per additional loan</li>
      </ul>
    </section>
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
  onVerify: (message?: string) => void;
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
      <h2 tabIndex={-1} className="outline-none m-0 text-xl font-bold text-[#0a0e14]">Welcome back</h2>
      <p className="mb-4 mt-2 text-[15px] leading-6 text-[#48566b]">
        Your details are saved. Continue to payment to finish signing up.
      </p>
      <div className="mb-5">
        <SignedInAs email={session?.email ?? null} />
      </div>
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
  initialError = "",
  session,
  onSession,
  onPaid,
  onNeedDetails,
}: {
  initialError?: string;
  session: Session | null;
  onSession: (s: Session) => void;
  onPaid: () => void;
  onNeedDetails: () => void;
}) {
  const [busy, setBusy] = useState<"" | "check" | "resend">("");
  const [error, setError] = useState(initialError);
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
      <h2 tabIndex={-1} className="outline-none m-0 text-xl font-bold text-[#0a0e14]">Check your email</h2>
      <p className="mb-0 mt-2 text-[15px] leading-6 text-[#48566b]">
        We sent a verification link{session?.email ? ` to ${session.email}` : ""}. Click it, then come back here to
        continue to payment.
      </p>
      <div className="mt-5 grid gap-4">
        {session ? <SignedInAs email={session.email} /> : null}
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
  onVerify: (message?: string) => void;
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
      const weak = passwordProblem(password, email);
      if (weak) found.password = weak;
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
        setPassword("");
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
        try {
          await sendVerification();
          onVerify();
        } catch {
          onVerify("We saved your details but could not send the verification email. Use Resend email to try again.");
        }
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
        {session ? <SignedInAs email={session.email} /> : null}
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
            <PasswordField value={password} onChange={setPassword} email={email} error={errors.password} />
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
        <button type="submit" className={`${primaryButton} w-full`} disabled={busy}>
          {busy ? "Working…" : session ? "Save and continue to payment" : "Create account and continue"}
        </button>
        {!session ? (
          <p className="m-0 text-center text-[15px] text-[#48566b]">
            Already have an account?{" "}
            <button type="button" className={`${linkClass} bg-transparent p-0`} onClick={onSignIn}>
              Sign in
            </button>
          </p>
        ) : null}
      </form>
    </Card>
  );
}

function LegalLink({ href, children }: { href: string; children: string }) {
  const url = safeUrl(href);
  if (!url) return <>{children}</>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}
