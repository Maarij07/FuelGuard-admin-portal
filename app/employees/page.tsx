"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmployeeDetailPanel, type Employee } from "../components/employee-detail-panel";
import { AddEmployeeModal } from "../components/add-employee-modal";

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "1", name: "Ali Khan", initials: "AK", employeeId: "EMP-001", nozzles: ["N-01", "N-02"], txnsToday: 42, fraudIncidents: 3, status: "active", verifiedPct: 97, totalTxns: 1284 },
  { id: "2", name: "Sara Ahmed", initials: "SA", employeeId: "EMP-002", nozzles: ["N-03"], txnsToday: 38, fraudIncidents: 0, status: "active", verifiedPct: 100, totalTxns: 980 },
  { id: "3", name: "Usman Malik", initials: "UM", employeeId: "EMP-003", nozzles: ["N-04", "N-05"], txnsToday: 55, fraudIncidents: 8, status: "active", verifiedPct: 92, totalTxns: 1540 },
  { id: "4", name: "Ayesha Raza", initials: "AR", employeeId: "EMP-004", nozzles: ["N-01"], txnsToday: 0, fraudIncidents: 1, status: "inactive", verifiedPct: 99, totalTxns: 742 },
  { id: "5", name: "Bilal Qureshi", initials: "BQ", employeeId: "EMP-005", nozzles: ["N-02", "N-03"], txnsToday: 30, fraudIncidents: 0, status: "active", verifiedPct: 100, totalTxns: 610 },
];

const COL_HEADERS = ["Name", "Employee ID", "Assigned Nozzles", "Txns Today", "Fraud Incidents", "Status"];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex gap-0 h-full -mx-8 -my-8">
      <div className="flex-1 flex flex-col gap-8 px-8 py-8 min-w-0">
        <div className="flex items-end justify-between">
          <PageHeader title="Employee Management" subtitle="Manage attendant accounts and track performance" />
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00B4A6] text-white text-[13px] font-semibold hover:bg-[#009E91] transition-colors">
            <UserPlus size={16} strokeWidth={1.5} /> Add Employee
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-4">
          {[
            { label: "Total Employees", value: employees.length },
            { label: "Active", value: employees.filter((e) => e.status === "active").length },
            { label: "Inactive", value: employees.filter((e) => e.status === "inactive").length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl px-5 py-4 flex items-center gap-3" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
              <p className="text-[22px] font-bold text-[#1C2536]">{s.value}</p>
              <p className="text-[13px] text-[#637381]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {COL_HEADERS.map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[12px] font-semibold text-[#637381] uppercase tracking-[0.4px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelected(emp)}
                    className={`border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F4F6F8] transition-colors ${selected?.id === emp.id ? "bg-[#E6F7F6]" : ""}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                          {emp.initials}
                        </div>
                        <span className="text-[14px] font-medium text-[#1C2536]">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#637381] font-mono">{emp.employeeId}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {emp.nozzles.map((n) => (
                          <span key={n} className="px-2 py-0.5 bg-[#E6F7F6] text-[#00B4A6] text-[12px] font-semibold rounded-full">{n}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#1C2536] font-medium">{emp.txnsToday}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[14px] font-semibold ${emp.fraudIncidents > 0 ? "text-[#EF4444]" : "text-[#22C55E]"}`}>
                        {emp.fraudIncidents}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${emp.status === "active" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-[#F4F6F8] text-[#637381]"}`}>
                        {emp.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && <EmployeeDetailPanel employee={selected} onClose={() => setSelected(null)} />}

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={(emp) => setEmployees((prev) => [...prev, emp])}
        />
      )}
    </div>
  );
}
