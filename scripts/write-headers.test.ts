import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs build script
import { buildCsp, buildHeadersFile } from "./write-headers.mjs";

const directive = (csp: string, name: string) => csp.split("; ").find((d) => d.startsWith(`${name} `)) ?? "";

const on = {
  VITE_SIGNUP_ENABLED: "true",
  VITE_ERP_API_URL: "https://api.example.test",
  VITE_FIREBASE_AUTH_DOMAIN: "proj.firebaseapp.com",
};

describe("write-headers CSP", () => {
  it("flag off: only self plus what the live site needs", () => {
    const csp = buildCsp({ ...on, VITE_SIGNUP_ENABLED: "" });
    expect(directive(csp, "connect-src")).toBe("connect-src 'self'");
    expect(directive(csp, "script-src")).toBe("script-src 'self'");
    // the homepage video is the only frame the live site needs
    expect(directive(csp, "frame-src")).toBe("frame-src https://www.youtube-nocookie.com");
    expect(directive(csp, "img-src")).toBe("img-src 'self' data: https://i.ytimg.com");
    expect(csp).not.toContain("api.example.test");
    expect(csp).not.toContain("identitytoolkit");
    expect(csp).not.toContain("cloudflare");
    expect(directive(csp, "style-src")).toContain("'unsafe-inline'");
    expect(directive(csp, "style-src")).toContain("https://fonts.googleapis.com");
    expect(directive(csp, "font-src")).toContain("https://fonts.gstatic.com");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("is on only for the literal string true, the same rule as the app", () => {
    for (const value of [" true", "true ", "TRUE", "1", undefined]) {
      expect(buildCsp({ ...on, VITE_SIGNUP_ENABLED: value })).not.toContain("api.example.test");
    }
  });

  it("flag on: adds ERP API, Firebase and Turnstile", () => {
    const csp = buildCsp(on);
    const connect = directive(csp, "connect-src");
    expect(connect).toContain("https://api.example.test");
    expect(connect).toContain("https://identitytoolkit.googleapis.com");
    expect(connect).toContain("https://securetoken.googleapis.com");
    expect(connect).toContain("https://proj.firebaseapp.com");
    expect(directive(csp, "script-src")).toContain("https://challenges.cloudflare.com");
    expect(directive(csp, "frame-src")).toContain("https://challenges.cloudflare.com");
  });

  it("flag on with blank URLs: no empty or broken entries", () => {
    const csp = buildCsp({ VITE_SIGNUP_ENABLED: "true", VITE_ERP_API_URL: "  ", VITE_FIREBASE_AUTH_DOMAIN: "" });
    expect(directive(csp, "connect-src")).toBe(
      "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
    );
    expect(csp).not.toMatch(/undefined|\s;|;;/);
  });

  it("uses the origin only, never the path or query", () => {
    const csp = buildCsp({ ...on, VITE_ERP_API_URL: "https://api.example.test:8443/v1/base?x=1#h" });
    expect(directive(csp, "connect-src")).toContain("https://api.example.test:8443");
    expect(csp).not.toContain("/v1/base");
    expect(csp).not.toContain("x=1");
  });

  it("ignores non-https ERP URLs", () => {
    expect(buildCsp({ ...on, VITE_ERP_API_URL: "http://api.example.test" })).not.toContain("api.example.test");
  });

  it("emits report-only, never enforcing, in _headers format", () => {
    const file = buildHeadersFile(on);
    expect(file.startsWith("/*\n  Content-Security-Policy-Report-Only: ")).toBe(true);
    expect(file).not.toMatch(/^\s*Content-Security-Policy:/m);
  });
});
