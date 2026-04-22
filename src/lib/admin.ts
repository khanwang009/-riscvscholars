import type {
  AdminInstitutionReviewItem,
  AdminInstitutionReviewListResponse,
  AdminReviewStatus,
  AdminSubmissionDetail,
  AdminSubmissionListResponse,
  AdminIntakeType,
} from "../types/admin";

const TOKEN_STORAGE_KEY = "riscvscholars.admin.token";

type ListFilters = {
  token: string;
  type: "all" | AdminIntakeType;
  reviewStatus: "all" | AdminReviewStatus;
  search: string;
  limit: number;
  offset: number;
};

function getAdminApiBase() {
  const configured = import.meta.env.VITE_ADMIN_API_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const intakeUrl = import.meta.env.VITE_INTAKE_WEBHOOK_URL?.trim();
  if (intakeUrl?.includes("/api/intake")) {
    return intakeUrl.replace(/\/api\/intake$/, "");
  }

  return "/riscvscholars-api";
}

export function readStoredToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
}

export function storeAdminToken(token: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function clearStoredAdminToken() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

async function adminFetch(
  path: string,
  token: string,
  init?: RequestInit,
) {
  const response = await fetch(`${getAdminApiBase()}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.clone().json()) as { error?: string };
      if (payload?.error) {
        message = payload.error;
      }
    } catch {
      // Ignore response parse failures and fall back to the generic message.
    }

    throw new Error(message);
  }

  return response;
}

export async function loginAdmin(username: string, password: string) {
  const response = await fetch(`${getAdminApiBase()}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let message = `Login failed with status ${response.status}`;
    try {
      const payload = (await response.clone().json()) as { error?: string };
      if (payload?.error) {
        message = payload.error;
      }
    } catch {
      // Ignore parse failures and keep the generic message.
    }
    throw new Error(message);
  }

  return (await response.json()) as {
    ok: true;
    token: string;
    username: string;
    expiresAt: string;
  };
}

export async function fetchAdminSubmissions(filters: ListFilters) {
  const params = new URLSearchParams({
    limit: String(filters.limit),
    offset: String(filters.offset),
  });

  if (filters.type !== "all") {
    params.set("type", filters.type);
  }

  if (filters.reviewStatus !== "all") {
    params.set("reviewStatus", filters.reviewStatus);
  }

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  const response = await adminFetch(
    `/api/admin/submissions?${params.toString()}`,
    filters.token,
  );

  return (await response.json()) as AdminSubmissionListResponse;
}

export async function fetchAdminSubmissionDetail(id: string, token: string) {
  const response = await adminFetch(`/api/admin/submissions/${id}`, token);
  return (await response.json()) as AdminSubmissionDetail;
}

export async function updateAdminSubmissionStatus(
  id: string,
  reviewStatus: AdminReviewStatus,
  token: string,
) {
  const response = await adminFetch(
    `/api/admin/submissions/${id}/review-status`,
    token,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewStatus }),
    },
  );

  return (await response.json()) as {
    ok: true;
    id: string;
    reviewStatus: AdminReviewStatus;
  };
}

export async function exportAdminSubmissions(
  token: string,
  format: "csv" | "json",
  filters: Pick<ListFilters, "type" | "reviewStatus" | "search">,
) {
  const params = new URLSearchParams({ format });

  if (filters.type !== "all") {
    params.set("type", filters.type);
  }

  if (filters.reviewStatus !== "all") {
    params.set("reviewStatus", filters.reviewStatus);
  }

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  const response = await adminFetch(
    `/api/admin/submissions-export?${params.toString()}`,
    token,
  );

  return response.blob();
}

export async function fetchInstitutionReviewItems(token: string) {
  const response = await adminFetch("/api/admin/institutions/review", token);
  return (await response.json()) as AdminInstitutionReviewListResponse;
}

export async function applyInstitutionReview(
  slug: string,
  updates: Record<string, unknown>,
  token: string,
) {
  const response = await adminFetch(
    `/api/admin/institutions/review/${slug}/apply`,
    token,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates }),
    },
  );

  return (await response.json()) as {
    ok: true;
    slug: string;
    lastUpdated: string;
    institution: AdminInstitutionReviewItem["current"] & Record<string, unknown>;
  };
}

export async function applyInstitutionReviewAndRebuild(
  slug: string,
  updates: Record<string, unknown>,
  token: string,
) {
  const response = await adminFetch(
    `/api/admin/institutions/review/${slug}/apply-and-rebuild`,
    token,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates }),
    },
  );

  return (await response.json()) as {
    ok: true;
    slug: string;
    lastUpdated: string;
    rebuild: {
      stdout: string;
      stderr: string;
    };
  };
}
