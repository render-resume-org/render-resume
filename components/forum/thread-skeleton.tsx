import { Skeleton } from "@/components/ui/skeleton";

export function ThreadSkeleton({ isComment = false }: { isComment?: boolean }) {
  return (
    <div className={`w-full ${isComment ? "pl-10" : ""}`}>
      <div className="flex space-x-3 p-4 border-b border-gray-100 dark:border-gray-800">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4 pt-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
