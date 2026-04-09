import { getTransactions } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { TransactionsClient } from "./transactions-client";

// Fetch up to 200 most recent transactions server-side.
// The client component handles local filtering + pagination from this set.
export default async function TransactionsPage() {
  const session = await requireSession();

  let transactions: Awaited<ReturnType<typeof getTransactions>>["items"] = [];
  let total = 0;

  try {
    const data = await getTransactions(session.accessToken, { limit: 200 });
    transactions = data.items;
    total        = data.total;
  } catch {
    // Render empty state — error boundary in layout catches hard failures
  }

  return <TransactionsClient transactions={transactions} total={total} />;
}
