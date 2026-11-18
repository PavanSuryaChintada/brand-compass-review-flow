import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  Compliant: "bg-success-soft text-success", "Brand Aligned": "bg-success-soft text-success", "Final Approved": "bg-success-soft text-success", Approved: "bg-success-soft text-success", Pass: "bg-success-soft text-success",
  "Needs Evidence": "bg-warning-soft text-warning", "Changes Requested": "bg-warning-soft text-warning", Warning: "bg-warning-soft text-warning", Pending: "bg-warning-soft text-warning",
  "High Risk": "bg-danger-soft text-danger", Violation: "bg-danger-soft text-danger",
  Tracked: "bg-info-soft text-primary", "In Review": "bg-info-soft text-primary",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", tone[status] ?? "bg-muted text-muted-foreground")}>{status}</span>;
}
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("min-w-0 rounded-lg border bg-card", className)}>{children}</div>;
}
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}
export function scoreColor(s: number) {
  return s >= 85 ? "text-success" : s >= 65 ? "text-warning" : "text-danger";
}
