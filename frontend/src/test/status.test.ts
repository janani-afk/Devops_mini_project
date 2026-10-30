import { describe, expect, it } from "vitest";
import { isExpired, isLowStock, isNearExpiry } from "@/lib/status";
import { medicineSchema } from "@/lib/validation";
import type { Medicine } from "@/lib/types";

const base: Medicine = { id: "1", name: "X", category: "Analgesic", batchNumber: "B", quantity: 10, minStock: 10, manufacturingDate: "2026-01-01", expiryDate: "2026-12-01", supplier: "S" };
const today = "2026-10-29";

describe("status rules", () => {
  it("flags low stock at the threshold", () => expect(isLowStock(base)).toBe(true));
  it("does not flag above threshold", () => expect(isLowStock({ ...base, quantity: 11 })).toBe(false));
  it("near expiry within 60 days", () => expect(isNearExpiry(base, 60, today)).toBe(true));
  it("not near expiry within 30 days", () => expect(isNearExpiry(base, 30, today)).toBe(false));
  it("expired is separate from near expiry", () => {
    const m = { ...base, expiryDate: "2026-10-28" };
    expect(isExpired(m, today)).toBe(true);
    expect(isNearExpiry(m, 90, today)).toBe(false);
  });
});

describe("form validation", () => {
  const ok = { ...base };
  it("rejects negative quantity", () => expect(medicineSchema.safeParse({ ...ok, quantity: -1 }).success).toBe(false));
  it("rejects expiry before manufacturing", () => expect(medicineSchema.safeParse({ ...ok, expiryDate: "2025-12-01" }).success).toBe(false));
  it("accepts valid input", () => expect(medicineSchema.safeParse(ok).success).toBe(true));
});
