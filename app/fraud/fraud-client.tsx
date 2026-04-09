"use client";

import { useTransition, useState } from "react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { resolveAlertAction, escalateAlertAction } from "@/app/actions/fraud";
import type { FraudAlert, FraudSeverity, FraudStatus } from "@/lib/types";

const SEVERITY_BADGE: Record<FraudSeverity, string> = {
  low:      "bg-[#F4F6F8] text-[#637381]",
  medium:   "bg-[#FFFBEB] text-[#F59E0B]",
  high:     "bg-[#FFFBEB] text-[#F59E0B]",
  critical: "bg-[#FEF2F2] text-[#EF4444]",
};

const STATUS_BADGE: Record<FraudStatus, string> = {
  open:          "bg-[#FEF2F2] text-[#EF4444]",
  investigating: "bg-[#FFFBEB] text-[#F59E0B]",
  escalated:     "bg-[#FFFBEB] text-[#F59E0B]",
  resolved:      "bg-[#F0FDF4] text-[#22C55E]",
};

// ── Detail Panel ──────────────────────────────────────────────────────────────

function FraudDetailPanel({
  alert,
  onClose,
  onStatusChange,
}: {
  alert: FraudAlert;
  onClose: () => void;
  onStatusChange: (id: string, status: FraudStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleResolve = () => {
    startTransition(async () => {
      await resolveAlertAction(alert.id);
      onStatusChange(alert.id, "resolved");
    });
  };

  const handleEscalate = () => {
    startTransition(async () => {
      await escalateAlertAction(alert.id);
      onStatusChange(alert.id, "escalated");
    });
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="w-[340px] shrink-0 border-l border-[#E5E7EB] bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <span className="text-[14px] font-semibold text-[#1C2536]">Alert Details</span>
        <button onClick={onClose} className="text-[#919EAB] hover:text-[#637381] text-lg leading-none">×</button>
      </div>

      <div className="flex flex-col gap-5 p-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize ${SEVERITY_BADGE[alert.severity]}`}>
            {alert.severity}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize ${STATUS_BADGE[alert.status]}`}>
            {alert.status}
          </span>
        </div>

        {[
          { label: "Alert ID",   value: alert.id.slice(0, 12).toUpperCase() },
          { label: "Type",       value: alert.alert_type.replace(/_/g, " ") },
          { label: "Nozzle",     value: alert.nozzle_id ?? "—"              },
          { label: "Transaction",value: alert.transaction_id ? alert.transaction_id.slice(0, 8).toUpperCase() : "—" },
          { label: "Created",    value: fmt(alert.created_at)               },
          { label: "Resolved",   value: alert.resolved_at ? fmt(alert.resolved_at) : "—" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[12px] font-medium text-[#919EAB] uppercase tracking-[0.4px] mb-0.5">{label}</p>
            <p className="text-[14px] text-[#1C2536] capitalize">{value}</p>
          </div>
        ))}

        {alert.description && (
          <div>
            <p className="text-[12px] font-medium text-[#919EAB] uppercase tracking-[0.4px] mb-0.5">Description</p>
            <p className="text-[13px] text-[#637381] leading-relaxed">{alert.description}</p>
          </div>
        )}

        {alert.status !== "resolved" && (
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleEscalate}
              disabled={isPending || alert.status === "escalated"}
              className="flex-1 py-2.5 rounded-lg bg-[#FFFBEB] text-[#F59E0B] text-[13px] font-semibold hover:bg-[#FEF3C7] transition-colors disabled:opacity-50"
            >
              Escalate
            </button>
            <button
              onClick={handleResolve}
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-[#F0FDF4] text-[#22C55E] text-[13px] font-semibold hover:bg-[#DCFCE7] transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Resolve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────────

export function FraudClient({ initialAlerts }: { initialAlerts: FraudAlert[] }) {
  const [alerts,   setAlerts]   = useState<FraudAlert[]>(initialAlerts);
  const [selected, setSelected] = useState<FraudAlert | null>(null);

  const handleStatusChange = (id: string, status: FraudStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short",
      hour: "2-digit", minute: "2-digit",
    });

  const counts = {
    total:       alerts.length,
    open:        alerts.filter((a) => a.status === "open").length,
    escalated:   alerts.filter((a) => a.status === "escalated").length,
    resolved:    alerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <div className="flex gap-0 h-full -mx-8 -my-8">
      <div className="flex-1 flex flex-col gap-8 px-8 py-8 min-w-0">
        <PageHeader title="Fraud Alerts" subtitle="Investigate and resolve flagged dispensing events" />

        {/* Summary chips */}
        <div className="flex gap-3">
          {[
            { label: "Total",     value: counts.total,     style: "bg-[#F4F6F8] text-[#1C2536]"  },
            { label: "Open",      value: counts.open,      style: "bg-[#FEF2F2] text-[#EF4444]"  },
            { label: "Escalated", value: counts.escalated, style: "bg-[#FFFBEB] text-[#F59E0B]"  },
            { label: "Resolved",  value: counts.resolved,  style: "bg-[#F0FDF4] text-[#22C55E]"  },
          ].map((c) => (
            <div key={c.label} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold ${c.style}`}>
              <span>{c.value}</span>
              <span className="font-medium opacity-70">{c.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-xl overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["Alert ID", "Time", "Type", "Nozzle", "Severity", "Status"].map((h) => (
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
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState variant="fraud" />
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      onClick={() => setSelected(alert)}
                      className={`border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F4F6F8] transition-colors ${
                        selected?.id === alert.id ? "bg-[#E6F7F6]" : ""
                      } ${alert.severity === "critical" ? "border-l-2 border-l-[#EF4444]" : ""}`}
                    >
                      <td className="px-5 py-3 text-[14px] font-medium text-[#00B4A6] font-mono">
                        {alert.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-[14px] text-[#637381] font-mono whitespace-nowrap">
                        {fmt(alert.created_at)}
                      </td>
                      <td className="px-5 py-3 text-[14px] text-[#1C2536] capitalize">
                        {alert.alert_type.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3 text-[14px] font-medium text-[#1C2536]">
                        {alert.nozzle_id ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize ${SEVERITY_BADGE[alert.severity]}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize ${STATUS_BADGE[alert.status]}`}>
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <FraudDetailPanel
          alert={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
