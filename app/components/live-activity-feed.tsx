"use client";

import { useEffect, useState, useCallback } from "react";
import type { Transaction } from "@/lib/types";

type EventStatus = "completed" | "flagged" | "pending" | "cancelled";

const STATUS_BADGE: Record<string, { label: string; style: string }> = {
  completed: { label: "Verified",   style: "bg-[#F0FDF4] text-[#22C55E]" },
  flagged:   { label: "Fraud",      style: "bg-[#FEF2F2] text-[#EF4444]" },
  pending:   { label: "Pending",    style: "bg-[#FFFBEB] text-[#F59E0B]" },
  cancelled: { label: "Cancelled",  style: "bg-[#F4F6F8] text-[#637381]" },
};

const POLL_MS = 10_000;

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function fmtPKR(n: number): string {
  return `PKR ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export function LiveActivityFeed() {
  const [events,     setEvents]     = useState<Transaction[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/transactions?limit=8`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data: { items: Transaction[]; total: number } = await res.json();
        setEvents(data.items ?? []);
        setLastUpdate(new Date());
      }
    } catch {
      // silently retain last known state
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchLatest();
    const id = setInterval(fetchLatest, POLL_MS);
    return () => clearInterval(id);
  }, [fetchLatest]);

  return (
    <div className="bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1C2536]">Live Activity Feed</h2>
          <p className="text-[13px] text-[#637381]">
            {lastUpdate
              ? `Updated ${lastUpdate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "Loading transactions…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[12px] text-[#22C55E] font-semibold">LIVE</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              {["Time", "Nozzle", "Litres", "Amount", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-[#E5E7EB] last:border-0">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-3">
                      <div className="h-4 bg-[#F4F6F8] rounded animate-pulse" style={{ width: j === 0 ? 60 : j === 4 ? 70 : 80 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-[#637381]">
                  No recent dispensing activity
                </td>
              </tr>
            ) : (
              events.map((ev) => {
                const badge = STATUS_BADGE[ev.status] ?? STATUS_BADGE["pending"];
                return (
                  <tr
                    key={ev.id}
                    className={`border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F8] transition-colors ${
                      ev.status === "flagged" ? "border-l-2 border-l-[#EF4444]" : ""
                    }`}
                  >
                    <td className="px-6 py-3 text-[14px] text-[#637381] font-mono">
                      {fmtTime(ev.created_at)}
                    </td>
                    <td className="px-6 py-3 text-[14px] font-medium text-[#1C2536]">
                      {ev.nozzle_id}
                    </td>
                    <td className="px-6 py-3 text-[14px] text-[#1C2536]">
                      {ev.litres_dispensed.toFixed(1)} L
                    </td>
                    <td className="px-6 py-3 text-[14px] font-medium text-[#1C2536]">
                      {fmtPKR(ev.total_amount)}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[12px] font-semibold ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
