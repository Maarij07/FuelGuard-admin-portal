import { SkeletonBox, TableSkeleton } from "../components/skeleton";

export default function EmployeesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SkeletonBox className="h-5 w-36 mb-2" />
        <SkeletonBox className="h-3 w-56" />
      </div>
      <div className="flex gap-3">
        <SkeletonBox className="h-10 w-64 rounded-lg" />
        <div className="ml-auto flex gap-2">
          <SkeletonBox className="h-10 w-24 rounded-lg" />
          <SkeletonBox className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
