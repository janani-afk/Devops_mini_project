
import type { Medicine } from "./types";

const DAY = 86_400_000;

function parseDate(d?: string) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return NaN;
  }

  const [y, m, day] = d.split("-").map(Number);
  return Date.UTC(y, m - 1, day);
}

export function todayISO(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function daysUntil(date?: string, today = todayISO()) {
  const target = parseDate(date);
  const current = parseDate(today);

  if (Number.isNaN(target) || Number.isNaN(current)) {
    return NaN;
  }

  return Math.round((target - current) / DAY);
}

export const isExpired = (m: Medicine, today = todayISO()) =>
  daysUntil(m.expiryDate, today) < 0;

export const isNearExpiry = (
  m: Medicine,
  warningDays: number,
  today = todayISO()
) => {
  const d = daysUntil(m.expiryDate, today);
  return d >= 0 && d <= warningDays;
};

export const isLowStock = (m: Medicine) =>
  m.quantity <= m.minStock;

export type StockStatus = "expired" | "near-expiry" | "low-stock" | "ok";

export function statusesOf(
  m: Medicine,
  warningDays: number,
  today = todayISO()
): StockStatus[] {
  const s: StockStatus[] = [];

  if (isExpired(m, today)) s.push("expired");
  else if (isNearExpiry(m, warningDays, today)) s.push("near-expiry");

  if (isLowStock(m)) s.push("low-stock");

  return s.length ? s : ["ok"];
}

export function addDays(days: number, from = todayISO()) {
  return new Date(parseDate(from) + days * DAY)
    .toISOString()
    .slice(0, 10);
}
