import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, FileText, Image as ImageIcon, Megaphone, Newspaper, PenLine, ShieldCheck, Eye, Languages, AlertTriangle, Accessibility, Wand2, Check, Send } from "lucide-react";
import { Panel, PageHeader, StatusBadge, scoreColor } from "@/components/brand/ui";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/lib/brand-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({ meta: [
    { title: "Check Content · BrandDNA" },
    { name: "description", content: "Run marketing assets through six layers of brand, claim, risk and accessibility checks." },
    { property: "og:title", content: "Check Content · BrandDNA" },
    { property: "og:description", content: "Six-layer AI analysis with one-click brand-aligned fixes." },
  ] }),
  component: Analyze,
});

type LayerKey = "tone" | "claim" | "visual" | "language" | "risk" | "a11y";
interface Issue { id: string; layer: LayerKey; severity: "Violation" | "Warning"; snippet: string; why: string; fix: string; inText: boolean }
interface Sample { id: string; label: string; icon: typeof FileText; kind: string; text: string; issues: Issue[] }

const layers: { key: LayerKey; label: string; icon: typeof FileText }[] = [
  { key: "tone", label: "Content & Tone", icon: PenLine }, { key: "claim", label: "Claim Verification", icon: ShieldCheck },
  { key: "visual", label: "Visual Checking", icon: Eye }, { key: "language", label: "Language Checking", icon: Languages },
  { key: "risk", label: "Risk Detection", icon: AlertTriangle }, { key: "a11y", label: "Accessibility", icon: Accessibility },
];

const samples: Sample[] = [
  { id: "ad", label: "Ad Copy", icon: Megaphone, kind: "Paid Social · LinkedIn",
    text: "Lumen is the best thermostat in the world!!! It guarantees 50% savings on every bill and is approved by all regulators. Choose the color that fits your home.",
    issues: [
      { id: "i1", layer: "tone", severity: "Warning", snippet: "the best thermostat in the world!!!", why: "Hyperbolic and exclamatory; Brand DNA voice is authoritative and calm.", fix: "a smart thermostat engineered for efficiency.", inText: true },
      { id: "i2", layer: "claim", severity: "Violation", snippet: "guarantees 50% savings on every bill", why: "No approved evidence. Closest proof: Field Trial Report 2025 supports “up to 23%”.", fix: "helps households save up to 23% on heating, based on 2025 field trials", inText: true },
      { id: "i3", layer: "risk", severity: "Violation", snippet: "approved by all regulators", why: "Unsubstantiated regulatory claim — legal exposure under ASA/FTC rules.", fix: "certified to UKCA and CE standards", inText: true },
      { id: "i4", layer: "language", severity: "Warning", snippet: "color", why: "EMEA channel requires UK spelling.", fix: "colour", inText: true },
    ] },
  { id: "landing", label: "Landing Page Text", icon: FileText, kind: "Website · Product page",
    text: "Meet Lumen Hub. Utilizing cutting-edge synergies, it delivers unparalleled, revolutionary home intelligence for the modern family. 100% secure.",
    issues: [
      { id: "j1", layer: "tone", severity: "Warning", snippet: "Utilizing cutting-edge synergies, it delivers unparalleled, revolutionary home intelligence", why: "Jargon-heavy; violates “clear, plain language” attribute.", fix: "It brings your heating, lighting and energy data together in one simple app", inText: true },
      { id: "j2", layer: "risk", severity: "Violation", snippet: "100% secure.", why: "Absolute security claims are restricted by Legal.", fix: "Protected with bank-grade encryption and ISO 27001 certification.", inText: true },
      { id: "j3", layer: "a11y", severity: "Warning", snippet: "Reading grade 14.2", why: "Target is grade 9 or lower for consumer pages.", fix: "Simplified sentences", inText: false },
    ] },
  { id: "banner", label: "Campaign Banner", icon: ImageIcon, kind: "Winter Launch · Display",
    text: "Stay warm for less this winter. Lumen — smarter heating.",
    issues: [
      { id: "k1", layer: "visual", severity: "Violation", snippet: "Logo safe zone 0.4× (min 1×)", why: "Logo crowded by headline; breaks Visual Brand Fingerprint.", fix: "Resize headline to restore 1× safe zone", inText: false },
      { id: "k2", layer: "visual", severity: "Warning", snippet: "Background #2563EB not in palette", why: "Closest approved swatch is Lumen Navy #0F172A.", fix: "Swap to #0F172A", inText: false },
      { id: "k3", layer: "a11y", severity: "Warning", snippet: "Missing alt text", why: "All display assets require descriptive alt text.", fix: "Add alt: “Lumen thermostat on a living-room wall”", inText: false },
    ] },
  { id: "pr", label: "Press Release", icon: Newspaper, kind: "Corporate · PR Wire",
    text: "Lumen Energy today announced Hub 2, which is now the #1 rated smart home device. The organization will expand to 12 markets.",
    issues: [
      { id: "m1", layer: "claim", severity: "Violation", snippet: "now the #1 rated smart home device", why: "Ranking source expired (Which? 2023). Claim is outdated.", fix: "rated 4.7/5 by over 12,000 verified customers", inText: true },
      { id: "m2", layer: "language", severity: "Warning", snippet: "organization", why: "House style uses UK spelling “organisation”.", fix: "organisation", inText: true },
    ] },
];

