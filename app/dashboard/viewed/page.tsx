import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, memberships, contactViews, biodatas } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { jwtVerify } from "jose"
import { Eye, User, Calendar, MapPin, Briefcase, GraduationCap, ExternalLink, Clock, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const { userId } = payload as { userId: number }
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
        return user[0] || null
    } catch {
        return null
    }
}

async function getMembership(userId: number) {
    const membership = await db
        .select()
        .from(memberships)
        .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
        .limit(1)

    return membership[0] || null
}

async function getViewedBiodatas(userId: number) {
    const viewed = await db
        .select({
            viewId: contactViews.id,
            viewedAt: contactViews.viewedAt,
            biodataId: biodatas.id,
            biodataNo: biodatas.biodataNo,
            fullName: biodatas.fullName,
            photo: biodatas.photo,
            age: biodatas.age,
            type: biodatas.type,
            occupation: biodatas.occupation,
            permanentDistrict: biodatas.permanentDistrict,
            education: biodatas.education,
            height: biodatas.height,
            maritalStatus: biodatas.maritalStatus,
        })
        .from(contactViews)
        .innerJoin(biodatas, eq(contactViews.biodataId, biodatas.id))
        .where(eq(contactViews.viewerUserId, userId))
        .orderBy(desc(contactViews.viewedAt))

    return viewed
}

export default async function ViewedBiodatasPage() {
    const user = await getUser()

    if (!user) {
        redirect("/login")
    }

    const membership = await getMembership(user.id)
    const viewedBiodatas = await getViewedBiodatas(user.id)

    // Calculate days remaining
    let daysRemaining = 0
    if (membership?.expiresAt) {
        const now = new Date()
        const expiresAt = new Date(membership.expiresAt)
        const diffTime = expiresAt.getTime() - now.getTime()
        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getMaritalStatusBangla = (status: string) => {
        const map: Record<string, string> = {
            unmarried: "অবিবাহিত",
            divorced: "তালাকপ্রাপ্ত",
            widow: "বিধবা",
            widower: "বিপত্নীক",
        }
        return map[status] || status
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-primary" />
                    </div>
                    দেখা বায়োডাটা
                </h1>
                <p className="text-muted-foreground mt-2">আপনি যাদের বায়োডাটা আনলক করেছেন তাদের তালিকা</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm text-white/80">কানেকশন বাকি</span>
                    </div>
                    <p className="text-3xl font-bold">{membership?.contactViewsRemaining || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm text-white/80">মেয়াদ বাকি</span>
                    </div>
                    <p className="text-3xl font-bold">{daysRemaining} দিন</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-5 h-5" />
                        <span className="text-sm text-white/80">মোট দেখা হয়েছে</span>
                    </div>
                    <p className="text-3xl font-bold">{viewedBiodatas.length} টি</p>
                </div>
            </div>

            {/* Viewed Biodatas List */}
            {viewedBiodatas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {viewedBiodatas.map((biodata, index) => (
                        <Link
                            key={biodata.viewId}
                            href={`/biodata/${biodata.biodataNo}`}
                            className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                            style={{
                                animation: `fadeInUp 0.5s ease-out forwards`,
                                animationDelay: `${index * 50}ms`,
                                opacity: 0,
                            }}
                        >
                            {/* Header with photo */}
                            <div className="relative h-32 bg-gradient-to-br from-pink-100 to-rose-200">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                {/* Biodata Type Badge */}
                                <div
                                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${biodata.type === "bride" ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {biodata.type === "bride" ? "পাত্রী" : "পাত্র"}
                                </div>

                                {/* View Date */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(new Date(biodata.viewedAt))}
                                </div>

                                {/* Profile Photo */}
                                <div className="absolute -bottom-10 left-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-card shadow-lg bg-card">
                                        {biodata.photo ? (
                                            <Image
                                                src={biodata.photo || "/placeholder.svg"}
                                                alt={biodata.fullName}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                                                <User className="w-8 h-8 text-pink-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* External Link Icon */}
                                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-12 px-4 pb-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                            {biodata.fullName}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">#{biodata.biodataNo}</p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4 text-pink-500" />
                                        <span>
                                            {biodata.age ? `${biodata.age} বছর` : "বয়স উল্লেখ নেই"}
                                            {biodata.height && ` • ${biodata.height}`}
                                        </span>
                                    </div>

                                    {biodata.permanentDistrict && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4 text-pink-500" />
                                            <span>{biodata.permanentDistrict}</span>
                                        </div>
                                    )}

                                    {biodata.education && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <GraduationCap className="w-4 h-4 text-pink-500" />
                                            <span className="truncate">{biodata.education}</span>
                                        </div>
                                    )}

                                    {biodata.occupation && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Briefcase className="w-4 h-4 text-pink-500" />
                                            <span className="truncate">{biodata.occupation}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Marital Status Badge */}
                                {biodata.maritalStatus && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                            {getMaritalStatusBangla(biodata.maritalStatus)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">কোনো বায়োডাটা দেখা হয়নি</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        আপনি এখনো কোনো বায়োডাটা আনলক করেননি। বায়োডাটা খুঁজে আপনার পছন্দের পাত্র/পাত্রী খুঁজুন।
                    </p>
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        বায়োডাটা খুঁজুন
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    )
}
