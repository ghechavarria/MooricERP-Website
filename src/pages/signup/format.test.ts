import { afterEach, describe, expect, it } from "vitest";
import { formatDate, formatShortDate } from "./format";

const original = process.env.TZ;
afterEach(() => {
  process.env.TZ = original;
});

describe("formatDate", () => {
  it("shows the day in Stripe's zone with its label, whatever the visitor's own zone", () => {
    process.env.TZ = "Pacific/Auckland"; // already the next day locally
    // 3 AM UTC on Dec 6 is still Dec 5 in New York
    expect(formatDate("2026-12-06T03:00:00+00:00", "America/New_York")).toBe("December 5, 2026 (EST)");
  });

  it("labels summer dates EDT", () => {
    process.env.TZ = "Pacific/Honolulu";
    expect(formatDate("2026-07-04T16:00:00+00:00", "America/New_York")).toBe("July 4, 2026 (EDT)");
  });

  it("follows another zone when Stripe uses one", () => {
    expect(formatDate("2026-12-06T03:00:00+00:00", "UTC")).toBe("December 6, 2026 (UTC)");
  });

  it("uses Eastern when the ERP sends no zone or an unknown one", () => {
    expect(formatDate("2026-12-06T03:00:00+00:00")).toBe("December 5, 2026 (EST)");
    expect(formatDate("2026-12-06T03:00:00+00:00", "Mars/Base")).toBe("December 5, 2026 (EST)");
  });

  it("is empty for missing or bad dates", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("nope")).toBe("");
  });
});

describe("formatShortDate", () => {
  it("uses the same zone", () => {
    expect(formatShortDate("2026-12-10T03:00:00+00:00", "America/New_York")).toBe("Dec 9, 2026");
  });
});
