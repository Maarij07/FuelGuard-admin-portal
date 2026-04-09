"use client";

import { useState, useTransition, useCallback } from "react";
import { FileText, Sheet, FileDown } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { TransactionChart, type ChartPoint } from "../components/transaction-chart";
import { FraudDonutChart } from "../components/fraud-donut-chart";
import type { NozzlePerf } from "@/lib/types";

type Period = "daily" | "weekly" | "monthly";

interface InitialData {
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

const fmtPKR = (n: number) => {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `PKR ${(n / 1_000).toFixed(0)}K`;
  return `PKR ${n.toFixed(0)}`;
};

const PERIOD_LABELS: Record<Period, string> = {
  daily:   "Today",
  weekly:  "This Week",
  monthly: "This Month",
};

export function ReportsClient({ initial }: { initial: InitialData }) {
  const [data,       setData]       = useState<InitialData>(initial);
  const [period,     setPeriod]     = useState<Period>("monthly");
  const [isPending,  startTransition] = useTransition();

  const fetchPeriod = useCallback(async (p: Period) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/reports?period=${p}`, { credentials: "include" });
        if (res.ok) {
          const d: InitialData = await res.json();
          setData(d);
          setPeriod(p);
        }
      } catch {
        // keep existing data on error
      }
    });
  }, []);

  const kpi = data.kpi;
  const SUMMARY = [
    { label: "Total Transactions", value: kpi.totalTransactions.toLocaleString(), sub: PERIOD_LABELS[period] },
    { label: "Total Revenue",      value: fmtPKR(kpi.totalRevenue),              sub: PERIOD_LABELS[period] },
    { label: "Avg. Litres / Txn",  value: `${kpi.avgLitres.toFixed(1)} L`,       sub: PERIOD_LABELS[period] },
    { label: "Fraud Rate",         value: `${kpi.fraudRate.toFixed(1)}%`,         sub: PERIOD_LABELS[period], alert: kpi.fraudRate > 5 },
  ];

  const nozzleRows = Object.entries(data.nozzles).map(([id, perf]) => ({
    nozzle:       id,
    transactions: perf.transaction_count,
    litres:       `${perf.total_litres.toFixed(0)} L`,
    revenue:      fmtPKR(perf.total_revenue),
    fraudRate:    data.totalTxns > 0
      ? ((data.fraudTotal / data.totalTxns) * 100).toFixed(1) + "%"
      : "0%",
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <PageHeader title="Reports" subtitle="Exportable analytics and transaction summaries" />
        <div className="flex gap-2">
          {(["PDF", "Excel", "CSV"] as const).map((label) => {
            const Icon = label === "PDF" ? FileText : label === "Excel" ? Sheet : FileDown;
            return (
              <button
                key={label}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#637381] hover:border-[#00B4A6] hover:text-[#00B4A6] transition-colors bg-white"
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Period filter */}
      <div
        className="flex items-center gap-3 bg-white rounded-xl px-5 py-4"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
      >
        <span className="text-[13px] font-medium text-[#637381]">Period</span>
        <div className="flex gap-1 p-1 bg-[#F4F6F8] rounded-lg">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => { if (p !== period) fetchPeriod(p); }}
              disabled={isPending}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md capitalize transition-colors ${
                period === p
                  ? "bg-white text-[#1C2536] shadow-sm"
                  : "text-[#637381] hover:text-[#1C2536]"
              } disabled:opacity-50`}
            >
              {p}
            </button>
          ))}
        </div>
        {isPending && (
          <span className="text-[12px] text-[#919EAB] ml-2 animate-pulse">Refreshing…</span>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-6">
        {SUMMARY.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl px-5 py-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-1">{s.label}</p>
            <p className={`text-[24px] font-bold tracking-[-0.3px] ${s.alert ? "text-[#EF4444]" : "text-[#1C2536]"}`}>
              {s.value}
            </p>
            <p className="text-[12px] text-[#637381] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts — minWidth:0 on grid cells prevents Recharts width:-1 */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8" style={{ minWidth: 0 }}>
          <TransactionChart data7d={data.chartData7d} data30d={data.chartData30d} />
        </div>
        <div className="col-span-4" style={{ minWidth: 0 }}>
          <FraudDonutChart
            verified={data.totalTxns - data.fraudTotal}
            fraud={data.fraudTotal}
          />
        </div>
      </div>

      {/* Per-nozzle breakdown */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
      >
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-[14px] font-semibold text-[#1C2536]">Per-Nozzle Breakdown</h2>
          <p className="text-[13px] text-[#637381]">Aggregated performance by nozzle</p>
        </div>
        {nozzleRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="#F4F6F8"/>
              <path d="M22 44V26l10-8 10 8v18H22z" stroke="#C4CDD5" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <path d="M28 44v-8h8v8" stroke="#C4CDD5" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <path d="M32 18v-4M32 14l3-3M32 14l-3-3" stroke="#C4CDD5" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="32" cy="30" r="3" stroke="#C4CDD5" strokeWidth="1.5" fill="none"/>
            </svg>
            <p className="text-[14px] font-medium text-[#637381]">No nozzle data for this period</p>
            <p className="text-[12px] text-[#919EAB]">Data appears once dispensing sessions are recorded</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {["Nozzle", "Transactions", "Total Litres", "Total Revenue", "Fraud Rate"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nozzleRows.map((row) => (
                <tr key={row.nozzle} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F8] transition-colors">
                  <td className="px-6 py-3 text-[14px] font-semibold text-[#1C2536]">{row.nozzle}</td>
                  <td className="px-6 py-3 text-[14px] text-[#1C2536]">{row.transactions}</td>
                  <td className="px-6 py-3 text-[14px] text-[#1C2536]">{row.litres}</td>
                  <td className="px-6 py-3 text-[14px] font-medium text-[#1C2536]">{row.revenue}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                        parseFloat(row.fraudRate) > 3
                          ? "bg-[#FEF2F2] text-[#EF4444]"
                          : "bg-[#F0FDF4] text-[#22C55E]"
                      }`}
                    >
                      {row.fraudRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
