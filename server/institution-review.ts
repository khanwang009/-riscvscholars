import fs from "node:fs/promises";
import path from "node:path";

type SourceLink = {
  label: string;
  url: string;
};

type CanonicalInstitution = {
  slug: string;
  institutionName: string;
  labName: string;
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
  sources: SourceLink[];
  lastUpdated: string;
};

type DraftInstitution = {
  slug: string;
  institutionName: string;
  labName: string;
  officialWebsite: string;
  summaryCandidate?: string;
  researchFocusCandidate?: string;
  representativeProjectCandidates?: string[];
  projectKeywordCandidates?: string[];
  ecosystemRoleCandidates?: string[];
  representativeOutputCandidates?: string[];
  industryCollaborationSignalCandidates?: string[];
  openSourceFootprintCandidates?: string[];
  notablePartnerCandidates?: string[];
  proofOfRelevanceCandidates?: string[];
  sourceCandidates?: SourceLink[];
  evidence?: Array<{
    url: string;
    title: string;
    metaDescription: string;
    headings: string[];
    paragraphs: string[];
  }>;
};

type PreviewInstitution = {
  slug: string;
  changed: boolean;
  updates: Record<string, unknown>;
};

export type ReviewableField =
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

export type InstitutionReviewItem = {
  slug: string;
  institutionName: string;
  labName: string;
  current: Pick<
    CanonicalInstitution,
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
    | "sources"
    | "lastUpdated"
  >;
  candidates: Partial<Record<ReviewableField, string | string[] | SourceLink[]>>;
  previewUpdates: Record<string, unknown>;
  evidence: DraftInstitution["evidence"];
};

export type InstitutionReviewUpdates = Partial<
  Record<ReviewableField, string | string[] | SourceLink[]>
>;

const runtimeDir = process.env.STORAGE_DIR ?? path.resolve(process.cwd(), "runtime-data");
const draftsPath = path.join(runtimeDir, "institution-drafts.json");
const previewPath = path.join(runtimeDir, "institution-ingest-preview.json");
const canonicalPath =
  process.env.CANONICAL_INSTITUTIONS_PATH ??
  path.resolve(process.cwd(), "src", "data", "institutions.json");

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values.map((item) => item.trim()).filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(value);
  }

  return output;
}

function uniqueSources(values: SourceLink[]) {
  const seen = new Set<string>();
  const output: SourceLink[] = [];

  for (const value of values) {
    const key = value.url.replace(/\/$/, "");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(value);
  }

  return output;
}

export async function listInstitutionReviewItems() {
  const canonical = await readJsonFile<CanonicalInstitution[]>(canonicalPath, []);
  const drafts = await readJsonFile<DraftInstitution[]>(draftsPath, []);
  const previews = await readJsonFile<PreviewInstitution[]>(previewPath, []);

  const draftMap = new Map(drafts.map((item) => [item.slug, item]));
  const previewMap = new Map(previews.map((item) => [item.slug, item]));

  return canonical.map((institution) => {
    const draft = draftMap.get(institution.slug);
    const preview = previewMap.get(institution.slug);

    const candidates: InstitutionReviewItem["candidates"] = {};

    if (draft?.summaryCandidate) candidates.summary = draft.summaryCandidate;
    if (draft?.researchFocusCandidate) candidates.researchFocus = draft.researchFocusCandidate;
    if (draft?.representativeProjectCandidates?.length) {
      candidates.representativeProjects = draft.representativeProjectCandidates;
    }
    if (draft?.projectKeywordCandidates?.length) {
      candidates.projectKeywords = draft.projectKeywordCandidates;
    }
    if (draft?.ecosystemRoleCandidates?.length) {
      candidates.ecosystemRole = draft.ecosystemRoleCandidates;
    }
    if (draft?.representativeOutputCandidates?.length) {
      candidates.representativeOutputs = draft.representativeOutputCandidates;
    }
    if (draft?.industryCollaborationSignalCandidates?.length) {
      candidates.industryCollaborationSignals =
        draft.industryCollaborationSignalCandidates;
    }
    if (draft?.openSourceFootprintCandidates?.length) {
      candidates.openSourceFootprint = draft.openSourceFootprintCandidates;
    }
    if (draft?.notablePartnerCandidates?.length) {
      candidates.notablePartners = draft.notablePartnerCandidates;
    }
    if (draft?.proofOfRelevanceCandidates?.length) {
      candidates.proofOfRelevance = draft.proofOfRelevanceCandidates;
    }
    if (draft?.sourceCandidates?.length) {
      candidates.sources = draft.sourceCandidates;
    }

    return {
      slug: institution.slug,
      institutionName: institution.institutionName,
      labName: institution.labName,
      current: {
        summary: institution.summary,
        researchFocus: institution.researchFocus,
        representativeProjects: institution.representativeProjects,
        projectKeywords: institution.projectKeywords,
        ecosystemRole: institution.ecosystemRole,
        representativeOutputs: institution.representativeOutputs,
        industryCollaborationSignals: institution.industryCollaborationSignals,
        openSourceFootprint: institution.openSourceFootprint,
        notablePartners: institution.notablePartners,
        proofOfRelevance: institution.proofOfRelevance,
        sources: institution.sources,
        lastUpdated: institution.lastUpdated,
      },
      candidates,
      previewUpdates: preview?.updates ?? {},
      evidence: draft?.evidence ?? [],
    } satisfies InstitutionReviewItem;
  });
}

export async function getInstitutionReviewItem(slug: string) {
  const items = await listInstitutionReviewItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function applyInstitutionReviewUpdates(
  slug: string,
  updates: InstitutionReviewUpdates,
) {
  const canonical = await readJsonFile<CanonicalInstitution[]>(canonicalPath, []);
  const index = canonical.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return null;
  }

  const next = structuredClone(canonical[index]);

  if (typeof updates.summary === "string") {
    next.summary = updates.summary.trim();
  }

  if (typeof updates.researchFocus === "string") {
    next.researchFocus = updates.researchFocus.trim();
  }

  if (Array.isArray(updates.representativeProjects)) {
    next.representativeProjects = uniqueStrings(
      updates.representativeProjects.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.projectKeywords)) {
    next.projectKeywords = uniqueStrings(
      updates.projectKeywords.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.ecosystemRole)) {
    next.ecosystemRole = uniqueStrings(
      updates.ecosystemRole.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.representativeOutputs)) {
    next.representativeOutputs = uniqueStrings(
      updates.representativeOutputs.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.industryCollaborationSignals)) {
    next.industryCollaborationSignals = uniqueStrings(
      updates.industryCollaborationSignals.filter(
        (value): value is string => typeof value === "string",
      ),
    );
  }

  if (Array.isArray(updates.openSourceFootprint)) {
    next.openSourceFootprint = uniqueStrings(
      updates.openSourceFootprint.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.notablePartners)) {
    next.notablePartners = uniqueStrings(
      updates.notablePartners.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.proofOfRelevance)) {
    next.proofOfRelevance = uniqueStrings(
      updates.proofOfRelevance.filter((value): value is string => typeof value === "string"),
    );
  }

  if (Array.isArray(updates.sources)) {
    next.sources = uniqueSources(
      updates.sources.filter((value): value is SourceLink => {
        return (
          typeof value === "object" &&
          value !== null &&
          typeof (value as SourceLink).label === "string" &&
          typeof (value as SourceLink).url === "string"
        );
      }),
    );
  }

  next.lastUpdated = new Date().toISOString().slice(0, 10);
  canonical[index] = next;

  await fs.writeFile(canonicalPath, JSON.stringify(canonical, null, 2) + "\n");
  return next;
}
