import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const api = vi.hoisted(() => ({ config: vi.fn(), signup: vi.fn(), checkout: vi.fn(), status: vi.fn() }));
const fb = vi.hoisted(() => ({
  firebaseAvailable: vi.fn(() => true),
  currentSession: vi.fn(),
  registerUser: vi.fn(),
  signIn: vi.fn(),
  completeTotp: vi.fn(),
  sendVerification: vi.fn(),
  refreshVerification: vi.fn(),
  signOut: vi.fn(),
}));
const nav = vi.hoisted(() => ({ redirectTo: vi.fn(), reloadAt: vi.fn() }));

vi.mock("../lib/erpApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/erpApi")>()),
  erpApi: api,
}));
vi.mock("../lib/firebase", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/firebase")>()),
  ...fb,
}));
vi.mock("./signup/redirect", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./signup/redirect")>()),
  ...nav,
}));
vi.mock("../config/signup", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../config/signup")>()),
  ERP_URL: "https://erp.example.test",
}));

import { ErpApiError } from "../lib/erpApi";
import RegisterPage from "./RegisterPage";

const config = {
  signup_available: true,
  plan: { code: "monthly", name: "Monthly", price_cents: 5000, included_loans: 10, overage_cents: 1500 },
  terms_url: "https://t.example.test",
  privacy_url: "https://p.example.test",
  terms_version: "2026-11",
};

const renderPage = (path = "/register") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <RegisterPage />
    </MemoryRouter>,
  );

const type = (label: RegExp | string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const PASSWORD = "Correct-Horse-12";

/** The page opens on sign-in; this switches to the create-account form. */
const openCreate = async () => {
  fireEvent.click(await screen.findByRole("button", { name: /create an account/i }));
  await screen.findByLabelText(/^first name/i);
};

const fillForm = async (over: { nmls?: string; terms?: boolean; password?: string } = {}) => {
  await openCreate();
  type(/^first name/i, "Ada");
  type(/^last name/i, "Lovelace");
  type(/^email/i, "ada@example.test");
  type(/^password/i, over.password ?? PASSWORD);
  type(/nmls id/i, over.nmls ?? "123456");
  if (over.terms !== false) fireEvent.click(screen.getByLabelText(/i agree/i));
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: /create account/i }));

beforeEach(() => {
  vi.clearAllMocks();
  fb.firebaseAvailable.mockReturnValue(true);
  fb.currentSession.mockResolvedValue(null);
  fb.registerUser.mockResolvedValue({});
  fb.sendVerification.mockResolvedValue(undefined);
  api.config.mockResolvedValue(config);
  api.signup.mockResolvedValue({ state: "started", plan: "monthly" });
  api.checkout.mockResolvedValue({ url: "https://checkout.example.test/s/1" });
  api.status.mockResolvedValue({ state: "none" });
});

afterEach(() => vi.unstubAllEnvs());

