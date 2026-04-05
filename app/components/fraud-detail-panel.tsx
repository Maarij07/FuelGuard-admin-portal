"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Severity = "critical" | "warning" | "low";

export interface FraudAlert {
  id: string;
  time: string;
  nozzle: string;
  s1: number;
  s2: number;
  delta: number;
  severity: Severity;
  status: "open" | "resolved" | "escalated";
}

interface FraudDetailPanelProps {
  alert: FraudAlert;
  onClose: () => void;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
}

const SEVERITY_STYLE: Record<Severity, string> = {
  critical: "bg-[#FEF2F2] text-[#EF4444]",
  warning: "bg-[#FFFBEB] text-[#F59E0B]",
  low: "bg-[#F4F6F8] text-[#637381]",
};

export function FraudDetailPanel({ alert, onClose, onResolve, onEscalate }: FraudDetailPanelProps) {
  const [assignee, setAssignee] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState<"resolve" | "escalate" | null>(null);
  const s1Pct = Math.round((alert.s1 / (alert.s1 + alert.s2)) * 100);
  const s2Pct = 100 - s1Pct;

  const handleResolve = () => {
    setSaving("resolve");
    setTimeout(() => { onResolve(alert.id); onClose(); }, 500);
  };
  const handleEscalate = () => {
    setSaving("escalate");
    setTimeout(() => { onEscalate(alert.id); onClose(); }, 500);
  };

  return (
    <div className="w-[420px] shrink-0 bg-white border-l border-[#E5E7EB] flex flex-col h-full overflow-y-auto" style={{ boxShadow: "-4px 0 12px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
        <div>
          <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium">Alert</p>
          <p className="text-[16px] font-semibold text-[#1C2536]">{alert.id}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F4F6F8] text-[#637381] transition-colors">
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {/* Time + Nozzle */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F4F6F8] rounded-lg p-4">
            <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-1">Time</p>
            <p className="text-[14px] font-semibold text-[#1C2536]">{alert.time}</p>
          </div>
          <div className="bg-[#F4F6F8] rounded-lg p-4">
            <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-1">Nozzle</p>
            <p className="text-[14px] font-semibold text-[#1C2536]">{alert.nozzle}</p>
          </div>
        </div>

        {/* Delta */}
        <div className="text-center py-4 bg-[#FEF2F2] rounded-xl">
          <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-1">Discrepancy Delta</p>
          <p className="text-[36px] font-bold text-[#EF4444] tracking-[-0.8px]">{alert.delta.toFixed(1)} L</p>
          <span className={`inline-block text-[12px] font-semibold px-3 py-1 rounded-full mt-2 ${SEVERITY_STYLE[alert.severity]}`}>
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </span>
        </div>

        {/* Sensor comparison */}
        <div>
          <p className="text-[13px] font-semibold text-[#1C2536] mb-3">Sensor Comparison</p>
          <div className="flex flex-col gap-3">
            {[{ label: "Sensor 1", value: alert.s1, pct: s1Pct, color: "#00B4A6" }, { label: "Sensor 2", value: alert.s2, pct: s2Pct, color: "#EF4444" }].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] text-[#637381]">{s.label}</span>
                  <span className="text-[12px] font-semibold text-[#1C2536]">{s.value.toFixed(1)} L</span>
                </div>
                <div className="h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assign */}
        <div>
          <label className="text-[13px] font-semibold text-[#1C2536] block mb-2">Assign to Employee</label>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]">
            <option value="">Select employee…</option>
            <option>Ali Khan</option>
            <option>Sara Ahmed</option>
            <option>Usman Malik</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[13px] font-semibold text-[#1C2536] block mb-2">Resolution Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add investigation notes…"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] resize-none"
          />
        </div>

        {/* Actions */}
        {alert.status === "open" ? (
          <div className="flex gap-3">
            <button onClick={handleResolve} disabled={!!saving} className="flex-1 py-2.5 rounded-lg bg-[#22C55E] text-white text-[14px] font-semibold hover:bg-[#16A34A] transition-colors disabled:opacity-60">
              {saving === "resolve" ? "Saving…" : "Mark Resolved"}
            </button>
            <button onClick={handleEscalate} disabled={!!saving} className="flex-1 py-2.5 rounded-lg border border-[#EF4444] text-[#EF4444] text-[14px] font-semibold hover:bg-[#FEF2F2] transition-colors disabled:opacity-60">
              {saving === "escalate" ? "Saving…" : "Escalate"}
            </button>
          </div>
        ) : (
          <div className={`text-center py-3 rounded-lg text-[13px] font-semibold ${alert.status === "resolved" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-[#FFFBEB] text-[#F59E0B]"}`}>
            {alert.status === "resolved" ? "✓ Alert Resolved" : "⚠ Alert Escalated"}
          </div>
        )}
      </div>
    </div>
  );
}
