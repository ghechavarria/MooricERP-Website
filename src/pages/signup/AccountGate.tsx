import type { AccountPhase } from "./useAccountStatus";
import { Card, NotAvailable, Notice } from "./Layout";
import { SignInForm } from "./SignInForm";

/**
 * What the account pages show before there is a status to show: checking the
 * session, "not available", or the sign-in form. Renders nothing once signed in.
 */
export function AccountGate({
  phase,
  onSignedIn,
  signInHeading,
}: {
  phase: AccountPhase;
  onSignedIn: () => void;
  signInHeading: string;
}) {
  if (phase.kind === "checking") return <Notice>Loading…</Notice>;
  if (phase.kind === "unavailable") return <NotAvailable />;
  if (phase.kind === "signin") {
    return (
      <Card className="max-w-[28rem]">
        <h2 tabIndex={-1} className="outline-none m-0 mb-5 text-xl font-bold text-[#0a0e14]">{signInHeading}</h2>
        <SignInForm onSignedIn={onSignedIn} />
      </Card>
    );
  }
  return null;
}
