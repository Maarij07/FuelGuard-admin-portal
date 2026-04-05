"use client";

import { X, ShieldAlert, Activity, CheckCircle, AlertTriangle } from "lucide-react";

interface Notification {
  id: string;
  type: "fraud" | "session" | "resolved" | "warning";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", type: "fraud", title: "Fraud Detected", body: "Nozzle N-02 — delta 2.6 L (ALT-0041)", time: "2 min ago", read: false },
  { id: "2", type: "fraud", title: "Fraud Detected", body: "Nozzle N-03 — delta 0.7 L (ALT-0040)", time: "38 min ago", read: false },
  { id: "3", type: "warning", title: "Threshold Exceeded", body: "Nozzle N-01 sensor variance above warning level", time: "1 hr ago", read: false },
  { id: "4", type: "session", title: "New Session Started", body: "Active dispensing on N-05 — SES-8821", time: "1 hr ago", read: true },
  { id: "5", type: "resolved", title: "Alert Resolved", body: "ALT-0038 marked resolved by Station Admin", time: "3 hrs ago", read: true },
  { id: "6", type: "session", title: "New Session Started", body: "Active dispensing on N-01 — SES-8820", time: "4 hrs ago", read: true },
  { id: "7", type: "resolved", title: "Alert Resolved", body: "ALT-0037 marked resolved by Ali Khan", time: "Yesterday", read: true },
];

const TYPE_CONFIG = {
  fraud: { icon: ShieldAlert, color: "#EF4444", bg: "#FEF2F2" },
  session: { icon: Activity, color: "#00B4A6", bg: "#E6F7F6" },
  resolved: { icon: CheckCircle, color: "#22C55E", bg: "#F0FDF4" },
  warning: { icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB" },
};

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(28,37,54,0.25)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
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
            {unread > 0 && (
              <span className="text-[11px] font-semibold bg-[#FEF2F2] text-[#EF4444] px-2 py-0.5 rounded-full">
                {unread} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[12px] font-medium text-[#00B4A6] hover:underline">
              Mark all read
            </button>
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
          {NOTIFICATIONS.map((n) => {
            const cfg = TYPE_CONFIG[n.type];
            return (
              <div
                key={n.id}
                className={`flex gap-3 px-5 py-4 border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F4F6F8] transition-colors ${!n.read ? "bg-[#FAFBFF]" : ""}`}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: cfg.bg }}
                >
                  <cfg.icon size={16} strokeWidth={1.5} color={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[13px] ${!n.read ? "font-semibold text-[#1C2536]" : "font-medium text-[#637381]"}`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-[#919EAB] shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[12px] text-[#919EAB] mt-0.5 truncate">{n.body}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] shrink-0">
          <button className="w-full py-2 text-[13px] font-semibold text-[#00B4A6] hover:bg-[#E6F7F6] rounded-lg transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
}
