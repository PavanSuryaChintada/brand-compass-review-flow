import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileText, ShieldCheck, Type, Upload, PenLine, Eye, Ban } from "lucide-react";
import { Panel, PageHeader, StatusBadge } from "@/components/brand/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/brand-dna")({
  head: () => ({ meta: [
    { title: "Brand DNA · BrandDNA" },
    { name: "description", content: "Organisation profile, brand data vault and the learned Brand DNA rules." },
    { property: "og:title", content: "Brand DNA · BrandDNA" },
    { property: "og:description", content: "Guidelines, approved claims, colours and typography in one vault." },
  ] }),
  component: BrandDna,
});

const swatches = [
  { name: "Lumen Navy", hex: "#0F172A", cls: "bg-ink" }, { name: "Slate", hex: "#1E293B", cls: "bg-ink-2" },
  { name: "Royal Blue", hex: "#1D4ED8", cls: "bg-primary" }, { name: "Emerald", hex: "#15803D", cls: "bg-success" },
  { name: "Alabaster", hex: "#F8FAFC", cls: "bg-background border" },
];
const docs = [
  { name: "Lumen Brand Guidelines 2026.pdf", meta: "48 pages · v4.2" },
  { name: "Tone of Voice Playbook.pdf", meta: "16 pages · v2.0" },
  { name: "Legal Claims Policy.pdf", meta: "9 pages · Legal" },
];
const claims = [
  { c: "Save up to 23% on heating", proof: "Field Trial Report 2025", s: "Compliant" },
  { c: "Rated 4.7/5 by 12,000+ customers", proof: "Trustpilot export, Oct 2026", s: "Compliant" },
  { c: "#1 rated smart home device", proof: "Which? 2023 (expired)", s: "Needs Evidence" },
];

function BrandDna() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Brand DNA & Organisation" subtitle="The source of truth every check is measured against."
        actions={<Button onClick={() => toast.success("Guideline uploaded", { description: "Brand DNA will re-learn in ~2 minutes." })}><Upload className="h-4 w-4" />Upload guideline</Button>} />

      <Panel className="grid gap-4 p-5 sm:grid-cols-4">
        {[["Company", "Lumen Energy Ltd."], ["Industry", "Smart Home & Energy"], ["Regulatory tier", "Tier 2 · ASA, FTC"], ["Target markets", "UK, EU, US, India"]].map(([k, v]) => (
          <div key={k}><p className="text-xs text-muted-foreground">{k}</p><p className="font-semibold">{v}</p></div>
        ))}
      </Panel>

      <h2 className="mb-3 mt-8 font-semibold">Extracted Brand DNA Profile</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Writing Style & Tone", icon: PenLine, items: ["Authoritative, calm, never hyperbolic", "Plain English, reading grade ≤ 9", "UK spelling for EMEA channels", "Max one exclamation mark per asset"] },
          { t: "Visual Standards", icon: Eye, items: ["Logo safe zone ≥ 1× mark height", "Only 5 approved palette colours", "Plus Jakarta Sans for all headlines", "Contrast ratio ≥ 4.5:1"] },
          { t: "Restricted Claims", icon: Ban, items: ["“Guaranteed” savings", "“100% secure” or absolute safety", "Rankings older than 12 months", "Unnamed regulator approvals"] },
        ].map((c) => (
          <Panel key={c.t} className="p-5">
            <div className="flex items-center gap-2"><c.icon className="h-4 w-4 text-primary" /><h3 className="font-semibold">{c.t}</h3></div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{c.items.map((i) => <li key={i} className="border-l-2 pl-3">{i}</li>)}</ul>
          </Panel>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-semibold">Brand Data Vault</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><h3 className="font-semibold">Guidelines</h3></div>
          <ul className="divide-y">{docs.map((d) => <li key={d.name} className="flex justify-between gap-2 py-2 text-sm"><span className="truncate font-medium">{d.name}</span><span className="shrink-0 text-muted-foreground">{d.meta}</span></li>)}</ul>
        </Panel>
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h3 className="font-semibold">Approved Claims & Proof</h3></div>
          <ul className="divide-y">{claims.map((c) => <li key={c.c} className="flex items-center justify-between gap-2 py-2 text-sm"><div className="min-w-0"><p className="font-medium">{c.c}</p><p className="text-xs text-muted-foreground">{c.proof}</p></div><StatusBadge status={c.s} /></li>)}</ul>
        </Panel>
        <Panel className="p-5">
          <h3 className="mb-3 font-semibold">Colour Swatches</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">{swatches.map((s) => (
            <button key={s.hex} onClick={() => { navigator.clipboard?.writeText(s.hex); toast(`Copied ${s.hex}`); }} className="text-left">
              <div className={`h-12 rounded-md ${s.cls}`} /><p className="mt-1 text-xs font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.hex}</p>
            </button>))}</div>
        </Panel>
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2"><Type className="h-4 w-4 text-primary" /><h3 className="font-semibold">Typography & Logos</h3></div>
          <p className="text-2xl font-bold">Plus Jakarta Sans</p><p className="text-sm text-muted-foreground">Headlines 700 · Body 400 · Min 14px</p>
          <div className="mt-4 flex gap-3">{["Primary", "Mono", "Reversed"].map((l, i) => (
            <div key={l} className={`grid h-14 flex-1 place-items-center rounded-md border text-sm font-bold ${i === 2 ? "bg-ink text-ink-foreground" : "bg-card"}`}>Lumen<span className="sr-only"> {l}</span></div>))}</div>
        </Panel>
      </div>
    </div>
  );
}
