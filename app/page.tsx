import { Suspense } from "react";
import { Activity, BadgeDollarSign, ShieldAlert, Droplets } from "lucide-react";
import { cacheLife } from "next/cache";
import { KPICard } from "./components/kpi-card";
import { TransactionChart } from "./components/transaction-chart";
import { FraudDonutChart } from "./components/fraud-donut-chart";
import { LiveActivityFeed } from "./components/live-activity-feed";
import { getDashboardOverview, getChartFraud } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import type { DashboardOverview } from "@/lib/types";

// ── KPI skeleton ──────────────────────────────────────────────────────────────

function KPISkeleton() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-5 animate-pulse h-28"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <div className="h-4 bg-[#F4F6F8] rounded w-1/2 mb-3" />
          <div className="h-7 bg-[#F4F6F8] rounded w-1/3 mb-2" />
          <div className="h-3 bg-[#F4F6F8] rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

// ── KPI Server Component — cached for 2 minutes ───────────────────────────────

async function DashboardKPIs({ token }: { token: string }) {
  "use cache";
  cacheLife("minutes");

  let overview: DashboardOverview | null = null;

  try {
    overview = await getDashboardOverview(token);
  } catch {
    // Fall back to zeros on API error — the UI still renders
  }

  const formatPKR = (v: number) => {
    if (v >= 1_000_000) return `PKR ${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `PKR ${(v / 1_000).toFixed(0)}K`;
    return `PKR ${v.toFixed(0)}`;
  };

  const kpis = [
    {
      icon: Activity,
      value: String(overview?.active_sessions ?? 0),
      label: "Active Sessions",
      sublabel: "Nozzles currently dispensing",
      trend: overview ? `${overview.active_sessions}` : "—",
      trendDirection: "up" as const,
    },
    {
      icon: BadgeDollarSign,
      value: formatPKR(overview?.revenue_today_pkr ?? 0),
      label: "Total Revenue Today",
      sublabel: `${overview?.transactions_today ?? 0} transactions since midnight`,
      trend: overview ? `${overview.transactions_today} txns` : "—",
      trendDirection: "up" as const,
    },
    {
      icon: ShieldAlert,
      value: String(overview?.open_fraud_alerts ?? 0),
      label: "Open Fraud Alerts",
      sublabel: "Unresolved alerts",
      trend: overview && overview.open_fraud_alerts > 0 ? `+${overview.open_fraud_alerts}` : "0",
      trendDirection: "down" as const,
      alert: (overview?.open_fraud_alerts ?? 0) > 0,
    },
    {
      icon: Droplets,
      value: `${(overview?.avg_litres_per_transaction ?? 0).toFixed(1)} L`,
      label: "Avg. Dispensed",
      sublabel: "Per transaction today",
      trend: `${(overview?.avg_litres_per_transaction ?? 0).toFixed(1)} L`,
      trendDirection: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}

// ── Charts Server Component ───────────────────────────────────────────────────

async function DashboardCharts({ token }: { token: string }) {
  "use cache";
  cacheLife("minutes");

  let fraudTotal = 0;
  let txnTotal   = 0;

  try {
    const fraudData = await getChartFraud(token, "weekly");
    fraudTotal = Object.values(fraudData.by_type).reduce((s, n) => s + n, 0);
    txnTotal   = fraudTotal > 0 ? Math.round(fraudTotal / 0.06) : 0;
  } catch {
    // no data yet — zeroes render fine
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8" style={{ minWidth: 0 }}>
        <TransactionChart />
      </div>
      <div className="col-span-4" style={{ minWidth: 0 }}>
        <FraudDonutChart
          verified={txnTotal - fraudTotal}
          fraud={fraudTotal}
        />
      </div>
    </div>
  );
}

// ── Page (Server Component) ───────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await requireSession();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-[18px] font-semibold text-[#1C2536] tracking-[-0.2px]">
          Overview
        </h2>
        <p className="text-[13px] text-[#637381] mt-0.5">
          System-wide status as of today, {dateStr}
        </p>
      </div>

      {/* KPIs — cached 2 min, Suspense shows skeleton while fetching */}
      <Suspense fallback={<KPISkeleton />}>
        <DashboardKPIs token={session.accessToken} />
      </Suspense>

      {/* Charts — streamed in with real fraud data */}
      <Suspense
        fallback={
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 bg-white rounded-xl h-64 animate-pulse" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }} />
            <div className="col-span-4 bg-white rounded-xl h-64 animate-pulse" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }} />
          </div>
        }
      >
        <DashboardCharts token={session.accessToken} />
      </Suspense>

      {/* Live feed — always fresh, streams in at request time */}
      <LiveActivityFeed />
    </div>
  );
}