describe("register form", () => {
  it("register requires NMLS digits and terms", async () => {
    renderPage();
    await fillForm({ nmls: "12ab", terms: false });
    submit();
    expect(await screen.findByText(/nmls id must be 1 to 12 digits/i)).toBeTruthy();
    expect(screen.getByText(/agree to the terms/i)).toBeTruthy();
    expect(fb.registerUser).not.toHaveBeenCalled();
    expect(api.signup).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/nmls id/i).getAttribute("aria-invalid")).toBe("true");
  });

  it("rejects an NMLS ID longer than 12 digits and accepts 12", async () => {
    renderPage();
    await fillForm({ nmls: "1234567890123" });
    submit();
    expect(await screen.findByText(/nmls id must be 1 to 12 digits/i)).toBeTruthy();
    type(/nmls id/i, "123456789012");
    submit();
    await waitFor(() => expect(api.signup).toHaveBeenCalled());
  });

  it("links Terms and Privacy from the plan config", async () => {
    renderPage();
    await openCreate();
    expect(screen.getByRole("link", { name: /terms of service/i }).getAttribute("href")).toBe("https://t.example.test");
    expect(screen.getByRole("link", { name: /privacy policy/i }).getAttribute("href")).toBe("https://p.example.test");
  });

  it("creates the account, saves signup with the config terms version, and sends verification", async () => {
    renderPage();
    await fillForm();
    submit();
    expect(await screen.findByRole("heading", { name: /check your email/i })).toBeTruthy();
    expect(fb.registerUser).toHaveBeenCalledWith("ada@example.test", PASSWORD);
    expect(api.signup).toHaveBeenCalledWith({
      first_name: "Ada",
      last_name: "Lovelace",
      nmls_id: "123456",
      terms_version: "2026-11",
      turnstile_token: "",
    });
    expect(fb.sendVerification).toHaveBeenCalledTimes(1);
  });

  it("register blocks checkout until email verified", async () => {
    fb.refreshVerification.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    renderPage();
    await fillForm();
    submit();
    await screen.findByRole("heading", { name: /check your email/i });
    expect(api.checkout).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /verified/i }));
    expect(await screen.findByText(/not verified yet/i)).toBeTruthy();
    expect(api.checkout).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /verified/i }));
    await waitFor(() => expect(nav.redirectTo).toHaveBeenCalledWith("https://checkout.example.test/s/1"));
    expect(api.checkout).toHaveBeenCalledTimes(1);
  });

  it("resends the verification email", async () => {
    renderPage();
    await fillForm();
    submit();
    await screen.findByRole("heading", { name: /check your email/i });
    fireEvent.click(screen.getByRole("button", { name: /resend/i }));
    await waitFor(() => expect(fb.sendVerification).toHaveBeenCalledTimes(2));
  });

  it("sends people with an ERP account to ERP sign-in", async () => {
    api.signup.mockRejectedValue(new ErpApiError(409, "account_exists", "exists"));
    renderPage();
    await fillForm();
    submit();
    const link = await screen.findByRole("link", { name: /sign in to mooric erp/i });
    expect(link.getAttribute("href")).toBe("https://erp.example.test");
    expect(api.checkout).not.toHaveBeenCalled();
  });

  it("production build with no Turnstile key shows not available", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
    expect(screen.queryByLabelText(/^first name/i)).toBeNull();
    expect(api.config).not.toHaveBeenCalled();
  });

  it("production build with a Turnstile key shows the form", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "site-key");
    renderPage();
    await openCreate();
    expect(screen.getByLabelText(/^first name/i)).toBeTruthy();
    document.getElementById("cf-turnstile-script")?.remove();
  });

  it("dev build with no Turnstile key still shows the form", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    renderPage();
    await openCreate();
    expect(screen.getByLabelText(/^first name/i)).toBeTruthy();
  });

  it("explains an NMLS ID already in use without naming anyone", async () => {
    fb.currentSession.mockResolvedValue({ email: "ada@example.test", emailVerified: true });
    api.checkout.mockRejectedValue(new ErpApiError(409, "nmls_in_use", "server text"));
    renderPage();
    await screen.findByLabelText(/^first name/i);
    type(/^first name/i, "Ada");
    type(/^last name/i, "Lovelace");
    type(/nmls id/i, "123456");
    fireEvent.click(screen.getByLabelText(/i agree/i));
    fireEvent.click(screen.getByRole("button", { name: /save and continue/i }));
    const alert = (await screen.findByRole("alert")).textContent ?? "";
    expect(alert).toMatch(/NMLS ID can't be used/i);
    expect(alert).toMatch(/contact support/i);
    expect(alert).not.toContain("server text");
  });

  it("explains a locked signup", async () => {
    api.signup.mockRejectedValue(new ErpApiError(409, "signup_locked", "locked"));
    renderPage();
    await fillForm();
    submit();
    expect((await screen.findByRole("alert")).textContent).toMatch(/can no longer be changed|contact support/i);
  });

  it("shows friendly copy when rate limited", async () => {
    api.signup.mockRejectedValue(new ErpApiError(429, "rate_limited", "Too many requests"));
    renderPage();
    await fillForm();
    submit();
    expect((await screen.findByRole("alert")).textContent).toMatch(/too many attempts/i);
  });

  it("maps an existing Firebase email to a sign-in prompt", async () => {
    fb.registerUser.mockRejectedValue({ code: "auth/email-already-in-use" });
    renderPage();
    await fillForm();
    submit();
    expect((await screen.findByRole("alert")).textContent).toMatch(/already exists/i);
    expect(api.signup).not.toHaveBeenCalled();
  });

  it("a returning user can sign in, pass the authenticator check, and continue", async () => {
    fb.signIn.mockResolvedValue({ status: "mfa_required", resolver: {} });
    fb.completeTotp.mockResolvedValue({ status: "signed_in", user: {} });
    fb.currentSession
      .mockResolvedValueOnce(null)
      .mockResolvedValue({ email: "ada@example.test", emailVerified: true });
    renderPage();
    // the page opens on sign-in
    await screen.findByRole("heading", { name: /^sign in$/i });
    type(/^email/i, "ada@example.test");
    type(/^password/i, "pw-pw-pw-pw");
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    fireEvent.change(await screen.findByLabelText(/authenticator code/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    // signed in with no signup yet: the details form without email and password
    expect(await screen.findByLabelText(/nmls id/i)).toBeTruthy();
    expect(screen.queryByLabelText(/^password/i)).toBeNull();
    expect(fb.completeTotp).toHaveBeenCalledWith({}, "123456");
  });

  it("a verified signed-in user with saved details can resume checkout after cancelling", async () => {
    fb.currentSession.mockResolvedValue({ email: "ada@example.test", emailVerified: true });
    api.status.mockResolvedValue({ state: "started" });
    renderPage("/register?checkout=cancelled");
    expect(await screen.findByText(/checkout was cancelled/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /continue to payment/i }));
    await waitFor(() => expect(nav.redirectTo).toHaveBeenCalledWith("https://checkout.example.test/s/1"));
  });

  it("someone who already paid goes straight to their account", async () => {
    fb.currentSession.mockResolvedValue({ email: "ada@example.test", emailVerified: true });
    api.status.mockResolvedValue({ state: "ready" });
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<p>Account page</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Account page")).toBeTruthy();
  });

  it("stays on the verify step when checkout says the email is not verified", async () => {
    fb.refreshVerification.mockResolvedValue(true);
    api.checkout.mockRejectedValue(new ErpApiError(403, "email_not_verified", "Verify"));
    renderPage();
    await fillForm();
    submit();
    await screen.findByRole("heading", { name: /check your email/i });
    fireEvent.click(screen.getByRole("button", { name: /verified/i }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/confirm your email/i);
    expect(nav.redirectTo).not.toHaveBeenCalled();
  });
});

describe("sign in first", () => {
  it("opens on sign-in, switches to create an account and back", async () => {
    renderPage();
    expect(await screen.findByRole("heading", { level: 1, name: /sign in to get started/i })).toBeTruthy();
    expect(screen.queryByLabelText(/^first name/i)).toBeNull();
    await openCreate();
    expect(screen.getByRole("heading", { level: 1, name: /create your account/i })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
    expect(await screen.findByRole("heading", { name: /^sign in$/i })).toBeTruthy();
  });

  it("a cancelled checkout while signed out still opens on sign-in, with the notice", async () => {
    renderPage("/register?checkout=cancelled");
    expect(await screen.findByText(/checkout was cancelled/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /^sign in$/i })).toBeTruthy();
  });

  it("a signed-in person can sign out, which reloads /register fresh", async () => {
    fb.currentSession.mockResolvedValue({ email: "ada@example.test", emailVerified: false });
    fb.signOut.mockResolvedValue(undefined);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /^sign out$/i }));
    await waitFor(() => expect(nav.reloadAt).toHaveBeenCalledWith("/register"));
    expect(fb.signOut).toHaveBeenCalledTimes(1);
  });
});

