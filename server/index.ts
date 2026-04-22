import crypto from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import {
  getSubmissionById,
  getSubmissionCounts,
  insertSubmission,
  listSubmissions,
  updateSubmissionReviewStatus,
  type IntakeRecord,
  type IntakeType,
  type ReviewStatus,
} from "./db.js";
import {
  applyInstitutionReviewUpdates,
  getInstitutionReviewItem,
  listInstitutionReviewItems,
  type InstitutionReviewUpdates,
} from "./institution-review.js";
import { rebuildWebStack } from "./deploy.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const adminApiToken = process.env.ADMIN_API_TOKEN ?? "";

app.use(express.json({ limit: "1mb" }));

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return (
    value === "submitted" ||
    value === "under_review" ||
    value === "shortlisted" ||
    value === "declined" ||
    value === "scheduled"
  );
}

function getBearerToken(request: Request) {
  const authHeader = request.header("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return request.header("x-admin-token")?.trim() ?? "";
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createAdminSessionToken(username: string) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt,
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", adminApiToken)
    .update(payload)
    .digest("base64url");

  return {
    token: `${payload}.${signature}`,
    expiresAt,
  };
}

function verifyAdminSessionToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", adminApiToken)
    .update(payload)
    .digest("base64url");

  if (!timingSafeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: string;
    };
    return (
      typeof decoded.username === "string" &&
      typeof decoded.expiresAt === "string" &&
      new Date(decoded.expiresAt).getTime() > Date.now()
    );
  } catch {
    return false;
  }
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (!adminApiToken) {
    response.status(503).json({ error: "Admin API token is not configured." });
    return;
  }

  const bearerToken = getBearerToken(request);
  if (bearerToken !== adminApiToken && !verifyAdminSessionToken(bearerToken)) {
    response.status(401).json({ error: "Unauthorized." });
    return;
  }

  next();
}

app.post("/api/admin/login", (request, response) => {
  const username = typeof request.body?.username === "string" ? request.body.username.trim() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "aigc8888";

  if (!adminApiToken) {
    response.status(503).json({ error: "Admin API token is not configured." });
    return;
  }

  if (
    !timingSafeEqual(username, expectedUsername) ||
    !timingSafeEqual(password, expectedPassword)
  ) {
    response.status(401).json({ error: "Invalid username or password." });
    return;
  }

  const session = createAdminSessionToken(expectedUsername);
  response.json({
    ok: true,
    token: session.token,
    username: expectedUsername,
    expiresAt: session.expiresAt,
  });
});

function validateClaim(payload: Record<string, unknown>) {
  return (
    hasText(payload.institutionName) &&
    hasText(payload.profileLink) &&
    hasText(payload.applicantName) &&
    hasText(payload.applicantRole) &&
    isEmail(payload.applicantEmail) &&
    hasText(payload.verificationMaterial) &&
    hasText(payload.contactPath)
  );
}

function validateCollaboration(payload: Record<string, unknown>) {
  return (
    hasText(payload.applicantOrg) &&
    hasText(payload.applicantType) &&
    hasText(payload.applicantLead) &&
    isEmail(payload.applicantEmail) &&
    hasText(payload.researchFocus) &&
    hasText(payload.capabilitySummary) &&
    hasText(payload.targetProfile) &&
    hasText(payload.collaborationGoal) &&
    Array.isArray(payload.desiredFormats) &&
    payload.desiredFormats.length > 0
  );
}

function csvEscape(value: string | null) {
  if (value === null) {
    return "";
  }

  return `"${value.replaceAll('"', '""')}"`;
}

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "riscvscholars-api",
    storage: "sqlite",
    received: getSubmissionCounts(),
  });
});

app.post("/api/intake", (request, response) => {
  const payload = request.body as Record<string, unknown>;
  const submissionType = payload.type as IntakeType | undefined;

  if (submissionType !== "claim_request" && submissionType !== "collaboration_request") {
    response.status(400).json({ error: "Invalid submission type." });
    return;
  }

  const isValid =
    submissionType === "claim_request"
      ? validateClaim(payload)
      : validateCollaboration(payload);

  if (!isValid) {
    response.status(400).json({ error: "Missing or invalid required fields." });
    return;
  }

  const now = new Date().toISOString();
  const record: IntakeRecord = {
    id: crypto.randomUUID(),
    type: submissionType,
    reviewStatus: "submitted",
    institutionName: hasText(payload.institutionName) ? String(payload.institutionName) : null,
    applicantOrg: hasText(payload.applicantOrg) ? String(payload.applicantOrg) : null,
    applicantName: hasText(payload.applicantName)
      ? String(payload.applicantName)
      : hasText(payload.applicantLead)
        ? String(payload.applicantLead)
        : null,
    applicantEmail: String(payload.applicantEmail),
    targetProfile: hasText(payload.targetProfile) ? String(payload.targetProfile) : null,
    submittedAt: hasText(payload.submittedAt) ? String(payload.submittedAt) : now,
    receivedAt: now,
    updatedAt: now,
    payload,
  };

  insertSubmission(record);

  response.status(201).json({
    ok: true,
    id: record.id,
    type: submissionType,
    reviewStatus: record.reviewStatus,
    receivedAt: record.receivedAt,
  });
});

