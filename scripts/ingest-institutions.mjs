import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const canonicalPath = path.join(repoRoot, "src", "data", "institutions.json");
const draftPath = path.join(repoRoot, "runtime-data", "institution-drafts.json");
const previewPath = path.join(repoRoot, "runtime-data", "institution-ingest-preview.json");

const shouldApply = process.argv.includes("--apply");
const shouldAppendCandidates = process.argv.includes("--append-candidates");

const blockedCandidateWords = new Set([
  "navigation",
  "menu",
  "search",
  "home",
  "research",
  "people",
  "academics",
  "upcoming",
  "events",
  "event",
  "projects",
  "project",
  "content",
  "staff",
  "education",
  "join",
  "transfer",
  "structure",
  "collaboration",
  "companies",
  "computing",
  "code",
  "repositories",
  "users",
  "issues",
  "welcome",
  "what",
  "happening",
  "create",
  "serve",
  "educate",
  "seminar",
]);

function isUsefulCandidate(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (blockedCandidateWords.has(normalized)) {
    return false;
  }

  if (normalized.split(/\s+/).some((part) => blockedCandidateWords.has(part))) {
    return false;
  }

  if (/^[a-z0-9._-]+$/.test(value) && value.length >= 4) {
    return true;
  }

  if (/^[A-Z0-9+/-]{2,12}$/.test(value)) {
    return true;
  }

  return /(risc|chip|core|processor|vector|bench|boom|rocket|chisel|lagarto|ariane|ibex|snitch|pulp|cva6|ri5cy|flamingo|cheshire|spatz)/i.test(
    value,
  );
}

function uniqueStrings(values) {
  const seen = new Set();
  const output = [];

  for (const value of values.filter(Boolean)) {
    const normalized = value.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    output.push(value);
  }

  return output;
}

function uniqueNonEmptyStrings(values) {
  return uniqueStrings(values.filter((value) => typeof value === "string" && value.trim().length > 0));
}

