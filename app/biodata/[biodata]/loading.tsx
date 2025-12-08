import { Skeleton } from "@/components/ui/skeleton"

export default function BiodataLoading() {
    return (
        <main className="min-h-screen bg-linear-to-br from-slate-100 via-pink-50/30 to-slate-100 pt-20">
            <div className="container mx-auto px-4 py-6">
                {/* Back Button Skeleton */}
                <Skeleton className="h-5 w-48 mb-6" />

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar Skeleton */}
                    <div className="lg:w-80 shrink-0">
                        <div className="bg-linear-to-b from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl animate-pulse">
                            {/* Profile Photo Skeleton */}
                            <div className="flex justify-center mb-5">
                                <div className="relative w-32 h-32 rounded-full bg-slate-700 border-4 border-pink-500/30 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-linear-to-r from-slate-700 via-slate-600 to-slate-700 animate-shimmer"
                                        style={{
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Biodata ID Skeleton */}
                            <div className="text-center mb-5">
                                <Skeleton className="h-4 w-24 mx-auto mb-2 bg-slate-700" />
                                <Skeleton className="h-7 w-32 mx-auto bg-slate-700" />
                                <Skeleton className="h-6 w-20 mx-auto mt-3 rounded-full bg-slate-700" />
                            </div>

                            {/* Quick Info Badges Skeleton */}
                            <div className="space-y-2 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-slate-700/80 rounded-lg px-4 py-2.5">
                                        <Skeleton className="w-4 h-4 rounded bg-slate-600" />
                                        <Skeleton className="h-4 w-20 bg-slate-600" />
                                        <Skeleton className="h-4 w-16 ml-auto bg-slate-600" />
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons Skeleton */}
                            <div className="space-y-2.5">
                                <Skeleton className="h-10 w-full rounded-lg bg-slate-700" />
                                <Skeleton className="h-10 w-full rounded-lg bg-slate-700" />
                                <Skeleton className="h-10 w-full rounded-lg bg-slate-700" />
                            </div>
                        </div>
                    </div>

                    {/* Right Content Skeleton */}
                    <div className="flex-1 space-y-6">
                        {/* Section Cards Skeleton */}
                        {[...Array(5)].map((_, sectionIndex) => (
                            <div key={sectionIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
                                {/* Section Header Skeleton */}
                                <div className="bg-linear-to-r from-pink-300 to-pink-200 px-6 py-3">
                                    <Skeleton className="h-5 w-32 bg-pink-400/50" />
                                </div>

                                {/* Section Content Skeleton */}
                                <div className="divide-y divide-pink-50">
                                    {[...Array(sectionIndex === 2 ? 8 : sectionIndex === 3 ? 10 : 4)].map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex">
                                            <div className="w-2/5 px-5 py-3 bg-pink-50/50">
                                                <Skeleton className="h-4 w-3/4 bg-pink-100" />
                                            </div>
                                            <div className="w-3/5 px-5 py-3">
                                                <Skeleton className="h-4 w-full bg-gray-100" />
                                                {rowIndex % 3 === 0 && <Skeleton className="h-4 w-2/3 bg-gray-100 mt-2" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shimmer animation keyframes */}
            <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
        </main>
    )
}
