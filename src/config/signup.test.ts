import { afterEach, describe, expect, it, vi } from "vitest";
import { readSignupConfig } from "./signup";

const loadFresh = async () => {
  vi.resetModules();
  return import("./signup");
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("signup flags", () => {
  it("flags default off", async () => {
    expect(readSignupConfig({})).toMatchObject({
      SIGNUP_ENABLED: false,
      SIGNUP_NAV_ENABLED: false,
    });
    const mod = await loadFresh();
    expect(mod.SIGNUP_ENABLED).toBe(false);
    expect(mod.SIGNUP_NAV_ENABLED).toBe(false);
  });

  it("is on only for the literal string true", () => {
    for (const v of ["TRUE", "1", "yes", "on", " true", "true ", "", undefined]) {
      expect(readSignupConfig({ VITE_SIGNUP_ENABLED: v }).SIGNUP_ENABLED).toBe(false);
      expect(readSignupConfig({ VITE_SIGNUP_NAV_ENABLED: v }).SIGNUP_NAV_ENABLED).toBe(false);
    }
    const on = readSignupConfig({ VITE_SIGNUP_ENABLED: "true", VITE_SIGNUP_NAV_ENABLED: "true" });
    expect(on.SIGNUP_ENABLED).toBe(true);
    expect(on.SIGNUP_NAV_ENABLED).toBe(true);
  });

  it("reads the flags from the build environment", async () => {
    vi.stubEnv("VITE_SIGNUP_ENABLED", "true");
    vi.stubEnv("VITE_SIGNUP_NAV_ENABLED", "true");
    const mod = await loadFresh();
    expect(mod.SIGNUP_ENABLED).toBe(true);
    expect(mod.SIGNUP_NAV_ENABLED).toBe(true);
  });

  it("keeps the ERP sign-in URL and API URL separate and blank by default", async () => {
    expect(readSignupConfig({})).toMatchObject({ ERP_URL: "", ERP_API_URL: "" });
    const cfg = readSignupConfig({
      VITE_ERP_URL: "https://erp.example.test",
      VITE_ERP_API_URL: "https://api.example.test",
    });
    expect(cfg.ERP_URL).toBe("https://erp.example.test");
    expect(cfg.ERP_API_URL).toBe("https://api.example.test");
  });

  it("exposes route paths", async () => {
    const { ROUTES } = await loadFresh();
    expect(ROUTES).toEqual({
      pricing: "/pricing",
      register: "/register",
      account: "/account",
      checkoutReturn: "/checkout/return",
      terms: "/terms",
      privacy: "/privacy",
    });
  });
});
