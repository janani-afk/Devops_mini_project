import { Link, useRouterState } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, Boxes, CalendarClock, LayoutDashboard, Menu, PackageMinus, PlusCircle, Settings, Pill } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/services/api";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Medicine Inventory", icon: Boxes },
  { to: "/medicines/new", label: "Add Medicine", icon: PlusCircle },
  { to: "/expiry", label: "Expiry Monitoring", icon: CalendarClock },
  { to: "/low-stock", label: "Low-Stock Monitoring", icon: PackageMinus },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => {
        const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Pill className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none text-sidebar-foreground">MediStock</div>
        <div className="text-[11px] text-sidebar-foreground/60">Inventory & Expiry</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 bg-sidebar p-4 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-foreground/70">
          {isDemoMode ? "Demo mode: sample data, changes reset on reload." : "Connected to backend API."}
        </div>
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-none bg-sidebar p-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="mb-6"><Brand /></div>
          <NavList onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-display font-bold">MediStock</span>
        </header>
        {isDemoMode && (
          <div className="flex items-center gap-2 border-b bg-warning/10 px-4 py-2 text-xs text-foreground lg:px-8">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            Showing sample data. Changes are kept only for this session until the Spring Boot backend is connected.
          </div>
        )}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
