"use client";

import {
  LayoutDashboard,
  Radio,
  ShieldAlert,
  ArrowLeftRight,
  BarChart3,
  Users,
  Settings,
  Fuel,
  User,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface Props {
  openFraudCount: number;
}

export function Sidebar({ openFraudCount }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const NAV_GROUPS = [
    {
      label: "OVERVIEW",
      items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/" }],
    },
    {
      label: "MONITORING",
      items: [
        { label: "Live Nozzle Monitor", icon: Radio, href: "/nozzles" },
        { label: "Fraud Alerts", icon: ShieldAlert, href: "/fraud", badge: openFraudCount > 0 ? openFraudCount : null },
      ],
    },
    {
      label: "TRANSACTIONS",
      items: [
        { label: "All Transactions", icon: ArrowLeftRight, href: "/transactions" },
        { label: "Reports", icon: BarChart3, href: "/reports" },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { label: "Employee Management", icon: Users, href: "/employees" },
        { label: "Station Settings", icon: Settings, href: "/settings" },
      ],
    },
    {
      label: "ACCOUNT",
      items: [
        { label: "Profile", icon: User, href: "/profile" },
        { label: "Settings", icon: Settings, href: "/account-settings" },
      ],
    },
  ];

  return (
    <aside
      style={{ width: collapsed ? 72 : 280, transition: "width 200ms ease" }}
      className="flex flex-col h-full bg-white border-r border-[#E5E7EB] shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A2744] shrink-0">
          <Fuel size={16} color="#00B4A6" strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <span className="font-bold text-[15px] text-[#1A2744] tracking-tight whitespace-nowrap">
            Fuel Guard
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-md hover:bg-[#F4F6F8] text-[#637381] transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={16}
            strokeWidth={1.5}
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#919EAB] px-3 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium mb-0.5 transition-colors relative ${
                    isActive
                      ? "bg-[#E6F7F6] text-[#00B4A6]"
                      : "text-[#637381] hover:bg-[#F4F6F8]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#00B4A6] rounded-full" />
                  )}
                  <item.icon size={20} strokeWidth={1.5} className="shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                  )}
                  {!collapsed && item.badge != null && item.badge > 0 && (
                    <span className="text-[11px] font-semibold bg-[#FEF2F2] text-[#EF4444] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
