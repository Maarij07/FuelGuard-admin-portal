import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ShellWrapper } from "./components/shell-wrapper";
import { getSession } from "@/lib/auth";
import { getFraudAlerts } from "@/lib/api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fuel Guard Admin",
  description: "Fuel Guard — IoT-Based Fuel Dispenser Admin Panel",
};

// ── Async shell — fetches session + fraud count inside a Suspense boundary ────
// Wrapping in Suspense prevents Next.js 16 from blocking static prerender of
// special routes (/_not-found) on this dynamic, cookie-based data access.

async function DynamicShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  let openFraudCount = 0;
  if (session) {
    try {
      const alerts = await getFraudAlerts(session.accessToken, { status: "open", limit: 1 });
      openFraudCount = alerts.total;
    } catch {
      // not critical — badge stays 0
    }
  }

  const user = session
    ? { name: session.fullName, email: session.email, uid: session.uid }
    : null;

  return (
    <ShellWrapper user={user} openFraudCount={openFraudCount}>
      {children}
    </ShellWrapper>
  );
}

// ── Root layout (synchronous — no async fetching at this level) ────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full flex bg-[#F9FAFB]">
        {/* ShellWrapper fallback renders with no user data while DynamicShell resolves */}
        <Suspense
          fallback={
            <ShellWrapper user={null} openFraudCount={0}>
              {children}
            </ShellWrapper>
          }
        >
          <DynamicShell>{children}</DynamicShell>
        </Suspense>
      </body>
    </html>
  );
}
