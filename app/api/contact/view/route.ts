import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { memberships, contactViews, biodatas } from "@/lib/db/schema"
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

// POST - View contact (deduct from membership)
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

    // Check if already viewed
    const existingView = await db
      .select()
      .from(contactViews)
      .where(and(eq(contactViews.viewerUserId, userId), eq(contactViews.biodataId, biodataId)))
      .limit(1)

    if (existingView.length > 0) {
      // Already viewed, return contact info
      const biodata = await db.select().from(biodatas).where(eq(biodatas.id, biodataId)).limit(1)

      if (biodata.length === 0) {
        return NextResponse.json({ error: "বায়োডাটা পাওয়া যায়নি" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        alreadyViewed: true,
        contact: {
          guardianPhone: biodata[0].guardianPhone,
          guardianRelation: biodata[0].guardianRelation,
        },
      })
    }

    // Check membership
    const membership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0 || membership[0].contactViewsRemaining <= 0) {
      return NextResponse.json(
        {
          error: "আপনার কোনো কন্টাক্ট ভিউ বাকি নেই। অনুগ্রহ করে সদস্যতা কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    // Check if membership expired
    if (membership[0].expiresAt && new Date(membership[0].expiresAt) < new Date()) {
      await db.update(memberships).set({ status: "expired" }).where(eq(memberships.id, membership[0].id))

      return NextResponse.json(
        {
          error: "আপনার সদস্যতার মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন সদস্যতা কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    // Get biodata
    const biodata = await db.select().from(biodatas).where(eq(biodatas.id, biodataId)).limit(1)

    if (biodata.length === 0) {
      return NextResponse.json({ error: "বায়োডাটা পাওয়া যায়নি" }, { status: 404 })
    }

    // Record the view
    await db.insert(contactViews).values({
      viewerUserId: userId,
      biodataId,
    })

    // Deduct from membership
    await db
      .update(memberships)
      .set({
        contactViewsRemaining: membership[0].contactViewsRemaining - 1,
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membership[0].id))

    return NextResponse.json({
      success: true,
      contact: {
        guardianPhone: biodata[0].guardianPhone,
        guardianRelation: biodata[0].guardianRelation,
      },
      remainingViews: membership[0].contactViewsRemaining - 1,
    })
  } catch (error) {
    console.error("Error viewing contact:", error)
    return NextResponse.json({ error: "যোগাযোগ তথ্য দেখতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// GET - Check if user can view contact
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    const biodataId = request.nextUrl.searchParams.get("biodataId")

    if (!userId) {
      return NextResponse.json({ canView: false, reason: "not_logged_in" })
    }

    if (!biodataId) {
      return NextResponse.json({ error: "বায়োডাটা আইডি আবশ্যক" }, { status: 400 })
    }

    // Check if already viewed
    const existingView = await db
      .select()
      .from(contactViews)
      .where(and(eq(contactViews.viewerUserId, userId), eq(contactViews.biodataId, Number.parseInt(biodataId))))
      .limit(1)

    if (existingView.length > 0) {
      const biodata = await db
        .select()
        .from(biodatas)
        .where(eq(biodatas.id, Number.parseInt(biodataId)))
        .limit(1)

      return NextResponse.json({
        canView: true,
        alreadyViewed: true,
        contact: {
          guardianPhone: biodata[0]?.guardianPhone,
          guardianRelation: biodata[0]?.guardianRelation,
        },
      })
    }

    // Check membership
    const membership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0 || membership[0].contactViewsRemaining <= 0) {
      return NextResponse.json({
        canView: false,
        reason: "no_views_remaining",
        remainingViews: 0,
      })
    }

    return NextResponse.json({
      canView: true,
      alreadyViewed: false,
      remainingViews: membership[0].contactViewsRemaining,
    })
  } catch (error) {
    console.error("Error checking contact view:", error)
    return NextResponse.json({ error: "চেক করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
