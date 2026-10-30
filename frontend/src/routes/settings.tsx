import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Panel } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventory } from "@/lib/inventory-store";
import { isDemoMode } from "@/services/api";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MediStock" },
      { name: "description", content: "Configure stock thresholds and expiry warning periods." },
      { property: "og:title", content: "Settings — MediStock" },
      { property: "og:description", content: "Configure MediStock thresholds and warning periods." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, setSettings } = useInventory();
  const [minStock, setMinStock] = useState(String(settings.defaultMinStock));
  const [warn, setWarn] = useState(String(settings.expiryWarningDays));
  const [periods, setPeriods] = useState(settings.warningPeriods.join(", "));
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setMinStock(String(settings.defaultMinStock));
    setWarn(String(settings.expiryWarningDays));
    setPeriods(settings.warningPeriods.join(", "));
  }, [settings]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const ms = Number(minStock), w = Number(warn);
    const ps = periods.split(",").map((p) => Number(p.trim())).filter((n) => n > 0);
    if (!Number.isInteger(ms) || ms < 0) return setErr("Default minimum stock must be a whole number ≥ 0.");
    if (!Number.isInteger(w) || w < 1 || w > 730) return setErr("Expiry warning must be between 1 and 730 days.");
    if (!ps.length || ps.some((p) => !Number.isInteger(p) || p > 730)) return setErr("Warning periods must be whole days, e.g. 30, 60, 90.");
    setErr(null);
    setSettings({ defaultMinStock: ms, expiryWarningDays: w, warningPeriods: [...new Set(ps)].sort((a, b) => a - b) });
    toast.success("Settings updated", { description: "Stored in this browser." });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Thresholds used to flag low stock and near-expiry medicines." />
      <form onSubmit={save} className="space-y-6">
        <Panel title="Stock thresholds">
          <div className="space-y-1.5">
            <Label htmlFor="ms">Default minimum stock for new medicines</Label>
            <Input id="ms" type="number" min={0} value={minStock} onChange={(e) => setMinStock(e.target.value)} />
            <p className="text-xs text-muted-foreground">Each medicine can override this in its own record.</p>
          </div>
        </Panel>
        <Panel title="Expiry warnings">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="w">Near-expiry warning (days)</Label>
              <Input id="w" type="number" min={1} value={warn} onChange={(e) => setWarn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p">Warning periods shown on Expiry Monitoring</Label>
              <Input id="p" value={periods} onChange={(e) => setPeriods(e.target.value)} placeholder="30, 60, 90" />
            </div>
          </div>
        </Panel>
        <Panel title="Backend connection">
          <p className="text-sm text-muted-foreground">
            {isDemoMode ? "Not connected. Set VITE_API_BASE_URL to your Spring Boot API to store records permanently." : "Connected via VITE_API_BASE_URL."}
          </p>
        </Panel>
        {err && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}
        <div className="flex justify-end"><Button type="submit">Save settings</Button></div>
      </form>
    </div>
  );
}
