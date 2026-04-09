"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { NozzleCard } from "../components/nozzle-card";
import { EmptyState } from "../components/empty-state";
import type { Nozzle } from "@/lib/types";

type Filter = "all" | "live" | "idle" | "flagged";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",     label: "All"     },
  { key: "live",    label: "Live"    },
  { key: "idle",    label: "Idle"    },
  { key: "flagged", label: "Flagged" },
];

// Map API nozzle status to the shape NozzleCard expects
function toCardProps(n: Nozzle) {
  const cardStatus =
    n.status === "active"   ? "live"     :
    n.status === "tampered" ? "tampered" :
    n.status === "offline"  ? "idle"     : "idle";

  return {
    id:       n.nozzle_id || n.id.slice(0, 5),
    status:   cardStatus as "live" | "idle" | "tampered",
    litres:   0,
    pkr:      0,
    s1:       0,
    s2:       0,
    customer: n.status === "active" ? "Active Session" : undefined,
  };
}

const POLL_INTERVAL = 15_000; // refresh nozzle list every 15 s

export function NozzlesClient({ initialNozzles }: { initialNozzles: Nozzle[] }) {
  const [nozzles,     setNozzles]     = useState<Nozzle[]>(initialNozzles);
  const [filter,      setFilter]      = useState<Filter>("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing,  setRefreshing]  = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/nozzles`, {
        credentials: "include",
      });
      if (res.ok) {
        const data: Nozzle[] = await res.json();
        setNozzles(data);
        setLastUpdated(new Date());
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Poll every 15 seconds to keep nozzle status current
  useEffect(() => {
    const id = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [refresh]);

  const cardList = nozzles.map(toCardProps);

  const filtered = cardList.filter((n) => {
    if (filter === "all")     return true;
    if (filter === "live")    return n.status === "live";
    if (filter === "idle")    return n.status === "idle";
    if (filter === "flagged") return n.status === "tampered";
    return true;
  });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <PageHeader
          title="Live Nozzle Monitor"
          subtitle="Real-time status of all dispensing nozzles"
        />

        <div className="flex items-center gap-3">
          {/* Last updated + manual refresh */}
          <div className="flex items-center gap-2 text-[12px] text-[#919EAB]">
            <span className={`w-1.5 h-1.5 rounded-full ${refreshing ? "bg-[#F59E0B]" : "bg-[#22C55E]"} animate-pulse`} />
            Updated {fmtTime(lastUpdated)}
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#637381] hover:border-[#00B4A6] hover:text-[#00B4A6] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} strokeWidth={1.5} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Filter tabs */}
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
      </div>

      {filtered.length === 0 ? (
        nozzles.length === 0
          ? <EmptyState variant="nozzles" />
          : (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
              <p className="text-[14px] font-medium text-[#637381]">No nozzles match this filter</p>
              <p className="text-[12px] text-[#919EAB]">Try selecting a different status</p>
            </div>
          )
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
