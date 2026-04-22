import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type IntakeType = "claim_request" | "collaboration_request";
export type ReviewStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "declined"
  | "scheduled";

export type IntakeRecord = {
  id: string;
  type: IntakeType;
  reviewStatus: ReviewStatus;
  institutionName: string | null;
  applicantOrg: string | null;
  applicantName: string | null;
  applicantEmail: string;
  targetProfile: string | null;
  submittedAt: string;
  receivedAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
};

export type ListSubmissionFilters = {
  type?: IntakeType;
  reviewStatus?: ReviewStatus;
  search?: string;
  limit: number;
  offset: number;
};

export type SubmissionListItem = Omit<IntakeRecord, "payload">;

const storageDir = process.env.STORAGE_DIR ?? path.resolve(process.cwd(), "runtime-data");
const sqlitePath = process.env.SQLITE_PATH ?? path.join(storageDir, "intake.sqlite");

mkdirSync(path.dirname(sqlitePath), { recursive: true });

const database = new DatabaseSync(sqlitePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    review_status TEXT NOT NULL,
    institution_name TEXT,
    applicant_org TEXT,
    applicant_name TEXT,
    applicant_email TEXT NOT NULL,
    target_profile TEXT,
    submitted_at TEXT NOT NULL,
    received_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    payload_json TEXT NOT NULL
  ) STRICT;

  CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
  CREATE INDEX IF NOT EXISTS idx_submissions_review_status ON submissions(review_status);
  CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
`);

const insertStatement = database.prepare(`
  INSERT INTO submissions (
    id,
    type,
    review_status,
    institution_name,
    applicant_org,
    applicant_name,
    applicant_email,
    target_profile,
    submitted_at,
    received_at,
    updated_at,
    payload_json
  ) VALUES (
    :id,
    :type,
    :review_status,
    :institution_name,
    :applicant_org,
    :applicant_name,
    :applicant_email,
    :target_profile,
    :submitted_at,
    :received_at,
    :updated_at,
    :payload_json
  )
`);

const insertOrIgnoreStatement = database.prepare(`
  INSERT OR IGNORE INTO submissions (
    id,
    type,
    review_status,
    institution_name,
    applicant_org,
    applicant_name,
    applicant_email,
    target_profile,
    submitted_at,
    received_at,
    updated_at,
    payload_json
  ) VALUES (
    :id,
    :type,
    :review_status,
    :institution_name,
    :applicant_org,
    :applicant_name,
    :applicant_email,
    :target_profile,
    :submitted_at,
    :received_at,
    :updated_at,
    :payload_json
  )
