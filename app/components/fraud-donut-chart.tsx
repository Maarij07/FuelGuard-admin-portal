"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DATA = [
  { name: "Verified", value: 94, color: "#00B4A6" },
  { name: "Fraud", value: 6, color: "#EF4444" },
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white rounded-lg px-3 py-2 text-[13px]"
      style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)" }}
    >
      <p className="font-semibold text-[#1C2536]">{payload[0].name}</p>
      <p className="text-[#637381]">{payload[0].value}%</p>
    </div>
  );
};

export function FraudDonutChart() {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col gap-4"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div>
        <h2 className="text-[14px] font-semibold text-[#1C2536]">Fraud vs Verified</h2>
        <p className="text-[13px] text-[#637381]">This week's transactions</p>
      </div>

      {/* Chart with fixed height so ResponsiveContainer resolves correctly */}
      <div className="relative" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={3}
              stroke="#ffffff"
              animationDuration={400}
              animationEasing="ease"
            >
              {DATA.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label — overlaid absolutely */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[28px] font-bold text-[#1C2536] tracking-[-0.5px]">94%</p>
          <p className="text-[12px] text-[#919EAB]">Verified</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6">
        {DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-[12px] text-[#637381] font-medium">{d.name}</span>
            <span className="text-[12px] font-semibold text-[#1C2536]">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
