"use server";

import { revalidatePath } from "next/cache";
import { apiAddEmployee, apiUpdateEmployee } from "@/lib/api";
import { requireSession } from "@/lib/auth";

export async function addEmployeeAction(formData: FormData) {
  const session = await requireSession();

  const payload = {
    full_name: formData.get("full_name") as string,
    email:     formData.get("email") as string,
    password:  formData.get("password") as string,
    phone:     (formData.get("phone") as string) || undefined,
  };

  if (!payload.full_name || !payload.email || !payload.password) {
    return { error: "Name, email and password are required" };
  }

  try {
    await apiAddEmployee(session.accessToken, payload);
    revalidatePath("/employees");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to add employee" };
  }
}

export async function updateEmployeeAction(
  uid: string,
  updates: { full_name?: string; phone?: string; is_active?: boolean }
) {
  const session = await requireSession();

  try {
    await apiUpdateEmployee(session.accessToken, uid, updates);
    revalidatePath("/employees");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update employee" };
  }
}
