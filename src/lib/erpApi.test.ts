import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cfg = vi.hoisted(() => ({ url: "https://erp.test/" }));
vi.mock("../config/signup", () => ({
  get ERP_API_URL() {
    return cfg.url;
  },
}));
const tokenMock = vi.hoisted(() => ({ getIdToken: vi.fn() }));
vi.mock("./firebase", () => tokenMock);

import { ErpApiError, erpApi, pollStatus, type AccountStatus } from "./erpApi";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const fetchMock = vi.fn();

const STATUS: AccountStatus = {
  state: "paid",
  plan: "monthly",
  billing_status: "active",
  verified: false,
  suspended_reason: null,
  access_cutoff_at: null,
  loans_used: 0,
  loans_included: 25,
  erp_url: null,
  support_email: "help@example.test",
};

beforeEach(() => {
  cfg.url = "https://erp.test/";
  fetchMock.mockReset();
  tokenMock.getIdToken.mockReset().mockResolvedValue("tok-123");
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("erpApi requests", () => {
  it("bearer token attached, no cookies", async () => {
    fetchMock.mockResolvedValue(json(STATUS));
    await erpApi.status();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://erp.test/api/account/status");
    expect(init.method).toBe("GET");
    expect(init.credentials).toBe("omit");
    expect(init.headers.Authorization).toBe("Bearer tok-123");
  });

  it("checkout forces a token refresh, status does not", async () => {
    fetchMock.mockResolvedValue(json({ url: "u" }));
    await erpApi.checkout();
    expect(tokenMock.getIdToken).toHaveBeenCalledWith(true);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({});
    tokenMock.getIdToken.mockClear();
    fetchMock.mockResolvedValue(json(STATUS));
    await erpApi.status();
    expect(tokenMock.getIdToken).toHaveBeenCalledWith(false);
  });

  it("portal sends an empty JSON object", async () => {
    fetchMock.mockResolvedValue(json({ url: "u" }));
    await erpApi.portal();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({});
  });

  it("a 401 retries once with a fresh token", async () => {
    tokenMock.getIdToken.mockImplementation(async (force?: boolean) => (force ? "fresh" : "stale"));
    fetchMock
      .mockResolvedValueOnce(json({ detail: "Not authenticated" }, 401))
      .mockResolvedValueOnce(json(STATUS));
    await expect(erpApi.status()).resolves.toEqual(STATUS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer stale");
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer fresh");
  });

  it("a second 401 throws", async () => {
    fetchMock.mockImplementation(async () => json({ detail: "Not authenticated" }, 401));
    await expect(erpApi.status()).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("a 2xx non-JSON body becomes an ErpApiError", async () => {
    fetchMock.mockResolvedValue(new Response("<html>ok</html>", { status: 200 }));
    await expect(erpApi.status()).rejects.toMatchObject({ code: "invalid_response" });
  });

  it("signup posts the body as JSON", async () => {
    fetchMock.mockResolvedValue(json({ state: "started", plan: "monthly" }));
    const body = {
      first_name: "A",
      last_name: "B",
      nmls_id: "123",
      terms_version: "v1",
      turnstile_token: "t",
    };
    const res = await erpApi.signup(body);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://erp.test/api/account/signup");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual(body);
    expect(res).toEqual({ state: "started", plan: "monthly" });
  });

  it("checkout and portal return the url", async () => {
    fetchMock.mockResolvedValueOnce(json({ url: "https://stripe.test/c" }));
    fetchMock.mockResolvedValueOnce(json({ url: "https://stripe.test/p" }));
    await expect(erpApi.checkout()).resolves.toEqual({ url: "https://stripe.test/c" });
    await expect(erpApi.portal()).resolves.toEqual({ url: "https://stripe.test/p" });
    expect(fetchMock.mock.calls[0][0]).toBe("https://erp.test/api/account/checkout");
    expect(fetchMock.mock.calls[1][0]).toBe("https://erp.test/api/account/portal");
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  it("config is public: no token, no cookies", async () => {
    fetchMock.mockResolvedValue(json({ signup_available: true }));
    await erpApi.config();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://erp.test/api/account/config");
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.credentials).toBe("omit");
    expect(tokenMock.getIdToken).not.toHaveBeenCalled();
  });

  it("authenticated call without a signed-in user is a 401 error and makes no request", async () => {
    tokenMock.getIdToken.mockResolvedValue(null);
    await expect(erpApi.status()).rejects.toMatchObject({ status: 401, code: "not_signed_in" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("blank ERP_API_URL gives not_available without a network call", async () => {
    cfg.url = "";
    await expect(erpApi.config()).rejects.toMatchObject({ status: 503, code: "not_available" });
    await expect(erpApi.status()).rejects.toBeInstanceOf(ErpApiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("erpApi errors", () => {
  it.each([
    [503, { detail: { code: "not_available", message: "Signup is not available." } }, "not_available"],
    [409, { detail: { code: "account_exists", message: "exists", sign_in_url: "https://x" } }, "account_exists"],
    [409, { detail: { code: "signup_locked", message: "locked" } }, "signup_locked"],
    [409, { detail: { code: "already_paid", message: "paid", account_url: "https://x/account" } }, "already_paid"],
    [403, { detail: { code: "email_not_verified", message: "Verify" } }, "email_not_verified"],
  ])("maps %i to code %s", async (status, body, code) => {
    fetchMock.mockResolvedValue(json(body, status));
    const err = await erpApi.checkout().catch((e) => e);
    expect(err).toBeInstanceOf(ErpApiError);
    expect(err.status).toBe(status);
    expect(err.code).toBe(code);
    expect(err.details).toEqual(body.detail);
  });

  it("429 is rate_limited even with a plain-text detail", async () => {
    fetchMock.mockResolvedValue(json({ detail: "Too many requests" }, 429));
    await expect(erpApi.status()).rejects.toMatchObject({
      status: 429,
      code: "rate_limited",
      message: "Too many requests",
    });
  });

  it("validation errors (422) become validation_failed", async () => {
    fetchMock.mockResolvedValue(json({ detail: [{ loc: ["body", "nmls_id"], msg: "bad" }] }, 422));
    await expect(
      erpApi.signup({ first_name: "a", last_name: "b", nmls_id: "x", terms_version: "v", turnstile_token: "" }),
    ).rejects.toMatchObject({ status: 422, code: "validation_failed" });
  });

  it("a non-JSON error body still yields a typed error", async () => {
    fetchMock.mockResolvedValue(new Response("<html>bad gateway</html>", { status: 502 }));
    await expect(erpApi.status()).rejects.toMatchObject({ status: 502, code: "http_502" });
  });

  it("network failure becomes network_error with status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(erpApi.status()).rejects.toMatchObject({ status: 0, code: "network_error" });
  });
});

describe("pollStatus", () => {
  const flush = async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
  };

  it("polls every 5 seconds by default and stops when done", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async () => json(STATUS));
    const seen: string[] = [];
    let n = 0;
    const handle = pollStatus({
      onUpdate: (s) => seen.push(s.state),
      isDone: () => ++n >= 3,
    });
    await flush(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flush(4999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flush(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await flush(5000);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    await flush(60000);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(seen).toHaveLength(3);
    handle.stop();
  });

  it("never exceeds 30 requests a minute even if asked for faster", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async () => json(STATUS));
    const handle = pollStatus({ intervalMs: 100, onUpdate: () => {} });
    await flush(60000);
    handle.stop();
    expect(fetchMock.mock.calls.length).toBeLessThan(30);
  });

  it("backs off after errors and recovers after a success", async () => {
    vi.useFakeTimers();
    fetchMock
      .mockResolvedValueOnce(json({ detail: "slow down" }, 429))
      .mockResolvedValueOnce(json({ detail: "slow down" }, 429))
      .mockImplementation(async () => json(STATUS));
    const errors: string[] = [];
    const handle = pollStatus({
      onUpdate: () => {},
      onError: (e) => errors.push(e.code),
    });
    await flush(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flush(9999); // first retry waits 10s (double)
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flush(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await flush(19999); // then 20s
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await flush(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    await flush(5000); // success resets to 5s
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(errors).toEqual(["rate_limited", "rate_limited"]);
    handle.stop();
  });

  it("stops on a fatal error (not_available, 401, 403)", async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValue(json({ detail: { code: "forbidden", message: "no" } }, 403));
    const onError = vi.fn();
    pollStatus({ onUpdate: () => {}, onError });
    await flush(120000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("stop() halts further requests", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async () => json(STATUS));
    const handle = pollStatus({ onUpdate: () => {} });
    await flush(0);
    handle.stop();
    await flush(60000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
