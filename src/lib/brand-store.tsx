import { createContext, useContext, useState, type ReactNode } from "react";

export type Status = "Compliant" | "Needs Evidence" | "Brand Aligned" | "Tracked" | "High Risk" | "In Review" | "Final Approved" | "Changes Requested";
export type AssetType = "Logo & Visuals" | "Product Claim" | "Tone & Messaging" | "Version Change";

export interface Asset {
  id: string; name: string; type: AssetType; channel: string; score: number; status: Status; updated: string;
}
export interface Review {
  id: string; name: string; channel: string; submittedBy: string; score: number;
  original: string; corrected: string; status: "Pending" | "Approved" | "Changes Requested"; comment?: string | undefined;
}
export interface LearningEntry { id: string; when: string; actor: string; action: string; rule: string; kind: "approval" | "override" | "rule" }

const initialAssets: Asset[] = [
  { id: "a1", name: "Q4 Hero Banner — Logo Lockup", type: "Logo & Visuals", channel: "Winter Launch · Display", score: 96, status: "Compliant", updated: "12 min ago" },
  { id: "a2", name: "“Reduces energy use by 40%” claim", type: "Product Claim", channel: "Website · Product page", score: 71, status: "Needs Evidence", updated: "38 min ago" },
  { id: "a3", name: "Holiday Email — Subject & Body", type: "Tone & Messaging", channel: "Lifecycle · Email", score: 94, status: "Brand Aligned", updated: "1 hr ago" },
  { id: "a4", name: "Press Release v2.0", type: "Version Change", channel: "Corporate · PR Wire", score: 89, status: "Tracked", updated: "3 hr ago" },
  { id: "a5", name: "“#1 rated thermostat” LinkedIn ad", type: "Product Claim", channel: "Paid Social · LinkedIn", score: 52, status: "High Risk", updated: "5 hr ago" },
  { id: "a6", name: "Partner Co-brand Deck", type: "Logo & Visuals", channel: "Partnerships · Sales", score: 91, status: "Compliant", updated: "Yesterday" },
];

const initialReviews: Review[] = [
  { id: "r1", name: "Spring Ad Copy — Search", channel: "Paid Search", submittedBy: "Priya Nair", score: 93,
    original: "Our revolutionary thermostat is the best in the world and guarantees 50% savings on every bill. Totally color-matched to any home!",
    corrected: "Our smart thermostat helps households reduce heating costs by up to 23%, based on 2025 independent field trials. Designed to complement any home's colour palette.",
    status: "Pending" },
  { id: "r2", name: "Product Landing Page — Hero", channel: "Website", submittedBy: "Marcus Lee", score: 88,
    original: "Never worry again. Lumen is 100% secure and approved by every major regulator.",
    corrected: "Lumen is built with bank-grade encryption and is certified to ISO 27001. See our security overview for details.",
    status: "Pending" },
  { id: "r3", name: "Webinar Invitation Email", channel: "Lifecycle Email", submittedBy: "Aisha Khan", score: 97,
    original: "Join us for an amazing, unmissable webinar!!!",
    corrected: "Join our product team for a 30-minute walkthrough of the new energy dashboard.",
    status: "Pending" },
];

const initialLog: LearningEntry[] = [
  { id: "l1", when: "Today, 09:42", actor: "Sarah Chen · Brand Lead", action: "Approved override", rule: "Allowed “up to 23%” savings phrasing when linked to Field Trial Report 2025.", kind: "override" },
  { id: "l2", when: "Yesterday, 17:10", actor: "Legal · D. Okafor", action: "New restricted claim", rule: "Block “guaranteed” in any savings or financial context.", kind: "rule" },
  { id: "l3", when: "Yesterday, 11:03", actor: "Marcus Lee · Reviewer", action: "Approved asset", rule: "Reinforced: UK spelling (“colour”, “organisation”) for EMEA channels.", kind: "approval" },
  { id: "l4", when: "Nov 14, 15:21", actor: "Sarah Chen · Brand Lead", action: "Rule refined", rule: "Logo safe zone tightened to 1× mark height on social formats.", kind: "rule" },
];

interface Ctx {
  assets: Asset[]; reviews: Review[]; log: LearningEntry[];
  addAsset: (a: Asset) => void;
  submitReview: (r: Review) => void;
  decideReview: (id: string, decision: "Approved" | "Changes Requested", comment?: string | undefined) => void;
}
const BrandCtx = createContext<Ctx | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState(initialAssets);
  const [reviews, setReviews] = useState(initialReviews);
  const [log, setLog] = useState(initialLog);
  const value: Ctx = {
    assets, reviews, log,
    addAsset: (a) => setAssets((p) => [a, ...p]),
    submitReview: (r) => setReviews((p) => [r, ...p]),
    decideReview: (id, decision, comment) => {
      const r = reviews.find((x) => x.id === id);
      setReviews((p) => p.map((x) => (x.id === id ? { ...x, status: decision, comment } : x)));
      if (!r) return;
      setAssets((p) => [{ id: `a-${id}-${Date.now()}`, name: r.name, type: "Tone & Messaging", channel: r.channel, score: r.score,
        status: decision === "Approved" ? "Final Approved" : "Changes Requested", updated: "Just now" }, ...p]);
      setLog((p) => [{ id: `l${Date.now()}`, when: "Just now", actor: "You · Brand Manager",
        action: decision === "Approved" ? "Approved asset" : "Requested changes",
        rule: decision === "Approved" ? `Learned from “${r.name}”: corrected phrasing added to approved patterns.` : `Feedback logged: ${comment || "Reviewer requested revisions."}`,
        kind: decision === "Approved" ? "approval" : "override" }, ...p]);
    },
  };
  return <BrandCtx.Provider value={value}>{children}</BrandCtx.Provider>;
}

export function useBrand() {
  const c = useContext(BrandCtx);
  if (!c) throw new Error("useBrand outside provider");
  return c;
}
