import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/lib/inventory-store";
import { isDemoMode } from "@/services/api";
import { CATEGORIES, type Medicine } from "@/lib/types";
import { medicineSchema, type MedicineFormValues } from "@/lib/validation";

export function MedicineForm({ initial }: { initial?: Medicine }) {
  const { create, update, settings } = useInventory();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: initial ?? { name: "", batchNumber: "", supplier: "", quantity: 0, minStock: settings.defaultMinStock, manufacturingDate: "", expiryDate: "" } as Partial<MedicineFormValues> as MedicineFormValues,
  });

  const onSubmit = async (v: MedicineFormValues) => {
    setSubmitError(null);
    try {
      if (initial) await update(initial.id, v);
      else await create(v);
      toast.success(initial ? "Medicine updated" : "Medicine added", {
        description: isDemoMode ? "Kept for this session only (demo mode)." : undefined,
      });
      navigate({ to: "/inventory" });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const field = (id: keyof MedicineFormValues, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label} <span className="text-destructive">*</span></Label>
      <Input id={id} aria-invalid={!!errors[id]} {...props} {...register(id)} />
      {errors[id] && <p className="text-xs text-destructive">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-xl border bg-card p-6 shadow-card">
      <div className="grid gap-5 md:grid-cols-2">
        {field("name", "Medicine name", { placeholder: "e.g. Paracetamol 500mg" })}
        <div className="space-y-1.5">
          <Label>Category <span className="text-destructive">*</span></Label>
          <Select value={watch("category")} onValueChange={(v) => setValue("category", v as MedicineFormValues["category"], { shouldValidate: true })}>
            <SelectTrigger aria-invalid={!!errors.category}><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
        {field("batchNumber", "Batch number", { placeholder: "e.g. PCM-2401" })}
        {field("supplier", "Supplier", { placeholder: "e.g. MedLife Distributors" })}
        {field("quantity", "Quantity", { type: "number", min: 0 })}
        {field("minStock", "Minimum stock threshold", { type: "number", min: 0 })}
        {field("manufacturingDate", "Manufacturing date", { type: "date" })}
        {field("expiryDate", "Expiry date", { type: "date" })}
      </div>
      {submitError && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{submitError}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/inventory" })}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : initial ? "Save changes" : "Add medicine"}</Button>
      </div>
    </form>
  );
}
