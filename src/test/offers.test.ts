import { describe, expect, it } from "vitest";

import {
  codeError,
  codes,
  discountFor,
  entryTiers,
  paymentDiscount,
  paymentMethods,
  quote,
  tiers,
} from "@/lib/offers";

const TODAY = new Date("2026-11-02T12:00:00");

describe("Entry-level packages", () => {
  it("sits in the $200–$400 CAD band the business asked for", () => {
    expect(entryTiers.map((t) => t.price)).toEqual([249, 399]);
    for (const t of entryTiers) {
      expect(t.price).toBeGreaterThanOrEqual(200);
      expect(t.price).toBeLessThanOrEqual(400);
    }
  });

  it("keeps the three main tiers above the entry band", () => {
    expect(tiers.map((t) => t.name)).toEqual(["Basic", "Standard", "Premium"]);
    for (const t of tiers) expect(t.price).toBeGreaterThan(400);
  });
});

describe("Discount codes", () => {
  it("takes $200 off any package", () => {
    expect(discountFor("CANCUN200", 3798)).toBe(200);
  });

  it("never discounts more than the subtotal", () => {
    expect(discountFor("CANCUN200", 150)).toBe(150);
  });

  it("takes 10% off for early birds and 15% off for groups", () => {
    expect(discountFor("EARLYBIRD", 3798)).toBe(380);
    expect(discountFor("SNOWBIRD", 3798)).toBe(570);
  });

  it("rejects unknown codes", () => {
    expect(codeError("NOPE", 3798, 2, "2027-01-01", TODAY)).toBe("That code isn't valid.");
    expect(discountFor("NOPE", 3798)).toBe(0);
  });

  it("requires 6+ travellers for the group code", () => {
    expect(codeError("SNOWBIRD", 3798, 2, "2027-01-01", TODAY)).toBe("SNOWBIRD needs 6+ travellers.");
    expect(codeError("SNOWBIRD", 3798, 6, "2027-01-01", TODAY)).toBeNull();
  });

  it("requires a travel date 45+ days out for the early-bird code", () => {
    expect(codeError("EARLYBIRD", 3798, 2, "", TODAY)).toBe("Add a travel date to use EARLYBIRD.");
    expect(codeError("EARLYBIRD", 3798, 2, "2026-11-12", TODAY)).toBe(
      "EARLYBIRD needs a travel date 45+ days out.",
    );
    expect(codeError("EARLYBIRD", 3798, 2, "2027-01-01", TODAY)).toBeNull();
  });

  it("lets the flat code through with no travel date", () => {
    expect(codeError("CANCUN200", 3798, 2, "", TODAY)).toBeNull();
  });
});

describe("Offer copy", () => {
  it("ships the three codes advertised on the page", () => {
    expect(Object.keys(codes)).toEqual(["CANCUN200", "EARLYBIRD", "SNOWBIRD"]);
  });
});

describe("Special offers — payment-method discounts", () => {
  it("advertises a flat 10% for both crypto and card", () => {
    expect(paymentMethods.map((m) => [m.name, m.pct])).toEqual([
      ["Cryptocurrency", 0.1],
      ["Card", 0.1],
    ]);
  });

  it("takes 10% off the package total for crypto", () => {
    expect(paymentDiscount("Cryptocurrency", 3798)).toBe(380);
  });

  it("takes 10% off the package total for card", () => {
    expect(paymentDiscount("Card", 3798)).toBe(380);
  });

  it("gives nothing for an unlisted payment method", () => {
    expect(paymentDiscount("Cash", 3798)).toBe(0);
    expect(paymentDiscount("Cryptocurrency", 0)).toBe(0);
  });

  it("applies the offer to entry-level packages too", () => {
    const saver = entryTiers.find((t) => t.name === "Saver")!;
    expect(paymentDiscount("Cryptocurrency", saver.price)).toBe(25);
    expect(quote(saver.price, null, "Cryptocurrency").total).toBe(224);
  });

  it("stacks the payment discount with a promo code", () => {
    const q = quote(3798, "CANCUN200", "Cryptocurrency");
    expect(q.payment).toBe(380);
    expect(q.code).toBe(200);
    expect(q.discount).toBe(580);
    expect(q.total).toBe(3218);
  });

  it("never discounts a trip below zero", () => {
    const q = quote(150, "CANCUN200", "Cryptocurrency");
    expect(q.discount).toBe(150);
    expect(q.total).toBe(0);
  });
});
