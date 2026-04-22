import { useState, type FormEvent } from "react";
import { ArrowRight, Info } from "lucide-react";
import Seo from "../components/Seo";
import { Button, Card } from "../components/ui";
import { isValidEmail, postFormPayload, type ValidationErrors } from "../lib/forms";
import { collaborationTypeLabels, type CollaborationType } from "../types/profile";

type RequestField =
  | "applicantOrg"
  | "applicantType"
  | "applicantLead"
  | "applicantEmail"
  | "researchFocus"
  | "capabilitySummary"
  | "targetProfile"
  | "collaborationGoal";

type RequestFormData = {
  applicantOrg: string;
  applicantType: string;
  applicantLead: string;
  applicantEmail: string;
  researchFocus: string;
  capabilitySummary: string;
  targetProfile: string;
  collaborationGoal: string;
  desiredFormats: CollaborationType[];
  evidenceLinks: string;
  extraNotes: string;
};

const collaborationOptions: CollaborationType[] = [
  "joint_research",
  "joint_benchmark",
  "student_exchange",
  "workshop",
  "open_source_contribution",
];

const initialForm: RequestFormData = {
  applicantOrg: "",
  applicantType: "",
  applicantLead: "",
  applicantEmail: "",
  researchFocus: "",
  capabilitySummary: "",
  targetProfile: "",
  collaborationGoal: "",
  desiredFormats: [],
  evidenceLinks: "",
  extraNotes: "",
};

