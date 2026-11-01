import { afterEach, describe, expect, it } from "vitest";
import { formatDate } from "./format";

const original = process.env.TZ;
afterEach(() => {
  process.env.TZ = original;
});

describe("formatDate", () => {
  it("shows the UTC day with a UTC label, even late evening UTC in a far-east zone", () => {
    process.env.TZ = "Pacific/Auckland"; // already the next day locally
    expect(formatDate("2026-12-05T23:30:00+00:00")).toBe("December 5, 2026 (UTC)");
  });

  it("shows the UTC day for an offset instant in a far-west zone", () => {
    process.env.TZ = "Pacific/Honolulu";
    expect(formatDate("2026-12-05T20:00:00-05:00")).toBe("December 6, 2026 (UTC)");
  });

  it("is empty for missing or bad dates", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("nope")).toBe("");
  });
});
