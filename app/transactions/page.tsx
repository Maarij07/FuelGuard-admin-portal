"use client";

import { useState } from "react";
import { Search, FileText, Sheet, FileDown } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { useExport, type ExportRow } from "../hooks/use-export";

type TxnStatus = "verified" | "flagged" | "pending";

interface Transaction {
  id: string;
  datetime: string;
  nozzle: string;
  session: string;
  litres: number;
  pkr: number;
  s1: number;
  s2: number;
  delta: number;
  status: TxnStatus;
}

const STATUS_BADGE: Record<TxnStatus, string> = {
  verified: "bg-[#F0FDF4] text-[#22C55E]",
  flagged: "bg-[#FEF2F2] text-[#EF4444]",
  pending: "bg-[#FFFBEB] text-[#F59E0B]",
};

const TRANSACTIONS: Transaction[] = [
  { id: "TXN-1041", datetime: "2026-04-05 14:32", nozzle: "N-01", session: "SES-8821", litres: 28.4, pkr: 4260, s1: 28.4, s2: 28.4, delta: 0.0, status: "verified" },
  { id: "TXN-1040", datetime: "2026-04-05 14:31", nozzle: "N-02", session: "SES-8820", litres: 31.0, pkr: 4650, s1: 31.0, s2: 28.4, delta: 2.6, status: "flagged" },
  { id: "TXN-1039", datetime: "2026-04-05 14:30", nozzle: "N-03", session: "SES-8819", litres: 15.5, pkr: 2325, s1: 15.5, s2: 15.5, delta: 0.0, status: "verified" },
  { id: "TXN-1038", datetime: "2026-04-05 13:55", nozzle: "N-04", session: "SES-8818", litres: 40.0, pkr: 6000, s1: 40.0, s2: 40.0, delta: 0.0, status: "verified" },
  { id: "TXN-1037", datetime: "2026-04-05 13:22", nozzle: "N-01", session: "SES-8817", litres: 22.1, pkr: 3315, s1: 22.1, s2: 21.4, delta: 0.7, status: "flagged" },
  { id: "TXN-1036", datetime: "2026-04-05 12:48", nozzle: "N-05", session: "SES-8816", litres: 18.8, pkr: 2820, s1: 18.8, s2: 18.8, delta: 0.0, status: "verified" },
  { id: "TXN-1035", datetime: "2026-04-05 12:10", nozzle: "N-02", session: "SES-8815", litres: 35.6, pkr: 5340, s1: 35.6, s2: 35.6, delta: 0.0, status: "verified" },
  { id: "TXN-1034", datetime: "2026-04-05 11:33", nozzle: "N-03", session: "SES-8814", litres: 10.0, pkr: 1500, s1: 10.0, s2: 10.0, delta: 0.0, status: "verified" },
  { id: "TXN-1033", datetime: "2026-04-05 10:55", nozzle: "N-04", session: "SES-8813", litres: 44.5, pkr: 6675, s1: 44.5, s2: 44.5, delta: 0.0, status: "verified" },
  { id: "TXN-1032", datetime: "2026-04-05 10:12", nozzle: "N-01", session: "SES-8812", litres: 19.2, pkr: 2880, s1: 19.2, s2: 18.9, delta: 0.3, status: "pending" },
];

const COL_HEADERS = ["Txn ID", "Date & Time", "Nozzle", "Session", "Litres", "PKR", "S1", "S2", "Delta", "Status"];

const EXPORT_COLS = ["id", "datetime", "nozzle", "session", "litres", "pkr", "s1", "s2", "delta", "status"];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = TRANSACTIONS.filter((t) => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.nozzle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const { exportCSV, exportExcel, exportPDF } = useExport("transactions", filtered as unknown as ExportRow[], EXPORT_COLS);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="All Transactions" subtitle="Full transaction history with sensor verification" />

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white flex-1 min-w-[200px] max-w-xs">
          <Search size={16} strokeWidth={1.5} color="#919EAB" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID or nozzle…"
            className="text-[14px] text-[#1C2536] placeholder:text-[#919EAB] outline-none flex-1 bg-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] bg-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="flagged">Flagged</option>
          <option value="pending">Pending</option>
        </select>

        {/* Export buttons */}
        <div className="flex gap-2 ml-auto">
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

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10 border-b border-[#E5E7EB]">
              <tr>
                {COL_HEADERS.map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className={`border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F8] transition-colors ${t.status === "flagged" ? "border-l-2 border-l-[#EF4444]" : ""}`}>
                  <td className="px-5 py-3 text-[14px] font-medium text-[#00B4A6]">{t.id}</td>
                  <td className="px-5 py-3 text-[14px] text-[#637381] font-mono whitespace-nowrap">{t.datetime}</td>
                  <td className="px-5 py-3 text-[14px] font-medium text-[#1C2536]">{t.nozzle}</td>
                  <td className="px-5 py-3 text-[14px] text-[#637381]">{t.session}</td>
                  <td className="px-5 py-3 text-[14px] text-[#1C2536]">{t.litres.toFixed(1)} L</td>
                  <td className="px-5 py-3 text-[14px] font-medium text-[#1C2536]">PKR {t.pkr.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[14px] text-[#1C2536]">{t.s1.toFixed(1)} L</td>
                  <td className="px-5 py-3 text-[14px] text-[#1C2536]">{t.s2.toFixed(1)} L</td>
                  <td className={`px-5 py-3 text-[14px] font-semibold ${t.delta > 0 ? "text-[#EF4444]" : "text-[#637381]"}`}>{t.delta.toFixed(1)} L</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${STATUS_BADGE[t.status]}`}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#637381]">Showing {filtered.length} of {TRANSACTIONS.length} transactions</p>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#637381]">Rows per page:</span>
            <select className="border border-[#E5E7EB] rounded-lg px-2 py-1 text-[13px] text-[#1C2536] focus:outline-none">
              <option>25</option><option>50</option><option>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
