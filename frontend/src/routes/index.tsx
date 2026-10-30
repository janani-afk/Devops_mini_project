import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Boxes, CalendarClock, Package, PackageMinus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingRows, Panel, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/lib/inventory-store";
import { isExpired, isLowStock, isNearExpiry } from "@/lib/status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — MediStock" },
      { name: "description", content: "Overview of medicine stock, expiry alerts and low-stock items for your pharmacy." },
      { property: "og:title", content: "MediStock Dashboard" },
      { property: "og:description", content: "Smart medicine inventory and expiry monitoring for pharmacies and clinics." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { medicines, activity, loading, error, reload, settings } = useInventory();
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const near = medicines.filter((m) => isNearExpiry(m, settings.expiryWarningDays));
  const expired = medicines.filter((m) => isExpired(m));
  const low = medicines.filter(isLowStock);
  const units = medicines.reduce((s, m) => s + m.quantity, 0);

  const byCat = Object.entries(medicines.reduce<Record<string, number>>((a, m) => ((a[m.category] = (a[m.category] ?? 0) + m.quantity), a), {}))
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);
  const healthy = medicines.length - near.length - expired.length;
  const pie = [
    { name: "Healthy", value: healthy, color: "var(--success)", cls: "fill-success" },
    { name: `Expiring ≤${settings.expiryWarningDays}d`, value: near.length, color: "var(--warning)", cls: "fill-warning" },
    { name: "Expired", value: expired.length, color: "var(--destructive)", cls: "fill-destructive" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Today's snapshot of your medicine inventory."
        action={<Button asChild><Link to="/medicines/new">Add medicine</Link></Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total medicines" value={loading ? "—" : medicines.length} icon={<Boxes className="h-5 w-5" />} hint="Distinct batches" />
        <StatCard label="Total stock units" value={loading ? "—" : units.toLocaleString()} icon={<Package className="h-5 w-5" />} tone="info" />
        <StatCard label="Nearing expiry" value={loading ? "—" : near.length} icon={<CalendarClock className="h-5 w-5" />} tone="warning" hint={`Within ${settings.expiryWarningDays} days · ${expired.length} expired`} />
        <StatCard label="Low stock" value={loading ? "—" : low.length} icon={<PackageMinus className="h-5 w-5" />} tone="destructive" hint="At or below minimum" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Stock units by category" className="xl:col-span-2">
          {loading ? <LoadingRows /> : byCat.length === 0 ? <EmptyState title="No stock yet" /> : (
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={byCat} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="qty" name="Units" className="fill-primary" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
        <Panel title="Expiry summary">
          {loading ? <LoadingRows rows={3} /> : (
            <>
              <div className="h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie isAnimationActive={false} data={pie} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {pie.map((p) => <Cell key={p.name} style={{ fill: p.color }} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm">
                {pie.map((p) => (
                  <li key={p.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />{p.name}</span>
                    <span className="font-medium tabular-nums">{p.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Recent inventory activity">
          {loading ? <LoadingRows rows={4} /> : activity.length === 0 ? <EmptyState title="No activity yet" /> : (
            <ul className="divide-y">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{a.medicineName}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.type === "added" ? "bg-success/10 text-success" : a.type === "updated" ? "bg-info/10 text-info" : "bg-destructive/10 text-destructive"}`}>{a.type}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(a.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Needs attention" action={<Link to="/expiry" className="text-sm font-medium text-primary hover:underline">View all</Link>}>
          {loading ? <LoadingRows rows={4} /> : [...expired, ...near, ...low].length === 0 ? <EmptyState title="All clear" description="No expiring or low-stock medicines." /> : (
            <ul className="divide-y">
              {[...new Set([...expired, ...near, ...low])].slice(0, 6).map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />{m.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {isExpired(m) ? "Expired" : isNearExpiry(m, settings.expiryWarningDays) ? "Expiring soon" : ""}
                    {isLowStock(m) ? `${isExpired(m) || isNearExpiry(m, settings.expiryWarningDays) ? " · " : ""}${m.quantity} left` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
