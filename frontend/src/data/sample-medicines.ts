// SAMPLE DATA ONLY — used when no backend URL is configured (VITE_API_BASE_URL).
// Dates are relative to today so the demo always shows expired / near-expiry items.
import { addDays } from "@/lib/status";
import type { Activity, Medicine } from "@/lib/types";

type Row = [string, Medicine["category"], string, number, number, number, number, string];
// name, category, batch, qty, minStock, mfgOffsetDays, expOffsetDays, supplier
const rows: Row[] = [
  ["Paracetamol 500mg", "Analgesic", "PCM-2401", 420, 100, -300, 430, "MedLife Distributors"],
  ["Amoxicillin 250mg", "Antibiotic", "AMX-2317", 35, 50, -400, 22, "HealthBridge Pharma"],
  ["Metformin 500mg", "Antidiabetic", "MTF-2409", 180, 60, -200, 520, "Sunrise Medical Supply"],
  ["Amlodipine 5mg", "Antihypertensive", "AML-2402", 12, 40, -350, 75, "CarePlus Wholesale"],
  ["Cetirizine 10mg", "Antihistamine", "CTZ-2311", 260, 50, -500, -12, "MedLife Distributors"],
  ["Omeprazole 20mg", "Antacid", "OMP-2405", 95, 40, -250, 48, "HealthBridge Pharma"],
  ["Vitamin D3 1000IU", "Vitamin & Supplement", "VTD-2408", 310, 80, -150, 610, "NutriCare Ltd."],
  ["Salbutamol Inhaler", "Respiratory", "SLB-2403", 18, 25, -280, 140, "Sunrise Medical Supply"],
  ["Atorvastatin 10mg", "Cardiovascular", "ATV-2312", 140, 50, -420, 15, "CarePlus Wholesale"],
  ["Ibuprofen 400mg", "Analgesic", "IBU-2406", 220, 80, -220, 380, "MedLife Distributors"],
  ["Azithromycin 500mg", "Antibiotic", "AZT-2308", 8, 30, -600, -40, "HealthBridge Pharma"],
  ["Losartan 50mg", "Antihypertensive", "LSN-2410", 75, 40, -120, 700, "CarePlus Wholesale"],
  ["Loratadine 10mg", "Antihistamine", "LRT-2404", 40, 40, -260, 88, "NutriCare Ltd."],
  ["Insulin Glargine", "Antidiabetic", "INS-2407", 22, 15, -90, 35, "Sunrise Medical Supply"],
  ["Folic Acid 5mg", "Vitamin & Supplement", "FOL-2401", 500, 100, -310, 240, "NutriCare Ltd."],
  ["Ranitidine 150mg", "Antacid", "RNT-2309", 0, 30, -560, -5, "HealthBridge Pharma"],
];

export const sampleMedicines: Medicine[] = rows.map(([name, category, batch, q, min, mfg, exp, supplier], i) => ({
  id: `sample-${i + 1}`,
  name,
  category,
  batchNumber: batch,
  quantity: q,
  minStock: min,
  manufacturingDate: addDays(mfg),
  expiryDate: addDays(exp),
  supplier,
}));

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
export const sampleActivity: Activity[] = [
  { id: "a1", type: "updated", medicineName: "Paracetamol 500mg", detail: "Restocked +200 units", at: hoursAgo(2) },
  { id: "a2", type: "added", medicineName: "Insulin Glargine", detail: "New batch INS-2407", at: hoursAgo(7) },
  { id: "a3", type: "updated", medicineName: "Amoxicillin 250mg", detail: "Dispensed 40 units", at: hoursAgo(20) },
  { id: "a4", type: "deleted", medicineName: "Cough Syrup 100ml", detail: "Removed expired batch", at: hoursAgo(30) },
  { id: "a5", type: "added", medicineName: "Losartan 50mg", detail: "New batch LSN-2410", at: hoursAgo(52) },
];
