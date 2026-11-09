import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const api = vi.hoisted(() => ({ portal: vi.fn(), pollStatus: vi.fn(), config: vi.fn() }));
const fb = vi.hoisted(() => ({
  firebaseAvailable: vi.fn(() => true),
  currentSession: vi.fn(),
  signIn: vi.fn(),
  completeTotp: vi.fn(),
  signOut: vi.fn(),
}));
const nav = vi.hoisted(() => ({ redirectTo: vi.fn(), reloadAt: vi.fn() }));

vi.mock("../lib/erpApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/erpApi")>()),
  erpApi: { portal: api.portal, config: api.config },
  pollStatus: api.pollStatus,
}));
vi.mock("../lib/firebase", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/firebase")>()),
  ...fb,
}));
vi.mock("./signup/redirect", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./signup/redirect")>()),
  ...nav,
}));

import { ErpApiError, type AccountStatus, type PollOptions } from "../lib/erpApi";
import AccountPage from "./AccountPage";

const status = (over: Partial<AccountStatus> = {}): AccountStatus => ({
  state: "ready",
  plan: "monthly",
  billing_status: "active",
  verified: true,
  suspended_reason: null,
  access_cutoff_at: null,
  loans_used: 3,
  loans_included: 10,
  erp_url: "https://erp.example.test",
  support_email: "support@example.test",
  ...over,
});

let lastOptions: PollOptions | undefined;
const stop = vi.fn();

/** Every poll delivers these statuses, in order. */
const serve = (...statuses: AccountStatus[]) => {
  api.pollStatus.mockImplementation((options: PollOptions) => {
    lastOptions = options;
    for (const s of statuses) {
      options.onUpdate(s);
      if (options.isDone?.(s)) break;
    }
    return { stop };
  });
};

const renderPage = (path = "/account") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AccountPage />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  lastOptions = undefined;
  fb.firebaseAvailable.mockReturnValue(true);
  api.config.mockResolvedValue({ plan: { overage_cents: 1500 } });
  fb.currentSession.mockResolvedValue({ email: "ada@example.test", emailVerified: true });
  api.portal.mockResolvedValue({ url: "https://billing.example.test/p/1" });
});

