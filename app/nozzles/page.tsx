import { getNozzles } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { NozzlesClient } from "./nozzles-client";

// Nozzle status changes rapidly — no cache, always fresh on each request
export default async function NozzlesPage() {
  const session = await requireSession();

  let nozzles: Awaited<ReturnType<typeof getNozzles>> = [];

  try {
    nozzles = await getNozzles(session.accessToken);
  } catch {
    // Client component renders empty state
  }

  return <NozzlesClient initialNozzles={nozzles} />;
}
