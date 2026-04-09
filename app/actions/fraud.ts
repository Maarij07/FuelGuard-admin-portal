"use server";

import { revalidatePath } from "next/cache";
import { apiEscalateFraudAlert, apiResolveFraudAlert } from "@/lib/api";
import { requireSession } from "@/lib/auth";

export async function resolveAlertAction(alertId: string, notes = "Resolved via admin panel") {
  const session = await requireSession();

  try {
    await apiResolveFraudAlert(session.accessToken, alertId, notes);
    revalidatePath("/fraud");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to resolve alert" };
  }
}

export async function escalateAlertAction(alertId: string) {
  const session = await requireSession();

  try {
    await apiEscalateFraudAlert(session.accessToken, alertId);
    revalidatePath("/fraud");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to escalate alert" };
  }
}
