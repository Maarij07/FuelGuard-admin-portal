import { SkeletonBox } from "../components/skeleton";

export default function FraudLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SkeletonBox className="h-5 w-40 mb-2" />
        <SkeletonBox className="h-3 w-60" />
      </div>
      <div className="flex gap-3">
        <SkeletonBox className="h-10 w-64 rounded-lg" />
        <div className="ml-auto flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Alert cards */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 flex items-center gap-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonBox className="h-4 w-48" />
              <SkeletonBox className="h-3 w-72" />
            </div>
            <SkeletonBox className="h-6 w-20 rounded-full shrink-0" />
            <SkeletonBox className="h-8 w-24 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
