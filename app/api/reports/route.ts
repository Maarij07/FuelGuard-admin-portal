import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchReportsData } from "@/lib/reports-data";

// Period-toggle endpoint called by ReportsClient.
// fetchReportsData uses 'use cache' internally — the first call for a given
// (token, period) hits Railway; subsequent calls within 2 min are instant.
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = req.nextUrl.searchParams.get("period") ?? "monthly";
  const period = (["daily", "weekly", "monthly"].includes(raw) ? raw : "monthly") as
    | "daily"
    | "weekly"
    | "monthly";

  const data = await fetchReportsData(session.accessToken, period);
  return NextResponse.json(data);
}
