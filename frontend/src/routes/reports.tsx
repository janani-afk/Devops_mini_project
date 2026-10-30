import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { ErrorState, LoadingRows, Panel, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toCsv } from "@/lib/csv";
import { useInventory } from "@/lib/inventory-store";
import { daysUntil, isExpired, isLowStock, isNearExpiry, statusesOf } from "@/lib/status";
import { Boxes, CalendarX, PackageMinus } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — MediStock" },
      { name: "description", content: "Inventory summaries, expiry reports and CSV export." },
      { property: "og:title", content: "Reports — MediStock" },
      { property: "og:description", content: "Inventory and expiry reports with CSV export." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { medicines, loading, error, reload, settings } = useInventory();
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const byCat = Object.values(
    medicines.reduce<Record<string, { cat: string; count: number; units: number; low: number; exp: number }>>((a, m) => {
      const r = (a[m.category] ??= { cat: m.category, count: 0, units: 0, low: 0, exp: 0 });
      r.count++; r.units += m.quantity;
      if (isLowStock(m)) r.low++;
      if (isExpired(m) || isNearExpiry(m, settings.expiryWarningDays)) r.exp++;
      return a;
    }, {}),
  ).sort((a, b) => b.units - a.units);

  const buckets = [
    { label: "Expired", n: medicines.filter((m) => daysUntil(m.expiryDate) < 0).length },
    ...[30, 60, 90].map((d, i, arr) => ({ label: `${i ? arr[i - 1] + 1 : 0}–${d} days`, n: medicines.filter((m) => { const x = daysUntil(m.expiryDate); return x >= (i ? arr[i - 1] + 1 : 0) && x <= d; }).length })),
    { label: "Over 90 days", n: medicines.filter((m) => daysUntil(m.expiryDate) > 90).length },
  ];

  const exportCsv = () => {
    const csv = toCsv(medicines.map((m) => ({ ...m, status: statusesOf(m, settings.expiryWarningDays).join("|") })));
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `medistock-inventory-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Reports" description="Inventory summary and expiry report." action={<Button onClick={exportCsv} disabled={loading || !medicines.length}><Download className="h-4 w-4" />Export CSV</Button>} />
      {loading ? <LoadingRows rows={6} /> : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total stock units" value={medicines.reduce((s, m) => s + m.quantity, 0).toLocaleString()} icon={<Boxes className="h-5 w-5" />} />
            <StatCard label="Low-stock items" value={medicines.filter(isLowStock).length} icon={<PackageMinus className="h-5 w-5" />} tone="destructive" />
            <StatCard label="Expired batches" value={buckets[0].n} icon={<CalendarX className="h-5 w-5" />} tone="warning" />
          </div>
          <Panel title="Inventory summary by category">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader><TableRow className="bg-muted/50"><TableHead>Category</TableHead><TableHead className="text-right">Batches</TableHead><TableHead className="text-right">Units</TableHead><TableHead className="text-right">Low stock</TableHead><TableHead className="text-right">Expiring/expired</TableHead></TableRow></TableHeader>
                <TableBody>
                  {byCat.map((r) => (
                    <TableRow key={r.cat}><TableCell className="font-medium">{r.cat}</TableCell><TableCell className="text-right">{r.count}</TableCell><TableCell className="text-right">{r.units}</TableCell><TableCell className="text-right">{r.low}</TableCell><TableCell className="text-right">{r.exp}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
          <Panel title="Expiry report">
            <div className="grid gap-3 sm:grid-cols-5">
              {buckets.map((b) => (
                <div key={b.label} className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">{b.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{b.n}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
