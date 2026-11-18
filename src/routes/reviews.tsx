import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { Panel, PageHeader, StatusBadge, scoreColor } from "@/components/brand/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBrand } from "@/lib/brand-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [
    { title: "Human Review · BrandDNA" },
    { name: "description", content: "Reviewer queue to compare original and AI-corrected content and approve for publication." },
    { property: "og:title", content: "Human Review · BrandDNA" },
    { property: "og:description", content: "Approve or request changes on AI-corrected brand content." },
  ] }),
  component: Reviews,
});

function Reviews() {
  const { reviews, decideReview } = useBrand();
  const [sel, setSel] = useState(reviews[0]?.id);
  const [comment, setComment] = useState("");
  const r = reviews.find((x) => x.id === sel) ?? reviews[0];

  const decide = (d: "Approved" | "Changes Requested") => {
    if (d === "Changes Requested" && !comment.trim()) { toast.error("Add a comment for the author first"); return; }
    decideReview(r.id, d, comment.trim());
    setComment("");
    toast.success(d === "Approved" ? "Stamped as Final Approved Content" : "Changes requested", { description: "Feedback logged to the Learning Loop." });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Human Review & Approval" subtitle={`${reviews.filter((x) => x.status === "Pending").length} assets awaiting your decision`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="h-fit divide-y">
          {reviews.map((x) => (
            <button key={x.id} onClick={() => setSel(x.id)} className={cn("block w-full p-4 text-left hover:bg-background", x.id === r?.id && "bg-info-soft")}>
              <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{x.name}</p><StatusBadge status={x.status} /></div>
              <p className="mt-1 text-xs text-muted-foreground">{x.channel} · by {x.submittedBy} · score <span className={cn("font-semibold", scoreColor(x.score))}>{x.score}</span></p>
            </button>
          ))}
        </Panel>

        {r && (
          <Panel className="p-5 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><h2 className="font-semibold">Brand Risk & Compliance Report</h2><p className="text-sm text-muted-foreground">{r.name}</p></div>
              <p className={cn("text-2xl font-bold", scoreColor(r.score))}>{r.score}<span className="text-sm text-muted-foreground">/100</span></p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-md border p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-danger">Original</p><p className="text-sm leading-6">{r.original}</p></div>
              <div className="rounded-md border border-success/30 bg-success-soft/40 p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-success">AI-Corrected</p><p className="text-sm leading-6">{r.corrected}</p></div>
            </div>
            {r.status === "Pending" ? (
              <>
                <Textarea className="mt-5" placeholder="Reviewer comment (required to request changes)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => decide("Changes Requested")}><MessageSquareWarning className="h-4 w-4" />Request Changes</Button>
                  <Button onClick={() => decide("Approved")}><CheckCircle2 className="h-4 w-4" />Approve for Publication</Button>
                </div>
              </>
            ) : (
              <div className={cn("mt-5 rounded-md p-4 text-sm font-medium", r.status === "Approved" ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
                {r.status === "Approved" ? "Final Approved Content — ready for publication." : `Changes requested: ${r.comment}`}
              </div>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}
