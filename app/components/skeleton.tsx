// Shared skeleton primitives — used by all loading.tsx files

export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-[#F4F6F8] rounded animate-pulse ${className}`} />;
}

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      {/* Header */}
      <div className="flex gap-4 px-5 py-3 border-b border-[#E5E7EB]">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-[#E5E7EB] last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBox key={j} className={`h-4 flex-1 ${j === 0 ? "max-w-[120px]" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