export default function SubmitRequest() {
  const [formData, setFormData] = useState<RequestFormData>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<RequestField>>({});
  const [formatError, setFormatError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "unavailable">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const webhookUrl = import.meta.env.VITE_INTAKE_WEBHOOK_URL;

  function updateField<K extends keyof RequestFormData>(field: K, value: RequestFormData[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function toggleFormat(value: CollaborationType) {
    setFormData((current) => {
      const nextFormats = current.desiredFormats.includes(value)
        ? current.desiredFormats.filter((item) => item !== value)
        : [...current.desiredFormats, value];
      return { ...current, desiredFormats: nextFormats };
    });
    setFormatError("");
  }

  function validate() {
    const nextErrors: ValidationErrors<RequestField> = {};

    if (!formData.applicantOrg.trim()) nextErrors.applicantOrg = "Organization name is required.";
    if (!formData.applicantType.trim()) nextErrors.applicantType = "Applicant type is required.";
    if (!formData.applicantLead.trim()) nextErrors.applicantLead = "Lead contact is required.";
    if (!formData.applicantEmail.trim()) {
      nextErrors.applicantEmail = "Email is required.";
    } else if (!isValidEmail(formData.applicantEmail)) {
      nextErrors.applicantEmail = "Enter a valid email address.";
    }
    if (!formData.researchFocus.trim()) nextErrors.researchFocus = "Research focus is required.";
    if (!formData.capabilitySummary.trim()) {
      nextErrors.capabilitySummary = "Capability summary is required.";
    }
    if (!formData.targetProfile.trim()) nextErrors.targetProfile = "Target profile is required.";
    if (!formData.collaborationGoal.trim()) {
      nextErrors.collaborationGoal = "Collaboration goal is required.";
    }

    setErrors(nextErrors);

    if (formData.desiredFormats.length === 0) {
      setFormatError("Select at least one desired collaboration format.");
    } else {
      setFormatError("");
    }

    return Object.keys(nextErrors).length === 0 && formData.desiredFormats.length > 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      setStatus("error");
      setStatusMessage("Please complete the required fields before submitting.");
      return;
    }

    const payload = {
      type: "collaboration_request",
      submittedAt: new Date().toISOString(),
      ...formData,
    };

    if (!webhookUrl) {
      setStatus("unavailable");
      setStatusMessage(
        "Validation passed, but live intake delivery is not configured. Set VITE_INTAKE_WEBHOOK_URL to enable submission.",
      );
      return;
    }

    try {
      setStatus("submitting");
      setStatusMessage("Submitting collaboration request...");
      await postFormPayload(webhookUrl, payload);
      setStatus("success");
      setStatusMessage("Collaboration request submitted. The intake team can now review the proposal.");
      setFormData(initialForm);
      setErrors({});
      setFormatError("");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Request failed. Please try again.",
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Seo
        title="Submit a Collaboration Request | RISC-V Scholars"
        description="Submit a structured collaboration request to an overseas RISC-V institution profile without relying on cold outreach or raw contact exposure."
        pathname="/submit-request"
      />
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          Structured request
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Submit a collaboration request</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Use this intake when your lab already understands a target overseas profile and can
          explain why a bilateral conversation should happen.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded mb-8 flex gap-3 text-sm text-gray-800">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p>
          Contact details are not automatically exposed to the target institution. The request is
          screened for fit, clarity, and readiness before any introduction is considered.
        </p>
      </div>

      {!webhookUrl && (
        <div className="mb-8 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live delivery is currently disabled in this environment. You can still validate the form
          locally, but no request will be sent until <code>VITE_INTAKE_WEBHOOK_URL</code> is set.
        </div>
      )}

      {status !== "idle" && (
        <div
          className={`mb-8 px-4 py-3 text-sm border ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : status === "submitting"
                ? "border-blue-200 bg-blue-50 text-blue-900"
                : status === "unavailable"
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <Card className="p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <section>
            <h2 className="font-serif text-2xl border-b border-border pb-2 mb-6">
              1. Applicant organization
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Organization name"
                  value={formData.applicantOrg}
                  error={errors.applicantOrg}
                  onChange={(value) => updateField("applicantOrg", value)}
                />
                <Field
                  label="Applicant type"
                  value={formData.applicantType}
                  error={errors.applicantType}
                  placeholder="University lab, institute, national unit..."
                  onChange={(value) => updateField("applicantType", value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Lead contact"
                  value={formData.applicantLead}
                  error={errors.applicantLead}
                  onChange={(value) => updateField("applicantLead", value)}
                />
                <Field
                  label="Official email"
                  value={formData.applicantEmail}
                  error={errors.applicantEmail}
                  type="email"
                  onChange={(value) => updateField("applicantEmail", value)}
                />
              </div>

              <TextAreaField
                label="Research focus"
                value={formData.researchFocus}
                error={errors.researchFocus}
                rows={3}
                placeholder="What areas of RISC-V research does your team actively work on?"
                onChange={(value) => updateField("researchFocus", value)}
              />
              <TextAreaField
                label="Capability summary"
                value={formData.capabilitySummary}
                error={errors.capabilitySummary}
                rows={4}
                placeholder="Explain the technical capabilities, infrastructure, or evidence your team brings."
                onChange={(value) => updateField("capabilitySummary", value)}
              />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl border-b border-border pb-2 mb-6">
              2. Collaboration proposal
            </h2>
            <div className="space-y-4">
              <Field
                label="Target overseas profile"
                value={formData.targetProfile}
                error={errors.targetProfile}
                placeholder="Exact institution or lab profile name"
                onChange={(value) => updateField("targetProfile", value)}
              />
              <TextAreaField
                label="Collaboration goal"
                value={formData.collaborationGoal}
                error={errors.collaborationGoal}
                rows={5}
                placeholder="What specific bilateral outcome are you seeking, and why is this institution the right fit?"
                onChange={(value) => updateField("collaborationGoal", value)}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Desired collaboration format
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {collaborationOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2 text-sm border p-3 cursor-pointer transition-colors ${
                        formData.desiredFormats.includes(option)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-surface-alt"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.desiredFormats.includes(option)}
                        onChange={() => toggleFormat(option)}
                      />
                      {collaborationTypeLabels[option]}
                    </label>
                  ))}
                </div>
                {formatError && <div className="text-xs text-red-600 mt-2">{formatError}</div>}
              </div>

              <TextAreaField
                label="Evidence links"
                value={formData.evidenceLinks}
                rows={3}
                placeholder="GitHub repos, papers, demos, or benchmark links."
                onChange={(value) => updateField("evidenceLinks", value)}
              />
              <TextAreaField
                label="Other notes"
                value={formData.extraNotes}
                rows={3}
                placeholder="Anything else that would help the review."
                onChange={(value) => updateField("extraNotes", value)}
              />
            </div>
          </section>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border">
            <p className="text-sm text-gray-500">
              By submitting, you agree that the platform may review, decline, shortlist, or route
              the request based on stated collaboration fit.
            </p>
            <Button type="submit" className="gap-2" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Submit request"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-400" : "border-border focus:border-primary"
        }`}
      />
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows: number;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-400" : "border-border focus:border-primary"
        }`}
      />
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