`);

function mapRow(row: Record<string, unknown>): IntakeRecord {
  return {
    id: String(row.id),
    type: row.type as IntakeType,
    reviewStatus: row.review_status as ReviewStatus,
    institutionName: row.institution_name ? String(row.institution_name) : null,
    applicantOrg: row.applicant_org ? String(row.applicant_org) : null,
    applicantName: row.applicant_name ? String(row.applicant_name) : null,
    applicantEmail: String(row.applicant_email),
    targetProfile: row.target_profile ? String(row.target_profile) : null,
    submittedAt: String(row.submitted_at),
    receivedAt: String(row.received_at),
    updatedAt: String(row.updated_at),
    payload: JSON.parse(String(row.payload_json)) as Record<string, unknown>,
  };
}

function buildWhereClause(filters: Omit<ListSubmissionFilters, "limit" | "offset">) {
  const clauses: string[] = [];
  const params: Record<string, string> = {};

  if (filters.type) {
    clauses.push("type = :type");
    params.type = filters.type;
  }

  if (filters.reviewStatus) {
    clauses.push("review_status = :review_status");
    params.review_status = filters.reviewStatus;
  }

  if (filters.search) {
    clauses.push(`(
      COALESCE(institution_name, '') LIKE :search OR
      COALESCE(applicant_org, '') LIKE :search OR
      COALESCE(applicant_name, '') LIKE :search OR
      COALESCE(applicant_email, '') LIKE :search OR
      COALESCE(target_profile, '') LIKE :search
    )`);
    params.search = `%${filters.search}%`;
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export function insertSubmission(record: IntakeRecord) {
  insertStatement.run({
    id: record.id,
    type: record.type,
    review_status: record.reviewStatus,
    institution_name: record.institutionName,
    applicant_org: record.applicantOrg,
    applicant_name: record.applicantName,
    applicant_email: record.applicantEmail,
    target_profile: record.targetProfile,
    submitted_at: record.submittedAt,
    received_at: record.receivedAt,
    updated_at: record.updatedAt,
    payload_json: JSON.stringify(record.payload),
  });
}

export function getSubmissionCounts() {
  const rows = database
    .prepare(`
      SELECT type, COUNT(*) AS total
      FROM submissions
      GROUP BY type
    `)
    .all() as Array<Record<string, unknown>>;

  const counts: Record<IntakeType, number> = {
    claim_request: 0,
    collaboration_request: 0,
  };

  for (const row of rows) {
    const type = row.type as IntakeType;
    counts[type] = Number(row.total ?? 0);
  }

  return counts;
}

export function listSubmissions(filters: ListSubmissionFilters) {
  const { whereSql, params } = buildWhereClause(filters);

  const totalRow = database
    .prepare(`SELECT COUNT(*) AS total FROM submissions ${whereSql}`)
    .get(params) as Record<string, unknown>;

  const rows = database
    .prepare(`
      SELECT
        id,
        type,
        review_status,
        institution_name,
        applicant_org,
        applicant_name,
        applicant_email,
        target_profile,
        submitted_at,
        received_at,
        updated_at,
        payload_json
      FROM submissions
      ${whereSql}
      ORDER BY submitted_at DESC, received_at DESC
      LIMIT :limit OFFSET :offset
    `)
    .all({
      ...params,
      limit: filters.limit,
      offset: filters.offset,
    }) as Array<Record<string, unknown>>;

  const items: SubmissionListItem[] = rows.map((row) => {
    const mapped = mapRow(row);
    return {
      id: mapped.id,
      type: mapped.type,
      reviewStatus: mapped.reviewStatus,
      institutionName: mapped.institutionName,
      applicantOrg: mapped.applicantOrg,
      applicantName: mapped.applicantName,
      applicantEmail: mapped.applicantEmail,
      targetProfile: mapped.targetProfile,
      submittedAt: mapped.submittedAt,
      receivedAt: mapped.receivedAt,
      updatedAt: mapped.updatedAt,
    };
  });

  return {
    total: Number(totalRow.total ?? 0),
    items,
  };
}

export function getSubmissionById(id: string) {
  const row = database
    .prepare(`
      SELECT
        id,
        type,
        review_status,
        institution_name,
        applicant_org,
        applicant_name,
        applicant_email,
        target_profile,
        submitted_at,
        received_at,
        updated_at,
        payload_json
      FROM submissions
      WHERE id = ?
    `)
    .get(id) as Record<string, unknown> | undefined;

  return row ? mapRow(row) : null;
}

export function updateSubmissionReviewStatus(id: string, reviewStatus: ReviewStatus) {
  const now = new Date().toISOString();
  const result = database
    .prepare(`
      UPDATE submissions
      SET review_status = :review_status, updated_at = :updated_at
      WHERE id = :id
    `)
    .run({
      id,
      review_status: reviewStatus,
      updated_at: now,
    });

  return result.changes > 0;
}

function migrateLegacyJsonlIfPresent() {
  const legacyFiles: IntakeType[] = ["claim_request", "collaboration_request"];

  for (const type of legacyFiles) {
    const filePath = path.join(storageDir, `${type}.jsonl`);
    if (!existsSync(filePath)) {
      continue;
    }

    const lines = readFileSync(filePath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      const payload = JSON.parse(line) as Record<string, unknown>;
      const fallbackNow = new Date().toISOString();

      insertOrIgnoreStatement.run({
        id: typeof payload.id === "string" ? payload.id : `${type}-${fallbackNow}`,
        type,
        review_status: "submitted",
        institution_name:
          typeof payload.institutionName === "string" ? payload.institutionName : null,
        applicant_org:
          typeof payload.applicantOrg === "string" ? payload.applicantOrg : null,
        applicant_name:
          typeof payload.applicantName === "string"
            ? payload.applicantName
            : typeof payload.applicantLead === "string"
              ? payload.applicantLead
              : null,
        applicant_email:
          typeof payload.applicantEmail === "string" ? payload.applicantEmail : "unknown@example.invalid",
        target_profile:
          typeof payload.targetProfile === "string" ? payload.targetProfile : null,
        submitted_at:
          typeof payload.submittedAt === "string" ? payload.submittedAt : fallbackNow,
        received_at:
          typeof payload.receivedAt === "string" ? payload.receivedAt : fallbackNow,
        updated_at: fallbackNow,
        payload_json: JSON.stringify(payload),
      });
    }
  }
}

migrateLegacyJsonlIfPresent();
