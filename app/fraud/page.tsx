"use client";

import { useState } from "react";
import { PageHeader } from "../components/page-header";
import { FraudDetailPanel, type FraudAlert } from "../components/fraud-detail-panel";

type Severity = "critical" | "warning" | "low";

const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "bg-[#FEF2F2] text-[#EF4444]",
  warning: "bg-[#FFFBEB] text-[#F59E0B]",
  low: "bg-[#F4F6F8] text-[#637381]",
};

const INITIAL_ALERTS: FraudAlert[] = [
  { id: "ALT-0041", time: "14:31:47", nozzle: "N-02", s1: 31.0, s2: 28.4, delta: 2.6, severity: "critical", status: "open" },
  { id: "ALT-0040", time: "13:55:20", nozzle: "N-03", s1: 22.1, s2: 21.4, delta: 0.7, severity: "warning", status: "open" },
  { id: "ALT-0039", time: "12:10:05", nozzle: "N-01", s1: 18.8, s2: 18.5, delta: 0.3, severity: "low", status: "open" },
  { id: "ALT-0038", time: "10:44:33", nozzle: "N-04", s1: 35.6, s2: 32.1, delta: 3.5, severity: "critical", status: "resolved" },
  { id: "ALT-0037", time: "09:22:11", nozzle: "N-02", s1: 14.0, s2: 13.2, delta: 0.8, severity: "warning", status: "resolved" },
  { id: "ALT-0036", time: "08:05:49", nozzle: "N-05", s1: 28.0, s2: 27.8, delta: 0.2, severity: "low", status: "resolved" },
];

const COL_HEADERS = ["Alert ID", "Time", "Nozzle", "S1 Reading", "S2 Reading", "Delta", "Severity", "Status"];

export default function FraudPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>(INITIAL_ALERTS);
  const [selected, setSelected] = useState<FraudAlert | null>(null);

  const updateStatus = (id: string, status: FraudAlert["status"]) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div className="flex gap-0 h-full -mx-8 -my-8">
      {/* Main content */}
      <div className="flex-1 flex flex-col gap-8 px-8 py-8 min-w-0">
        <PageHeader title="Fraud Alerts" subtitle="Investigate and resolve flagged dispensing events" />

        {/* Summary chips */}
        <div className="flex gap-3">
          {[
            { label: "Total Alerts", value: alerts.length, style: "bg-[#F4F6F8] text-[#1C2536]" },
            { label: "Open", value: alerts.filter((a) => a.status === "open").length, style: "bg-[#FEF2F2] text-[#EF4444]" },
            { label: "Escalated", value: alerts.filter((a) => a.status === "escalated").length, style: "bg-[#FFFBEB] text-[#F59E0B]" },
            { label: "Resolved", value: alerts.filter((a) => a.status === "resolved").length, style: "bg-[#F0FDF4] text-[#22C55E]" },
          ].map((c) => (
            <div key={c.label} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold ${c.style}`}>
              <span>{c.value}</span>
              <span className="font-medium opacity-70">{c.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {COL_HEADERS.map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelected(alert)}
                    className={`border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F4F6F8] transition-colors ${
                      selected?.id === alert.id ? "bg-[#E6F7F6]" : ""
                    } ${alert.severity === "critical" ? "border-l-2 border-l-[#EF4444]" : ""}`}
                  >
                    <td className="px-5 py-3 text-[14px] font-medium text-[#00B4A6]">{alert.id}</td>
                    <td className="px-5 py-3 text-[14px] text-[#637381] font-mono">{alert.time}</td>
                    <td className="px-5 py-3 text-[14px] font-medium text-[#1C2536]">{alert.nozzle}</td>
                    <td className="px-5 py-3 text-[14px] text-[#1C2536]">{alert.s1.toFixed(1)} L</td>
                    <td className="px-5 py-3 text-[14px] text-[#1C2536]">{alert.s2.toFixed(1)} L</td>
                    <td className="px-5 py-3 text-[14px] font-semibold text-[#EF4444]">{alert.delta.toFixed(1)} L</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${SEVERITY_BADGE[alert.severity]}`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                        alert.status === "open" ? "bg-[#FEF2F2] text-[#EF4444]"
                        : alert.status === "escalated" ? "bg-[#FFFBEB] text-[#F59E0B]"
                        : "bg-[#F0FDF4] text-[#22C55E]"
                      }`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <FraudDetailPanel
          alert={selected}
          onClose={() => setSelected(null)}
          onResolve={(id) => updateStatus(id, "resolved")}
          onEscalate={(id) => updateStatus(id, "escalated")}
        />
      )}
    </div>
  );
}
