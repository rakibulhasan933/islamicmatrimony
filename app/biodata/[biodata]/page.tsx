import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, User, Calendar, Ruler, MapPin, Heart, BadgeCheck, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { biodatas, contactViews, memberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { ShortlistButton } from "@/components/shortlist-button"
import { CopyLinkButton } from "@/components/copy-link-button"
import { BiodataContent } from "@/components/biodata-content"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return (payload as { userId: number }).userId
  } catch {
    return null
  }
}

async function checkGoldMembership(userId: number) {
  const membership = await db
    .select()
    .from(memberships)
    .where(and(eq(memberships.userId, userId), eq(memberships.status, "active"), eq(memberships.type, "gold")))
    .limit(1)

  return membership.length > 0
}

function QuickInfoBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-700/80 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white text-sm hover:bg-slate-600 transition-all duration-200 hover:scale-[1.02]">
      <Icon className="w-4 h-4 text-pink-400 shrink-0" />
      <span className="text-gray-300">{label}</span>
      <span className="font-semibold ml-auto">{value}</span>
    </div>
  )
}

function getMaritalStatusDisplay(status: string | null) {
  const statusMap: Record<string, string> = {
    unmarried: "অবিবাহিত",
    divorced: "ডিভোর্সড",
    widow: "বিধবা",
    widower: "বিপত্নীক",
  }
  return status ? statusMap[status] || status : "—"
}

function getTypeDisplay(type: string) {
  return type === "bride" ? "পাত্রীর বায়োডাটা" : "পাত্রের বায়োডাটা"
}

export default async function BiodataDetailPage({
  params,
}: {
  params: Promise<{ biodata: string }>
}) {
  const bioDataParams = await params
  const { biodata } = bioDataParams

  const biodataList = await db.select().from(biodatas).where(eq(biodatas.biodataNo, biodata)).limit(1)

  if (biodataList.length === 0) {
    notFound()
  }

  const bio = biodataList[0]
  const userId = await getUserId()

  const isVerified = await checkGoldMembership(bio.userId)

  // Check if user is viewing their own biodata
  const isOwnBiodata = userId === bio.userId

  let hasViewedBiodata = false
  let canViewBiodata = false
  let remainingConnections = 0
  let membershipType = "free"

  if (userId) {
    // Check if already viewed this biodata
    const existingView = await db
      .select()
      .from(contactViews)
      .where(and(eq(contactViews.viewerUserId, userId), eq(contactViews.biodataId, bio.id)))
      .limit(1)

    hasViewedBiodata = existingView.length > 0

    // Get membership info
    const membership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length > 0) {
      membershipType = membership[0].type
      remainingConnections = membership[0].contactViewsRemaining || 0
      canViewBiodata = membershipType !== "free" && remainingConnections > 0
    }
  }

  // Determine if content should be unlocked
  const isUnlocked = isOwnBiodata || hasViewedBiodata

  console.log(
    "[v0] Biodata page loaded - userId:",
    userId,
    "isOwnBiodata:",
    isOwnBiodata,
    "hasViewedBiodata:",
    hasViewedBiodata,
    "isUnlocked:",
    isUnlocked,
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-pink-50/30 to-slate-100 pt-20">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(236, 72, 153, 0.2);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          বায়োডাটা খুঁজুনে ফিরে যান
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div
              className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 sticky top-24 shadow-xl"
              style={{ animation: "fadeInLeft 0.5s ease-out" }}
            >
              <div className="flex justify-center mb-5">
                <div
                  className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-4 border-pink-500/50 overflow-hidden"
                  style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
                >
                  {isUnlocked ? (
                    bio.photo ? (
                      <Image
                        src={bio.photo || "/placeholder.svg"}
                        alt="Profile"
                        width={128}
                        height={128}
                        priority
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-500 to-slate-600">
                        <User className="w-16 h-16 text-slate-300" />
                      </div>
                    )
                  ) : (
                    // Blurred/Hidden photo when locked
                    <div className="w-full h-full relative">
                      {bio.photo ? (
                        <Image
                          src={bio.photo || "/placeholder.svg"}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover blur-xl scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-500 to-slate-600">
                          <User className="w-16 h-16 text-slate-300 blur-sm" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-800/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-1.5 border border-pink-400/30">
                            <User className="w-5 h-5 text-pink-300" />
                          </div>
                          <span className="text-[11px] text-pink-300 font-medium">লক করা</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUnlocked && bio.fullName && (
                <div className="text-center mb-3">
                  <p className="text-white font-semibold text-lg">{bio.fullName}</p>
                </div>
              )}

              {/* Biodata ID */}
              <div className="text-center mb-5">
                <p className="text-gray-400 text-sm mb-1">বায়োডাটা নং:</p>
                <p className="text-white font-bold text-xl tracking-wider">{bio.biodataNo}</p>
                {isVerified && (
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-yellow-900 text-xs font-semibold px-3 py-1.5 rounded-full mt-3 shadow-lg">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    ভেরিফাইড
                  </div>
                )}
              </div>

              {/* Quick Info Badges */}
              <div className="space-y-2 mb-5">
                <QuickInfoBadge icon={User} label="বায়োডাটার ধরন" value={getTypeDisplay(bio.type)} />
                {bio.age && <QuickInfoBadge icon={Calendar} label="বয়স" value={`${bio.age} বছর`} />}
                {bio.height && <QuickInfoBadge icon={Ruler} label="উচ্চতা" value={bio.height} />}
                {bio.currentDistrict && <QuickInfoBadge icon={MapPin} label="জেলা" value={bio.currentDistrict} />}
                <QuickInfoBadge icon={Heart} label="বৈবাহিক অবস্থা" value={getMaritalStatusDisplay(bio.maritalStatus)} />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <ShortlistButton biodataId={bio.id} isLoggedIn={!!userId} variant="large" />
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <Share2 className="w-4 h-4" />
                  শেয়ার করুন
                </Button>
                <CopyLinkButton biodataNo={bio.biodataNo} />
              </div>
            </div>
          </div>

          {/* Right Content - Client component for unlock functionality */}
          <BiodataContent
            biodata={bio}
            isLoggedIn={!!userId}
            isOwnBiodata={isOwnBiodata}
            hasViewedBiodata={hasViewedBiodata}
            canViewBiodata={canViewBiodata}
            remainingConnections={remainingConnections}
            membershipType={membershipType}
            initialUnlocked={isUnlocked}
          />
        </div>
      </div>
    </main>
  )
}
