import { useEffect, useMemo, useState } from "react";
import { Rocket, RefreshCw, Sparkles } from "lucide-react";
import { Button, Card } from "../ui";
import {
  applyInstitutionReviewAndRebuild,
  fetchInstitutionReviewItems,
} from "../../lib/admin";
import type { AdminInstitutionReviewItem } from "../../types/admin";

type ReviewField =
  | "summary"
  | "researchFocus"
  | "representativeProjects"
  | "projectKeywords"
  | "ecosystemRole"
  | "representativeOutputs"
  | "industryCollaborationSignals"
  | "openSourceFootprint"
  | "notablePartners"
  | "proofOfRelevance"
  | "sources";

const reviewFieldOrder: Array<{ field: ReviewField; label: string; kind: "text" | "list" | "sources" }> = [
  { field: "summary", label: "Summary", kind: "text" },
  { field: "researchFocus", label: "Research focus", kind: "text" },
  { field: "representativeProjects", label: "Representative projects", kind: "list" },
  { field: "projectKeywords", label: "Project keywords", kind: "list" },
  { field: "ecosystemRole", label: "Ecosystem role", kind: "list" },
  { field: "representativeOutputs", label: "Representative outputs", kind: "list" },
  { field: "industryCollaborationSignals", label: "Industry collaboration signals", kind: "list" },
  { field: "openSourceFootprint", label: "Open-source footprint", kind: "list" },
  { field: "notablePartners", label: "Notable partners", kind: "list" },
  { field: "proofOfRelevance", label: "Proof of relevance", kind: "list" },
  { field: "sources", label: "Sources", kind: "sources" }
];