function Analyze() {
  const { submitReview, addAsset } = useBrand();
  const [sampleId, setSampleId] = useState("ad");
  const sample = samples.find((s) => s.id === sampleId)!;
  const [text, setText] = useState(sample.text);
  const [fixed, setFixed] = useState<string[]>([]);
  const [layer, setLayer] = useState<LayerKey | "all">("all");
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pick = (id: string) => {
    const s = samples.find((x) => x.id === id)!;
    setSampleId(id); setText(s.text); setFixed([]); setLayer("all");
    setAnalyzing(true); setTimeout(() => setAnalyzing(false), 700);
  };
  const open = sample.issues.filter((i) => !fixed.includes(i.id));
  const score = useMemo(() => {
    const penalty = open.reduce((n, i) => n + (i.severity === "Violation" ? 14 : 6), 0);
    return Math.max(30, 98 - penalty);
  }, [open]);

  const apply = (i: Issue) => {
    if (i.inText) setText((t) => t.replace(i.snippet, i.fix));
    setFixed((f) => [...f, i.id]);
    toast.success("Brand-aligned fix applied", { description: `Compliance score recalculated.` });
  };
  const applyAll = () => { open.forEach((i) => i.inText && setText((t) => t.replace(i.snippet, i.fix))); setFixed(sample.issues.map((i) => i.id)); toast.success("All fixes applied"); };
  const submit = () => {
    const id = `r${Date.now()}`;
    submitReview({ id, name: `${sample.label} — ${sample.kind.split(" · ")[0]}`, channel: sample.kind, submittedBy: "You", score, original: sample.text, corrected: text, status: "Pending" });
    addAsset({ id: `a${id}`, name: `${sample.label} — ${sample.kind.split(" · ")[0]}`, type: sample.id === "banner" ? "Logo & Visuals" : "Tone & Messaging", channel: sample.kind, score, status: "In Review", updated: "Just now" });
    toast.success("Sent to Human Review", { description: "A brand manager will approve or request changes." });
  };

  const shown = layer === "all" ? sample.issues : sample.issues.filter((i) => i.layer === layer);
  const highlighted = useMemo(() => {
    let parts: (string | { t: string; sev: string })[] = [text];
    open.filter((i) => i.inText).forEach((i) => {
      parts = parts.flatMap((p) => typeof p !== "string" || !p.includes(i.snippet) ? [p] : p.split(i.snippet).flatMap((seg, k, arr) => k < arr.length - 1 ? [seg, { t: i.snippet, sev: i.severity }] : [seg]));
    });
    return parts;
  }, [text, open]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Check Content" subtitle="Upload an asset or choose a sample to run the 6-layer Brand DNA analysis." />

      <Panel className="mb-6 p-5">
        <button onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed bg-background py-6 text-sm text-muted-foreground hover:border-primary">
          <UploadCloud className="h-6 w-6 text-primary" />
          <span><span className="font-semibold text-primary">Click to upload</span> ad copy, landing pages, banners or press releases</span>
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { toast.info(`“${f.name}” uploaded`, { description: "Running analysis using closest matching template." }); pick("landing"); } }} />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {samples.map((s) => (
            <button key={s.id} onClick={() => pick(s.id)} className={cn("flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm font-medium", s.id === sampleId ? "border-primary bg-info-soft text-primary" : "hover:bg-background")}>
              <s.icon className="h-4 w-4 shrink-0" /><span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Asset Preview</h2><span className="truncate text-xs text-muted-foreground">{sample.kind}</span></div>
          {sample.id === "banner" && (
            <div className={cn("mt-4 grid aspect-[16/7] place-items-center rounded-md p-4 text-center", fixed.includes("k2") ? "bg-ink" : "bg-primary")}>
              <p className="text-lg font-bold text-primary-foreground">{text}</p>
            </div>
          )}
          <p className="mt-4 rounded-md border bg-background p-4 text-[15px] leading-7">
            {highlighted.map((p, k) => typeof p === "string" ? <span key={k}>{p}</span> :
              <mark key={k} className={cn("rounded px-0.5", p.sev === "Violation" ? "bg-danger-soft text-danger" : "bg-warning-soft text-warning")}>{p.t}</mark>)}
          </p>
          <div className="mt-5 flex items-center justify-between rounded-md border p-4">
            <div><p className="text-xs text-muted-foreground">Compliance Score</p><p className={cn("text-3xl font-bold", scoreColor(score))}>{analyzing ? "…" : score}</p></div>
            <StatusBadge status={score >= 85 ? "Compliant" : score >= 65 ? "Needs Evidence" : "High Risk"} />
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={applyAll} disabled={!open.length}><Wand2 className="h-4 w-4" />Fix all</Button>
            <Button className="flex-1" onClick={submit}><Send className="h-4 w-4" />Send to review</Button>
          </div>
        </Panel>

        <Panel className="lg:col-span-3">
          <div className="flex gap-1 overflow-x-auto border-b p-2">
            <button onClick={() => setLayer("all")} className={cn("whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium", layer === "all" ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:bg-background")}>All layers</button>
            {layers.map((l) => {
              const n = open.filter((i) => i.layer === l.key).length;
              return (
                <button key={l.key} onClick={() => setLayer(l.key)} className={cn("flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium", layer === l.key ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:bg-background")}>
                  <l.icon className="h-4 w-4" />{l.label}
                  {n > 0 ? <span className="rounded-full bg-danger-soft px-1.5 text-xs text-danger">{n}</span> : <Check className="h-3.5 w-3.5 text-success" />}
                </button>
              );
            })}
          </div>
          <div className="space-y-3 p-5">
            {analyzing ? <p className="py-10 text-center text-sm text-muted-foreground">Analysing against Brand DNA…</p> :
              shown.length === 0 ? (
                <div className="flex items-center gap-3 rounded-md bg-success-soft p-4 text-sm font-medium text-success"><Check className="h-5 w-5" />No issues on this layer. Passes Brand DNA rules.</div>
              ) : shown.map((i) => {
                const done = fixed.includes(i.id);
                const L = layers.find((l) => l.key === i.layer)!;
                return (
                  <div key={i.id} className={cn("rounded-md border p-4", done && "bg-background")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <L.icon className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{L.label}</span>
                      <StatusBadge status={done ? "Pass" : i.severity} />
                    </div>
                    <p className={cn("mt-2 text-sm font-medium", done && "line-through text-muted-foreground")}>“{i.snippet}”</p>
                    <p className="mt-1 text-sm text-muted-foreground">{i.why}</p>
                    <div className="mt-3 flex flex-col gap-2 rounded-md bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm"><span className="font-semibold text-success">Suggested: </span>{i.fix}</p>
                      <Button size="sm" disabled={done} onClick={() => apply(i)} className="shrink-0">{done ? <><Check className="h-4 w-4" />Applied</> : "Apply Brand-Aligned Fix"}</Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