describe("account states", () => {
  const cases: [string, Partial<AccountStatus>, RegExp][] = [
    ["started", { state: "started", billing_status: null, loans_included: null, erp_url: null }, /payment (has not|hasn't) been completed/i],
    ["paid", { state: "paid", billing_status: null, erp_url: null }, /payment received/i],
    ["provisioned", { state: "provisioned", billing_status: null, erp_url: null }, /setting up your account/i],
    ["ready", {}, /your account is ready/i],
    ["review", { state: "review", billing_status: null, erp_url: null }, /under review/i],
    [
      "past_due",
      { billing_status: "past_due", access_cutoff_at: "2026-12-05T12:00:00+00:00" },
      /payment (problem|failed)/i,
    ],
    [
      "suspended for billing",
      { suspended_reason: "billing", billing_status: "past_due", erp_url: null },
      /suspended because of a payment problem/i,
    ],
    [
      "suspended for verification",
      { suspended_reason: "verification", erp_url: null },
      /could not verify/i,
    ],
    [
      "suspended with no reason recorded",
      { org_status: "suspended", suspended_reason: null, erp_url: null },
      /suspended because of a payment problem/i,
    ],
    ["canceling", { billing_status: "canceling" }, /you've canceled your subscription/i],
    ["canceled", { suspended_reason: "canceled", billing_status: "canceled", erp_url: null }, /subscription (has been )?canceled/i],
  ];

  it.each(cases)("account shows every status including rejected and suspended: %s", async (_name, over, text) => {
    serve(status(over));
    renderPage();
    expect(await screen.findByText(text)).toBeTruthy();
  });

  it("a scheduled cancel shows when access ends, in the message and the Billing tile", async () => {
    serve(status({ billing_status: "canceling", ends_at: "2026-12-09T00:00:00+00:00" }));
    renderPage();
    expect(await screen.findByText(/keep full access until December 9, 2026/)).toBeTruthy();
    expect(screen.getByText("Ends Dec 9, 2026")).toBeTruthy();
    expect(screen.getByText(/won't be charged again/)).toBeTruthy();
  });

  it("shows the cutoff date for a payment problem", async () => {
    serve(status({ billing_status: "past_due", access_cutoff_at: "2026-12-05T12:00:00+00:00" }));
    renderPage();
    expect(await screen.findByText(/December 5, 2026/)).toBeTruthy();
  });

  it("suspended-for-verification points to support", async () => {
    serve(status({ suspended_reason: "verification", erp_url: null, support_email: "help@example.test" }));
    renderPage();
    const link = await screen.findByRole("link", { name: "help@example.test" });
    expect(link.getAttribute("href")).toBe("mailto:help@example.test");
  });

  it("shows loans used against the included amount", async () => {
    serve(status({ loans_used: 12, loans_included: 10 }));
    renderPage();
    expect(await screen.findByText(/12 of 10 loans/i)).toBeTruthy();
  });
});

describe("account links", () => {
  it("suspended user sees portal link and it opens the portal", async () => {
    serve(status({ suspended_reason: "billing", billing_status: "past_due", erp_url: null }));
    renderPage();
    const button = await screen.findByRole("button", { name: /manage billing|update payment/i });
    fireEvent.click(button);
    await waitFor(() => expect(nav.redirectTo).toHaveBeenCalledWith("https://billing.example.test/p/1"));
  });

  it("suspended for verification still sees the portal button", async () => {
    serve(status({ suspended_reason: "verification", erp_url: null }));
    renderPage();
    expect(await screen.findByRole("button", { name: /manage billing|update payment/i })).toBeTruthy();
  });

  it("ERP sign-in link comes only from the status erp_url", async () => {
    serve(status({ erp_url: "https://app.example.test" }));
    const { unmount } = renderPage();
    const link = await screen.findByRole("link", { name: /sign in to mooric erp/i });
    expect(link.getAttribute("href")).toBe("https://app.example.test");
    unmount();

    serve(status({ erp_url: null }));
    renderPage();
    await screen.findByText(/your account is ready/i);
    expect(screen.queryByRole("link", { name: /sign in to mooric erp/i })).toBeNull();
  });

  it("shows a portal error without losing the page", async () => {
    api.portal.mockRejectedValue(new ErpApiError(502, "billing_unavailable", "Try again shortly."));
    serve(status());
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /manage billing/i }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/try again/i);
    expect(screen.getByText(/your account is ready/i)).toBeTruthy();
  });

  it("no portal before any payment", async () => {
    serve(status({ state: "started", billing_status: null, erp_url: null }));
    renderPage();
    await screen.findByText(/payment (has not|hasn't) been completed/i);
    expect(screen.queryByRole("button", { name: /manage billing/i })).toBeNull();
  });
});

describe("erp link safety", () => {
  it("ignores an erp_url that is not https", async () => {
    serve(status({ erp_url: "http://evil.example.test" }));
    renderPage();
    await screen.findByText(/your account is ready/i);
    expect(screen.queryByRole("link", { name: /sign in to mooric erp/i })).toBeNull();
  });

  it("ignores a javascript: erp_url", async () => {
    serve(status({ erp_url: "javascript:alert(1)" }));
    renderPage();
    await screen.findByText(/your account is ready/i);
    expect(screen.queryByRole("link", { name: /sign in to mooric erp/i })).toBeNull();
  });
});

describe("polling", () => {
  it("polls only while the state is transitional", async () => {
    serve(status({ state: "paid" }));
    renderPage();
    await screen.findByText(/payment received/i);
    const done = lastOptions!.isDone!;
    for (const s of ["paid", "provisioned", "claims_set", "email_sending"]) {
      expect(done(status({ state: s })), s).toBe(false);
    }
    for (const s of ["ready", "review", "none", "started"]) {
      expect(done(status({ state: s })), s).toBe(true);
    }
  });

  it("stops polling when the page closes", async () => {
    serve(status({ state: "paid" }));
    const { unmount } = renderPage();
    await screen.findByText(/payment received/i);
    unmount();
    expect(stop).toHaveBeenCalled();
  });
});

describe("account sign-in", () => {
  it("shows the sign-in form when nobody is signed in and loads status after sign-in", async () => {
    fb.currentSession.mockResolvedValueOnce(null).mockResolvedValue({ email: "a@b.co", emailVerified: true });
    fb.signIn.mockResolvedValue({ status: "signed_in", user: {} });
    serve(status());
    renderPage();
    fireEvent.change(await screen.findByLabelText(/^email/i), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "pw-pw-pw-pw" } });
    expect(api.pollStatus).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    expect(await screen.findByText(/your account is ready/i)).toBeTruthy();
  });

  it("asks for the authenticator code when the account has a second factor", async () => {
    fb.currentSession.mockResolvedValueOnce(null).mockResolvedValue({ email: "a@b.co", emailVerified: true });
    fb.signIn.mockResolvedValue({ status: "mfa_required", resolver: { r: 1 } });
    fb.completeTotp.mockResolvedValue({ status: "signed_in", user: {} });
    serve(status());
    renderPage();
    fireEvent.change(await screen.findByLabelText(/^email/i), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "pw-pw-pw-pw" } });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    fireEvent.change(await screen.findByLabelText(/authenticator code/i), { target: { value: "654321" } });
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    expect(await screen.findByText(/your account is ready/i)).toBeTruthy();
    expect(fb.completeTotp).toHaveBeenCalledWith({ r: 1 }, "654321");
  });

  it("shows a friendly message for a wrong password", async () => {
    fb.currentSession.mockResolvedValue(null);
    fb.signIn.mockRejectedValue({ code: "auth/invalid-credential" });
    renderPage();
    fireEvent.change(await screen.findByLabelText(/^email/i), { target: { value: "a@b.co" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "x" } });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/incorrect/i);
  });

  it("not available without Firebase", async () => {
    fb.firebaseAvailable.mockReturnValue(false);
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
  });

  it("not available when the API says so", async () => {
    api.pollStatus.mockImplementation((o: PollOptions) => {
      o.onError?.(new ErpApiError(503, "not_available", "no"));
      return { stop };
    });
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
  });

  it("signing out ends the Firebase session and reloads the account page fresh", async () => {
    serve(status());
    fb.signOut.mockResolvedValue(undefined);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /sign out/i }));
    await waitFor(() => expect(nav.reloadAt).toHaveBeenCalledWith("/account?signed_out=1"));
    expect(fb.signOut).toHaveBeenCalledTimes(1);
  });

  it("a failed sign-out says so and does not reload", async () => {
    serve(status());
    fb.signOut.mockRejectedValue(new Error("offline"));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /sign out/i }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/couldn't sign you out/i);
    expect(nav.reloadAt).not.toHaveBeenCalled();
  });

  it("shows who is signed in, billing and verification labels, and loan usage", async () => {
    serve(status({ loans_used: 12, loans_included: 10, verified: false }));
    renderPage();
    expect(await screen.findByText("ada@example.test")).toBeTruthy();
    expect(screen.getByText("12 of 10 loans used")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
    expect(screen.getByText("Pending check")).toBeTruthy();
    const bar = screen.getByRole("progressbar", { name: /included loans used/i });
    expect(bar.getAttribute("aria-valuenow")).toBe("10");
    expect(screen.getByText("2 extra loans")).toBeTruthy();
    expect(await screen.findByText("$15 each, $30 so far this period")).toBeTruthy();
  });

  it("extra loans show none yet, and still read sensibly without the price", async () => {
    api.config.mockRejectedValue(new Error("offline"));
    serve(status({ loans_used: 3, loans_included: 10 }));
    renderPage();
    expect(await screen.findByText("0 extra loans")).toBeTruthy();
    expect(screen.getByText("Billed per loan after the first 10")).toBeTruthy();
  });

  it("after signing out the page confirms it above the sign-in form", async () => {
    fb.currentSession.mockResolvedValue(null);
    renderPage("/account?signed_out=1");
    expect(await screen.findByText(/you're signed out/i)).toBeTruthy();
    expect(screen.getByLabelText(/^email/i)).toBeTruthy();
  });
});
