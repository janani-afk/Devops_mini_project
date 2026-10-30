import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { MedicineForm } from "@/components/medicine-form";

export const Route = createFileRoute("/medicines/new")({
  head: () => ({
    meta: [
      { title: "Add Medicine — MediStock" },
      { name: "description", content: "Register a new medicine batch with quantity, threshold and expiry date." },
      { property: "og:title", content: "Add Medicine — MediStock" },
      { property: "og:description", content: "Register a new medicine batch in MediStock." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add Medicine" description="All fields are required." />
      <MedicineForm />
    </div>
  ),
});
