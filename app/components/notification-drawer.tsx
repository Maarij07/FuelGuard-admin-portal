"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ShieldAlert, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import type { FraudAlert, FraudSeverity } from "@/lib/types";

const SEVERITY_ICON: Record<FraudSeverity, { icon: typeof ShieldAlert; color: string; bg: string }> = {
  low:      { icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB" },
  medium:   { icon: ShieldAlert,   color: "#F59E0B", bg: "#FFFBEB" },
  high:     { icon: ShieldAlert,   color: "#EF4444", bg: "#FEF2F2" },
  critical: { icon: ShieldAlert,   color: "#EF4444", bg: "#FEF2F2" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 1)  return `${days}d ago`;
  if (days  === 1) return "Yesterday";
  if (hours > 1)  return `${hours}h ago`;
  if (hours === 1) return "1 hr ago";
  if (mins  > 1)  return `${mins} min ago`;
  return "Just now";
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ open, onClose }: Props) {
  const [alerts,  setAlerts]  = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [read,    setRead]    = useState<Set<string>>(new Set());

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fraud/alerts?limit=20`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data: { items: FraudAlert[] } = await res.json();
        setAlerts(data.items ?? []);
      }
    } catch {
      // retain last state
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when drawer opens
  useEffect(() => {
    if (open) fetchAlerts();
  }, [open, fetchAlerts]);

  const unreadCount = alerts.filter((a) => !read.has(a.id)).length;

  const markAllRead = () => setRead(new Set(alerts.map((a) => a.id)));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(28,37,54,0.25)" }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 h-full w-[380px] bg-white z-50 flex flex-col"
        style={{
          boxShadow: "-4px 0 24px rgba(0,0,0,0.10)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 200ms ease",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-[#1C2536]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold bg-[#FEF2F2] text-[#EF4444] px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[12px] font-medium text-[#00B4A6] hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F4F6F8] text-[#637381] transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-5 py-4 border-b border-[#E5E7EB]">
                <div className="w-9 h-9 rounded-lg bg-[#F4F6F8] animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 bg-[#F4F6F8] rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-[#F4F6F8] rounded animate-pulse w-full" />
                </div>
              </div>
            ))
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                <CheckCircle size={24} color="#22C55E" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-semibold text-[#1C2536]">All clear</p>
              <p className="text-[13px] text-[#919EAB]">No fraud alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const cfg    = SEVERITY_ICON[alert.severity];
              const isRead = read.has(alert.id);
              return (
                <div
                  key={alert.id}
                  onClick={() => setRead((prev) => new Set([...prev, alert.id]))}
                  className={`flex gap-3 px-5 py-4 border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F4F6F8] transition-colors ${
                    !isRead ? "bg-[#FAFBFF]" : ""
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <cfg.icon size={16} strokeWidth={1.5} color={cfg.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[13px] ${!isRead ? "font-semibold text-[#1C2536]" : "font-medium text-[#637381]"}`}>
                        {alert.alert_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </p>
                      <span className="text-[11px] text-[#919EAB] shrink-0">
                        {relativeTime(alert.created_at)}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#919EAB] mt-0.5 truncate">
                      {alert.nozzle_id ? `Nozzle ${alert.nozzle_id} — ` : ""}
                      {alert.description || `${alert.severity} severity alert`}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${
                        alert.status === "resolved"
                          ? "bg-[#F0FDF4] text-[#22C55E]"
                          : alert.status === "escalated"
                          ? "bg-[#FFFBEB] text-[#F59E0B]"
                          : "bg-[#FEF2F2] text-[#EF4444]"
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  {!isRead && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] shrink-0">
          <a
            href="/fraud"
            onClick={onClose}
            className="flex items-center justify-center w-full py-2 text-[13px] font-semibold text-[#00B4A6] hover:bg-[#E6F7F6] rounded-lg transition-colors gap-2"
          >
            <Activity size={14} strokeWidth={1.5} />
            View All Fraud Alerts
          </a>
        </div>
      </div>
    </>
  );
}
