export const CATEGORIES = [
  "Analgesic",
  "Antibiotic",
  "Antidiabetic",
  "Antihypertensive",
  "Antihistamine",
  "Antacid",
  "Vitamin & Supplement",
  "Respiratory",
  "Cardiovascular",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Medicine {
  id: string;
  name: string;
  category: Category;
  batchNumber: string;
  quantity: number;
  minStock: number;
  manufacturingDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  supplier: string;
}

export type MedicineInput = Omit<Medicine, "id">;

export interface Activity {
  id: string;
  type: "added" | "updated" | "deleted";
  medicineName: string;
  detail: string;
  at: string; // ISO
}

export interface Settings {
  defaultMinStock: number;
  expiryWarningDays: number;
  warningPeriods: number[];
}

export const DEFAULT_SETTINGS: Settings = {
  defaultMinStock: 20,
  expiryWarningDays: 60,
  warningPeriods: [30, 60, 90],
};
