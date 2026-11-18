import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GitCommit, CheckCircle2, Sliders, BookOpen } from "lucide-react";
import { Panel, PageHeader, scoreColor } from "@/components/brand/ui";
import { useBrand } from "@/lib/brand-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [
    { title: "Version History & Learning Loop · BrandDNA" },
    { name: "description", content: "Track asset revisions and see how reviewer feedback updates your Brand DNA rules." },
    { property: "og:title", content: "Version History & Learning Loop · BrandDNA" },
    { property: "og:description", content: "Content Time Machine and continuous learning audit log." },
  ] }),
  component: HistoryPage,
});

const versions = [
  { v: "v1.0", date: "Nov 02", author: "Priya Nair", score: 61, removed: "Lumen guarantees 50% savings and is the world's best thermostat.", added: "", note: "Initial draft flagged: 2 violations" },
  { v: "v1.1", date: "Nov 05", author: "Priya Nair", score: 78, removed: "the world's best thermostat", added: "a smart thermostat engineered for efficiency", note: "Tone fix applied; claim still unverified" },
  { v: "v2.0", date: "Nov 09", author: "Sarah Chen", score: 96, removed: "guarantees 50% savings", added: "helps save up to 23% on heating, based on 2025 field trials", note: "Claim linked to proof · Final Approved" },
];
const icon = { approval: CheckCircle2, override: Sliders, rule: BookOpen };

function HistoryPage() {
  const { log } = useBrand();
  const [sel, setSel] = useState(2);
  const v = versions[sel] ?? versions[0]!;
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Version History & Learning Loop" subtitle="Every revision is tracked so the same mistake is never approved twice." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="font-semibold">Content Time Machine</h2>
          <p className="text-sm text-muted-foreground">Winter Launch — Search Ad</p>
          <div className="mt-4 flex gap-2">
            {versions.map((x, i) => (
              <button key={x.v} onClick={() => setSel(i)} className={cn("flex-1 rounded-md border px-3 py-2 text-left text-sm", i === sel ? "border-primary bg-info-soft" : "hover:bg-background")}>
                <p className="font-semibold">{x.v}</p><p className={cn("text-xs font-semibold", scoreColor(x.score))}>{x.score}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm"><GitCommit className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{v.v}</span><span className="text-muted-foreground">· {v.date} · {v.author}</span></div>
          <p className="mt-1 text-sm text-muted-foreground">{v.note}</p>
          <div className="mt-3 space-y-2 font-mono text-sm">
            <p className="rounded-md bg-danger-soft px-3 py-2 text-danger">− {v.removed}</p>
            {v.added && <p className="rounded-md bg-success-soft px-3 py-2 text-success">+ {v.added}</p>}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="font-semibold">Continuous Learning Loop</h2>
          <p className="text-sm text-muted-foreground">How reviewer decisions reshape future checks</p>
          <ol className="mt-4 space-y-4">
            {log.map((l) => { const I = icon[l.kind]; return (
              <li key={l.id} className="flex gap-3">
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", l.kind === "approval" ? "bg-success-soft text-success" : l.kind === "rule" ? "bg-info-soft text-primary" : "bg-warning-soft text-warning")}><I className="h-4 w-4" /></span>
                <div className="min-w-0"><p className="text-sm"><span className="font-semibold">{l.action}</span> <span className="text-muted-foreground">· {l.actor}</span></p>
                  <p className="text-sm text-muted-foreground">{l.rule}</p><p className="text-xs text-muted-foreground">{l.when}</p></div>
              </li>); })}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
