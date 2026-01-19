import { Skeleton } from "@/components/ui/skeleton";

interface ListingSkeletonProps {
  count?: number;
  variant?: "card" | "compact";
}

export function ListingSkeleton({ count = 6, variant = "card" }: ListingSkeletonProps) {
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3 bg-card rounded-xl">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
