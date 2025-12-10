import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, shortlists, biodatas } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { jwtVerify } from "jose"
import Link from "next/link"
import Image from "next/image"
import { Heart, User, MapPin, GraduationCap, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RemoveFromShortlistButton } from "@/components/remove-shortlist-button"
import { auth } from "@clerk/nextjs/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUser() {

  try {
    const { userId } = await auth()
    const user = await db.select().from(users).where(eq(users.clerkId, userId || "")).limit(1)
    return user[0] || null
  } catch {
    return null
  }
}

async function getShortlist(userId: string) {
  const items = await db
    .select({
      id: shortlists.id,
      biodataId: shortlists.biodataId,
      createdAt: shortlists.createdAt,
      biodata: {
        id: biodatas.id,
        biodataNo: biodatas.biodataNo,
        type: biodatas.type,
        fullName: biodatas.fullName,
        age: biodatas.age,
        height: biodatas.height,
        education: biodatas.education,
        occupation: biodatas.occupation,
        currentDistrict: biodatas.currentDistrict,
        maritalStatus: biodatas.maritalStatus,
        photo: biodatas.photo,
      },
    })
    .from(shortlists)
    .innerJoin(biodatas, eq(shortlists.biodataId, biodatas.id))
    .where(eq(shortlists.userId, userId))

  return items
}

function getMaritalStatusDisplay(status: string | null) {
  const statusMap: Record<string, string> = {
    unmarried: "অবিবাহিত",
    divorced: "ডিভোর্সড",
    widow: "বিধবা",
    widower: "বিপত্নীক",
  }
  return status ? statusMap[status] || status : "N/A"
}

export default async function ShortlistPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const shortlistItems = await getShortlist(user.clerkId)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" />
          আমার শর্টলিস্ট
        </h1>
        <p className="text-gray-600 mt-1">আপনার পছন্দের বায়োডাটাগুলো এখানে সংরক্ষিত আছে</p>
      </div>

      {shortlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">শর্টলিস্ট খালি</h3>
          <p className="text-gray-500 mb-6">আপনি এখনো কোনো বায়োডাটা শর্টলিস্টে যোগ করেননি</p>
          <Link href="/search">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">বায়োডাটা খুঁজুন</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Photo */}
              <div className="aspect-4/3 bg-gray-100 relative">
                {item.biodata.photo ? (
                  <Image
                    src={item.biodata.photo || "/placeholder.svg"}
                    alt={item.biodata.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${item.biodata.type === "bride" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {item.biodata.type === "bride" ? "পাত্রী" : "পাত্র"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.biodata.fullName}</h3>
                <p className="text-sm text-gray-500 mb-3">বায়োডাটা নং: {item.biodata.biodataNo}</p>

                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">বয়স:</span>
                    {item.biodata.age || "N/A"} বছর
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.biodata.currentDistrict || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {item.biodata.education || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-3.5 h-3.5" />
                    {item.biodata.occupation || "N/A"}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link href={`/biodata/${item.biodata.biodataNo}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent"
                    >
                      বিস্তারিত দেখুন
                    </Button>
                  </Link>
                  <RemoveFromShortlistButton biodataId={item.biodata.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
