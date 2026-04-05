"use client";

import { useEffect, useState } from "react";

type NozzleStatus = "live" | "idle" | "tampered";

interface NozzleCardProps {
  id: string;
  status: NozzleStatus;
  litres: number;
  pkr: number;
  s1: number;
  s2: number;
  customer?: string;
}

const STATUS_CONFIG: Record<NozzleStatus, { label: string; dotColor: string; headerAccent: string }> = {
  live: { label: "LIVE", dotColor: "#22C55E", headerAccent: "" },
  idle: { label: "IDLE", dotColor: "#919EAB", headerAccent: "" },
  tampered: { label: "TAMPERED", dotColor: "#EF4444", headerAccent: "border-t-2 border-[#EF4444]" },
};

export function NozzleCard({ id, status, litres: initialLitres, pkr: initialPkr, s1: initialS1, s2, customer }: NozzleCardProps) {
  const [litres, setLitres] = useState(initialLitres);
  const [pkr, setPkr] = useState(initialPkr);
  const [s1, setS1] = useState(initialS1);

  useEffect(() => {
    if (status !== "live") return;
    const timer = setInterval(() => {
      const delta = parseFloat((Math.random() * 0.3).toFixed(1));
      setLitres((l) => parseFloat((l + delta).toFixed(1)));
      setPkr((p) => Math.round(p + delta * 150));
      setS1((v) => parseFloat((v + delta).toFixed(1)));
    }, 2000);
    return () => clearInterval(timer);
  }, [status]);

  const cfg = STATUS_CONFIG[status];
  const delta = parseFloat((Math.abs(s1 - s2)).toFixed(1));
  const hasMismatch = delta >= 0.5;

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${cfg.headerAccent}`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
        <span className="text-[14px] font-semibold text-[#1C2536]">Nozzle {id}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: cfg.dotColor }} />
          <span className={`text-[11px] font-semibold tracking-[0.6px] uppercase ${status === "tampered" ? "text-[#EF4444]" : status === "live" ? "text-[#22C55E]" : "text-[#919EAB]"}`}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Readings */}
      <div className="px-5 py-4 flex flex-col gap-4">
        <div>
          <p className="text-[28px] font-bold text-[#00B4A6] tracking-[-0.5px] leading-none">{litres.toFixed(1)} L</p>
          <p className="text-[15px] font-medium text-[#1C2536] mt-1">PKR {pkr.toLocaleString()}</p>
        </div>

        {/* Sensor row */}
        <div className="flex gap-4 py-3 border-t border-b border-[#E5E7EB]">
          <div className="flex-1">
            <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-0.5">S1</p>
            <p className="text-[14px] font-semibold text-[#1C2536]">{s1.toFixed(1)} L</p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-[#919EAB] uppercase tracking-[0.6px] font-medium mb-0.5">S2</p>
            <p className={`text-[14px] font-semibold ${hasMismatch ? "text-[#EF4444]" : "text-[#1C2536]"}`}>{s2.toFixed(1)} L</p>
          </div>
        </div>

        {/* Verdict */}
        {!hasMismatch ? (
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-[#F0FDF4] text-[#22C55E] px-3 py-1 rounded-[6px]">
              ✓ Verified
            </span>
            {customer && <span className="text-[12px] text-[#637381]">{customer}</span>}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-[#FEF2F2] text-[#EF4444] px-3 py-1 rounded-[6px]">
            ✕ Discrepancy: {delta} L
          </span>
        )}
      </div>
    </div>
  );
}
