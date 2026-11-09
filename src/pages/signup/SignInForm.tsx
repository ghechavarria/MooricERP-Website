import { useState, type FormEvent } from "react";
import { completeTotp, signIn, type SignInResult } from "../../lib/firebase";
import { friendlyError } from "./errors";
import { Alert, primaryButton, TextField } from "./Layout";

type Resolver = Extract<SignInResult, { status: "mfa_required" }>["resolver"];

/**
 * Email and password sign-in with the authenticator-app challenge for accounts
 * that have a second factor. Calls onSignedIn once Firebase has a signed-in user.
 */
export function SignInForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [resolver, setResolver] = useState<Resolver | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submitCredentials = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await signIn(email.trim(), password);
      setPassword("");
      if (result.status === "mfa_required") setResolver(result.resolver);
      else onSignedIn();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!resolver) return;
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await completeTotp(resolver, code.trim());
      onSignedIn();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  if (resolver) {
    return (
      <form onSubmit={submitCode} noValidate className="grid gap-5">
        <TextField
          id="signin-code"
          label="Authenticator code"
          value={code}
          onChange={setCode}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          hint="Open your authenticator app and enter the 6-digit code for Mooric ERP."
        />
        {error ? <Alert>{error}</Alert> : null}
        <button type="submit" className={`${primaryButton} w-full`} disabled={busy}>
          {busy ? "Checking…" : "Verify code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submitCredentials} noValidate className="grid gap-5">
      <TextField
        id="signin-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        inputMode="email"
      />
      <TextField
        id="signin-password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      {error ? <Alert>{error}</Alert> : null}
      <button type="submit" className={`${primaryButton} w-full`} disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
