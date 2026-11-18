import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ScanSearch, UserCheck, Dna, History, Menu, Bell, Search, X, Fingerprint } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBrand } from "@/lib/brand-store";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Check Content", icon: ScanSearch },
  { to: "/reviews", label: "Human Review", icon: UserCheck },
  { to: "/brand-dna", label: "Brand DNA", icon: Dna },
  { to: "/history", label: "History & Learning", icon: History },
] as const;

function SidebarBody({ onNav }: { onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { reviews } = useBrand();
  const pending = reviews.filter((r) => r.status === "Pending").length;
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <Fingerprint className="h-6 w-6 text-ink-foreground" />
        <span className="text-lg font-bold text-ink-foreground">BrandDNA</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((n) => {
          const active = path === n.to;
          return (
            <Link key={n.to} to={n.to} onClick={onNav}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
              <n.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{n.label}</span>
              {n.to === "/reviews" && pending > 0 && <span className="rounded-full bg-ink-2 px-2 text-xs text-ink-foreground">{pending}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 text-xs text-ink-muted">
        <p className="font-semibold text-ink-foreground">Lumen Energy Ltd.</p>
        <p>Regulated · Tier 2</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 lg:block"><SidebarBody /></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-64"><SidebarBody onNav={() => setOpen(false)} />
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-5 text-ink-foreground"><X className="h-5 w-5" /></button>
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 sm:px-8">
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground sm:flex">
            <Search className="h-4 w-4" /> Search assets, claims, rules…
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-semibold text-ink-foreground">SC</div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
