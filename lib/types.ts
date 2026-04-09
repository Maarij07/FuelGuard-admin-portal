// ── Auth ──────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  uid: string;
  role: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  uid: string;
  role: string;
  email: string;
  fullName: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  active_sessions: number;
  revenue_today_pkr: number;
  transactions_today: number;
  open_fraud_alerts: number;
  avg_litres_per_transaction: number;
  generated_at: string;
}

// ── Transactions ──────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  session_id: string;
  nozzle_id: string;
  user_id: string | null;
  fuel_type: string;
  litres_dispensed: number;
  price_per_litre: number;
  total_amount: number;
  payment_method: string;
  status: string;
  employee_id: string | null;
  station_id: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}

// ── Employees ─────────────────────────────────────────────────────────────────

export interface Employee {
  uid: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

// ── Fraud ─────────────────────────────────────────────────────────────────────

export type FraudSeverity = "low" | "medium" | "high" | "critical";
export type FraudStatus   = "open" | "investigating" | "resolved" | "escalated";

export interface FraudAlert {
  id: string;
  alert_type: string;
  severity: FraudSeverity;
  status: FraudStatus;
  nozzle_id: string | null;
  transaction_id: string | null;
  description: string;
  evidence: Record<string, unknown>;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

// ── Nozzles ───────────────────────────────────────────────────────────────────

export type NozzleStatus = "idle" | "active" | "tampered" | "offline";

export interface Nozzle {
  id: string;
  nozzle_id: string;
  station_id: string;
  status: NozzleStatus;
  ble_uuid: string;
  ble_device_name: string;
  hardware_serial: string;
  fuel_type: string;
  tamper_detected: boolean;
  created_at: string;
}

// ── Reports ───────────────────────────────────────────────────────────────────

export interface ChartDayData {
  count: number;
  revenue: number;
  litres: number;
}

export interface ChartTransactionsResponse {
  period: string;
  data: Record<string, ChartDayData>;
}

export interface ChartFraudResponse {
  period: string;
  by_type: Record<string, number>;
  by_severity: Record<string, number>;
}

export interface NozzlePerf {
  transaction_count: number;
  total_revenue: number;
  total_litres: number;
}

export interface NozzleReportResponse {
  period: string;
  nozzles: Record<string, NozzlePerf>;
}

// ── API Error ─────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
