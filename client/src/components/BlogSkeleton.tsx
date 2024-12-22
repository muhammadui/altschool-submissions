import { Skeleton } from "@/components/ui/skeleton";

export function BlogSkeleton() {
  return (
    <div className="container px-3 my-6 mx-auto">
      {/* User Information Skeleton */}
      <div className="flex items-center space-x-4 mb-8">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Blog Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded overflow-hidden shadow-lg flex flex-col"
          >
            {/* Image Placeholder */}
            <div className="relative">
              <Skeleton className="h-48 w-full" />
              <div className="absolute top-3 right-3">
                <Skeleton className="h-6 w-16 rounded" />
              </div>
            </div>

            {/* Blog Content Placeholder */}
            <div className="px-6 py-4 mb-auto space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Footer Information Placeholder */}
            <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
