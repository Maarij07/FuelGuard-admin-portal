import { SkeletonBox } from "./components/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SkeletonBox className="h-5 w-24 mb-2" />
        <SkeletonBox className="h-3 w-48" />
      </div>
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 h-28" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <SkeletonBox className="h-4 w-1/2 mb-3" />
            <SkeletonBox className="h-7 w-1/3 mb-2" />
            <SkeletonBox className="h-3 w-3/4" />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl h-64 animate-pulse" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }} />
        <div className="col-span-4 bg-white rounded-xl h-64 animate-pulse" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }} />
      </div>
    </div>
  );
}
