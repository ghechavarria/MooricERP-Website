import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../lib/erpApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/erpApi")>()),
  erpApi: { config: () => new Promise(() => {}), status: () => new Promise(() => {}) },
  pollStatus: () => ({ stop: () => {} }),
}));
vi.mock("../lib/firebase", () => ({
  firebaseAvailable: () => true,
  currentSession: () => new Promise(() => {}),
}));

const robots = () => document.head.querySelector('meta[name="robots"]');

const load = async (env: Record<string, string>) => {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  const [pricing, register, account, ret] = await Promise.all([
    import("./PricingPage"),
    import("./RegisterPage"),
    import("./AccountPage"),
    import("./CheckoutReturnPage"),
  ]);
  return { PricingPage: pricing.default, RegisterPage: register.default, AccountPage: account.default, CheckoutReturnPage: ret.default };
};

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("noindex", () => {
  it("pages carry noindex when nav off, in the head and not the body", async () => {
    const pages = await load({});
    for (const [name, Page] of Object.entries(pages)) {
      const { container, unmount } = render(
        <MemoryRouter>
          <Page />
        </MemoryRouter>,
      );
      expect(robots()?.getAttribute("content"), name).toBe("noindex");
      expect(container.querySelector('meta[name="robots"]'), name).toBeNull();
      unmount();
      expect(robots(), `${name} removed on unmount`).toBeNull();
    }
  });

  it("no noindex once nav is on", async () => {
    const pages = await load({ VITE_SIGNUP_NAV_ENABLED: "true" });
    render(
      <MemoryRouter>
        <pages.PricingPage />
      </MemoryRouter>,
    );
    expect(robots()).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });
});
