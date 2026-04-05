"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Employee } from "./employee-detail-panel";

interface AddEmployeeModalProps {
  onClose: () => void;
  onAdd: (employee: Employee) => void;
}

const ALL_NOZZLES = ["N-01", "N-02", "N-03", "N-04", "N-05"];

type FormErrors = Partial<Record<"name" | "email" | "phone" | "nozzles", string>>;

function validate(name: string, email: string, phone: string, nozzles: string[]): FormErrors {
  const errs: FormErrors = {};
  if (!name.trim()) errs.name = "Full name is required";
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required";
  if (!phone.trim()) errs.phone = "Phone number is required";
  if (nozzles.length === 0) errs.nozzles = "Assign at least one nozzle";
  return errs;
}

export function AddEmployeeModal({ onClose, onAdd }: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nozzles, setNozzles] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const toggleNozzle = (n: string) =>
    setNozzles((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]);

  const handleSubmit = () => {
    const errs = validate(name, email, phone, nozzles);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);

    // Simulate async save
    setTimeout(() => {
      const initials = name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
      const id = `EMP-${String(Math.floor(Math.random() * 900) + 100)}`;
      onAdd({
        id: Date.now().toString(),
        name: name.trim(),
        initials,
        employeeId: id,
        nozzles,
        txnsToday: 0,
        fraudIncidents: 0,
        status: "active",
        verifiedPct: 100,
        totalTxns: 0,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(28,37,54,0.4)" }}>
      <div className="bg-white rounded-xl w-full max-w-md" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1C2536]">Add Employee</h2>
            <p className="text-[13px] text-[#637381]">Create a new attendant account</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F4F6F8] text-[#637381] transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="text-[13px] font-medium text-[#637381] block mb-1.5">Full Name <span className="text-[#EF4444]">*</span></label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="e.g. Ali Khan"
              className={`w-full border rounded-lg px-3 py-2 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] ${errors.name ? "border-[#EF4444]" : "border-[#E5E7EB]"}`}
            />
            {errors.name && <p className="text-[12px] text-[#EF4444] mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-[13px] font-medium text-[#637381] block mb-1.5">Email Address <span className="text-[#EF4444]">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="e.g. ali@fuelguard.io"
              className={`w-full border rounded-lg px-3 py-2 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] ${errors.email ? "border-[#EF4444]" : "border-[#E5E7EB]"}`}
            />
            {errors.email && <p className="text-[12px] text-[#EF4444] mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-[13px] font-medium text-[#637381] block mb-1.5">Phone Number <span className="text-[#EF4444]">*</span></label>
            <input
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
              placeholder="e.g. +92 300 1234567"
              className={`w-full border rounded-lg px-3 py-2 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] ${errors.phone ? "border-[#EF4444]" : "border-[#E5E7EB]"}`}
            />
            {errors.phone && <p className="text-[12px] text-[#EF4444] mt-1">{errors.phone}</p>}
          </div>

          {/* Nozzles */}
          <div>
            <label className="text-[13px] font-medium text-[#637381] block mb-1.5">Assign Nozzles <span className="text-[#EF4444]">*</span></label>
            <div className="flex gap-2 flex-wrap">
              {ALL_NOZZLES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { toggleNozzle(n); setErrors((p) => ({ ...p, nozzles: undefined })); }}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${nozzles.includes(n) ? "bg-[#00B4A6] text-white border-[#00B4A6]" : "bg-white text-[#637381] border-[#E5E7EB] hover:border-[#00B4A6]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            {errors.nozzles && <p className="text-[12px] text-[#EF4444] mt-1">{errors.nozzles}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] font-semibold text-[#637381] hover:bg-[#F4F6F8] transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-[#00B4A6] text-white text-[14px] font-semibold hover:bg-[#009E91] transition-colors disabled:opacity-60">
            {submitting ? "Adding…" : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
