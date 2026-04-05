"use client";

import { X, Pencil, Ban } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  initials: string;
  employeeId: string;
  nozzles: string[];
  txnsToday: number;
  fraudIncidents: number;
  status: "active" | "inactive";
  verifiedPct: number;
  totalTxns: number;
}

interface EmployeeDetailPanelProps {
  employee: Employee;
  onClose: () => void;
}

const ACTIVITY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVITY_TXN = [42, 38, 51, 45, 55, 30, 0];

export function EmployeeDetailPanel({ employee, onClose }: EmployeeDetailPanelProps) {
  const maxTxn = Math.max(...ACTIVITY_TXN, 1);

  return (
    <div className="w-[400px] shrink-0 bg-white border-l border-[#E5E7EB] flex flex-col h-full overflow-y-auto" style={{ boxShadow: "-4px 0 12px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[15px] font-bold">
            {employee.initials}
          </div>
          <div>
            <p className="text-[16px] font-semibold text-[#1C2536]">{employee.name}</p>
            <p className="text-[13px] text-[#637381]">{employee.employeeId}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F4F6F8] text-[#637381] transition-colors">
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {/* Status badge */}
        <span className={`inline-flex self-start px-3 py-1 rounded-full text-[12px] font-semibold ${employee.status === "active" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-[#F4F6F8] text-[#637381]"}`}>
          {employee.status === "active" ? "Active" : "Inactive"}
        </span>

        {/* Performance summary */}
        <div>
          <p className="text-[13px] font-semibold text-[#1C2536] mb-3">Performance Summary</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Txns", value: employee.totalTxns.toString() },
              { label: "Verified", value: `${employee.verifiedPct}%` },
              { label: "Fraud", value: employee.fraudIncidents.toString(), alert: employee.fraudIncidents > 0 },
            ].map((s) => (
              <div key={s.label} className="bg-[#F4F6F8] rounded-lg p-3 text-center">
                <p className={`text-[20px] font-bold tracking-[-0.3px] ${s.alert ? "text-[#EF4444]" : "text-[#1C2536]"}`}>{s.value}</p>
                <p className="text-[11px] text-[#919EAB] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned nozzles */}
        <div>
          <p className="text-[13px] font-semibold text-[#1C2536] mb-2">Assigned Nozzles</p>
          <div className="flex gap-2 flex-wrap">
            {employee.nozzles.map((n) => (
              <span key={n} className="px-3 py-1 bg-[#E6F7F6] text-[#00B4A6] text-[12px] font-semibold rounded-full">{n}</span>
            ))}
          </div>
        </div>

        {/* Activity (last 7 days) */}
        <div>
          <p className="text-[13px] font-semibold text-[#1C2536] mb-3">Activity — Last 7 Days</p>
          <div className="flex items-end gap-2 h-16">
            {ACTIVITY_DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full rounded-t-sm bg-[#E6F7F6] relative" style={{ height: `${Math.round((ACTIVITY_TXN[i] / maxTxn) * 48)}px` }}>
                  <div className="absolute inset-0 bg-[#00B4A6] opacity-70 rounded-t-sm" />
                </div>
                <span className="text-[10px] text-[#919EAB]">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] font-semibold text-[#1C2536] hover:bg-[#F4F6F8] transition-colors">
            <Pencil size={15} strokeWidth={1.5} /> Edit
          </button>
          <button className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg border border-[#EF4444] text-[#EF4444] text-[14px] font-semibold hover:bg-[#FEF2F2] transition-colors">
            <Ban size={15} strokeWidth={1.5} /> Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
