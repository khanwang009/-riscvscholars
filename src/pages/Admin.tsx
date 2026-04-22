import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Download,
  FileSearch,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import InstitutionReviewPanel from "../components/admin/InstitutionReviewPanel";
import Seo from "../components/Seo";
import { Button, Card } from "../components/ui";
import {
  clearStoredAdminToken,
  exportAdminSubmissions,
  fetchAdminSubmissionDetail,
  fetchAdminSubmissions,
  readStoredToken,
  updateAdminSubmissionStatus,
} from "../lib/admin";
import {
  adminReviewStatusLabels,
  adminReviewStatusOptions,
  adminTypeLabels,
  type AdminIntakeType,
  type AdminReviewStatus,
  type AdminSubmissionDetail,
  type AdminSubmissionListItem,
} from "../types/admin";

const PAGE_SIZE = 20;

export default function Admin() {
  const [adminMode, setAdminMode] = useState<"submissions" | "institutions">("submissions");
  const [token, setToken] = useState(() => readStoredToken());
  const [submissions, setSubmissions] = useState<AdminSubmissionListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmissionDetail | null>(null);
  const [listStatus, setListStatus] = useState<"idle" | "loading" | "error">("idle");
  const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "error">("idle");
  const [pageOffset, setPageOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<"all" | AdminIntakeType>("all");
  const [reviewFilter, setReviewFilter] = useState<"all" | AdminReviewStatus>("all");
  const [search, setSearch] = useState("");
  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!token || adminMode !== "submissions") {
      return;
    }

    let cancelled = false;
    setListStatus("loading");
    setListError("");

    fetchAdminSubmissions({
      token,
      type: typeFilter,
      reviewStatus: reviewFilter,
      search,
      limit: PAGE_SIZE,
      offset: pageOffset,
    })
      .then((result) => {
        if (cancelled) {
          return;
        }

        setSubmissions(result.items);
        setTotal(result.total);
        setListStatus("idle");

        if (result.items.length === 0) {
          setSelectedId(null);
          setSelectedSubmission(null);
          return;
        }

        const hasSelected = result.items.some((item) => item.id === selectedId);
        if (!selectedId || !hasSelected) {
          setSelectedId(result.items[0].id);
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setListStatus("error");
        setListError(error instanceof Error ? error.message : "Failed to load submissions.");
      });

    return () => {
      cancelled = true;
    };
  }, [token, adminMode, typeFilter, reviewFilter, search, pageOffset, refreshTick, selectedId]);

  useEffect(() => {
    if (!token || !selectedId || adminMode !== "submissions") {
      setSelectedSubmission(null);
      setDetailStatus("idle");
      return;
    }

    let cancelled = false;
    setDetailStatus("loading");
    setDetailError("");

    fetchAdminSubmissionDetail(selectedId, token)
      .then((submission) => {
        if (!cancelled) {
          setSelectedSubmission(submission);
          setDetailStatus("idle");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setDetailStatus("error");
          setDetailError(
            error instanceof Error ? error.message : "Failed to load submission detail.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, adminMode, selectedId, refreshTick]);

  function handleLogout() {
    setToken("");
    setSubmissions([]);
    setSelectedId(null);
    setSelectedSubmission(null);
    setActionMessage("");
    clearStoredAdminToken();
  }

  async function handleStatusUpdate(reviewStatus: AdminReviewStatus) {
    if (!token || !selectedSubmission) {
      return;
    }

    setActionMessage("Updating review status...");

    try {
      await updateAdminSubmissionStatus(selectedSubmission.id, reviewStatus, token);
      setActionMessage(`Status updated to ${adminReviewStatusLabels[reviewStatus]}.`);
      setRefreshTick((current) => current + 1);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Status update failed.");
    }
  }

  async function handleExport(format: "csv" | "json") {
    if (!token) {
      return;
    }

    setIsExporting(true);
    setActionMessage(`Preparing ${format.toUpperCase()} export...`);

    try {
      const blob = await exportAdminSubmissions(token, format, {
        type: typeFilter,
        reviewStatus: reviewFilter,
        search,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `riscvscholars-submissions.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
      setActionMessage(`${format.toUpperCase()} export ready.`);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  const pageStart = total === 0 ? 0 : pageOffset + 1;
  const pageEnd = Math.min(pageOffset + PAGE_SIZE, total);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Seo
        title="Admin Review Workspace | RISC-V Scholars"
        description="Private workspace for submission review and institution enrichment workflows."
        pathname="/admin"
        robots="noindex,nofollow"
      />
      <div className="mb-10 border-b border-border pb-8">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          Minimal admin
        </div>
        <h1 className="text-4xl font-serif text-primary mb-4">
          Intake operations and institution enrichment review.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Review inbound requests and scraper-generated institution candidate fields after signing
          in with your administrator account.
        </p>
      </div>

      <div className="grid gap-6 mb-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 bg-surface-alt border border-border flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl">Administrator session</h2>
              <p className="text-sm text-gray-600 mt-1">
                You are signed in for the current browser session and can use the review workspace
                without pasting raw management tokens.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-border bg-surface-alt rounded px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">
                Authentication mode
              </div>
              <div className="text-sm text-black">Username and password login</div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Sign out
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-bold text-gray-700 mb-3">Workspace</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setAdminMode("submissions")}
              className={`border px-4 py-4 text-left ${
                adminMode === "submissions"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-black mb-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Submission Review
              </div>
              <div className="text-sm text-gray-600">
                Manage claim and collaboration request workflow state.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAdminMode("institutions")}
              className={`border px-4 py-4 text-left ${
                adminMode === "institutions"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-black mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                Institution Review
              </div>
              <div className="text-sm text-gray-600">
                Compare scrape candidates with canonical institution profile data.
              </div>
            </button>
          </div>
        </Card>
      </div>

      {adminMode === "institutions" ? (
        <InstitutionReviewPanel token={token} />
      ) : (
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 bg-surface-alt border border-border flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl">Filters and export</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Narrow the working set before reviewing or exporting.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FilterField
                  label="Submission type"
                  value={typeFilter}
                  onChange={(value) => {
                    setTypeFilter(value as "all" | AdminIntakeType);
                    setPageOffset(0);
                  }}
                  options={[
                    { label: "All", value: "all" },
                    { label: adminTypeLabels.claim_request, value: "claim_request" },
                    {
                      label: adminTypeLabels.collaboration_request,
                      value: "collaboration_request",
                    },
                  ]}
                />
                <FilterField
                  label="Review status"
                  value={reviewFilter}
                  onChange={(value) => {
                    setReviewFilter(value as "all" | AdminReviewStatus);
                    setPageOffset(0);
                  }}
                  options={[
                    { label: "All", value: "all" },
                    ...adminReviewStatusOptions.map((status) => ({
                      label: adminReviewStatusLabels[status],
                      value: status,
                    })),
                  ]}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Keyword</label>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPageOffset(0);
                  }}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Institution, applicant, target profile, email..."
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setRefreshTick((current) => current + 1)}
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => void handleExport("csv")}
                  disabled={!token || isExporting}
                >
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => void handleExport("json")}
                  disabled={!token || isExporting}
                >
                  <Download className="w-4 h-4" /> Export JSON
                </Button>
              </div>

              {actionMessage && (
                <div className="mt-4 text-sm border border-border bg-surface-alt px-3 py-2">
                  {actionMessage}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-serif text-2xl">Submission list</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {total === 0 ? "No results yet." : `Showing ${pageStart}-${pageEnd} of ${total}.`}
                  </p>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
                  {listStatus === "loading" ? "Loading" : "Ready"}
                </div>
              </div>

              {listError && (
                <div className="mb-4 text-sm border border-red-200 bg-red-50 text-red-800 px-3 py-2">
                  {listError}
                </div>
              )}

              <div className="space-y-3">
                {submissions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left border px-4 py-4 transition-colors ${
                      selectedId === item.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-white hover:border-primary/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="font-medium text-black">
                        {item.institutionName ?? item.applicantOrg ?? item.targetProfile ?? item.id}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <span className="px-2 py-1 bg-surface-alt border border-border">
                          {adminTypeLabels[item.type]}
                        </span>
                        <span className="px-2 py-1 bg-primary text-white">
                          {adminReviewStatusLabels[item.reviewStatus]}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                      <div>{item.applicantName ?? "No named applicant"}</div>
                      <div>{item.applicantEmail}</div>
                      <div>{item.targetProfile ?? "No target profile"}</div>
                      <div>{formatDateTime(item.submittedAt)}</div>
                    </div>
                  </button>
                ))}

                {submissions.length === 0 && listStatus !== "loading" && (
                  <div className="border border-dashed border-border bg-surface-alt px-4 py-8 text-center text-sm text-gray-600">
                    Add a valid token to load submissions, or broaden the filters if the current set is
                    empty.
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPageOffset((current) => Math.max(current - PAGE_SIZE, 0))}
                  disabled={pageOffset === 0 || listStatus === "loading"}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPageOffset((current) =>
                      current + PAGE_SIZE < total ? current + PAGE_SIZE : current,
                    )
                  }
                  disabled={pageOffset + PAGE_SIZE >= total || listStatus === "loading"}
                >
                  Next
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 bg-surface-alt border border-border flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl">Selected submission</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review the full payload and update workflow status from here.
                  </p>
                </div>
              </div>

              {detailError && (
                <div className="mb-4 text-sm border border-red-200 bg-red-50 text-red-800 px-3 py-2">
                  {detailError}
                </div>
              )}

              {!selectedSubmission && detailStatus !== "loading" && (
                <div className="border border-dashed border-border bg-surface-alt px-4 py-8 text-center text-sm text-gray-600">
                  Select a submission from the list to inspect it.
                </div>
              )}

              {detailStatus === "loading" && (
                <div className="border border-dashed border-border bg-surface-alt px-4 py-8 text-center text-sm text-gray-600">
                  Loading submission detail...
                </div>
              )}

              {selectedSubmission && detailStatus === "idle" && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <MetaField label="Type" value={adminTypeLabels[selectedSubmission.type]} />
                    <MetaField
                      label="Review status"
                      value={adminReviewStatusLabels[selectedSubmission.reviewStatus]}
                    />
                    <MetaField
                      label="Institution / org"
                      value={
                        selectedSubmission.institutionName ??
                        selectedSubmission.applicantOrg ??
                        "Not provided"
                      }
                    />
                    <MetaField
                      label="Applicant"
                      value={selectedSubmission.applicantName ?? "Not provided"}
                    />
                    <MetaField label="Applicant email" value={selectedSubmission.applicantEmail} />
                    <MetaField
                      label="Target profile"
                      value={selectedSubmission.targetProfile ?? "Not provided"}
                    />
                    <MetaField
                      label="Submitted at"
                      value={formatDateTime(selectedSubmission.submittedAt)}
                    />
                    <MetaField
                      label="Updated at"
                      value={formatDateTime(selectedSubmission.updatedAt)}
                    />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-2">Update status</div>
                    <div className="flex flex-wrap gap-2">
                      {adminReviewStatusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void handleStatusUpdate(status)}
                          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-widest border ${
                            selectedSubmission.reviewStatus === status
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white hover:border-primary"
                          }`}
                        >
                          {adminReviewStatusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-2">Payload</div>
                    <pre className="overflow-x-auto border border-border bg-surface-alt p-4 text-xs leading-relaxed">
                      {JSON.stringify(selectedSubmission.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-surface-alt px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">
        {label}
      </div>
      <div className="text-sm text-black">{value}</div>
    </div>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}
