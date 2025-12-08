import { Skeleton } from "@/components/ui/skeleton"

function BiodataCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-5 h-5 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-28 h-4" />
        </div>
      </div>
    </div>
  )
}

function FilterSidebarSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-border pb-4">
          <Skeleton className="w-32 h-5 mb-3" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="w-64 h-10 mb-2" />
          <Skeleton className="w-48 h-5" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar Skeleton */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-16 h-4" />
              </div>
              <FilterSidebarSkeleton />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Top Bar Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-24 h-10 rounded-xl lg:hidden" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-40 h-4 hidden sm:block" />
                <Skeleton className="w-20 h-10 rounded-lg" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <BiodataCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
