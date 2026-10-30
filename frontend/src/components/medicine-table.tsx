import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/lib/inventory-store";
import { daysUntil, statusesOf } from "@/lib/status";
import type { Medicine } from "@/lib/types";
import { fmtDate, StatusBadge } from "./common";

export function MedicineTable({ items, actions = true, showDays = false }: { items: Medicine[]; actions?: boolean; showDays?: boolean }) {
  const { settings, remove } = useInventory();
  const [toDelete, setToDelete] = useState<Medicine | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Medicine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Expiry</TableHead>
              {showDays && <TableHead className="text-right">Days left</TableHead>}
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              {actions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => {
              const d = daysUntil(m.expiryDate);
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.category}</TableCell>
                  <TableCell className="font-mono text-xs">{m.batchNumber}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.quantity}
                    <span className="text-xs text-muted-foreground"> / min {m.minStock}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{fmtDate(m.expiryDate)}</TableCell>
                  {showDays && <TableCell className={`text-right tabular-nums ${d < 0 ? "text-destructive" : ""}`}>{d < 0 ? `${-d} ago` : d}</TableCell>}
                  <TableCell className="text-muted-foreground">{m.supplier}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {statusesOf(m, settings.expiryWarningDays).map((s) => <StatusBadge key={s} status={s} />)}
                    </div>
                  </TableCell>
                  {actions && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label={`Edit ${m.name}`}>
                          <Link to="/medicines/$id/edit" params={{ id: m.id }}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${m.name}`} onClick={() => setToDelete(m)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Batch {toDelete?.batchNumber} will be removed from the inventory list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async (e) => {
                e.preventDefault();
                if (!toDelete) return;
                setBusy(true);
                try {
                  await remove(toDelete.id);
                  toast.success(`${toDelete.name} removed`);
                  setToDelete(null);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Delete failed");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
