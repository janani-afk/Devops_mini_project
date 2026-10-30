// API service layer. Set VITE_API_BASE_URL (e.g. http://localhost:8080/api) to talk to the
// Spring Boot backend. Without it, an in-memory sample store is used (resets on reload).
// No credentials or secrets belong here.
import { sampleActivity, sampleMedicines } from "@/data/sample-medicines";
import type { Activity, Medicine, MedicineInput } from "@/lib/types";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
export const isDemoMode = !BASE_URL;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- demo store ----
let memMeds = [...sampleMedicines];
let memActivity = [...sampleActivity];
const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), 350));
const log = (type: Activity["type"], medicineName: string, detail: string) => {
  memActivity = [{ id: crypto.randomUUID(), type, medicineName, detail, at: new Date().toISOString() }, ...memActivity].slice(0, 20);
};

export const medicineApi = {
  list: (): Promise<Medicine[]> => (isDemoMode ? delay(memMeds) : http("/medicines")),
  activity: (): Promise<Activity[]> => (isDemoMode ? delay(memActivity) : http("/activity")),
  create: async (input: MedicineInput): Promise<Medicine> => {
    if (!isDemoMode) return http("/medicines", { method: "POST", body: JSON.stringify(input) });
    const m = { ...input, id: crypto.randomUUID() };
    memMeds = [m, ...memMeds];
    log("added", m.name, `New batch ${m.batchNumber}`);
    return delay(m);
  },
  update: async (id: string, input: MedicineInput): Promise<Medicine> => {
    if (!isDemoMode) return http(`/medicines/${id}`, { method: "PUT", body: JSON.stringify(input) });
    const m = { ...input, id };
    memMeds = memMeds.map((x) => (x.id === id ? m : x));
    log("updated", m.name, `Quantity now ${m.quantity}`);
    return delay(m);
  },
  remove: async (id: string): Promise<void> => {
    if (!isDemoMode) return http(`/medicines/${id}`, { method: "DELETE" });
    const m = memMeds.find((x) => x.id === id);
    memMeds = memMeds.filter((x) => x.id !== id);
    if (m) log("deleted", m.name, `Removed batch ${m.batchNumber}`);
    await delay(null);
  },
};
