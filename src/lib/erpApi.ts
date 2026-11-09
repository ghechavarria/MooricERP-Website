/**
 * Typed client for the ERP account API (/api/account/*). Sends the Firebase ID
 * token as a Bearer header and never cookies. Types mirror backend/routes_billing.py.
 * Import only from the signup pages.
 */
import { ERP_API_URL } from "../config/signup";
import { getIdToken } from "./firebase";

export type SignupRequest = {
  first_name: string;
  last_name: string;
  nmls_id: string;
  terms_version: string;
  turnstile_token: string;
};

export type SignupResponse = { state: string; plan: string };

export type UrlResponse = { url: string };

export type AccountConfig = {
  signup_available: boolean;
  plan: {
    code: string;
    name: string;
    price_cents: number;
    included_loans: number;
    overage_cents: number;
    /** Free trial length in days; 0 or missing means no free month. */
    trial_days?: number;
  };
  terms_url: string;
  privacy_url: string;
  /** Current Terms version; sent back when signing up. Blank when the ERP has none set. */
  terms_version: string;
};

/** GET /status. "none" means no signup or ERP user yet. */
export type AccountStatus = {
  state: string;
  plan: string | null;
  billing_status: string | null;
  org_status?: string | null;
  verified: boolean;
  suspended_reason: string | null;
  access_cutoff_at: string | null;
  /** When a scheduled cancel takes effect (end of the current period); null otherwise. */
  ends_at?: string | null;
  loans_used: number;
  loans_included: number | null;
  erp_url: string | null;
  support_email: string;
  /** The Stripe account's time zone (IANA name), for showing dates. Missing from older ERPs. */
  timezone?: string;
};

export class ErpApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ErpApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const NOT_AVAILABLE_MESSAGE = "Signup is not available.";

const notAvailable = () => new ErpApiError(503, "not_available", NOT_AVAILABLE_MESSAGE);

const errorFrom = async (res: Response): Promise<ErpApiError> => {
  let detail: unknown;
  try {
    detail = ((await res.json()) as { detail?: unknown }).detail;
  } catch {
    detail = undefined;
  }
  const obj = detail && typeof detail === "object" && !Array.isArray(detail)
    ? (detail as { code?: unknown; message?: unknown })
    : null;
  const apiCode = typeof obj?.code === "string" ? obj.code : "";
  let code = apiCode;
  if (!code) {
    if (res.status === 429) code = "rate_limited";
    else if (res.status === 422) code = "validation_failed";
    else code = `http_${res.status}`;
  }
  let message = "Something went wrong. Please try again.";
  if (typeof obj?.message === "string") message = obj.message;
  else if (typeof detail === "string") message = detail;
  return new ErpApiError(res.status, code, message, detail);
};

const request = async <T>(
  method: "GET" | "POST",
  path: string,
  options: { auth: boolean; body?: unknown; forceRefresh?: boolean },
): Promise<T> => {
  const base = ERP_API_URL.trim().replace(/\/+$/, "");
  if (!base) throw notAvailable();
  const send = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options.body !== undefined) headers["Content-Type"] = "application/json";
    try {
      return await fetch(`${base}/api/account${path}`, {
        method,
        headers,
        credentials: "omit",
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      });
    } catch {
      throw new ErpApiError(0, "network_error", "Could not reach the server. Check your connection.");
    }
  };
  let res: Response;
  if (options.auth) {
    const token = await getIdToken(options.forceRefresh === true);
    if (!token) throw new ErpApiError(401, "not_signed_in", "Please sign in first.");
    res = await send(token);
    if (res.status === 401) {
      // the cached token may have expired or be stale: refresh once and retry
      const fresh = await getIdToken(true);
      if (!fresh) throw new ErpApiError(401, "not_signed_in", "Please sign in first.");
      res = await send(fresh);
    }
  } else {
    res = await send(null);
  }
  if (!res.ok) throw await errorFrom(res);
  try {
    return (await res.json()) as T;
  } catch {
    throw new ErpApiError(res.status, "invalid_response", "The server sent an unexpected response.");
  }
};

export const erpApi = {
  config: () => request<AccountConfig>("GET", "/config", { auth: false }),
  signup: (body: SignupRequest) =>
    request<SignupResponse>("POST", "/signup", { auth: true, body }),
  checkout: () => request<UrlResponse>("POST", "/checkout", { auth: true, body: {}, forceRefresh: true }),
  status: () => request<AccountStatus>("GET", "/status", { auth: true }),
  portal: () => request<UrlResponse>("POST", "/portal", { auth: true, body: {} }),
};

// ---------------------------------------------------------------------------
// status polling
// ---------------------------------------------------------------------------
export const DEFAULT_POLL_MS = 5000;
// The server allows 30 requests a minute per client; 2.5s is 24 a minute at best.
export const MIN_POLL_MS = 2500;
export const MAX_BACKOFF_MS = 60000;
const FATAL_CODES = new Set(["not_available", "not_signed_in"]);

export type PollOptions = {
  onUpdate: (status: AccountStatus) => void;
  onError?: (error: ErpApiError) => void;
  /** Return true to stop polling after this update. */
  isDone?: (status: AccountStatus) => boolean;
  intervalMs?: number;
};

const isFatal = (error: ErpApiError) =>
  FATAL_CODES.has(error.code) || error.status === 401 || error.status === 403;

/**
 * Polls /status. Waits intervalMs (default 5s, never below 2.5s) between requests,
 * doubles the wait after each failure up to 60s, and returns to the base interval
 * after a success. Stops on done, stop(), or an error that retrying cannot fix.
 */
export const pollStatus = (options: PollOptions): { stop: () => void } => {
  const base = Math.max(options.intervalMs ?? DEFAULT_POLL_MS, MIN_POLL_MS);
  let delay = base;
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const schedule = () => {
    if (!stopped) timer = setTimeout(tick, delay);
  };

  const tick = async () => {
    try {
      const status = await erpApi.status();
      if (stopped) return;
      delay = base;
      options.onUpdate(status);
      if (options.isDone?.(status)) stopped = true;
    } catch (error) {
      if (stopped) return;
      const apiError =
        error instanceof ErpApiError
          ? error
          : new ErpApiError(0, "network_error", "Could not reach the server.");
      options.onError?.(apiError);
      if (isFatal(apiError)) stopped = true;
      else delay = Math.min(delay * 2, MAX_BACKOFF_MS);
    }
    schedule();
  };

  void tick();
  return {
    stop: () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    },
  };
};
