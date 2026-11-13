import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyPage from "./PrivacyPage";
import TermsPage from "./TermsPage";

const renderAt = (Page: ComponentType) =>
  render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  );

describe("legal pages", () => {
  it("terms: title, every numbered section in the contents, and a link to Privacy", () => {
    renderAt(TermsPage);
    expect(screen.getByRole("heading", { level: 1, name: "Terms of Use" })).toBeTruthy();
    const toc = screen.getByRole("navigation", { name: /on this page/i });
    expect(within(toc).getByRole("link", { name: "1. Acceptance of These Terms" }).getAttribute("href")).toBe(
      "#1-acceptance-of-these-terms",
    );
    expect(within(toc).getByRole("link", { name: "23. Contact Us" })).toBeTruthy();
    expect(document.getElementById("18-dispute-resolution-arbitration-class-action-waiver")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe("/privacy");
    expect(document.title).toBe("Terms of Use | Mooric ERP");
  });

  it("terms: keeps the acknowledgment list but drops the paper signature lines", () => {
    renderAt(TermsPage);
    expect(screen.getByRole("heading", { name: "New User Acknowledgment" })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/_{5,}/);
  });

  it("privacy: renders both tables with their headers", () => {
    renderAt(PrivacyPage);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeTruthy();
    const headers = screen.getAllByRole("columnheader").map((h) => h.textContent);
    expect(headers).toEqual(["Category", "Examples", "Source", "Type", "Purpose", "Can you turn it off?"]);
    expect(screen.getAllByRole("row")).toHaveLength(9 + 4);
    expect(screen.getByRole("link", { name: "Terms of Use" }).getAttribute("href")).toBe("/terms");
  });
});
