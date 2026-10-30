import { AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

const styles: Record<StockStatus, { label: string; cls: string }> = {
  expired: { label: "Expired", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  "near-expiry": { label: "Near expiry", cls: "bg-warning/15 text-warning-foreground border-warning/30" },
  "low-stock": { label: "Low stock", cls: "bg-info/10 text-info border-info/20" },
  ok: { label: "In stock", cls: "bg-success/10 text-success border-success/20" },
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const s = styles[status];
  return <Badge variant="outline" className={cn("font-medium", s.cls)}>{s.label}</Badge>;
}

export function StatCard({ label, value, icon, tone = "primary", hint }: { label: string; value: ReactNode; icon: ReactNode; tone?: "primary" | "warning" | "destructive" | "info"; hint?: string }) {
  const toneCls = { primary: "bg-primary/10 text-primary", warning: "bg-warning/15 text-warning", destructive: "bg-destructive/10 text-destructive", info: "bg-info/10 text-info" }[tone];
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-card-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5", toneCls)}>{icon}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground/60" />
      <p className="mt-3 font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="mt-2 font-medium">Couldn't load inventory</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>Try again</Button>
    </div>
  );
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );
}

export function Panel({ title, children, action, className }: { title: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 shadow-card", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