export default function InstitutionReviewPanel({ token }: { token: string }) {
  const [items, setItems] = useState<AdminInstitutionReviewItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [draftValues, setDraftValues] = useState<Record<ReviewField, string>>({
    summary: "",
    researchFocus: "",
    representativeProjects: "",
    projectKeywords: "",
    ecosystemRole: "",
    representativeOutputs: "",
    industryCollaborationSignals: "",
    openSourceFootprint: "",
    notablePartners: "",
    proofOfRelevance: "",
    sources: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedItem = useMemo(
    () => items.find((item) => item.slug === selectedSlug) ?? null,
    [items, selectedSlug],
  );

  useEffect(() => {
    if (!token) {
      setItems([]);
      setSelectedSlug(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setMessage("");

    fetchInstitutionReviewItems(token)
      .then((result) => {
        setItems(result.items);
        setStatus("idle");
        if (result.items.length > 0) {
          setSelectedSlug((current) =>
            current && result.items.some((item) => item.slug === current)
              ? current
              : result.items[0].slug,
          );
        }
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to load institution review items.");
      });
  }, [token]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const nextValues = { ...draftValues };
    for (const item of reviewFieldOrder) {
      nextValues[item.field] = toEditableText(item.field, selectedItem);
    }
    setDraftValues(nextValues);
  }, [selectedItem]);

  async function refresh() {
    if (!token) {
      return;
    }

    setStatus("loading");
    try {
      const result = await fetchInstitutionReviewItems(token);
      setItems(result.items);
      setStatus("idle");
      setMessage("Institution review items refreshed.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Refresh failed.");
    }
  }

  async function applySelectedUpdatesAndRebuild() {
    if (!token || !selectedItem) {
      return;
    }

    const updates = buildUpdatesFromDrafts(draftValues);
    setMessage("Applying reviewed updates and rebuilding web...");

    try {
      await applyInstitutionReviewAndRebuild(selectedItem.slug, updates, token);
      setMessage("Institution data applied and web rebuild triggered.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Apply and rebuild failed.");
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-2xl">Institution review queue</h2>
            <p className="text-sm text-gray-600 mt-1">
              Candidate enrichment fields produced by the scraper, ready for review before ingest.
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => void refresh()} disabled={!token}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {message && (
          <div className="mb-4 text-sm border border-border bg-surface-alt px-3 py-2">
            {message}
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => {
            const updateCount = Object.keys(item.previewUpdates).length;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelectedSlug(item.slug)}
                className={`w-full text-left border px-4 py-4 transition-colors ${
                  selectedSlug === item.slug
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="font-medium text-black">{item.labName}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold bg-surface-alt px-2 py-1">
                    {updateCount} preview field{updateCount === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{item.institutionName}</div>
                <div className="mt-2 text-xs text-gray-500">Last updated: {item.current.lastUpdated}</div>
              </button>
            );
          })}

          {items.length === 0 && status !== "loading" && (
            <div className="border border-dashed border-border bg-surface-alt px-4 py-8 text-center text-sm text-gray-600">
              No scrape draft files are available on the current environment yet.
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        {!selectedItem ? (
          <div className="border border-dashed border-border bg-surface-alt px-4 py-8 text-center text-sm text-gray-600">
            Select an institution to compare current values with scraper candidates.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-1">
                  Institution review
                </div>
                <h2 className="font-serif text-3xl text-primary">{selectedItem.labName}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedItem.institutionName}</p>
              </div>
              <Button
                className="gap-2"
                onClick={() => void applySelectedUpdatesAndRebuild()}
                disabled={!token}
              >
                <Rocket className="w-4 h-4" /> Apply and Rebuild Web
              </Button>
            </div>

            <div className="grid gap-4">
              {reviewFieldOrder.map((fieldConfig) => (
                <div key={fieldConfig.field} className="border border-border bg-white">
                  <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <div className="text-sm font-bold text-gray-700">{fieldConfig.label}</div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 p-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                        Current
                      </div>
                      <pre className="min-h-24 whitespace-pre-wrap border border-border bg-surface-alt p-3 text-xs leading-relaxed">
                        {formatCurrentValue(selectedItem, fieldConfig.field)}
                      </pre>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                        Reviewed candidate
                      </div>
                      <textarea
                        rows={fieldConfig.kind === "text" ? 5 : 8}
                        value={draftValues[fieldConfig.field]}
                        onChange={(event) =>
                          setDraftValues((current) => ({
                            ...current,
                            [fieldConfig.field]: event.target.value,
                          }))
                        }
                        className="w-full border border-border bg-white p-3 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-sm font-bold text-gray-700 mb-2">Evidence</div>
              <div className="space-y-4">
                {selectedItem.evidence.map((entry) => (
                  <div key={entry.url} className="border border-border bg-surface-alt p-4">
                    <div className="text-sm font-bold text-black mb-1">{entry.title || entry.url}</div>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {entry.url}
                    </a>
                    {entry.metaDescription && (
                      <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                        {entry.metaDescription}
                      </p>
                    )}
                    {entry.headings.length > 0 && (
                      <div className="mt-3">
                        <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">
                          Headings
                        </div>
                        <div className="text-sm text-gray-700">{entry.headings.join(" | ")}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function toEditableText(field: ReviewField, item: AdminInstitutionReviewItem) {
  const candidate = item.candidates[field];
  if (typeof candidate === "string") {
    return candidate;
  }

  if (field === "sources" && Array.isArray(candidate)) {
    return candidate.map((source) => `${source.label} | ${source.url}`).join("\n");
  }

  if (Array.isArray(candidate)) {
    return candidate.join("\n");
  }

  if (field === "sources") {
    return item.current.sources.map((source) => `${source.label} | ${source.url}`).join("\n");
  }

  const currentValue = item.current[field];
  return Array.isArray(currentValue) ? currentValue.join("\n") : currentValue;
}

function formatCurrentValue(item: AdminInstitutionReviewItem, field: ReviewField) {
  if (field === "sources") {
    return item.current.sources.map((source) => `${source.label} | ${source.url}`).join("\n");
  }

  const value = item.current[field];
  return Array.isArray(value) ? value.join("\n") : value;
}

function buildUpdatesFromDrafts(values: Record<ReviewField, string>) {
  return {
    summary: values.summary.trim(),
    researchFocus: values.researchFocus.trim(),
    representativeProjects: splitLines(values.representativeProjects),
    projectKeywords: splitLines(values.projectKeywords),
    ecosystemRole: splitLines(values.ecosystemRole),
    representativeOutputs: splitLines(values.representativeOutputs),
    industryCollaborationSignals: splitLines(values.industryCollaborationSignals),
    openSourceFootprint: splitLines(values.openSourceFootprint),
    notablePartners: splitLines(values.notablePartners),
    proofOfRelevance: splitLines(values.proofOfRelevance),
    sources: splitSourceLines(values.sources),
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitSourceLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 2) {
        return { label: parts[0], url: parts.slice(1).join(" | ") };
      }
      return { label: line, url: line };
    });
}
