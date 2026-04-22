export type ClaimStatus =
  | "unclaimed"
  | "claim_requested"
  | "claimed"
  | "verified_update_pending";

export type CollaborationType =
  | "joint_research"
  | "joint_benchmark"
  | "student_exchange"
  | "workshop"
  | "open_source_contribution";

export interface SourceLink {
  label: string;
  url: string;
}

export interface ResearchLine {
  id: string;
  label: string;
  shortLabel: string;
  summary: string;
  signals: string[];
}

export interface ScholarLabProfile {
  slug: string;
  institutionName: string;
  labName: string;
  institutionType: string;
  country: string;
  city: string;
  officialWebsite: string;
  summary: string;
  researchAreas: string[];
  researchFocus: string;
  projectKeywords: string[];
  representativeProjects: string[];
  ecosystemRole: string[];
  representativeOutputs: string[];
  industryCollaborationSignals: string[];
  openSourceFootprint: string[];
  notablePartners: string[];
  benchmarkOrTapeoutSignals: string[];
  representativePapers: string[];
  openResources: SourceLink[];
  proofOfRelevance: string[];
  collaborationInterests: string[];
  collaborationTypes: CollaborationType[];
  acceptsRequests: boolean;
  requestStatusNote: string;
  claimStatus: ClaimStatus;
  editorialNote: string;
  sources: SourceLink[];
  lastUpdated: string;
}

export const claimStatusLabels: Record<ClaimStatus, string> = {
  unclaimed: "Unclaimed",
  claim_requested: "Claim requested",
  claimed: "Claimed",
  verified_update_pending: "Verified update pending",
};

export const collaborationTypeLabels: Record<CollaborationType, string> = {
  joint_research: "Joint research",
  joint_benchmark: "Joint benchmark",
  student_exchange: "Student exchange",
  workshop: "Workshop",
  open_source_contribution: "Open-source contribution",
};
