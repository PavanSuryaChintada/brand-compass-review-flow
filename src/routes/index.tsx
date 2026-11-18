import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Upload, Dna, Layers, FileWarning, UserCheck, Rocket, ArrowRight, Check, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { useBrand } from "@/lib/brand-store";
import { Panel, PageHeader, StatusBadge, scoreColor } from "@/components/brand/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Executive Dashboard · BrandDNA" },
    { name: "description", content: "Brand consistency, verified claims and open compliance issues at a glance." },
    { property: "og:title", content: "Executive Dashboard · BrandDNA" },
    { property: "og:description", content: "Brand consistency, verified claims and open compliance issues at a glance." },
  ] }),
  component: Dashboard,
});

const weekly = [{ w: "W1", v: 38 }, { w: "W2", v: 52 }, { w: "W3", v: 47 }, { w: "W4", v: 61 }, { w: "W5", v: 49 }];
const steps = [
  { label: "Upload", icon: Upload, count: 4 }, { label: "Brand DNA Analysis", icon: Dna, count: 3 },
  { label: "Multi-Layer Verification", icon: Layers, count: 5 }, { label: "Issue Report", icon: FileWarning, count: 2 },
  { label: "Human Review", icon: UserCheck, count: 3 }, { label: "Publish & Learn", icon: Rocket, count: 18 },
];

function Ring({ value }: { value: number }) {
  const r = 30, c = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0 -rotate-90">
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--border)" strokeWidth="7" />
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--success)" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}

function Dashboard() {
  const { assets, reviews } = useBrand();
  const navigate = useNavigate();
  const pending = reviews.filter((r) => r.status === "Pending").length;
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Brand Monitoring Dashboard" subtitle="Lumen Energy · Last 30 days"
        actions={<Button asChild><Link to="/analyze">Check new content <ArrowRight className="h-4 w-4" /></Link></Button>} />

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="flex items-center gap-5 p-5">
          <Ring value={92} />
          <div><p className="text-sm text-muted-foreground">Brand Consistency Score</p>
            <p className="text-3xl font-bold">92%</p>
            <p className="flex items-center gap-1 text-xs font-semibold text-success"><TrendingUp className="h-3.5 w-3.5" />+4.2% vs last month</p></div>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm text-muted-foreground">Claims Verified</p>
          <div className="flex items-end justify-between gap-4">
            <p className="text-3xl font-bold">247</p>
            <div className="h-14 w-36"><ResponsiveContainer><BarChart data={weekly}><XAxis dataKey="w" hide /><Bar dataKey="v" fill="var(--primary)" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <p className="text-xs text-muted-foreground">Weekly verification volume</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm text-muted-foreground">Issues Found</p>
          <p className="text-3xl font-bold">12</p>
          <div className="mt-2 flex gap-2"><span className="rounded-full bg-danger-soft px-2.5 py-0.5 text-xs font-semibold text-danger">3 High Risk</span>
            <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">9 Needs Evidence</span></div>
        </Panel>
      </div>

      <Panel className="mt-6 p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Governance Pipeline</h2><span className="text-xs text-muted-foreground">Live · {pending} awaiting review</span></div>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {steps.map((s, i) => (
            <li key={s.label} className="relative rounded-md border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${i < 5 ? "bg-primary text-primary-foreground" : "bg-success text-primary-foreground"}`}>{i === 5 ? <Check className="h-4 w-4" /> : i + 1}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium leading-tight">{s.label}</p>
              <p className="text-xs text-muted-foreground">{i === 4 ? pending : s.count} assets</p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel className="mt-6 overflow-hidden">
        <div className="border-b p-5"><h2 className="font-semibold">Recent Content Analysis</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-background text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-5 py-3 font-semibold">Asset</th><th className="px-5 py-3 font-semibold">Campaign / Channel</th><th className="px-5 py-3 font-semibold">Score</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Updated</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} onClick={() => navigate({ to: "/analyze" })} className="cursor-pointer border-t hover:bg-background">
                  <td className="px-5 py-3"><p className="font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.type}</p></td>
                  <td className="px-5 py-3 text-muted-foreground">{a.channel}</td>
                  <td className={`px-5 py-3 font-semibold ${scoreColor(a.score)}`}>{a.score}</td>
                  <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{a.updated}</td>
                  <td className="px-5 py-3 text-right"><span className="font-medium text-primary">Inspect Report →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
