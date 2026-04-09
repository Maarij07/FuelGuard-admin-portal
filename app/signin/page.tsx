"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Fuel, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";

const initialState = { error: undefined as string | undefined };

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#F9FAFB]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-[440px] shrink-0 flex-col justify-between p-12 bg-[#1A2744]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00B4A6]/20 flex items-center justify-center">
            <Fuel size={20} color="#00B4A6" strokeWidth={1.5} />
          </div>
          <span className="text-[18px] font-bold text-white tracking-tight">Fuel Guard</span>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[32px] font-bold text-white leading-tight tracking-[-0.5px]">
              Monitor every drop.<br />Flag every fraud.
            </h2>
            <p className="text-[15px] text-white/60 mt-3 leading-relaxed">
              Real-time IoT fuel dispenser verification — built for station operators who demand precision.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {["Live nozzle sensor monitoring", "Automated fraud detection", "Full transaction audit trail"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <ShieldCheck size={16} color="#00B4A6" strokeWidth={1.5} className="shrink-0" />
                <span className="text-[13px] text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[12px] text-white/30">© 2026 Fuel Guard · IoT Fuel Dispenser Management</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#1A2744] flex items-center justify-center">
              <Fuel size={16} color="#00B4A6" strokeWidth={1.5} />
            </div>
            <span className="text-[16px] font-bold text-[#1A2744]">Fuel Guard</span>
          </div>

          <h1 className="text-[24px] font-bold text-[#1C2536] tracking-[-0.3px]">Sign in</h1>
          <p className="text-[14px] text-[#637381] mt-1">Admin access only. Enter your credentials.</p>

          <form action={formAction} className="flex flex-col gap-4 mt-8">
            {/* Global error */}
            {state?.error && (
              <div className="px-4 py-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[13px] text-[#EF4444]">
                {state.error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[13px] font-medium text-[#637381] block mb-1.5">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@fuelguard.io"
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] focus:outline-none focus:ring-2 focus:ring-[#00B4A6] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[13px] font-medium text-[#637381] block mb-1.5">
                Password
              </label>
              <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-[#00B4A6] transition-colors">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="flex-1 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="text-[#919EAB] hover:text-[#637381] shrink-0"
                >
                  {showPw ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg bg-[#00B4A6] text-white text-[14px] font-semibold hover:bg-[#009E91] transition-colors disabled:opacity-60 mt-2"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
