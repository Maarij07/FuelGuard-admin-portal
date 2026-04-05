"use client";

import { useEffect, useState } from "react";

type EventStatus = "verified" | "fraud" | "pending";

interface FeedEvent {
  id: string;
  timestamp: string;
  nozzle: string;
  litres: string;
  pkr: string;
  status: EventStatus;
}

const INITIAL_EVENTS: FeedEvent[] = [
  { id: "E001", timestamp: "14:32:01", nozzle: "N-01", litres: "28.4 L", pkr: "PKR 4,260", status: "verified" },
  { id: "E002", timestamp: "14:31:47", nozzle: "N-03", litres: "31.0 L", pkr: "PKR 4,650", status: "fraud" },
  { id: "E003", timestamp: "14:31:22", nozzle: "N-02", litres: "15.5 L", pkr: "PKR 2,325", status: "verified" },
  { id: "E004", timestamp: "14:30:58", nozzle: "N-04", litres: "40.0 L", pkr: "PKR 6,000", status: "verified" },
  { id: "E005", timestamp: "14:30:33", nozzle: "N-01", litres: "22.1 L", pkr: "PKR 3,315", status: "pending" },
  { id: "E006", timestamp: "14:30:11", nozzle: "N-05", litres: "18.8 L", pkr: "PKR 2,820", status: "verified" },
  { id: "E007", timestamp: "14:29:50", nozzle: "N-02", litres: "35.6 L", pkr: "PKR 5,340", status: "fraud" },
  { id: "E008", timestamp: "14:29:22", nozzle: "N-03", litres: "10.0 L", pkr: "PKR 1,500", status: "verified" },
];

const STATUS_BADGE: Record<EventStatus, { label: string; style: string }> = {
  verified: { label: "Verified", style: "bg-[#F0FDF4] text-[#22C55E]" },
  fraud: { label: "Fraud", style: "bg-[#FEF2F2] text-[#EF4444]" },
  pending: { label: "Pending", style: "bg-[#FFFBEB] text-[#F59E0B]" },
};

export function LiveActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(INITIAL_EVENTS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tick === 0) return;
    const nozzles = ["N-01", "N-02", "N-03", "N-04", "N-05"];
    const statuses: EventStatus[] = ["verified", "verified", "verified", "fraud", "pending"];
    const litreVal = (Math.random() * 35 + 10).toFixed(1);
    const pkrVal = Math.round(parseFloat(litreVal) * 150).toLocaleString();
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const newEvent: FeedEvent = {
      id: `E${String(tick + 100).padStart(3, "0")}`,
      timestamp: time,
      nozzle: nozzles[Math.floor(Math.random() * nozzles.length)],
      litres: `${litreVal} L`,
      pkr: `PKR ${pkrVal}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
  }, [tick]);

  return (
    <div className="bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1C2536]">Live Activity Feed</h2>
          <p className="text-[13px] text-[#637381]">Real-time dispensing events</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] pulse-dot" />
          <span className="text-[12px] text-[#22C55E] font-semibold">LIVE</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              {["Time", "Nozzle", "Litres", "Amount", "Status"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr
                key={ev.id}
                className={`border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F8] transition-colors relative ${
                  ev.status === "fraud" ? "border-l-2 border-l-[#EF4444]" : ""
                }`}
              >
                <td className="px-6 py-3 text-[14px] text-[#637381] font-mono">{ev.timestamp}</td>
                <td className="px-6 py-3 text-[14px] font-medium text-[#1C2536]">{ev.nozzle}</td>
                <td className="px-6 py-3 text-[14px] text-[#1C2536]">{ev.litres}</td>
                <td className="px-6 py-3 text-[14px] font-medium text-[#1C2536]">{ev.pkr}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[12px] font-semibold ${STATUS_BADGE[ev.status].style}`}>
                    {STATUS_BADGE[ev.status].label}
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
