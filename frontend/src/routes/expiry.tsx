import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingRows, Panel } from "@/components/common";
import { MedicineTable } from "@/components/medicine-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInventory } from "@/lib/inventory-store";
import { daysUntil, isExpired, isNearExpiry } from "@/lib/status";

export const Route = createFileRoute("/expiry")({
  head: () => ({
    meta: [
      { title: "Expiry Monitoring — MediStock" },
      { name: "description", content: "See medicines approaching expiry within 30, 60 or 90 days, and expired stock." },
      { property: "og:title", content: "Expiry Monitoring — MediStock" },
      { property: "og:description", content: "Track medicines approaching their expiry dates." },
    ],
  }),
  component: Expiry,
});

function Expiry() {
  const { medicines, loading, error, reload, settings } = useInventory();
  const [days, setDays] = useState(settings.expiryWarningDays);
  useEffect(() => setDays(settings.expiryWarningDays), [settings.expiryWarningDays]);

  const byDays = (a: { expiryDate: string }, b: { expiryDate: string }) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate);
  const expired = medicines.filter((m) => isExpired(m)).sort(byDays);
  const near = medicines.filter((m) => isNearExpiry(m, days)).sort(byDays);
  const periods = [...new Set([...settings.warningPeriods, settings.expiryWarningDays])].sort((a, b) => a - b);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Expiry Monitoring"
        description="Medicines approaching their expiry date."
        action={
          <ToggleGroup type="single" variant="outline" value={String(days)} onValueChange={(v) => v && setDays(Number(v))}>
            {periods.map((p) => <ToggleGroupItem key={p} value={String(p)} className="px-4">{p} days</ToggleGroupItem>)}
          </ToggleGroup>
        }
      />
      <div className="space-y-6">
        <Panel title={`Expired (${expired.length})`} className="border-destructive/30">
          {loading ? <LoadingRows rows={3} /> : expired.length ? <MedicineTable items={expired} showDays /> : <EmptyState title="No expired medicines" />}
        </Panel>
        <Panel title={`Expiring within ${days} days (${near.length})`}>
          {loading ? <LoadingRows rows={4} /> : near.length ? <MedicineTable items={near} showDays /> : <EmptyState title={`Nothing expires in the next ${days} days`} />}
        </Panel>
      </div>
    </div>
  );
}
