import { SkeletonBox } from "../components/skeleton";

export default function NozzlesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <SkeletonBox className="h-5 w-48 mb-2" />
          <SkeletonBox className="h-3 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-6 w-32 rounded-lg" />
          <SkeletonBox className="h-8 w-24 rounded-lg" />
          <SkeletonBox className="h-9 w-48 rounded-lg" />
        </div>
      </div>
      {/* Nozzle cards grid */}
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 flex flex-col gap-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-7 w-32" />
              <SkeletonBox className="h-3 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBox className="h-12 rounded-lg" />
              <SkeletonBox className="h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
