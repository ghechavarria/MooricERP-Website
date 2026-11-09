import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const api = vi.hoisted(() => ({ pollStatus: vi.fn() }));
const fb = vi.hoisted(() => ({
  firebaseAvailable: vi.fn(() => true),
  currentSession: vi.fn(),
  signIn: vi.fn(),
  completeTotp: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("../lib/erpApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/erpApi")>()),
  erpApi: {},
  pollStatus: api.pollStatus,
}));
vi.mock("../lib/firebase", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/firebase")>()),
  ...fb,
}));

import type { AccountStatus, PollOptions } from "../lib/erpApi";
import AccountPage from "./AccountPage";
import CheckoutReturnPage from "./CheckoutReturnPage";

const status = (over: Partial<AccountStatus> = {}): AccountStatus => ({
  state: "started",
  plan: "monthly",
  billing_status: null,
  verified: false,
  suspended_reason: null,
  access_cutoff_at: null,
  loans_used: 0,
  loans_included: null,
  erp_url: null,
  support_email: "support@example.test",
  ...over,
});

let options: PollOptions | undefined;
const poll = (...statuses: AccountStatus[]) =>
  api.pollStatus.mockImplementation((o: PollOptions) => {
    options = o;
    for (const s of statuses) o.onUpdate(s);
    return { stop: vi.fn() };
  });

beforeEach(() => {
  vi.clearAllMocks();
  options = undefined;
  fb.firebaseAvailable.mockReturnValue(true);
  fb.currentSession.mockResolvedValue({ email: "ada@example.test", emailVerified: true });
});

const renderReturn = () =>
  render(
    <MemoryRouter initialEntries={["/account?checkout=success"]}>
      <AccountPage />
    </MemoryRouter>,
  );

describe("checkout return", () => {
  it("success page polls and never claims access", async () => {
    poll(); // the server has not answered yet
    renderReturn();
    expect(await screen.findByText(/confirming your payment/i)).toBeTruthy();
    expect(api.pollStatus).toHaveBeenCalled();
    expect(screen.queryByText(/account is ready/i)).toBeNull();
    expect(screen.queryByRole("link", { name: /sign in to mooric erp/i })).toBeNull();
  });

  it("keeps waiting while the payment is not confirmed yet, even though the URL says success", async () => {
    poll(status({ state: "started" }));
    renderReturn();
    expect(await screen.findByText(/confirming your payment/i)).toBeTruthy();
    expect(screen.queryByText(/account is ready/i)).toBeNull();
    // a just-returned customer's "started" state keeps the poll going
    expect(options!.isDone!(status({ state: "started" }))).toBe(false);
  });

  it("shows setup progress while provisioning, with no sign-in link", async () => {
    poll(status({ state: "provisioned", erp_url: null }));
    renderReturn();
    expect(await screen.findByText(/setting up your account/i)).toBeTruthy();
    expect(screen.queryByRole("link", { name: /sign in to mooric erp/i })).toBeNull();
  });

  it("offers the ERP link only once the server says ready", async () => {
    poll(status({ state: "ready", erp_url: "https://erp.example.test", verified: false, billing_status: "active" }));
    renderReturn();
    const link = await screen.findByRole("link", { name: /sign in to mooric erp/i });
    expect(link.getAttribute("href")).toBe("https://erp.example.test");
    expect(options!.isDone!(status({ state: "ready" }))).toBe(true);
  });

  it("does not claim access for a paid signup held for review", async () => {
    poll(status({ state: "review" }));
    renderReturn();
    expect(await screen.findByText(/under review/i)).toBeTruthy();
    expect(screen.queryByRole("link", { name: /sign in to mooric erp/i })).toBeNull();
  });

  it("after about two minutes without confirmation it says so and points to the account page", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      poll(status({ state: "started" }));
      renderReturn();
      expect(await screen.findByText(/confirming your payment/i)).toBeTruthy();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(121_000);
      });
      expect(screen.getByText(/payment still not confirmed/i)).toBeTruthy();
      expect(screen.getByRole("link", { name: /check your account/i }).getAttribute("href")).toBe("/account");
      expect(screen.queryByText(/account is ready/i)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("also works as the standalone /checkout/return page", async () => {
    poll(status({ state: "paid" }));
    render(
      <MemoryRouter initialEntries={["/checkout/return"]}>
        <CheckoutReturnPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/payment received/i)).toBeTruthy();
  });
});
