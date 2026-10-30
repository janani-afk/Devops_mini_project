import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, LoadingRows } from "@/components/common";
import { MedicineForm } from "@/components/medicine-form";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/lib/inventory-store";

export const Route = createFileRoute("/medicines/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Medicine — MediStock" },
      { name: "description", content: "Update a medicine batch's stock, threshold or dates." },
      { property: "og:title", content: "Edit Medicine — MediStock" },
      { property: "og:description", content: "Update a medicine record in MediStock." },
    ],
  }),
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  const { medicines, loading } = useInventory();
  const m = medicines.find((x) => x.id === id);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit Medicine" description={m ? `${m.name} · ${m.batchNumber}` : undefined} />
      {loading ? <LoadingRows /> : m ? <MedicineForm key={m.id} initial={m} /> : (
        <EmptyState title="Medicine not found" action={<Button asChild variant="outline"><Link to="/inventory">Back to inventory</Link></Button>} />
      )}
    </div>
  );
}
