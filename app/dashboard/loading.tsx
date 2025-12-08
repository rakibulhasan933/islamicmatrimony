import { Skeleton } from "@/components/ui/skeleton"

function StatCardSkeleton() {
    return (
        <div className="bg-muted rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-muted-foreground/5 rounded-full -mr-10 -mt-10" />
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="w-16 h-10 mt-2" />
                <Skeleton className="w-20 h-3 mt-2" />
            </div>
        </div>
    )
}

function QuickActionSkeleton() {
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-5 h-5 rounded" />
            </div>
            <Skeleton className="w-32 h-5 mt-4" />
            <Skeleton className="w-48 h-4 mt-2" />
        </div>
    )
}

function ViewedBiodataItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
            <Skeleton className="w-14 h-14 rounded-full shrink-0" />
            <div className="flex-1">
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-48 h-3 mb-1" />
                <Skeleton className="w-20 h-3" />
            </div>
        </div>
    )
}

export default function DashboardLoading() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Welcome Section Skeleton */}
            <div className="mb-8 flex items-center gap-4">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full shrink-0" />
                <div>
                    <Skeleton className="w-48 h-8 mb-2" />
                    <Skeleton className="w-64 h-4" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <QuickActionSkeleton />
                <QuickActionSkeleton />
                <QuickActionSkeleton />
            </div>

            {/* Recently Viewed Skeleton */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="w-40 h-5 mb-1" />
                            <Skeleton className="w-32 h-4" />
                        </div>
                    </div>
                    <Skeleton className="w-24 h-9 rounded-lg" />
                </div>
                <div>
                    <ViewedBiodataItemSkeleton />
                    <ViewedBiodataItemSkeleton />
                    <ViewedBiodataItemSkeleton />
                </div>
            </div>
        </div>
    )
}
