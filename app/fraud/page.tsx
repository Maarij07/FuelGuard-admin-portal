import { getFraudAlerts } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { FraudClient } from "./fraud-client";

export default async function FraudPage() {
  const session = await requireSession();

  let alerts: Awaited<ReturnType<typeof getFraudAlerts>>["items"] = [];

  try {
    const data = await getFraudAlerts(session.accessToken, { limit: 100 });
    alerts = data.items;
  } catch {
    // Render empty state
  }

  return <FraudClient initialAlerts={alerts} />;
}
