import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const api = vi.hoisted(() => ({ config: vi.fn() }));
vi.mock("../lib/erpApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/erpApi")>()),
  erpApi: { config: api.config },
}));
vi.mock("../lib/firebase", () => ({ firebaseAvailable: () => true }));

import { ErpApiError } from "../lib/erpApi";
import PricingPage from "./PricingPage";

const config = (over: Record<string, unknown> = {}) => ({
  signup_available: true,
  plan: { code: "launch", name: "Launch", price_cents: 5000, included_loans: 10, overage_cents: 1500 },
  terms_url: "https://t.example.test",
  privacy_url: "https://p.example.test",
  terms_version: "2026-11",
  ...over,
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <PricingPage />
    </MemoryRouter>,
  );

beforeEach(() => vi.clearAllMocks());

describe("pricing", () => {
  it("pricing reads plan data and shows plus tax", async () => {
    api.config.mockResolvedValue(config());
    renderPage();
    expect(await screen.findByText("$50")).toBeTruthy();
    expect(screen.getByText(/\+ applicable tax/i)).toBeTruthy();
    expect(screen.getByText(/10 loans included/i)).toBeTruthy();
    expect(screen.getByText(/\$15 per additional loan/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /get started/i }).getAttribute("href")).toBe("/register");
  });

  it("formats from plan data, not a fixed price", async () => {
    api.config.mockResolvedValue(
      config({ plan: { code: "x", name: "Pro", price_cents: 12950, included_loans: 25, overage_cents: 900 } }),
    );
    renderPage();
    expect(await screen.findByText("$129.50")).toBeTruthy();
    expect(screen.getByText(/25 loans included/i)).toBeTruthy();
    expect(screen.getByText(/\$9 per additional loan/i)).toBeTruthy();
    expect(screen.queryByText("$50")).toBeNull();
  });

  it("shows not available when the API says so", async () => {
    api.config.mockRejectedValue(new ErpApiError(503, "not_available", "Signup is not available."));
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
    expect(screen.queryByRole("link", { name: /get started/i })).toBeNull();
  });

  it("shows not available when signup is switched off server side", async () => {
    api.config.mockResolvedValue(config({ signup_available: false }));
    renderPage();
    expect(await screen.findByText(/not available/i)).toBeTruthy();
  });

  it("shows a retry message when the request fails", async () => {
    api.config.mockRejectedValue(new ErpApiError(0, "network_error", "Could not reach the server."));
    renderPage();
    expect(await screen.findByRole("alert")).toBeTruthy();
  });
});
