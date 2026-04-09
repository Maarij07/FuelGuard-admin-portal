import { cache } from "react";
import type {
  ChartFraudResponse,
  ChartTransactionsResponse,
  DashboardOverview,
  Employee,
  FraudAlert,
  Nozzle,
  NozzleReportResponse,
  PaginatedResponse,
  TokenResponse,
  Transaction,
  UserProfile,
} from "./types";

const BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Base fetcher ──────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth (no token required) ──────────────────────────────────────────────────

export async function apiLogin(
  email: string,
  password: string
): Promise<TokenResponse> {
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(body.detail ?? "Login failed");
  }

  return res.json();
}

// ── Current user profile ──────────────────────────────────────────────────────

export const getUserProfile = cache(
  async (token: string): Promise<UserProfile> =>
    apiFetch<UserProfile>("/users/me", token)
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
// React.cache memoises within a single render pass — identical calls in the
// same request share one network round-trip instead of making duplicate fetches.

export const getDashboardOverview = cache(
  async (token: string): Promise<DashboardOverview> =>
    apiFetch<DashboardOverview>("/admin/overview", token)
);

// ── Transactions ──────────────────────────────────────────────────────────────

export const getTransactions = cache(
  async (
    token: string,
    params: { limit?: number; offset?: number; status?: string } = {}
  ): Promise<PaginatedResponse<Transaction>> => {
    const qs = new URLSearchParams();
    if (params.limit)  qs.set("limit",  String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));
    if (params.status) qs.set("status", params.status);
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<PaginatedResponse<Transaction>>(`/transactions${query}`, token);
  }
);

// ── Employees ─────────────────────────────────────────────────────────────────

export const getEmployees = cache(
  async (
    token: string,
    isActive = true
  ): Promise<PaginatedResponse<Employee>> =>
    apiFetch<PaginatedResponse<Employee>>(
      `/admin/employees?is_active=${isActive}`,
      token
    )
);

// ── Fraud Alerts ──────────────────────────────────────────────────────────────

export const getFraudAlerts = cache(
  async (
    token: string,
    params: { status?: string; severity?: string; limit?: number } = {}
  ): Promise<PaginatedResponse<FraudAlert>> => {
    const qs = new URLSearchParams();
    if (params.status)   qs.set("status",   params.status);
    if (params.severity) qs.set("severity", params.severity);
    if (params.limit)    qs.set("limit",    String(params.limit));
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<PaginatedResponse<FraudAlert>>(`/fraud/alerts${query}`, token);
  }
);

// ── Nozzles ───────────────────────────────────────────────────────────────────

export const getNozzles = cache(
  async (token: string): Promise<Nozzle[]> =>
    apiFetch<Nozzle[]>("/nozzles", token)
);

// ── Reports ───────────────────────────────────────────────────────────────────

export const getChartTransactions = cache(
  async (token: string, period = "weekly"): Promise<ChartTransactionsResponse> =>
    apiFetch<ChartTransactionsResponse>(`/reports/charts/transactions?period=${period}`, token)
);

export const getChartFraud = cache(
  async (token: string, period = "monthly"): Promise<ChartFraudResponse> =>
    apiFetch<ChartFraudResponse>(`/reports/charts/fraud?period=${period}`, token)
);

export const getNozzleReport = cache(
  async (token: string, period = "monthly"): Promise<NozzleReportResponse> =>
    apiFetch<NozzleReportResponse>(`/reports/nozzles?period=${period}`, token)
);

// ── Mutations (called from Server Actions — no cache wrapper needed) ───────────

export async function apiAddEmployee(
  token: string,
  payload: { email: string; password: string; full_name: string; phone?: string }
) {
  return apiFetch("/admin/employees", token, {
    method: "POST",
    body: JSON.stringify({ ...payload, role: "employee" }),
  });
}

export async function apiUpdateEmployee(
  token: string,
  uid: string,
  payload: { full_name?: string; phone?: string; is_active?: boolean }
) {
  return apiFetch(`/admin/employees/${uid}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiResolveFraudAlert(
  token: string,
  alertId: string,
  notes: string
) {
  return apiFetch(`/fraud/alerts/${alertId}/resolve`, token, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
}

export async function apiEscalateFraudAlert(token: string, alertId: string) {
  return apiFetch(`/fraud/alerts/${alertId}/escalate`, token, {
    method: "POST",
    body: JSON.stringify({}),
  });
}
