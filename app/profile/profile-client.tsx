"use client";

import { useTransition, useState } from "react";
import { Camera, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { PageHeader } from "../components/page-header";

interface ProfileData {
  full_name:  string;
  email:      string;
  phone:      string | null;
  role:       string;
  created_at: string;
}

interface Props {
  profile:     ProfileData;
  accessToken: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";
}

export function ProfileClient({ profile, accessToken }: Props) {
  const [form, setForm] = useState({
    full_name: profile.full_name,
    phone:     profile.phone ?? "",
  });
  const [editing,   setEditing]   = useState(false);
  const [status,    setStatus]    = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              full_name: form.full_name || undefined,
              phone:     form.phone    || undefined,
            }),
          }
        );
        if (res.ok) {
          setEditing(false);
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 2500);
        } else {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
        }
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    });
  };

  const initials  = getInitials(form.full_name);
  const joinedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Profile" subtitle="Manage your personal information" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left — profile card */}
        <div className="col-span-4 flex flex-col gap-6">
          <div
            className="bg-white rounded-xl p-6 flex flex-col items-center gap-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[28px] font-bold">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00B4A6] flex items-center justify-center text-white hover:bg-[#009E91] transition-colors">
                <Camera size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold text-[#1C2536]">{form.full_name}</p>
              <p className="text-[13px] text-[#637381] mt-0.5 capitalize">{profile.role.replace(/_/g, " ")}</p>
            </div>
            <span className="px-3 py-1 bg-[#E6F7F6] text-[#00B4A6] text-[12px] font-semibold rounded-full">
              Active
            </span>
          </div>

          <div
            className="bg-white rounded-xl p-5 flex flex-col gap-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[13px] font-semibold text-[#1C2536]">Contact Info</p>
            {[
              { icon: Mail,     value: profile.email                   },
              { icon: Phone,    value: form.phone     || "—"           },
              { icon: Briefcase,value: profile.role.replace(/_/g, " ") },
              { icon: MapPin,   value: `Joined ${joinedDate}`          },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4F6F8] flex items-center justify-center shrink-0">
                  <Icon size={15} strokeWidth={1.5} color="#637381" />
                </div>
                <span className="text-[13px] text-[#637381] capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — edit form */}
        <div className="col-span-8">
          <div
            className="bg-white rounded-xl"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-[14px] font-semibold text-[#1C2536]">Personal Information</h2>
                <p className="text-[13px] text-[#637381]">Update your display name and phone number</p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold text-[#637381] hover:border-[#00B4A6] hover:text-[#00B4A6] transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setForm({ full_name: profile.full_name, phone: profile.phone ?? "" }); }}
                    className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold text-[#637381] hover:bg-[#F4F6F8] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg bg-[#00B4A6] text-white text-[13px] font-semibold hover:bg-[#009E91] transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {status === "saved" && (
              <div className="mx-6 mt-4 px-4 py-2.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-lg text-[13px] text-[#22C55E] font-medium">
                ✓ Profile updated successfully
              </div>
            )}
            {status === "error" && (
              <div className="mx-6 mt-4 px-4 py-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg text-[13px] text-[#EF4444] font-medium">
                Failed to save. Please try again.
              </div>
            )}

            <div className="px-6 py-2">
              {[
                { label: "Full Name",     key: "full_name" as const, editable: true  },
                { label: "Email Address", key: null,                  editable: false, value: profile.email },
                { label: "Phone Number",  key: "phone"    as const,  editable: true  },
                { label: "Role",          key: null,                  editable: false, value: profile.role.replace(/_/g, " ") },
                { label: "Member Since",  key: null,                  editable: false, value: joinedDate },
              ].map(({ label, key, editable, value }) => (
                <div key={label} className="py-4 border-b border-[#E5E7EB] last:border-0 flex items-center gap-6">
                  <span className="w-36 shrink-0 text-[13px] font-medium text-[#637381]">{label}</span>
                  {editing && editable && key ? (
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key!]: e.target.value }))}
                      className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]"
                    />
                  ) : (
                    <span className="text-[14px] text-[#1C2536] capitalize">
                      {key ? (form[key] || "—") : (value || "—")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
