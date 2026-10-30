
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { medicineApi } from "@/services/api";
import {
  DEFAULT_SETTINGS,
  type Activity,
  type Medicine,
  type MedicineInput,
  type Settings,
} from "./types";

interface Ctx {
  medicines: Medicine[];
  activity: Activity[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  create: (m: MedicineInput) => Promise<void>;
  update: (id: string, m: MedicineInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  settings: Settings;
  setSettings: (s: Settings) => void;
}

const InventoryCtx = createContext<Ctx | null>(null);
const SETTINGS_KEY = "medistock-settings";

export function InventoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettingsState] =
    useState<Settings>(DEFAULT_SETTINGS);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [m, a] = await Promise.all([
        medicineApi.list(),
        medicineApi.activity(),
      ]);

      setMedicines(m);
      setActivity(a);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load inventory"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();

    try {
      const raw = localStorage.getItem(SETTINGS_KEY);

      if (raw) {
        setSettingsState({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(raw),
        });
      }
    } catch {
      // Ignore invalid stored settings
    }
  }, [reload]);

  const refreshActivity = async () => {
    try {
      setActivity(await medicineApi.activity());
    } catch (e) {
      console.error("Could not refresh activity:", e);
    }
  };

  const value: Ctx = {
    medicines,
    activity,
    loading,
    error,
    reload,
    settings,

    setSettings: (s) => {
      setSettingsState(s);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    },

    // Add medicine and reload the actual database records.
    create: async (input) => {
      await medicineApi.create(input);
      await reload();
    },

    // Update medicine and reload the latest records.
    update: async (id, input) => {
      await medicineApi.update(id, input);
      await reload();
    },

    // Delete medicine using its actual database ID.
    remove: async (id) => {
      if (!id || id === "undefined") {
        throw new Error("Invalid medicine ID");
      }

      await medicineApi.remove(id);
      await reload();
    },
  };

  return (
    <InventoryCtx.Provider value={value}>
      {children}
    </InventoryCtx.Provider>
  );
}

export function useInventory() {
  const c = useContext(InventoryCtx);

  if (!c) {
    throw new Error(
      "useInventory must be used within InventoryProvider"
    );
  }

  return c;
}
