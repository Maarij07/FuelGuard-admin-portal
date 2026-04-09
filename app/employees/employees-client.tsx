"use client";

import { useTransition, useState } from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { addEmployeeAction, updateEmployeeAction } from "@/app/actions/employees";
import type { Employee } from "@/lib/types";

// ── Add Employee Modal ────────────────────────────────────────────────────────

function AddEmployeeModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await addEmployeeAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
      >
        <h2 className="text-[18px] font-semibold text-[#1C2536] mb-6">Add Employee</h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[13px] text-[#EF4444]">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: "full_name", label: "Full Name",       type: "text",     required: true  },
            { name: "email",     label: "Email Address",   type: "email",    required: true  },
            { name: "password",  label: "Temp Password",   type: "password", required: true  },
            { name: "phone",     label: "Phone (optional)", type: "tel",     required: false },
          ].map(({ name, label, type, required }) => (
            <div key={name}>
              <label className="text-[13px] font-medium text-[#637381] block mb-1.5">{label}</label>
              <input
                name={name}
                type={type}
                required={required}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-[14px] text-[#1C2536] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]"
              />
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#637381] hover:bg-[#F4F6F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-[#00B4A6] text-white text-[14px] font-semibold hover:bg-[#009E91] transition-colors disabled:opacity-60"
            >
              {isPending ? "Adding…" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function EmployeeDetailPanel({
  employee,
  onClose,
  onToggleActive,
}: {
  employee: Employee;
  onClose: () => void;
  onToggleActive: (uid: string, isActive: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await updateEmployeeAction(employee.uid, { is_active: !employee.is_active });
      onToggleActive(employee.uid, !employee.is_active);
    });
  };

  const initials = employee.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-[340px] shrink-0 border-l border-[#E5E7EB] bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <span className="text-[14px] font-semibold text-[#1C2536]">Employee Details</span>
        <button onClick={onClose} className="text-[#919EAB] hover:text-[#637381] text-lg leading-none">×</button>
      </div>

      <div className="flex flex-col gap-5 p-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[16px] font-bold">
            {initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1C2536]">{employee.full_name}</p>
            <p className="text-[13px] text-[#637381]">{employee.email}</p>
          </div>
        </div>

        {[
          { label: "Role",   value: employee.role },
          { label: "Phone",  value: employee.phone ?? "—" },
          { label: "Status", value: employee.is_active ? "Active" : "Inactive" },
          {
            label: "Joined",
            value: employee.created_at
              ? new Date(employee.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "—",
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[12px] font-medium text-[#919EAB] uppercase tracking-[0.4px] mb-0.5">{label}</p>
            <p className="text-[14px] text-[#1C2536] capitalize">{value}</p>
          </div>
        ))}

        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`mt-auto w-full py-2.5 rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-60 ${
            employee.is_active
              ? "bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]"
              : "bg-[#F0FDF4] text-[#22C55E] hover:bg-[#DCFCE7]"
          }`}
        >
          {isPending ? "Updating…" : employee.is_active ? "Deactivate Account" : "Activate Account"}
        </button>
      </div>
    </div>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────────

export function EmployeesClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selected, setSelected]   = useState<Employee | null>(null);
  const [showAdd,  setShowAdd]    = useState(false);

  const handleToggleActive = (uid: string, isActive: boolean) => {
    setEmployees((prev) =>
      prev.map((e) => (e.uid === uid ? { ...e, is_active: isActive } : e))
    );
    setSelected((prev) =>
      prev?.uid === uid ? { ...prev, is_active: isActive } : prev
    );
  };

  const active   = employees.filter((e) => e.is_active).length;
  const inactive = employees.filter((e) => !e.is_active).length;

  return (
    <div className="flex gap-0 h-full -mx-8 -my-8">
      <div className="flex-1 flex flex-col gap-8 px-8 py-8 min-w-0">
        <div className="flex items-end justify-between">
          <PageHeader
            title="Employee Management"
            subtitle="Manage attendant accounts and track performance"
          />
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00B4A6] text-white text-[13px] font-semibold hover:bg-[#009E91] transition-colors"
          >
            <UserPlus size={16} strokeWidth={1.5} /> Add Employee
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          {[
            { label: "Total Employees", value: employees.length },
            { label: "Active",          value: active           },
            { label: "Inactive",        value: inactive         },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl px-5 py-4 flex items-center gap-3"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              <p className="text-[22px] font-bold text-[#1C2536]">{s.value}</p>
              <p className="text-[13px] text-[#637381]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-xl overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["Name", "Email", "Phone", "Status", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState variant="employees" />
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => {
                    const initials = emp.full_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <tr
                        key={emp.uid}
                        onClick={() => setSelected(emp)}
                        className={`border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F4F6F8] transition-colors ${
                          selected?.uid === emp.uid ? "bg-[#E6F7F6]" : ""
                        }`}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                              {initials}
                            </div>
                            <span className="text-[14px] font-medium text-[#1C2536]">{emp.full_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[14px] text-[#637381]">{emp.email}</td>
                        <td className="px-5 py-3 text-[14px] text-[#637381]">{emp.phone ?? "—"}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                              emp.is_active
                                ? "bg-[#F0FDF4] text-[#22C55E]"
                                : "bg-[#F4F6F8] text-[#637381]"
                            }`}
                          >
                            {emp.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[14px] text-[#637381]">
                          {emp.created_at
                            ? new Date(emp.created_at).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <EmployeeDetailPanel
          employee={selected}
          onClose={() => setSelected(null)}
          onToggleActive={handleToggleActive}
        />
      )}

      {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
