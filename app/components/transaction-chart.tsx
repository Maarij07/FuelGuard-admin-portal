"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ChartPoint = { day: string; transactions: number };
export type ChartRange  = "7d" | "30d";

interface Props {
  data7d?:  ChartPoint[];
  data30d?: ChartPoint[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white rounded-lg px-3 py-2 text-[13px]"
      style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)" }}
    >
      <p className="text-[#637381]">{label}</p>
      <p className="font-semibold text-[#1C2536]">{payload[0].value} transactions</p>
    </div>
  );
};

export function TransactionChart({ data7d = [], data30d = [] }: Props) {
  const [range,   setRange]   = useState<ChartRange>("7d");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const data = range === "7d" ? data7d : data30d;

  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col gap-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1C2536]">Transaction Volume</h2>
          <p className="text-[13px] text-[#637381]">Total dispensing events</p>
        </div>
        <div className="flex gap-1 p-1 bg-[#F4F6F8] rounded-lg">
          {(["7d", "30d"] as ChartRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-colors ${
                range === r
                  ? "bg-white text-[#1C2536] shadow-sm"
                  : "text-[#637381] hover:text-[#1C2536]"
              }`}
            >
              {r === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Only render after mount — ResponsiveContainer returns -1 during SSR */}
      <div style={{ height: 208, minWidth: 0 }}>
        {mounted ? <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B4A6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00B4A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#F0F0F0" horizontal vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#919EAB", fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#919EAB", fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="#00B4A6"
              strokeWidth={2}
              fill="url(#tealGradient)"
              animationDuration={400}
              animationEasing="ease"
            />
          </AreaChart>
        </ResponsiveContainer> : null}
      </div>
    </div>
  );
}
