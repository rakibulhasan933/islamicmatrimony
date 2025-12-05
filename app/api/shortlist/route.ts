import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { shortlists, biodatas } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { jwtVerify } from "jose"

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

// GET - Get user's shortlist
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "অনুগ্রহ করে লগইন করুন" }, { status: 401 })
    }

    const shortlistItems = await db
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
      .orderBy(shortlists.createdAt)

    return NextResponse.json({ shortlist: shortlistItems })
  } catch (error) {
    console.error("Error fetching shortlist:", error)
    return NextResponse.json({ error: "শর্টলিস্ট লোড করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// POST - Add to shortlist
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "অনুগ্রহ করে লগইন করুন" }, { status: 401 })
    }

    const { biodataId } = await request.json()

    if (!biodataId) {
      return NextResponse.json({ error: "বায়োডাটা আইডি আবশ্যক" }, { status: 400 })
    }

    // Check if already in shortlist
    const existing = await db
      .select()
      .from(shortlists)
      .where(and(eq(shortlists.userId, userId), eq(shortlists.biodataId, biodataId)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: "ইতিমধ্যে শর্টলিস্টে আছে" }, { status: 400 })
    }

    await db.insert(shortlists).values({
      userId,
      biodataId,
    })

    return NextResponse.json({ success: true, message: "শর্টলিস্টে যোগ করা হয়েছে" })
  } catch (error) {
    console.error("Error adding to shortlist:", error)
    return NextResponse.json({ error: "শর্টলিস্টে যোগ করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// DELETE - Remove from shortlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "অনুগ্রহ করে লগইন করুন" }, { status: 401 })
    }

    const biodataId = request.nextUrl.searchParams.get("biodataId")

    if (!biodataId) {
      return NextResponse.json({ error: "বায়োডাটা আইডি আবশ্যক" }, { status: 400 })
    }

    await db
      .delete(shortlists)
      .where(and(eq(shortlists.userId, userId), eq(shortlists.biodataId, Number.parseInt(biodataId))))

    return NextResponse.json({ success: true, message: "শর্টলিস্ট থেকে সরানো হয়েছে" })
  } catch (error) {
    console.error("Error removing from shortlist:", error)
    return NextResponse.json({ error: "শর্টলিস্ট থেকে সরাতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
