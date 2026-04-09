import { requireSession } from "@/lib/auth";
import { fetchReportsData } from "@/lib/reports-data";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const session = await requireSession();

  // fetchReportsData is decorated with 'use cache' + cacheLife('minutes').
  // Second and subsequent navigations within the TTL are served from the
  // Next.js data cache — no round-trip to Railway.
  const data = await fetchReportsData(session.accessToken, "monthly");

  return <ReportsClient initial={data} />;
}
