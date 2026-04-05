"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PageHeader } from "../components/page-header";

type Section = "security" | "notifications" | "appearance" | "sessions";

const NAV: { key: Section; label: string }[] = [
  { key: "security", label: "Security" },
  { key: "notifications", label: "Notifications" },
  { key: "appearance", label: "Appearance" },
  { key: "sessions", label: "Active Sessions" },
];

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-[#00B4A6]" : "bg-[#E5E7EB]"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

function SettingRow({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB] last:border-0 gap-6">
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#1C2536]">{label}</p>
        <p className="text-[13px] text-[#637381] mt-0.5">{sub}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function PasswordField({ label, placeholder }: { label: string; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#637381]">{label}</label>
      <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-[#00B4A6]">
        <input type={show ? "text" : "password"} placeholder={placeholder} className="flex-1 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] outline-none bg-transparent" />
        <button type="button" onClick={() => setShow(!show)} className="text-[#919EAB] hover:text-[#637381]">
          {show ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
}

const SESSIONS = [
  { device: "Chrome · Windows 11", location: "Islamabad, PK", time: "Active now", current: true },
  { device: "Safari · iPhone 15", location: "Islamabad, PK", time: "2 hours ago", current: false },
  { device: "Firefox · macOS", location: "Lahore, PK", time: "3 days ago", current: false },
];

function SecuritySection() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-[#1C2536]">Change Password</h3>
        {saved && <div className="px-4 py-2.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-lg text-[13px] text-[#22C55E] font-medium">✓ Password updated successfully</div>}
        <PasswordField label="Current Password" placeholder="Enter current password" />
        <PasswordField label="New Password" placeholder="At least 8 characters" />
        <PasswordField label="Confirm New Password" placeholder="Repeat new password" />
        <button onClick={handleSave} className="self-start px-5 py-2.5 rounded-lg bg-[#00B4A6] text-white text-[13px] font-semibold hover:bg-[#009E91] transition-colors">
          Update Password
        </button>
      </div>
      <div className="border-t border-[#E5E7EB] pt-6">
        <SettingRow label="Two-Factor Authentication" sub="Add an extra layer of security with an authenticator app">
          <button className="px-3 py-1.5 rounded-lg border border-[#00B4A6] text-[#00B4A6] text-[12px] font-semibold hover:bg-[#E6F7F6] transition-colors">Enable 2FA</button>
        </SettingRow>
        <SettingRow label="Login Alerts" sub="Get notified by email when a new device logs in">
          <Toggle defaultChecked />
        </SettingRow>
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div>
      <SettingRow label="Fraud Alert Emails" sub="Receive an email immediately when a fraud event is detected"><Toggle defaultChecked /></SettingRow>
      <SettingRow label="Daily Summary Email" sub="A daily digest of transactions and system status sent at 08:00"><Toggle defaultChecked /></SettingRow>
      <SettingRow label="Weekly Report" sub="A weekly performance report every Monday morning"><Toggle /></SettingRow>
      <SettingRow label="In-App Toast Notifications" sub="Show toasts for live fraud alerts and system events"><Toggle defaultChecked /></SettingRow>
      <SettingRow label="Employee Action Alerts" sub="Notify when an employee is assigned, edited, or deactivated"><Toggle /></SettingRow>
      <SettingRow label="Resolved Alert Confirmations" sub="Send a confirmation when a fraud alert is marked resolved"><Toggle defaultChecked /></SettingRow>
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState("light");
  const [density, setDensity] = useState("comfortable");
  return (
    <div>
      <SettingRow label="Theme" sub="Choose between light and dark mode (dark is read-only on this build)">
        <div className="flex gap-1 p-1 bg-[#F4F6F8] rounded-lg">
          {["light", "dark"].map((t) => (
            <button key={t} onClick={() => setTheme(t)} disabled={t === "dark"}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-colors disabled:opacity-40 ${theme === t ? "bg-white text-[#1C2536] shadow-sm" : "text-[#637381]"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Table Density" sub="Controls row height in all data tables">
        <select value={density} onChange={(e) => setDensity(e.target.value)} className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]">
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
          <option value="spacious">Spacious</option>
        </select>
      </SettingRow>
      <SettingRow label="Animate Chart Transitions" sub="Enable 400ms entrance animations on all charts">
        <Toggle defaultChecked />
      </SettingRow>
      <SettingRow label="Sidebar Default State" sub="Start with the sidebar expanded or collapsed">
        <div className="flex gap-1 p-1 bg-[#F4F6F8] rounded-lg">
          {["Expanded", "Collapsed"].map((s) => (
            <button key={s} className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors ${s === "Expanded" ? "bg-white text-[#1C2536] shadow-sm" : "text-[#637381]"}`}>{s}</button>
          ))}
        </div>
      </SettingRow>
    </div>
  );
}

function SessionsSection() {
  return (
    <div className="flex flex-col gap-4">
      {SESSIONS.map((s, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0 gap-4">
          <div className="w-9 h-9 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[18px]">
            {s.device.includes("Chrome") ? "🌐" : s.device.includes("Safari") ? "🍎" : "🦊"}
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-[#1C2536]">{s.device}</p>
            <p className="text-[12px] text-[#919EAB]">{s.location} · {s.time}</p>
          </div>
          {s.current ? (
            <span className="text-[12px] font-semibold text-[#22C55E] bg-[#F0FDF4] px-2.5 py-1 rounded-full">Current</span>
          ) : (
            <button className="text-[12px] font-semibold text-[#EF4444] border border-[#EF4444] px-3 py-1.5 rounded-lg hover:bg-[#FEF2F2] transition-colors">Revoke</button>
          )}
        </div>
      ))}
      <button className="self-start mt-2 px-4 py-2 rounded-lg border border-[#EF4444] text-[#EF4444] text-[13px] font-semibold hover:bg-[#FEF2F2] transition-colors">
        Sign Out All Other Sessions
      </button>
    </div>
  );
}

const SECTION_CONTENT: Record<Section, React.ReactNode> = {
  security: <SecuritySection />,
  notifications: <NotificationsSection />,
  appearance: <AppearanceSection />,
  sessions: <SessionsSection />,
};

export default function AccountSettingsPage() {
  const [section, setSection] = useState<Section>("security");

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Account Settings" subtitle="Manage security, notifications, and preferences" />

      <div className="flex gap-6 items-start">
        <div className="w-[200px] shrink-0 bg-white rounded-xl py-2" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setSection(n.key)}
              className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors relative ${section === n.key ? "text-[#00B4A6] bg-[#E6F7F6]" : "text-[#637381] hover:bg-[#F4F6F8]"}`}>
              {section === n.key && <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#00B4A6] rounded-full" />}
              {n.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-5 border-b border-[#E5E7EB]">
            <h2 className="text-[16px] font-semibold text-[#1C2536]">{NAV.find((n) => n.key === section)?.label}</h2>
          </div>
          <div className="px-6 py-2">{SECTION_CONTENT[section]}</div>
        </div>
      </div>
    </div>
  );
}
