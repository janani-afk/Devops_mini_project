import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingRows } from "@/components/common";
import { MedicineTable } from "@/components/medicine-table";
import { useInventory } from "@/lib/inventory-store";
import { isLowStock } from "@/lib/status";

export const Route = createFileRoute("/low-stock")({
  head: () => ({
    meta: [
      { title: "Low-Stock Monitoring — MediStock" },
      { name: "description", content: "Medicines automatically flagged at or below their minimum stock threshold." },
      { property: "og:title", content: "Low-Stock Monitoring — MediStock" },
      { property: "og:description", content: "Know which medicines need reordering." },
    ],
  }),
  component: LowStock,
});

function LowStock() {
  const { medicines, loading, error, reload } = useInventory();
  const low = medicines.filter(isLowStock).sort((a, b) => a.quantity / (a.minStock || 1) - b.quantity / (b.minStock || 1));
  return (
    <div>
      <PageHeader title="Low-Stock Monitoring" description="Flagged automatically when quantity is at or below the minimum threshold." />
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? <LoadingRows /> : low.length ? <MedicineTable items={low} /> : <EmptyState title="All medicines are sufficiently stocked" />}
    </div>
  );
}
