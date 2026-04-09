"use client";

import { useState } from "react";
import { PageHeader } from "../components/page-header";

type SettingsSection = "general" | "nozzles" | "pricing" | "alerts" | "integrations";

const NAV: { key: SettingsSection; label: string }[] = [
  { key: "general", label: "General" },
  { key: "nozzles", label: "Nozzles" },
  { key: "pricing", label: "Pricing" },
  { key: "alerts", label: "Alerts" },
  { key: "integrations", label: "Integrations" },
];

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

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-[#00B4A6]" : "bg-[#E5E7EB]"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

const SECTION_CONTENT: Record<SettingsSection, React.ReactNode> = {
  general: (
    <>
      <SettingRow label="Station Name" sub="Public display name for this station">
        <input defaultValue="Fuel Guard Station 1" className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-56" />
      </SettingRow>
      <SettingRow label="Time Zone" sub="All timestamps will use this zone">
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-56">
          <option>Asia/Karachi (PKT +5)</option>
          <option>UTC</option>
        </select>
      </SettingRow>
      <SettingRow label="Currency" sub="Used across all revenue displays">
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-56">
          <option>PKR — Pakistani Rupee</option>
          <option>USD — US Dollar</option>
        </select>
      </SettingRow>
      <SettingRow label="Data Retention" sub="How long to keep raw transaction logs">
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-56">
          <option>90 Days</option>
          <option>180 Days</option>
          <option>1 Year</option>
        </select>
      </SettingRow>
    </>
  ),
  nozzles: (
    <>
      <SettingRow label="Sensor Sync Interval" sub="How often nozzle readings are polled (seconds)">
        <input type="number" defaultValue={2} min={1} max={10} className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-32" />
      </SettingRow>
      <SettingRow label="Discrepancy Threshold (Warning)" sub="Delta above which a Warning alert is raised (L)">
        <input type="number" defaultValue={0.5} step={0.1} className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-32" />
      </SettingRow>
      <SettingRow label="Discrepancy Threshold (Critical)" sub="Delta above which a Critical alert is raised (L)">
        <input type="number" defaultValue={2.0} step={0.1} className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-32" />
      </SettingRow>
      <SettingRow label="Auto-flag Tampered Nozzles" sub="Automatically mark nozzle as Tampered when Critical threshold is hit">
        <Toggle defaultChecked />
      </SettingRow>
    </>
  ),
  pricing: (
    <>
      <SettingRow label="Fuel Price per Litre" sub="Current price used for PKR calculations (PKR/L)">
        <input type="number" defaultValue={150} className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-40" />
      </SettingRow>
      <SettingRow label="Tax Rate" sub="Applied to all transaction totals (%)">
        <input type="number" defaultValue={0} className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-40" />
      </SettingRow>
      <SettingRow label="Show Pre-tax Amount" sub="Display pre-tax breakdowns on transaction records">
        <Toggle />
      </SettingRow>
    </>
  ),
  alerts: (
    <>
      <SettingRow label="Email Notifications" sub="Send fraud alert emails to station admin">
        <Toggle defaultChecked />
      </SettingRow>
      <SettingRow label="Admin Email" sub="Destination for system alert emails">
        <input type="email" defaultValue="admin@fuelguard.io" className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] w-56" />
      </SettingRow>
      <SettingRow label="Push Notifications" sub="In-app toast notifications for fraud events">
        <Toggle defaultChecked />
      </SettingRow>
      <SettingRow label="Fraud Alert Persistence" sub="Fraud alerts must be manually dismissed (cannot auto-dismiss)">
        <Toggle defaultChecked />
      </SettingRow>
    </>
  ),
  integrations: (
    <>
      <SettingRow label="API Base URL" sub="Railway-deployed REST API base URL">
        <input
          readOnly
          defaultValue={process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-0cb0e.up.railway.app"}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#919EAB] bg-[#F4F6F8] focus:outline-none w-64 cursor-not-allowed"
        />
      </SettingRow>
      <SettingRow label="IoT Device Auth" sub="BLE nozzle devices authenticate via Firebase Auth">
        <span className="text-[13px] font-medium text-[#22C55E] bg-[#F0FDF4] px-3 py-1.5 rounded-lg">Firebase Auth (Active)</span>
      </SettingRow>
      <SettingRow label="Admin Panel Auth" sub="JWT tokens stored as httpOnly cookies">
        <span className="text-[13px] font-medium text-[#00B4A6] bg-[#E6F7F6] px-3 py-1.5 rounded-lg">JWT + HttpOnly Cookies</span>
      </SettingRow>
    </>
  ),
};

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("general");

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Station Settings" subtitle="Configure dispenser parameters and system behaviour" />

      <div className="flex gap-6 items-start">
        {/* Left nav */}
        <div className="w-[200px] shrink-0 bg-white rounded-xl py-2" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setSection(n.key)}
              className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors relative ${section === n.key ? "text-[#00B4A6] bg-[#E6F7F6]" : "text-[#637381] hover:bg-[#F4F6F8]"}`}
            >
              {section === n.key && <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#00B4A6] rounded-full" />}
              {n.label}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-5 border-b border-[#E5E7EB]">
            <h2 className="text-[16px] font-semibold text-[#1C2536]">{NAV.find((n) => n.key === section)?.label}</h2>
          </div>
          <div className="px-6">{SECTION_CONTENT[section]}</div>

          {/* Sticky save */}
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end">
            <button className="px-6 py-2.5 rounded-lg bg-[#00B4A6] text-white text-[14px] font-semibold hover:bg-[#009E91] transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
