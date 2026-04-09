"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface ShellUser {
  name: string;
  email: string;
  uid: string;
}

interface Props {
  children: React.ReactNode;
  user: ShellUser | null;
  openFraudCount: number;
}

export function ShellWrapper({ children, user, openFraudCount }: Props) {
  const pathname = usePathname();

  if (pathname === "/signin") {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar openFraudCount={openFraudCount} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar user={user} openFraudCount={openFraudCount} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </>
  );
}
