// Shared cached report data fetcher.
// 'use cache' persists the result across requests keyed by (token, period).
// React.cache() in lib/api.ts only deduplicates within one render pass —
// this is what actually makes navigating back to /reports fast.

import { cacheLife } from "next/cache";
import { getChartTransactions, getChartFraud, getNozzleReport } from "./api";
import type { ChartPoint } from "@/app/components/transaction-chart";
import type { NozzlePerf } from "./types";

export interface ReportsData {
  chartData7d:  ChartPoint[];
  chartData30d: ChartPoint[];
  fraudTotal:   number;
  totalTxns:    number;
  nozzles:      Record<string, NozzlePerf>;
  kpi: {
    totalTransactions: number;
    totalRevenue:      number;
    avgLitres:         number;
    fraudRate:         number;
  };
}

function toChartPoints(
  data: Record<string, { count: number }>,
  maxDays: number,
): ChartPoint[] {
  return Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-maxDays)
    .map(([date, d]) => {
      const dow    = new Date(date).toLocaleDateString("en-GB", { weekday: "short" });
      const dayNum = date.slice(8);
      return { day: maxDays <= 7 ? dow : dayNum, transactions: d.count };
    });
}

// 'use cache' inside an async function body: Next.js 16 caches the return
// value, keyed by all arguments. Each unique (token, period) pair gets its
// own slot. TTL = 2 minutes ("minutes" preset).
export async function fetchReportsData(
  token:  string,
  period: "daily" | "weekly" | "monthly" = "monthly",
): Promise<ReportsData> {
  "use cache";
  cacheLife("minutes");

  const [txns7, txns30, fraud, nozzles] = await Promise.allSettled([
    getChartTransactions(token, "weekly"),
    getChartTransactions(token, "monthly"),
    getChartFraud(token, period),
    getNozzleReport(token, period),
  ]);

  const raw7d      = txns7.status   === "fulfilled" ? txns7.value.data   : {};
  const raw30d     = txns30.status  === "fulfilled" ? txns30.value.data  : {};
  const fraudData  = fraud.status   === "fulfilled" ? fraud.value        : { by_type: {}, by_severity: {} };
  const nozzleData = nozzles.status === "fulfilled" ? nozzles.value      : { nozzles: {} };

  const chartData7d  = toChartPoints(raw7d,  7);
  const chartData30d = toChartPoints(raw30d, 30);

  const fraudTotal        = Object.values(fraudData.by_type).reduce((s, n) => s + n, 0);
  const totalTxns         = Object.values(raw30d).reduce((s, d) => s + d.count, 0);
  const allNozzlePerf     = nozzleData.nozzles;
  const totalTransactions = Object.values(allNozzlePerf).reduce((s, n) => s + n.transaction_count, 0);
  const totalRevenue      = Object.values(allNozzlePerf).reduce((s, n) => s + n.total_revenue, 0);
  const totalLitres       = Object.values(allNozzlePerf).reduce((s, n) => s + n.total_litres, 0);
  const avgLitres         = totalTransactions > 0 ? totalLitres / totalTransactions : 0;
  const fraudRate         = totalTransactions > 0 ? (fraudTotal / totalTransactions) * 100 : 0;

  return {
    chartData7d,
    chartData30d,
    fraudTotal,
    totalTxns,
    nozzles: allNozzlePerf,
    kpi: { totalTransactions, totalRevenue, avgLitres, fraudRate },
  };
}
