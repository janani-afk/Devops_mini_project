import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingRows } from "@/components/common";
import { MedicineTable } from "@/components/medicine-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/lib/inventory-store";
import { statusesOf } from "@/lib/status";
import { CATEGORIES } from "@/lib/types";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Medicine Inventory — MediStock" },
      { name: "description", content: "Search, filter, edit and delete medicine records with stock and expiry status." },
      { property: "og:title", content: "Medicine Inventory — MediStock" },
      { property: "og:description", content: "Search and manage every medicine batch in your pharmacy." },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const { medicines, loading, error, reload, settings } = useInventory();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return medicines.filter((m) =>
      (!s || [m.name, m.batchNumber, m.supplier].some((f) => f.toLowerCase().includes(s))) &&
      (cat === "all" || m.category === cat) &&
      (status === "all" || statusesOf(m, settings.expiryWarningDays).includes(status as never)),
    );
  }, [medicines, q, cat, status, settings.expiryWarningDays]);

  return (
    <div>
      <PageHeader title="Medicine Inventory" description={`${medicines.length} medicine batches`} action={<Button asChild><Link to="/medicines/new">Add medicine</Link></Button>} />
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, batch or supplier…" className="pl-9" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ok">In stock</SelectItem>
            <SelectItem value="low-stock">Low stock</SelectItem>
            <SelectItem value="near-expiry">Near expiry</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? <LoadingRows rows={8} /> : items.length === 0 ? (
        <EmptyState title="No medicines found" description={medicines.length ? "Try a different search or filter." : "Add your first medicine to get started."} action={!medicines.length && <Button asChild><Link to="/medicines/new">Add medicine</Link></Button>} />
      ) : <MedicineTable items={items} />}
    </div>
  );
}
