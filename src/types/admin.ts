export type AdminIntakeType = "claim_request" | "collaboration_request";
export type AdminReviewStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "declined"
  | "scheduled";

export interface AdminSubmissionListItem {
  id: string;
  type: AdminIntakeType;
  reviewStatus: AdminReviewStatus;
  institutionName: string | null;
  applicantOrg: string | null;
  applicantName: string | null;
  applicantEmail: string;
  targetProfile: string | null;
  submittedAt: string;
  receivedAt: string;
  updatedAt: string;
}

export interface AdminSubmissionDetail extends AdminSubmissionListItem {
  payload: Record<string, unknown>;
}

export interface AdminSubmissionListResponse {
  total: number;
  items: AdminSubmissionListItem[];
}

export interface AdminInstitutionReviewItem {
  slug: string;
  institutionName: string;
  labName: string;
  current: {
    summary: string;
    researchFocus: string;
    representativeProjects: string[];
    projectKeywords: string[];
    ecosystemRole: string[];
    representativeOutputs: string[];
    industryCollaborationSignals: string[];
    openSourceFootprint: string[];
    notablePartners: string[];
    proofOfRelevance: string[];
    sources: Array<{ label: string; url: string }>;
    lastUpdated: string;
  };
  candidates: Partial<
    Record<
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
      | "sources",
      string | string[] | Array<{ label: string; url: string }>
    >
  >;
  previewUpdates: Record<string, unknown>;
  evidence: Array<{
    url: string;
    title: string;
    metaDescription: string;
    headings: string[];
    paragraphs: string[];
  }>;
}

export interface AdminInstitutionReviewListResponse {
  items: AdminInstitutionReviewItem[];
}

export const adminTypeLabels: Record<AdminIntakeType, string> = {
  claim_request: "Claim request",
  collaboration_request: "Collaboration request",
};

export const adminReviewStatusLabels: Record<AdminReviewStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  declined: "Declined",
  scheduled: "Scheduled",
};

export const adminReviewStatusOptions: AdminReviewStatus[] = [
  "submitted",
  "under_review",
  "shortlisted",
  "declined",
  "scheduled",
];
