import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users, memberships, contactViews } from "@/lib/db/schema"
import { eq, and, count } from "drizzle-orm"
import { Crown, Eye, Clock, CheckCircle, XCircle, BadgeCheck, Star, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUser() {
  const { userId } = await auth()

  try {

    const user = await db.select().from(users).where(eq(users.clerkId, userId || "")).limit(1)
    return user[0] || null
  } catch {
    return null
  }
}

async function getMembership(userId: string) {
  const membership = await db
    .select()
    .from(memberships)
    .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
    .limit(1)

  return membership[0] || null
}

async function getContactViewsCount(userId: string) {
  const result = await db.select({ count: count() }).from(contactViews).where(eq(contactViews.viewerUserId, userId))

  return result[0]?.count || 0
}

export default async function MembershipPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const membership = await getMembership(user.clerkId)
  const viewsCount = await getContactViewsCount(user.clerkId)

  const getMembershipTypeDisplay = (type: string) => {
    const types: Record<string, { name: string; color: string; icon: typeof Crown }> = {
      free: { name: "ফ্রি", color: "text-gray-600", icon: User },
      silver: { name: "সিলভার", color: "text-gray-500", icon: Star },
      gold: { name: "গোল্ড", color: "text-yellow-600", icon: Crown },
    }
    return types[type] || types.free
  }

  const typeInfo = getMembershipTypeDisplay(membership?.type || "free")
  const TypeIcon = typeInfo.icon

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          আমার সদস্যতা
        </h1>
        <p className="text-gray-600 mt-1">আপনার বর্তমান সদস্যতার বিস্তারিত</p>
      </div>

      {/* Current Membership Card */}
      <div className="bg-linear-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">বর্তমান প্যাকেজ</p>
            <div className="flex items-center gap-2">
              <h2 className={`text-3xl font-bold ${typeInfo.color}`}>{typeInfo.name}</h2>
              {membership?.type === "gold" && <BadgeCheck className="w-6 h-6 text-yellow-500" />}
            </div>
          </div>
          <div
            className={`p-4 rounded-full ${membership?.type === "gold"
              ? "bg-yellow-100"
              : membership?.type === "silver"
                ? "bg-gray-100"
                : "bg-pink-100"
              }`}
          >
            <TypeIcon
              className={`w-8 h-8 ${membership?.type === "gold"
                ? "text-yellow-500"
                : membership?.type === "silver"
                  ? "text-gray-500"
                  : "text-pink-400"
                }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contact Views Remaining */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Eye className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">বাকি কন্টাক্ট ভিউ</p>
                <p className="text-2xl font-bold text-gray-900">{membership?.contactViewsRemaining || 0}</p>
              </div>
            </div>
          </div>

          {/* Total Views Used */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">মোট ভিউ করেছেন</p>
                <p className="text-2xl font-bold text-gray-900">{viewsCount}</p>
              </div>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">মেয়াদ শেষ</p>
                <p className="text-lg font-bold text-gray-900">
                  {membership?.expiresAt ? new Date(membership.expiresAt).toLocaleDateString("bn-BD") : "প্রযোজ্য নয়"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      {(!membership || membership.type === "free" || membership.contactViewsRemaining === 0) && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 text-center">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">আপগ্রেড করুন</h3>
          <p className="text-gray-600 mb-6">আরো কন্টাক্ট দেখতে সিলভার বা গোল্ড প্যাকেজে আপগ্রেড করুন</p>
          <Link href="/pricing">
            <Button className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
              প্যাকেজ দেখুন
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">প্যাকেজ তুলনা</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free */}
          <div
            className={`bg-white border rounded-xl p-4 ${!membership || membership.type === "free" ? "border-pink-300 ring-2 ring-pink-100" : "border-gray-100"}`}
          >
            <h4 className="font-bold text-gray-900 mb-2">ফ্রি</h4>
            <p className="text-2xl font-bold text-gray-900 mb-4">৳০</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                বায়োডাটা তৈরি
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                বায়োডাটা দেখা
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                কন্টাক্ট দেখা
              </li>
            </ul>
          </div>

          {/* Silver */}
          <div
            className={`bg-white border rounded-xl p-4 ${membership?.type === "silver" ? "border-gray-400 ring-2 ring-gray-200" : "border-gray-100"}`}
          >
            <h4 className="font-bold text-gray-700 mb-2">সিলভার</h4>
            <p className="text-2xl font-bold text-gray-900 mb-4">
              ৳২০০<span className="text-sm font-normal text-gray-500">/মাস</span>
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                সব ফ্রি ফিচার
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                ১০টি কন্টাক্ট দেখা
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                অভিভাবকের নাম্বার
              </li>
            </ul>
          </div>

          {/* Gold */}
          <div
            className={`bg-white border rounded-xl p-4 ${membership?.type === "gold" ? "border-yellow-400 ring-2 ring-yellow-100" : "border-gray-100"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-yellow-600">গোল্ড</h4>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">জনপ্রিয়</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-4">
              ৳৫০০<span className="text-sm font-normal text-gray-500">/৩ মাস</span>
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                সব সিলভার ফিচার
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                ৩০টি কন্টাক্ট দেখা
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-yellow-500" />
                প্রিমিয়াম ভেরিফাইড ব্যাজ
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
