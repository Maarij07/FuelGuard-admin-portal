import { type LucideIcon } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface KPICardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  sublabel: string;
  trend?: string;
  trendDirection?: TrendDirection;
  alert?: boolean;
}

const TREND_STYLES: Record<TrendDirection, string> = {
  up: "bg-[#F0FDF4] text-[#22C55E]",
  down: "bg-[#FEF2F2] text-[#EF4444]",
  neutral: "bg-[#F4F6F8] text-[#637381]",
};

const TREND_ARROWS: Record<TrendDirection, string> = {
  up: "↑",
  down: "↓",
  neutral: "—",
};

export function KPICard({
  icon: Icon,
  value,
  label,
  sublabel,
  trend,
  trendDirection = "neutral",
  alert = false,
}: KPICardProps) {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col gap-4"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-[#E6F7F6] flex items-center justify-center">
        <Icon size={20} strokeWidth={1.5} color="#00B4A6" />
      </div>

      {/* Value + Label */}
      <div>
        <p
          className={`text-[32px] font-bold tracking-[-0.5px] leading-none mb-1 ${
            alert ? "text-[#EF4444]" : "text-[#1C2536]"
          }`}
        >
          {value}
        </p>
        <p className="text-[12px] text-[#919EAB] uppercase tracking-[0.6px] font-medium">
          {label}
        </p>
        <p className="text-[13px] text-[#637381] mt-0.5">{sublabel}</p>
      </div>

      {/* Trend chip */}
      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-[6px] ${TREND_STYLES[trendDirection]}`}
          >
            {TREND_ARROWS[trendDirection]} {trend}
          </span>
          <span className="text-[12px] text-[#919EAB]">vs yesterday</span>
        </div>
      )}
    </div>
  );
}