function uniqueSources(values) {
  const seen = new Set();
  const output = [];

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

async function main() {
  const canonicalProfiles = JSON.parse(await fs.readFile(canonicalPath, "utf8"));
  const draftProfiles = JSON.parse(await fs.readFile(draftPath, "utf8"));

  const draftMap = new Map(draftProfiles.map((draft) => [draft.slug, draft]));
  const preview = [];

  const nextProfiles = canonicalProfiles.map((profile) => {
    const draft = draftMap.get(profile.slug);
    if (!draft) {
      return profile;
    }

    const updates = {};
    const nextProfile = structuredClone(profile);

    if (!nextProfile.officialWebsite && draft.officialWebsite) {
      nextProfile.officialWebsite = draft.officialWebsite;
      updates.officialWebsite = draft.officialWebsite;
    }

    if ((!nextProfile.summary || nextProfile.summary.trim().length === 0) && draft.summaryCandidate) {
      nextProfile.summary = draft.summaryCandidate;
      updates.summary = draft.summaryCandidate;
    }

    if (
      (!nextProfile.researchFocus || nextProfile.researchFocus.trim().length === 0) &&
      draft.researchFocusCandidate
    ) {
      nextProfile.researchFocus = draft.researchFocusCandidate;
      updates.researchFocus = draft.researchFocusCandidate;
    }

    const mergedSources = uniqueSources([
      ...(nextProfile.sources ?? []),
      ...(draft.sourceCandidates ?? []),
    ]);
    if (mergedSources.length !== nextProfile.sources.length) {
      nextProfile.sources = mergedSources;
      updates.sources = mergedSources;
    }

    if (shouldAppendCandidates) {
      const mergedProjects = uniqueStrings([
        ...(nextProfile.representativeProjects ?? []),
        ...(draft.representativeProjectCandidates ?? []).filter(isUsefulCandidate),
      ]).slice(0, 10);

      const mergedKeywords = uniqueStrings([
        ...(nextProfile.projectKeywords ?? []),
        ...(draft.projectKeywordCandidates ?? []).filter(isUsefulCandidate),
      ]).slice(0, 16);

      if (JSON.stringify(mergedProjects) !== JSON.stringify(nextProfile.representativeProjects)) {
        nextProfile.representativeProjects = mergedProjects;
        updates.representativeProjects = mergedProjects;
      }

      if (JSON.stringify(mergedKeywords) !== JSON.stringify(nextProfile.projectKeywords)) {
        nextProfile.projectKeywords = mergedKeywords;
        updates.projectKeywords = mergedKeywords;
      }
    }

    const ecosystemRoleCandidates = uniqueNonEmptyStrings([
      ...(nextProfile.ecosystemRole ?? []),
      ...(draft.ecosystemRoleCandidates ?? []),
    ]).slice(0, 8);
    if (JSON.stringify(ecosystemRoleCandidates) !== JSON.stringify(nextProfile.ecosystemRole)) {
      nextProfile.ecosystemRole = ecosystemRoleCandidates;
      updates.ecosystemRole = ecosystemRoleCandidates;
    }

    const representativeOutputCandidates = uniqueNonEmptyStrings([
      ...(nextProfile.representativeOutputs ?? []),
      ...(draft.representativeOutputCandidates ?? []),
    ]).slice(0, 8);
    if (
      JSON.stringify(representativeOutputCandidates) !==
      JSON.stringify(nextProfile.representativeOutputs)
    ) {
      nextProfile.representativeOutputs = representativeOutputCandidates;
      updates.representativeOutputs = representativeOutputCandidates;
    }

    const industrySignalCandidates = uniqueNonEmptyStrings([
      ...(nextProfile.industryCollaborationSignals ?? []),
      ...(draft.industryCollaborationSignalCandidates ?? []),
    ]).slice(0, 8);
    if (
      JSON.stringify(industrySignalCandidates) !==
      JSON.stringify(nextProfile.industryCollaborationSignals)
    ) {
      nextProfile.industryCollaborationSignals = industrySignalCandidates;
      updates.industryCollaborationSignals = industrySignalCandidates;
    }

    const openSourceCandidates = uniqueNonEmptyStrings([
      ...(nextProfile.openSourceFootprint ?? []),
      ...(draft.openSourceFootprintCandidates ?? []),
    ]).slice(0, 8);
    if (
      JSON.stringify(openSourceCandidates) !==
      JSON.stringify(nextProfile.openSourceFootprint)
    ) {
      nextProfile.openSourceFootprint = openSourceCandidates;
      updates.openSourceFootprint = openSourceCandidates;
    }

    const partnerCandidates = uniqueNonEmptyStrings([
      ...(nextProfile.notablePartners ?? []),
      ...(draft.notablePartnerCandidates ?? []),
    ]).slice(0, 8);
    if (JSON.stringify(partnerCandidates) !== JSON.stringify(nextProfile.notablePartners)) {
      nextProfile.notablePartners = partnerCandidates;
      updates.notablePartners = partnerCandidates;
    }

    const proofCandidates = uniqueNonEmptyStrings([
      ...(nextProfile.proofOfRelevance ?? []),
      ...(draft.proofOfRelevanceCandidates ?? []),
    ]).slice(0, 8);
    if (JSON.stringify(proofCandidates) !== JSON.stringify(nextProfile.proofOfRelevance)) {
      nextProfile.proofOfRelevance = proofCandidates;
      updates.proofOfRelevance = proofCandidates;
    }

    nextProfile.lastUpdated = new Date().toISOString().slice(0, 10);
    updates.lastUpdated = nextProfile.lastUpdated;

    preview.push({
      slug: profile.slug,
      changed: Object.keys(updates).length > 0,
      updates,
    });

    return nextProfile;
  });

  await fs.writeFile(previewPath, JSON.stringify(preview, null, 2));

  if (shouldApply) {
    await fs.writeFile(canonicalPath, JSON.stringify(nextProfiles, null, 2) + "\n");
    console.log(`Applied ingestion to ${canonicalPath}`);
  } else {
    console.log(`Preview written to ${previewPath}`);
    console.log("Run with --apply to update src/data/institutions.json");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
