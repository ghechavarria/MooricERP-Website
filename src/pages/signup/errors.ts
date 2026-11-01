import { ErpApiError } from "../../lib/erpApi";

const FIREBASE_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    'An account with this email already exists. Choose "I already have an account" to sign in.',
  "auth/weak-password": "Choose a stronger password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/wrong-password": "The email or password is incorrect.",
  "auth/user-not-found": "The email or password is incorrect.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "Could not reach the sign-in service. Check your connection and try again.",
  "auth/invalid-verification-code": "That code is not correct. Check your authenticator app and try again.",
  "auth/code-expired": "That code has expired. Enter the newest code from your authenticator app.",
  "auth/requires-recent-login": "Please sign in again.",
};

const API_MESSAGES: Record<string, string> = {
  rate_limited: "Too many attempts. Please wait a minute and try again.",
  signup_locked:
    "Checkout has already started for this account, so your email and NMLS ID can no longer be changed here. Contact support to change them.",
  nmls_in_use: "This NMLS ID can't be used for a new account. Check it, or contact support if it is yours.",
  bot_check_failed: "The bot check failed. Please try again.",
  email_not_verified: "Please confirm your email first, then try again.",
  billing_unavailable: "Billing is temporarily unavailable. Please try again shortly.",
  validation_failed: "Please check the details you entered.",
  not_signed_in: "Please sign in again.",
  no_customer: "There is no billing account to manage yet.",
};

/** A short message a person can act on. */
export const friendlyError = (error: unknown): string => {
  if (error instanceof ErpApiError) return API_MESSAGES[error.code] ?? error.message;
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === "string" && FIREBASE_MESSAGES[code]) return FIREBASE_MESSAGES[code];
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
};

export const isApiCode = (error: unknown, code: string): boolean =>
  error instanceof ErpApiError && error.code === code;
