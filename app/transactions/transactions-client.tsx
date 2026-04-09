"use client";

import { useMemo, useState } from "react";
import { Search, FileText, Sheet, FileDown } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { useExport, type ExportRow } from "../hooks/use-export";
import type { Transaction } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-[#F0FDF4] text-[#22C55E]",
  flagged:   "bg-[#FEF2F2] text-[#EF4444]",
  pending:   "bg-[#FFFBEB] text-[#F59E0B]",
  cancelled: "bg-[#F4F6F8] text-[#637381]",
};

const COL_HEADERS = ["Txn ID", "Date & Time", "Nozzle", "Session", "Litres", "PKR", "Fuel Type", "Status"];
const EXPORT_COLS = ["id", "created_at", "nozzle_id", "session_id", "litres_dispensed", "total_amount", "fuel_type", "status"];

const PAGE_SIZE = 25;

interface Props {
  transactions: Transaction[];
  total: number;
}

export function TransactionsClient({ transactions, total }: Props) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page,         setPage]         = useState(1);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        t.id.toLowerCase().includes(q) ||
        t.nozzle_id.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const { exportCSV, exportExcel, exportPDF } = useExport(
    "transactions",
    filtered as unknown as ExportRow[],
    EXPORT_COLS
  );

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="All Transactions"
        subtitle={`${total} total transactions with sensor verification`}
      />

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white flex-1 min-w-[200px] max-w-xs">
          <Search size={16} strokeWidth={1.5} color="#919EAB" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search ID or nozzle…"
            className="text-[14px] text-[#1C2536] placeholder:text-[#919EAB] outline-none flex-1 bg-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] bg-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="flagged">Flagged</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex gap-2 ml-auto">
          {[
            { icon: FileText, label: "PDF",   onClick: exportPDF   },
            { icon: Sheet,    label: "Excel", onClick: exportExcel },
            { icon: FileDown, label: "CSV",   onClick: exportCSV   },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#637381] hover:border-[#00B4A6] hover:text-[#00B4A6] transition-colors bg-white"
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10 border-b border-[#E5E7EB]">
              <tr>
                {COL_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={COL_HEADERS.length}>
                    <EmptyState
                      variant="transactions"
                      title={search || statusFilter !== "all" ? "No transactions match your filters" : undefined}
                      subtitle={search || statusFilter !== "all" ? "Try adjusting the search or status filter" : undefined}
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr
                    key={t.id}
                    className={`border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F8] transition-colors ${
                      t.status === "flagged" ? "border-l-2 border-l-[#EF4444]" : ""
                    }`}
                  >
                    <td className="px-5 py-3 text-[14px] font-medium text-[#00B4A6] font-mono">
                      {t.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#637381] font-mono whitespace-nowrap">
                      {fmt(t.created_at)}
                    </td>
                    <td className="px-5 py-3 text-[14px] font-medium text-[#1C2536]">
                      {t.nozzle_id}
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#637381] font-mono">
                      {t.session_id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#1C2536]">
                      {t.litres_dispensed.toFixed(1)} L
                    </td>
                    <td className="px-5 py-3 text-[14px] font-medium text-[#1C2536]">
                      PKR {t.total_amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#637381] capitalize">
                      {t.fuel_type}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize ${
                          STATUS_BADGE[t.status] ?? "bg-[#F4F6F8] text-[#637381]"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#637381]">
            Showing {Math.min(filtered.length, (page - 1) * PAGE_SIZE + 1)}–
            {Math.min(filtered.length, page * PAGE_SIZE)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-[13px] border border-[#E5E7EB] rounded-lg text-[#637381] disabled:opacity-40 hover:border-[#00B4A6] transition-colors"
            >
              Prev
            </button>
            <span className="text-[13px] text-[#637381]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-[13px] border border-[#E5E7EB] rounded-lg text-[#637381] disabled:opacity-40 hover:border-[#00B4A6] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
