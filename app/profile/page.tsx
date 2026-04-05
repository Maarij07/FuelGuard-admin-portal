"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Briefcase, Shield } from "lucide-react";
import { PageHeader } from "../components/page-header";

const ACTIVITY_LOG = [
  { action: "Resolved fraud alert ALT-0038", time: "Today, 10:44", icon: Shield, color: "#22C55E" },
  { action: "Exported transactions report (PDF)", time: "Today, 09:30", icon: Briefcase, color: "#3B82F6" },
  { action: "Updated nozzle N-02 threshold to 2.0 L", time: "Yesterday, 16:15", icon: Briefcase, color: "#00B4A6" },
  { action: "Deactivated employee EMP-004", time: "Yesterday, 14:02", icon: Shield, color: "#F59E0B" },
  { action: "Escalated alert ALT-0040", time: "2 days ago, 11:30", icon: Shield, color: "#EF4444" },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Station Admin",
    email: "admin@fuelguard.io",
    phone: "+92 300 1234567",
    location: "Islamabad, Pakistan",
    role: "Station Administrator",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Profile" subtitle="Manage your personal information and activity" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left — profile card */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Avatar card */}
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[28px] font-bold">
                SA
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00B4A6] flex items-center justify-center text-white hover:bg-[#009E91] transition-colors">
                <Camera size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold text-[#1C2536]">{form.name}</p>
              <p className="text-[13px] text-[#637381] mt-0.5">{form.role}</p>
            </div>
            <span className="px-3 py-1 bg-[#E6F7F6] text-[#00B4A6] text-[12px] font-semibold rounded-full">Active</span>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-xl p-5 flex flex-col gap-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <p className="text-[13px] font-semibold text-[#1C2536]">Contact Info</p>
            {[
              { icon: Mail, value: form.email },
              { icon: Phone, value: form.phone },
              { icon: MapPin, value: form.location },
              { icon: Briefcase, value: form.role },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4F6F8] flex items-center justify-center shrink-0">
                  <Icon size={15} strokeWidth={1.5} color="#637381" />
                </div>
                <span className="text-[13px] text-[#637381]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — edit form + activity */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Edit form */}
          <div className="bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-[14px] font-semibold text-[#1C2536]">Personal Information</h2>
                <p className="text-[13px] text-[#637381]">Update your profile details</p>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold text-[#637381] hover:border-[#00B4A6] hover:text-[#00B4A6] transition-colors">
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold text-[#637381] hover:bg-[#F4F6F8] transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#00B4A6] text-white text-[13px] font-semibold hover:bg-[#009E91] transition-colors">Save Changes</button>
                </div>
              )}
            </div>

            {saved && (
              <div className="mx-6 mt-4 px-4 py-2.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-lg text-[13px] text-[#22C55E] font-medium">
                ✓ Profile updated successfully
              </div>
            )}

            <div className="px-6 py-2">
              {[
                { label: "Full Name", key: "name" as const },
                { label: "Email Address", key: "email" as const },
                { label: "Phone Number", key: "phone" as const },
                { label: "Location", key: "location" as const },
                { label: "Role", key: "role" as const },
              ].map(({ label, key }) => (
                <div key={key} className="py-4 border-b border-[#E5E7EB] last:border-0 flex items-center gap-6">
                  <span className="w-36 shrink-0 text-[13px] font-medium text-[#637381]">{label}</span>
                  {editing ? (
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]"
                    />
                  ) : (
                    <span className="text-[14px] text-[#1C2536]">{form[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-[14px] font-semibold text-[#1C2536]">Recent Activity</h2>
              <p className="text-[13px] text-[#637381]">Your last actions on the platform</p>
            </div>
            <div className="px-6 py-2">
              {ACTIVITY_LOG.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3.5 border-b border-[#E5E7EB] last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon size={15} strokeWidth={1.5} color={item.color} />
                  </div>
                  <span className="flex-1 text-[13px] text-[#1C2536]">{item.action}</span>
                  <span className="text-[12px] text-[#919EAB] shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