app.get("/api/admin/submissions", requireAdmin, (request, response) => {
  const limit = Math.min(Number(request.query.limit ?? 20) || 20, 100);
  const offset = Math.max(Number(request.query.offset ?? 0) || 0, 0);
  const type =
    request.query.type === "claim_request" || request.query.type === "collaboration_request"
      ? (request.query.type as IntakeType)
      : undefined;
  const reviewStatus = isReviewStatus(request.query.reviewStatus)
    ? request.query.reviewStatus
    : undefined;
  const search =
    typeof request.query.search === "string" && request.query.search.trim().length > 0
      ? request.query.search.trim()
      : undefined;

  response.json(
    listSubmissions({
      type,
      reviewStatus,
      search,
      limit,
      offset,
    }),
  );
});

app.get("/api/admin/submissions/:id", requireAdmin, (request, response) => {
  const submission = getSubmissionById(request.params.id);
  if (!submission) {
    response.status(404).json({ error: "Submission not found." });
    return;
  }

  response.json(submission);
});

app.patch("/api/admin/submissions/:id/review-status", requireAdmin, (request, response) => {
  const nextReviewStatus = request.body?.reviewStatus;
  if (!isReviewStatus(nextReviewStatus)) {
    response.status(400).json({ error: "Invalid review status." });
    return;
  }

  const updated = updateSubmissionReviewStatus(request.params.id, nextReviewStatus);
  if (!updated) {
    response.status(404).json({ error: "Submission not found." });
    return;
  }

  response.json({
    ok: true,
    id: request.params.id,
    reviewStatus: nextReviewStatus,
  });
});

app.get("/api/admin/submissions-export", requireAdmin, (request, response) => {
  const type =
    request.query.type === "claim_request" || request.query.type === "collaboration_request"
      ? (request.query.type as IntakeType)
      : undefined;
  const reviewStatus = isReviewStatus(request.query.reviewStatus)
    ? request.query.reviewStatus
    : undefined;
  const search =
    typeof request.query.search === "string" && request.query.search.trim().length > 0
      ? request.query.search.trim()
      : undefined;
  const format =
    request.query.format === "json" || request.query.format === "csv"
      ? request.query.format
      : "csv";

  const result = listSubmissions({
    type,
    reviewStatus,
    search,
    limit: 10_000,
    offset: 0,
  });

  if (format === "json") {
    response.json(result);
    return;
  }

  const lines = [
    [
      "id",
      "type",
      "reviewStatus",
      "institutionName",
      "applicantOrg",
      "applicantName",
      "applicantEmail",
      "targetProfile",
      "submittedAt",
      "receivedAt",
      "updatedAt",
    ].join(","),
    ...result.items.map((item) =>
      [
        csvEscape(item.id),
        csvEscape(item.type),
        csvEscape(item.reviewStatus),
        csvEscape(item.institutionName),
        csvEscape(item.applicantOrg),
        csvEscape(item.applicantName),
        csvEscape(item.applicantEmail),
        csvEscape(item.targetProfile),
        csvEscape(item.submittedAt),
        csvEscape(item.receivedAt),
        csvEscape(item.updatedAt),
      ].join(","),
    ),
  ];

  response.setHeader("Content-Type", "text/csv; charset=utf-8");
  response.setHeader("Content-Disposition", 'attachment; filename="submissions.csv"');
  response.send(lines.join("\n"));
});

app.get("/api/admin/institutions/review", requireAdmin, async (_request, response) => {
  response.json({
    items: await listInstitutionReviewItems(),
  });
});

app.get("/api/admin/institutions/review/:slug", requireAdmin, async (request, response) => {
  const item = await getInstitutionReviewItem(request.params.slug);
  if (!item) {
    response.status(404).json({ error: "Institution review item not found." });
    return;
  }

  response.json(item);
});

app.post("/api/admin/institutions/review/:slug/apply", requireAdmin, async (request, response) => {
  const updates = (request.body?.updates ?? {}) as InstitutionReviewUpdates;
  const updated = await applyInstitutionReviewUpdates(request.params.slug, updates);

  if (!updated) {
    response.status(404).json({ error: "Institution not found." });
    return;
  }

  response.json({
    ok: true,
    slug: request.params.slug,
    lastUpdated: updated.lastUpdated,
    institution: updated,
  });
});

app.post(
  "/api/admin/institutions/review/:slug/apply-and-rebuild",
  requireAdmin,
  async (request, response) => {
    const updates = (request.body?.updates ?? {}) as InstitutionReviewUpdates;
    const updated = await applyInstitutionReviewUpdates(request.params.slug, updates);

    if (!updated) {
      response.status(404).json({ error: "Institution not found." });
      return;
    }

    try {
      const rebuild = await rebuildWebStack();
      response.json({
        ok: true,
        slug: request.params.slug,
        lastUpdated: updated.lastUpdated,
        rebuild,
      });
    } catch (error) {
      response.status(500).json({
        error: error instanceof Error ? error.message : "Web rebuild failed.",
      });
    }
  },
);

app.use((_request, response) => {
  response.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`riscvscholars api listening on ${port}`);
});
