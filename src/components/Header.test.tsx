import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const out = vi.hoisted(() => ({ signOutCompletely: vi.fn(async () => "") }));
vi.mock("../config/signup", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../config/signup")>()),
  SIGNUP_NAV_ENABLED: true,
  ERP_URL: "https://erp.example.test",
}));
vi.mock("../pages/signup/signOut", () => ({ signOutCompletely: out.signOutCompletely }));

import { Header } from "./Header";
import { ContactModalProvider } from "../context/ContactModalContext";

const renderHeader = () =>
  render(
    <MemoryRouter>
      <ContactModalProvider>
        <Header />
      </ContactModalProvider>
    </MemoryRouter>,
  );

const primary = () => screen.getByRole("navigation", { name: "Primary" }).parentElement as HTMLElement;

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.clearAllMocks());

describe("header when signed out", () => {
  it("shows Book a demo and Get started, and no Account menu", () => {
    renderHeader();
    const bar = within(primary());
    expect(bar.getByRole("button", { name: "Book a demo" })).toBeTruthy();
    expect(bar.getByRole("link", { name: "Get started" }).getAttribute("href")).toBe("/register");
    expect(bar.queryByRole("button", { name: /account/i })).toBeNull();
  });
});

describe("header when signed in", () => {
  beforeEach(() => window.localStorage.setItem("mooric.signedIn", "1"));

  it("drops Book a demo and Get started for an Account menu", () => {
    renderHeader();
    const bar = within(primary());
    expect(bar.queryByRole("button", { name: "Book a demo" })).toBeNull();
    expect(bar.queryByRole("link", { name: "Get started" })).toBeNull();
    fireEvent.click(bar.getByRole("button", { name: /account/i }));
    expect(bar.getByRole("link", { name: "Mooric ERP" }).getAttribute("href")).toBe("https://erp.example.test");
    expect(bar.getByRole("link", { name: "Details" }).getAttribute("href")).toBe("/account");
    expect(bar.getByRole("button", { name: "Sign Out" })).toBeTruthy();
  });

  it("Sign Out signs out completely", async () => {
    renderHeader();
    const bar = within(primary());
    fireEvent.click(bar.getByRole("button", { name: /account/i }));
    fireEvent.click(bar.getByRole("button", { name: "Sign Out" }));
    await vi.waitFor(() => expect(out.signOutCompletely).toHaveBeenCalledTimes(1));
  });

  it("the mobile menu has the same Account links instead of the sign-up buttons", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = within(screen.getByRole("navigation", { name: "Mobile" }));
    expect(menu.queryByRole("link", { name: "Get started" })).toBeNull();
    expect(menu.queryByRole("button", { name: "Book a demo" })).toBeNull();
    fireEvent.click(menu.getByRole("button", { name: /account/i }));
    expect(menu.getByRole("link", { name: "Mooric ERP" })).toBeTruthy();
    expect(menu.getByRole("link", { name: "Details" }).getAttribute("href")).toBe("/account");
    expect(menu.getByRole("button", { name: "Sign Out" })).toBeTruthy();
  });
});
