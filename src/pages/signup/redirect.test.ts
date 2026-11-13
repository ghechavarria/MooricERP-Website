import { describe, expect, it } from "vitest";
import { safeUrl, stripeUrl } from "./redirect";

describe("stripeUrl", () => {
  it("allows Stripe Checkout and the billing portal over https", () => {
    expect(stripeUrl("https://checkout.stripe.com/c/pay/cs_test_1")).toBe("https://checkout.stripe.com/c/pay/cs_test_1");
    expect(stripeUrl("https://billing.stripe.com/p/session/test_1")).toBe("https://billing.stripe.com/p/session/test_1");
  });

  it("refuses anything else", () => {
    for (const url of [
      "https://evil.example.test/checkout.stripe.com",
      "https://checkout.stripe.com.evil.test/x",
      "http://checkout.stripe.com/x",
      "javascript:alert(1)",
      "",
      null,
    ]) {
      expect(stripeUrl(url)).toBeNull();
    }
  });

  it("leaves safeUrl (used for the Terms and Privacy links) at any https link", () => {
    expect(safeUrl("https://mooricerp.com/terms")).toBe("https://mooricerp.com/terms");
  });
});
