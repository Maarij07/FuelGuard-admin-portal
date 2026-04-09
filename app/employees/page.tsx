import { getEmployees } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { EmployeesClient } from "./employees-client";

export default async function EmployeesPage() {
  const session = await requireSession();

  let employees: Awaited<ReturnType<typeof getEmployees>>["items"] = [];

  try {
    // Fetch both active and inactive in parallel
    const [activeRes, inactiveRes] = await Promise.allSettled([
      getEmployees(session.accessToken, true),
      getEmployees(session.accessToken, false),
    ]);

    const active   = activeRes.status   === "fulfilled" ? activeRes.value.items   : [];
    const inactive = inactiveRes.status === "fulfilled" ? inactiveRes.value.items : [];
    employees = [...active, ...inactive];
  } catch {
    // Render empty state on error
  }

  return <EmployeesClient initialEmployees={employees} />;
}
