import type { AccountStatus } from "../../lib/erpApi";
import { formatDate } from "./format";

export type ViewKind =
  | "none"
  | "started"
  | "paid"
  | "provisioning"
  | "ready"
  | "review"
  | "past_due"
  | "suspended_billing"
  | "suspended_verification"
  | "canceling"
  | "canceled"
  | "unknown";

export type AccountView = {
  kind: ViewKind;
  tone: "info" | "progress" | "ok" | "warn" | "danger";
  title: string;
  body: string;
  /** True when the person can still pay or fix billing in the Stripe portal. */
  portal: boolean;
  /** Label for the portal button. */
  portalLabel: string;
};

/** Signup states that move on by themselves, so the page keeps asking. */
const PROVISIONING_STATES = new Set(["provisioned", "claims_set", "email_sending"]);

/**
 * True while the state will change without the person doing anything. Right after
 * Stripe sends the customer back, "started" counts too: the webhook may be a few
 * seconds behind.
 */
export const isTransitional = (status: AccountStatus, awaitingPayment = false): boolean =>
  status.state === "paid" ||
  PROVISIONING_STATES.has(status.state) ||
  (awaitingPayment && (status.state === "started" || status.state === "none"));

const view = (
  kind: ViewKind,
  tone: AccountView["tone"],
  title: string,
  body: string,
  portal = false,
  portalLabel = "Manage billing",
): AccountView => ({ kind, tone, title, body, portal, portalLabel });

/**
 * Turns the server's status into what to tell the person. Suspension and billing
 * flags win over the signup state because an organization can be suspended while
 * its signup state is still "ready". Suspended people keep the billing portal.
 */
export const describeAccount = (status: AccountStatus): AccountView => {
  const reason = status.suspended_reason;
  const cutoff = formatDate(status.access_cutoff_at, status.timezone);

  if (status.state === "none") {
    return view("none", "info", "No subscription yet", "You have not signed up yet. Create your account to get started.");
  }
  if (reason === "verification") {
    return view(
      "suspended_verification",
      "danger",
      "Your account is suspended",
      "We could not verify your business details. Contact support to resolve this; your data is kept.",
      true,
    );
  }
  if (reason === "canceled" || status.billing_status === "canceled") {
    return view(
      "canceled",
      "danger",
      "Your subscription has been canceled",
      "Your data is kept. Contact support if you would like to start a new subscription.",
      true,
    );
  }
  // An old suspension can have no reason recorded; the organization status still counts.
  if (reason || status.org_status === "suspended") {
    return view(
      "suspended_billing",
      "danger",
      "Your account is suspended because of a payment problem",
      "Update your payment method and pay the outstanding invoice to restore access. Your data is kept.",
      true,
      "Update payment method",
    );
  }
  if (status.billing_status === "past_due") {
    return view(
      "past_due",
      "warn",
      "Your last payment failed",
      cutoff
        ? `Update your payment method by ${cutoff} to keep your account active. After that date the account is suspended; your data is kept.`
        : "Update your payment method soon to keep your account active.",
      true,
      "Update payment method",
    );
  }
  if (status.billing_status === "canceling") {
    const ends = formatDate(status.ends_at, status.timezone);
    return view(
      "canceling",
      "warn",
      "You've canceled your subscription",
      `${
        ends ? `You keep full access until ${ends}` : "You keep full access until the end of the current billing period"
      }, and you won't be charged again. Changed your mind? Renew it from Manage billing.`,
      true,
    );
  }
  if (status.state === "started") {
    return view(
      "started",
      "info",
      "Payment hasn't been completed",
      "Your details are saved. Continue to payment to finish signing up.",
    );
  }
  if (status.state === "paid") {
    return view("paid", "progress", "Payment received", "We are creating your account now. This page updates on its own.", true);
  }
  if (PROVISIONING_STATES.has(status.state)) {
    return view(
      "provisioning",
      "progress",
      "Setting up your account",
      "Almost done. This page updates on its own; there is nothing you need to do.",
      true,
    );
  }
  if (status.state === "review") {
    return view(
      "review",
      "info",
      "Payment received, account under review",
      "Your payment went through. We need to check a few details before your account is opened, and we will be in touch.",
      true,
    );
  }
  if (status.state === "ready") {
    return view(
      "ready",
      "ok",
      "Your account is ready",
      status.erp_url
        ? "Sign in to Mooric ERP to get started."
        : "Your sign-in link will appear here as soon as it is available.",
      true,
    );
  }
  return view("unknown", "info", "Checking your account", "We could not work out the state of your account yet.", false);
};
