"use client";

import { Bell, Search, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificationDrawer } from "./notification-drawer";
import { SearchModal } from "./search-modal";
import { LogoutModal } from "./logout-modal";

const PAGE_TITLES: Record<string, string> = {
  "/":                "Dashboard",
  "/nozzles":         "Live Nozzle Monitor",
  "/fraud":           "Fraud Alerts",
  "/transactions":    "All Transactions",
  "/reports":         "Reports",
  "/employees":       "Employee Management",
  "/settings":        "Station Settings",
  "/profile":         "Profile",
  "/account-settings":"Account Settings",
};

interface ShellUser {
  name: string;
  email: string;
  uid: string;
}

interface Props {
  user: ShellUser | null;
  openFraudCount: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";
}

export function TopBar({ user, openFraudCount }: Props) {
  const pathname = usePathname();
  const title    = PAGE_TITLES[pathname] ?? "Fuel Guard";

  const [notifOpen,  setNotifOpen]  = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);

  // Ctrl+K / ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = user?.name  ?? "Admin";
  const displayEmail = user?.email ?? "";
  const initials    = getInitials(displayName);

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center px-8 gap-4 shrink-0 relative z-30">
        <div className="flex-1">
          <h1 className="text-[24px] font-bold text-[#1C2536] tracking-[-0.3px]">{title}</h1>
        </div>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] text-[#919EAB] text-[13px] hover:border-[#00B4A6] hover:text-[#637381] transition-colors min-w-[200px]"
        >
          <Search size={16} strokeWidth={1.5} />
          <span>Search...</span>
          <kbd className="ml-auto text-[11px] bg-[#F4F6F8] text-[#919EAB] px-1.5 py-0.5 rounded font-medium">Ctrl K</kbd>
        </button>

        {/* Bell */}
        <button
          onClick={() => setNotifOpen(true)}
          className="relative p-2 rounded-lg hover:bg-[#F4F6F8] text-[#637381] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.5} />
          {openFraudCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#EF4444] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-0.5">
              {openFraudCount > 99 ? "99+" : openFraudCount}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-[#E5E7EB]" />

        {/* Avatar dropdown */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => setAvatarOpen((p) => !p)}
            className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-[#F4F6F8] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[13px] font-semibold">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-[13px] font-medium text-[#1C2536]">{displayName}</p>
              <p className="text-[11px] text-[#919EAB]">{displayEmail}</p>
            </div>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              color="#919EAB"
              style={{ transform: avatarOpen ? "rotate(180deg)" : "none", transition: "transform 150ms ease" }}
            />
          </button>

          {avatarOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl py-1 z-50"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}
            >
              <div className="px-4 py-2.5 border-b border-[#E5E7EB]">
                <p className="text-[13px] font-semibold text-[#1C2536]">{displayName}</p>
                <p className="text-[11px] text-[#919EAB]">{displayEmail}</p>
              </div>

              <a
                href="/profile"
                onClick={() => setAvatarOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#637381] hover:bg-[#F4F6F8] transition-colors"
              >
                <User size={15} strokeWidth={1.5} /> Profile
              </a>
              <a
                href="/account-settings"
                onClick={() => setAvatarOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#637381] hover:bg-[#F4F6F8] transition-colors"
              >
                <Settings size={15} strokeWidth={1.5} /> Account Settings
              </a>

              <div className="border-t border-[#E5E7EB] mt-1 pt-1">
                <button
                  onClick={() => { setAvatarOpen(false); setLogoutOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                >
                  <LogOut size={15} strokeWidth={1.5} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {logoutOpen && <LogoutModal onClose={() => setLogoutOpen(false)} />}
    </>
  );
}