describe("subscription card", () => {
  it("shows the plan as a card above the name fields", async () => {
    renderPage();
    await openCreate();
    const card = screen.getByRole("region", { name: /your subscription/i });
    expect(card.textContent).toMatch(/Monthly plan/);
    expect(card.textContent).toMatch(/\$50/);
    expect(card.textContent).toMatch(/\+ applicable tax/);
    expect(card.textContent).toMatch(/10 loans included each month/);
    expect(card.textContent).toMatch(/\$15 per additional loan/);
    const first = screen.getByLabelText(/^first name/i);
    expect(card.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("password rules", () => {
  it.each([
    ["short", "Ab1!short", /at least 12 characters/i],
    ["no upper case", "correct-horse-12", /upper-case/i],
    ["no lower case", "CORRECT-HORSE-12", /lower-case/i],
    ["no number", "Correct-Horse-xx", /a number/i],
    ["no symbol", "CorrectHorse123", /a symbol/i],
    ["contains the email name", "Ada-Lovelace-12", /email name/i],
  ])("refuses a password with %s", async (_why, password, message) => {
    renderPage();
    await fillForm({ password });
    submit();
    expect((await screen.findByText(message, { selector: "#reg-password-error" })).textContent).toBeTruthy();
    expect(fb.registerUser).not.toHaveBeenCalled();
  });

  it("ticks each rule as it is met and can show the password", async () => {
    renderPage();
    await openCreate();
    type(/^password/i, "Correct-Horse-12");
    const rules = screen.getByRole("list", { name: /rules for your password/i });
    expect(rules.textContent).not.toMatch(/not yet/);
    const input = screen.getByLabelText(/^password/i);
    expect(input.getAttribute("type")).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: /^show$/i }));
    expect(input.getAttribute("type")).toBe("text");
  });

  it("explains Firebase's own password policy error", async () => {
    fb.registerUser.mockRejectedValue({ code: "auth/password-does-not-meet-requirements" });
    renderPage();
    await fillForm();
    submit();
    expect((await screen.findByRole("alert")).textContent).toMatch(/stronger password/i);
  });
});

describe("register robustness", () => {
  it("goes to the verify card with Resend when the first verification email fails", async () => {
    fb.sendVerification.mockRejectedValueOnce(new Error("boom"));
    renderPage();
    await fillForm();
    submit();
    expect(await screen.findByRole("heading", { name: /check your email/i })).toBeTruthy();
    expect((await screen.findByRole("alert")).textContent).toMatch(/could not send/i);
    expect(screen.getByRole("button", { name: /resend/i })).toBeTruthy();
    expect(api.signup).toHaveBeenCalledTimes(1);
  });

  it("moves focus to the new card heading", async () => {
    renderPage();
    await fillForm();
    submit();
    const heading = await screen.findByRole("heading", { name: /check your email/i });
    await waitFor(() => expect(document.activeElement).toBe(heading));
  });
});

describe("register availability", () => {
  it("not available when Firebase is not configured", async () => {
    fb.firebaseAvailable.mockReturnValue(false);
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
    expect(screen.queryByLabelText(/nmls id/i)).toBeNull();
  });

  it("not available when the API says not_available", async () => {
    api.config.mockRejectedValue(new ErpApiError(503, "not_available", "no"));
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
  });

  it("not available when the Terms or Privacy link is blank", async () => {
    api.config.mockResolvedValue({ ...config, terms_url: "" });
    const { unmount } = renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
    unmount();
    api.config.mockResolvedValue({ ...config, privacy_url: "" });
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
  });

  it("not available when the plan data has no terms version", async () => {
    api.config.mockResolvedValue({ ...config, terms_version: "" });
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
  });
});

describe("bot protection", () => {
  type TurnstileStub = { render: ReturnType<typeof vi.fn>; reset: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
  const w = window as unknown as { turnstile?: TurnstileStub };
  const scripts = () => document.head.querySelectorAll('script[src*="challenges.cloudflare.com/turnstile"]');
  afterEach(() => {
    scripts().forEach((s) => s.remove());
    delete w.turnstile;
  });

  it("blank site key skips the widget and sends an empty token", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    renderPage();
    await fillForm();
    expect(scripts()).toHaveLength(0);
    submit();
    await waitFor(() => expect(api.signup).toHaveBeenCalled());
  });

  it("adds the Cloudflare script once when a site key is set and none is loaded", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "site-key");
    const { unmount } = renderPage();
    await openCreate();
    await waitFor(() => expect(scripts()).toHaveLength(1));
    unmount();
    renderPage();
    await openCreate();
    expect(scripts()).toHaveLength(1);
  });

  it("loads Turnstile only when a site key is set and sends its token", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "site-key");
    let callback: (t: string) => void = () => {};
    w.turnstile = {
      render: vi.fn((_el: unknown, opts: { callback: (t: string) => void }) => {
        callback = opts.callback;
        return "w1";
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };
    renderPage();
    await fillForm();
    await waitFor(() => expect(w.turnstile!.render).toHaveBeenCalled());
    submit();
    expect(await screen.findByText(/bot check/i)).toBeTruthy();
    expect(api.signup).not.toHaveBeenCalled();
    act(() => callback("tok-123"));
    submit();
    await waitFor(() =>
      expect(api.signup).toHaveBeenCalledWith(expect.objectContaining({ turnstile_token: "tok-123" })),
    );
  });
});
