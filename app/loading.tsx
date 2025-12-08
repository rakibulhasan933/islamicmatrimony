import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="w-32 h-8 mx-auto mb-4" />
          <Skeleton className="w-96 h-12 mx-auto mb-4" />
          <Skeleton className="w-64 h-6 mx-auto mb-8" />
          <div className="flex justify-center gap-4">
            <Skeleton className="w-32 h-12 rounded-xl" />
            <Skeleton className="w-32 h-12 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Skeleton className="w-48 h-8 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Biodatas Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="w-48 h-8 mx-auto mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <Skeleton className="aspect-4/3 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
