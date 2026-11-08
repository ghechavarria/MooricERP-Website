import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ComponentType } from "react";

const fixtures = import.meta.glob<string>("./fixtures/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});
// Normalise line endings so git autocrlf cannot break the comparison.
const fixture = (name: string) => fixtures[`./fixtures/${name}`].replace(/\r\n/g, "\n");

const loadApp = async (env: Record<string, string>) => {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  const [{ default: App }, { Header }, { ContactModalProvider }] = await Promise.all([
    import("../App"),
    import("../components/Header"),
    import("../context/ContactModalContext"),
  ]);
  return { App, Header, ContactModalProvider };
};

const renderHeader = (
  mods: { Header: ComponentType; ContactModalProvider: ComponentType<{ children: React.ReactNode }> },
  path: string,
) => {
  const { Header, ContactModalProvider } = mods;
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ContactModalProvider>
        <Header />
      </ContactModalProvider>
    </MemoryRouter>,
  );
};

const renderedHeader = (
  mods: Parameters<typeof renderHeader>[0],
  path: string,
) => {
  const { container } = renderHeader(mods, path);
  const closed = container.innerHTML;
  fireEvent.click(screen.getByLabelText("Open menu"));
  const panel = document.querySelector('[role="dialog"]')!.outerHTML;
  return `${closed}
<!--MOBILE-->
${panel}`;
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("header", () => {
  it("header unchanged when nav off", async () => {
    // Fixtures were captured from the Header before this change.
    for (const [path, file] of [
      ["/", "header-today-home.html"],
      ["/team", "header-today-team.html"],
    ] as const) {
      // Even with signup itself on, nav off must render today's header.
      const envs: Record<string, string>[] = [{}, { VITE_SIGNUP_ENABLED: "true" }];
      for (const env of envs) {
        const mods = await loadApp(env);
        expect(renderedHeader(mods, path)).toBe(fixture(file));
        cleanup();
      }
    }
  });

  it("nav on adds Sign in and Get started and keeps Book a demo", async () => {
    const mods = await loadApp({
      VITE_SIGNUP_ENABLED: "true",
      VITE_SIGNUP_NAV_ENABLED: "true",
      VITE_ERP_URL: "https://erp.example.test",
    });
    renderHeader(mods, "/");

    const desktop = screen.getByRole("navigation", { name: "Primary" });
    const pricing = desktop.querySelector('a[href="/pricing"]');
    expect(pricing?.textContent).toBe("Pricing");
    expect(desktop.querySelector('a[href="/#contact"]')?.textContent).toBe("Contact");

    const signInDesktop = screen.getAllByRole("link", { name: "Sign in" });
    expect(signInDesktop).toHaveLength(1);
    expect(signInDesktop[0].getAttribute("href")).toBe("https://erp.example.test");
    expect(screen.getAllByRole("link", { name: "Get started" })[0].getAttribute("href")).toBe("/register");
    const demo = screen.getByRole("button", { name: "Book a demo" });
    const getStarted = screen.getAllByRole("link", { name: "Get started" })[0];
    // one primary action: Get started last and solid, Book a demo outlined before it
    expect(demo.compareDocumentPosition(getStarted) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(signInDesktop[0].compareDocumentPosition(demo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(getStarted.className).toContain("btn-primary-silver");
    expect(demo.className).not.toContain("btn-primary-silver");

    fireEvent.click(screen.getByLabelText("Open menu"));
    const mobile = screen.getByRole("navigation", { name: "Mobile" });
    expect(mobile.querySelector('a[href="/pricing"]')?.textContent).toBe("Pricing");
    expect(mobile.querySelector('a[href="https://erp.example.test"]')?.textContent).toBe("Sign in");
    expect(mobile.querySelector('a[href="/register"]')?.textContent).toBe("Get started");
    expect(mobile.textContent).toContain("Book a demo");
  });
  it("nav on with no ERP URL omits Sign in but keeps Get started", async () => {
    const mods = await loadApp({ VITE_SIGNUP_ENABLED: "true", VITE_SIGNUP_NAV_ENABLED: "true" });
    renderHeader(mods, "/");
    expect(screen.queryAllByText("Sign in")).toHaveLength(0);
    expect(screen.getAllByRole("link", { name: "Get started" })).toHaveLength(1);
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(screen.queryAllByText("Sign in")).toHaveLength(0);
    expect(screen.getAllByRole("link", { name: "Get started" })).toHaveLength(2);
  });
});

describe("routes", () => {
  const renderApp = (App: ComponentType, path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
  const mainHtml = () => document.querySelector("main")!.innerHTML;
  const newPaths = ["/pricing", "/register", "/account", "/checkout/return"];

  it("routes unreachable when signup off", async () => {
    const { App } = await loadApp({});
    renderApp(App, "/some-unknown-path");
    const unknown = mainHtml();
    expect(unknown).toBe("");
    cleanup();

    for (const p of newPaths) {
      const { unmount } = renderApp(App, p);
      expect(mainHtml()).toBe(unknown);
      unmount();
    }
  });

  it("routes unreachable when only nav is on", async () => {
    const { App } = await loadApp({ VITE_SIGNUP_NAV_ENABLED: "true" });
    renderApp(App, "/pricing");
    expect(mainHtml()).toBe("");
  });

  it("serves the new pages when signup on, and leaves unknown paths alone", async () => {
    const { App } = await loadApp({ VITE_SIGNUP_ENABLED: "true" });
    renderApp(App, "/pricing");
    expect(await screen.findByTestId("page-pricing")).toBeTruthy();
    cleanup();
    renderApp(App, "/register");
    expect(await screen.findByTestId("page-register")).toBeTruthy();
    cleanup();
    renderApp(App, "/account");
    expect(await screen.findByTestId("page-account")).toBeTruthy();
    cleanup();
    renderApp(App, "/checkout/return");
    expect(await screen.findByTestId("page-checkout-return")).toBeTruthy();
    cleanup();
    renderApp(App, "/nope");
    expect(mainHtml()).toBe("");
  });
});
