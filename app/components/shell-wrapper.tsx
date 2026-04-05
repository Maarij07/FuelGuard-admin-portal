"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/signin") {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </>
  );
}
