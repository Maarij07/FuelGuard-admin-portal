import { SkeletonBox, TableSkeleton } from "../components/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SkeletonBox className="h-5 w-44 mb-2" />
        <SkeletonBox className="h-3 w-64" />
      </div>
      <div className="flex gap-3">
        <SkeletonBox className="h-10 w-64 rounded-lg" />
        <SkeletonBox className="h-10 w-32 rounded-lg" />
        <div className="ml-auto flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      <TableSkeleton rows={10} cols={8} />
    </div>
  );
}
