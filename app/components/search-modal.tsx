"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ArrowRight, X } from "lucide-react";

interface SearchResult {
  type: "transaction" | "nozzle" | "employee" | "alert";
  label: string;
  sub: string;
  href: string;
}

const ALL_RESULTS: SearchResult[] = [
  { type: "transaction", label: "TXN-1041", sub: "N-01 · 28.4 L · PKR 4,260 · Verified", href: "/transactions" },
  { type: "transaction", label: "TXN-1040", sub: "N-02 · 31.0 L · PKR 4,650 · Flagged", href: "/transactions" },
  { type: "transaction", label: "TXN-1039", sub: "N-03 · 15.5 L · PKR 2,325 · Verified", href: "/transactions" },
  { type: "nozzle", label: "Nozzle N-01", sub: "Live · 24.6 L · Verified", href: "/nozzles" },
  { type: "nozzle", label: "Nozzle N-02", sub: "Tampered · 31.0 L · Discrepancy 2.6 L", href: "/nozzles" },
  { type: "nozzle", label: "Nozzle N-03", sub: "Live · 15.5 L · Verified", href: "/nozzles" },
  { type: "employee", label: "Ali Khan", sub: "EMP-001 · N-01, N-02 · 42 txns today", href: "/employees" },
  { type: "employee", label: "Sara Ahmed", sub: "EMP-002 · N-03 · 38 txns today", href: "/employees" },
  { type: "employee", label: "Usman Malik", sub: "EMP-003 · N-04, N-05 · 55 txns today", href: "/employees" },
  { type: "alert", label: "ALT-0041", sub: "Critical · N-02 · Delta 2.6 L · Open", href: "/fraud" },
  { type: "alert", label: "ALT-0040", sub: "Warning · N-03 · Delta 0.7 L · Open", href: "/fraud" },
];

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  transaction: "Transaction",
  nozzle: "Nozzle",
  employee: "Employee",
  alert: "Alert",
};

const TYPE_COLOR: Record<SearchResult["type"], string> = {
  transaction: "bg-[#EFF6FF] text-[#3B82F6]",
  nozzle: "bg-[#E6F7F6] text-[#00B4A6]",
  employee: "bg-[#F4F6F8] text-[#637381]",
  alert: "bg-[#FEF2F2] text-[#EF4444]",
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? ALL_RESULTS.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.sub.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_RESULTS.slice(0, 6);

  useEffect(() => {
    if (open) {
      setQuery("");
      setFocused(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setFocused((f) => Math.min(f + 1, results.length - 1));
      if (e.key === "ArrowUp") setFocused((f) => Math.max(f - 1, 0));
      if (e.key === "Enter" && results[focused]) {
        window.location.href = results[focused].href;
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, focused, results, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" style={{ background: "rgba(28,37,54,0.4)" }} onClick={onClose}>
      <div
        className="w-full max-w-[560px] bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <Search size={18} strokeWidth={1.5} color="#919EAB" className="shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
            placeholder="Search transactions, nozzles, employees, alerts…"
            className="flex-1 text-[14px] text-[#1C2536] placeholder:text-[#919EAB] outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#919EAB] hover:text-[#637381]">
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
          <kbd className="text-[11px] bg-[#F4F6F8] text-[#919EAB] px-1.5 py-0.5 rounded font-medium shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-center text-[13px] text-[#919EAB] py-8">No results for &quot;{query}&quot;</p>
          ) : (
            <>
              {!query && <p className="text-[11px] font-medium text-[#919EAB] uppercase tracking-[0.6px] px-4 py-2">Recent & Suggested</p>}
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.href}
                  onClick={onClose}
                  onMouseEnter={() => setFocused(i)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${focused === i ? "bg-[#E6F7F6]" : "hover:bg-[#F4F6F8]"}`}
                >
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[4px] shrink-0 ${TYPE_COLOR[r.type]}`}>
                    {TYPE_LABEL[r.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1C2536]">{r.label}</p>
                    <p className="text-[12px] text-[#919EAB] truncate">{r.sub}</p>
                  </div>
                  <ArrowRight size={14} strokeWidth={1.5} color="#919EAB" className="shrink-0" />
                </a>
              ))}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          {[["↑↓", "Navigate"], ["↵", "Open"], ["ESC", "Close"]].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <kbd className="text-[11px] bg-white border border-[#E5E7EB] text-[#637381] px-1.5 py-0.5 rounded font-medium">{key}</kbd>
              <span className="text-[11px] text-[#919EAB]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
