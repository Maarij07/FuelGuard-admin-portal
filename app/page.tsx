import {
  Activity,
  BadgeDollarSign,
  ShieldAlert,
  Droplets,
} from "lucide-react";
import { KPICard } from "./components/kpi-card";
import { TransactionChart } from "./components/transaction-chart";
import { FraudDonutChart } from "./components/fraud-donut-chart";
import { LiveActivityFeed } from "./components/live-activity-feed";

const KPI_DATA = [
  {
    icon: Activity,
    value: "14",
    label: "Active Sessions",
    sublabel: "Nozzles currently dispensing",
    trend: "+3",
    trendDirection: "up" as const,
  },
  {
    icon: BadgeDollarSign,
    value: "PKR 847K",
    label: "Total Revenue Today",
    sublabel: "Transactions since midnight",
    trend: "+12.4%",
    trendDirection: "up" as const,
  },
  {
    icon: ShieldAlert,
    value: "3",
    label: "Fraud Alerts",
    sublabel: "Unresolved this week",
    trend: "+2",
    trendDirection: "down" as const,
    alert: true,
  },
  {
    icon: Droplets,
    value: "28.4 L",
    label: "Avg. Dispensed",
    sublabel: "Per transaction today",
    trend: "+2.3 L",
    trendDirection: "up" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div>
        <h2 className="text-[18px] font-semibold text-[#1C2536] tracking-[-0.2px]">
          Overview
        </h2>
        <p className="text-[13px] text-[#637381] mt-0.5">
          System-wide status as of today, 5 Apr 2026
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6">
        {KPI_DATA.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <TransactionChart />
        </div>
        <div className="col-span-4">
          <FraudDonutChart />
        </div>
      </div>

      {/* Live Activity Feed */}
      <LiveActivityFeed />
    </div>
  );
}
