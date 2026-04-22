import { useState, type FormEvent } from "react";
import { ShieldAlert } from "lucide-react";
import Seo from "../components/Seo";
import { Button, Card } from "../components/ui";
import { isValidEmail, postFormPayload, type ValidationErrors } from "../lib/forms";

type ClaimField =
  | "institutionName"
  | "profileLink"
  | "applicantName"
  | "applicantRole"
  | "applicantEmail"
  | "verificationMaterial"
  | "contactPath";

type ClaimFormData = {
  institutionName: string;
  profileLink: string;
  applicantName: string;
  applicantRole: string;
  applicantEmail: string;
  verificationMaterial: string;
  collaborationInfo: string;
  contactPath: string;
  acceptsRequests: "yes" | "no" | "case_by_case";
  extraNotes: string;
};

const initialForm: ClaimFormData = {
  institutionName: "",
  profileLink: "",
  applicantName: "",
  applicantRole: "",
  applicantEmail: "",
  verificationMaterial: "",
  collaborationInfo: "",
  contactPath: "",
  acceptsRequests: "case_by_case",
  extraNotes: "",
};

export default function ClaimProfile() {
  const [formData, setFormData] = useState<ClaimFormData>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<ClaimField>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "unavailable">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const webhookUrl = import.meta.env.VITE_INTAKE_WEBHOOK_URL;

  function updateField<K extends keyof ClaimFormData>(field: K, value: ClaimFormData[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validate() {
    const nextErrors: ValidationErrors<ClaimField> = {};

    if (!formData.institutionName.trim()) nextErrors.institutionName = "Institution name is required.";
    if (!formData.profileLink.trim()) nextErrors.profileLink = "Profile link is required.";
    if (!formData.applicantName.trim()) nextErrors.applicantName = "Applicant name is required.";
    if (!formData.applicantRole.trim()) nextErrors.applicantRole = "Applicant role is required.";
    if (!formData.applicantEmail.trim()) {
      nextErrors.applicantEmail = "Applicant email is required.";
    } else if (!isValidEmail(formData.applicantEmail)) {
      nextErrors.applicantEmail = "Enter a valid institutional email.";
    }
    if (!formData.verificationMaterial.trim()) {
      nextErrors.verificationMaterial = "Verification material is required.";
    }
    if (!formData.contactPath.trim()) nextErrors.contactPath = "Preferred contact path is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      setStatus("error");
      setStatusMessage("Please fix the required fields before submitting.");
      return;
    }

    const payload = {
      type: "claim_request",
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
      setStatusMessage("Submitting claim request...");
      await postFormPayload(webhookUrl, payload);
      setStatus("success");
      setStatusMessage("Claim request submitted. The editorial team can now review your verification details.");
      setFormData(initialForm);
      setErrors({});
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Claim request failed. Please try again.",
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Seo
        title="Claim a Profile | RISC-V Scholars"
        description="Officially represent an overseas RISC-V institution, claim a profile, submit corrections, and refine collaboration information."
        pathname="/claim-profile"
      />
      <div className="mb-12">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          Claim intake
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Claim or correct an institution profile</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Use this form if you officially represent an overseas RISC-V institution and want to
          verify, correct, or expand the profile shown on the platform.
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

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10">
        <div>
          <Card className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <section className="space-y-4 border-b border-border pb-8">
                <h2 className="font-serif text-2xl">Identity & profile reference</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Institution name"
                    value={formData.institutionName}
                    error={errors.institutionName}
                    onChange={(value) => updateField("institutionName", value)}
                  />
                  <Field
                    label="Profile link"
                    value={formData.profileLink}
                    error={errors.profileLink}
                    placeholder="https://riscvscholars.org/directory/..."
                    onChange={(value) => updateField("profileLink", value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Applicant name"
                    value={formData.applicantName}
                    error={errors.applicantName}
                    onChange={(value) => updateField("applicantName", value)}
                  />
                  <Field
                    label="Applicant role"
                    value={formData.applicantRole}
                    error={errors.applicantRole}
                    placeholder="Professor, PI, program manager..."
                    onChange={(value) => updateField("applicantRole", value)}
                  />
                </div>
                <Field
                  label="Institutional email"
                  value={formData.applicantEmail}
                  error={errors.applicantEmail}
                  type="email"
                  placeholder="name@institution.edu"
                  onChange={(value) => updateField("applicantEmail", value)}
                />
                <TextAreaField
                  label="Verification material"
                  value={formData.verificationMaterial}
                  error={errors.verificationMaterial}
                  rows={4}
                  placeholder="Share institutional proof, public profile links, or other verification context."
                  onChange={(value) => updateField("verificationMaterial", value)}
                />
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl">Collaboration signal updates</h2>
                <TextAreaField
                  label="What collaboration information should be updated?"
                  value={formData.collaborationInfo}
                  rows={4}
                  placeholder="Describe collaboration interests, filters, or new profile details."
                  onChange={(value) => updateField("collaborationInfo", value)}
                />
                <Field
                  label="Preferred contact path"
                  value={formData.contactPath}
                  error={errors.contactPath}
                  placeholder="e.g. institutional email, grants office, or named contact workflow"
                  onChange={(value) => updateField("contactPath", value)}
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Do you currently accept collaboration requests?
                  </label>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {[
                      { label: "Yes", value: "yes" },
                      { label: "Case by case", value: "case_by_case" },
                      { label: "Not currently", value: "no" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`border px-3 py-3 text-sm cursor-pointer ${
                          formData.acceptsRequests === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="acceptsRequests"
                          className="mr-2"
                          checked={formData.acceptsRequests === option.value}
                          onChange={() =>
                            updateField(
                              "acceptsRequests",
                              option.value as ClaimFormData["acceptsRequests"],
                            )
                          }
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <TextAreaField
                  label="Additional notes"
                  value={formData.extraNotes}
                  rows={3}
                  placeholder="Anything else the editorial team should know."
                  onChange={(value) => updateField("extraNotes", value)}
                />
              </section>

              <div className="pt-2">
                <Button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Submit claim request"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <div className="bg-surface-alt p-6 border border-border sticky top-24">
            <ShieldAlert className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-serif text-2xl mb-3">Why claim?</h2>
            <ul className="space-y-3 text-sm text-gray-700 list-disc pl-4">
              <li>Correct factual errors before Chinese labs judge fit.</li>
              <li>Define what kinds of collaboration requests you do or do not want.</li>
              <li>Provide a preferred contact path without exposing raw inboxes publicly.</li>
              <li>Keep the archive source-based while preserving institutional control.</li>
            </ul>
          </div>
        </div>
      </div>
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
