"use client";

import { useState } from "react";
import { FileText, Sheet, FileDown } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { TransactionChart } from "../components/transaction-chart";
import { FraudDonutChart } from "../components/fraud-donut-chart";
import { useExport } from "../hooks/use-export";

const NOZZLE_ROWS = [
  { nozzle: "N-01", transactions: 284, litres: "7,846 L", revenue: "PKR 2.4M", fraud: 3, rate: "1.1%" },
  { nozzle: "N-02", transactions: 261, litres: "7,210 L", revenue: "PKR 2.2M", fraud: 12, rate: "4.6%" },
  { nozzle: "N-03", transactions: 243, litres: "6,720 L", revenue: "PKR 2.0M", fraud: 2, rate: "0.8%" },
  { nozzle: "N-04", transactions: 258, litres: "7,104 L", revenue: "PKR 2.1M", fraud: 8, rate: "3.1%" },
  { nozzle: "N-05", transactions: 238, litres: "6,580 L", revenue: "PKR 2.0M", fraud: 1, rate: "0.4%" },
];
const NOZZLE_COLS = ["nozzle", "transactions", "litres", "revenue", "fraud", "rate"];

const SUMMARY_STATS = [
  { label: "Total Transactions", value: "1,284", sub: "This month" },
  { label: "Total Revenue", value: "PKR 12.4M", sub: "This month" },
  { label: "Avg. Litres / Txn", value: "27.8 L", sub: "This month" },
  { label: "Fraud Rate", value: "6.2%", sub: "This month", alert: true },
];

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-04-05");
  const [station, setStation] = useState("all");
  const { exportCSV, exportExcel, exportPDF } = useExport("nozzle-report", NOZZLE_ROWS, NOZZLE_COLS);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <PageHeader title="Reports" subtitle="Exportable analytics and transaction summaries" />
        <div className="flex gap-2">
          {[
            { icon: FileText, label: "PDF", onClick: exportPDF },
            { icon: Sheet, label: "Excel", onClick: exportExcel },
            { icon: FileDown, label: "CSV", onClick: exportCSV },
          ].map(({ icon: Icon, label, onClick }) => (
            <button key={label} onClick={onClick} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#637381] hover:border-[#00B4A6] hover:text-[#00B4A6] transition-colors bg-white">
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap bg-white rounded-xl px-5 py-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-medium text-[#637381]">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-medium text-[#637381]">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-medium text-[#637381]">Station</label>
          <select value={station} onChange={(e) => setStation(e.target.value)} className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]">
            <option value="all">All Stations</option>
            <option value="s1">Station 1</option>
            <option value="s2">Station 2</option>
          </select>
        </div>
        <button className="ml-auto px-5 py-2 rounded-lg bg-[#00B4A6] text-white text-[13px] font-semibold hover:bg-[#009E91] transition-colors">
          Apply Filters
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-6">
        {SUMMARY_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-5 py-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-1">{s.label}</p>
            <p className={`text-[24px] font-bold tracking-[-0.3px] ${s.alert ? "text-[#EF4444]" : "text-[#1C2536]"}`}>{s.value}</p>
            <p className="text-[12px] text-[#637381] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <TransactionChart />
        </div>
        <div className="col-span-4">
          <FraudDonutChart />
        </div>
      </div>

      {/* Per-nozzle breakdown */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-[14px] font-semibold text-[#1C2536]">Per-Nozzle Breakdown</h2>
          <p className="text-[13px] text-[#637381]">Aggregated performance by nozzle</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              {["Nozzle", "Transactions", "Total Litres", "Total Revenue", "Fraud Count", "Fraud Rate"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOZZLE_ROWS.map((row) => (
              <tr key={row.nozzle} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F8] transition-colors">
                <td className="px-6 py-3 text-[14px] font-semibold text-[#1C2536]">{row.nozzle}</td>
                <td className="px-6 py-3 text-[14px] text-[#1C2536]">{row.transactions}</td>
                <td className="px-6 py-3 text-[14px] text-[#1C2536]">{row.litres}</td>
                <td className="px-6 py-3 text-[14px] font-medium text-[#1C2536]">{row.revenue}</td>
                <td className="px-6 py-3 text-[14px] font-semibold text-[#EF4444]">{row.fraud}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${parseFloat(row.rate) > 3 ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#F0FDF4] text-[#22C55E]"}`}>
                    {row.rate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
