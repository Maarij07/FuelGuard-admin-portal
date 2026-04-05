"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface LogoutModalProps {
  onClose: () => void;
}

export function LogoutModal({ onClose }: LogoutModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/signin");
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(28,37,54,0.45)" }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-sm"
        style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)" }}
      >
        {/* Icon */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
            <LogOut size={24} strokeWidth={1.5} color="#EF4444" />
          </div>
          <h2 className="text-[18px] font-semibold text-[#1C2536] tracking-[-0.2px]">
            Sign out of Fuel Guard?
          </h2>
          <p className="text-[13px] text-[#637381] mt-2">
            You will be returned to the sign-in page. Any unsaved changes will be lost.
          </p>
        </div>

        {/* Actions — Cancel left, destructive right per spec */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] font-semibold text-[#637381] hover:bg-[#F4F6F8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-[#EF4444] text-white text-[14px] font-semibold hover:bg-[#DC2626] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
