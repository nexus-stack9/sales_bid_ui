import { Skeleton } from "@/components/ui/skeleton"

export const BidSkeleton = () => {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const BidSkeletonMobile = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
