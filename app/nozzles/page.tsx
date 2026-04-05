"use client";

import { useState } from "react";
import { PageHeader } from "../components/page-header";
import { NozzleCard } from "../components/nozzle-card";

type Filter = "all" | "live" | "idle" | "flagged";

const NOZZLES = [
  { id: "01", status: "live" as const, litres: 24.6, pkr: 3690, s1: 24.6, s2: 24.6, customer: "Active Session" },
  { id: "02", status: "tampered" as const, litres: 31.0, pkr: 4650, s1: 31.0, s2: 28.4 },
  { id: "03", status: "live" as const, litres: 15.5, pkr: 2325, s1: 15.5, s2: 15.5, customer: "Active Session" },
  { id: "04", status: "idle" as const, litres: 0.0, pkr: 0, s1: 0.0, s2: 0.0 },
  { id: "05", status: "live" as const, litres: 40.2, pkr: 6030, s1: 40.2, s2: 40.2, customer: "Active Session" },
  { id: "06", status: "idle" as const, litres: 0.0, pkr: 0, s1: 0.0, s2: 0.0 },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "idle", label: "Idle" },
  { key: "flagged", label: "Flagged" },
];

export default function NozzlesPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = NOZZLES.filter((n) => {
    if (filter === "all") return true;
    if (filter === "live") return n.status === "live";
    if (filter === "idle") return n.status === "idle";
    if (filter === "flagged") return n.status === "tampered";
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <PageHeader
          title="Live Nozzle Monitor"
          subtitle="Real-time status of all dispensing nozzles"
        />
        {/* Filter bar */}
        <div className="flex gap-1 p-1 bg-[#F4F6F8] rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-colors ${
                filter === f.key
                  ? "bg-white text-[#1C2536] shadow-sm"
                  : "text-[#637381] hover:text-[#1C2536]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[14px] text-[#637381]">No nozzles match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((n) => (
            <NozzleCard key={n.id} {...n} />
          ))}
        </div>
      )}
    </div>
  );
}
