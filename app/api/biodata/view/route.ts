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

// POST - View biodata (deduct 1 connection)
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

    // Get biodata to check ownership
    const biodata = await db.select().from(biodatas).where(eq(biodatas.id, biodataId)).limit(1)

    if (biodata.length === 0) {
      return NextResponse.json({ error: "বায়োডাটা পাওয়া যায়নি" }, { status: 404 })
    }

    // If user is viewing their own biodata, allow free access
    if (biodata[0].userId === userId) {
      return NextResponse.json({
        success: true,
        isOwnBiodata: true,
        unlocked: true,
      })
    }

    // Check if already viewed
    const existingView = await db
      .select()
      .from(contactViews)
      .where(and(eq(contactViews.viewerUserId, userId), eq(contactViews.biodataId, biodataId)))
      .limit(1)

    if (existingView.length > 0) {
      // Already viewed, no charge
      return NextResponse.json({
        success: true,
        alreadyViewed: true,
        unlocked: true,
      })
    }

    // Check membership
    const membership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0 || membership[0].type === "free") {
      return NextResponse.json(
        {
          error: "বায়োডাটা দেখতে সদস্যতা প্রয়োজন। অনুগ্রহ করে প্যাকেজ কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    if (membership[0].contactViewsRemaining <= 0) {
      return NextResponse.json(
        {
          error: "আপনার কোনো কানেকশন বাকি নেই। অনুগ্রহ করে নতুন প্যাকেজ কিনুন।",
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
          error: "আপনার সদস্যতার মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন প্যাকেজ কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    // Record the view
    await db.insert(contactViews).values({
      viewerUserId: userId,
      biodataId,
    })

    // Deduct 1 connection from membership
    await db
      .update(memberships)
      .set({
        contactViewsRemaining: membership[0].contactViewsRemaining - 1,
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membership[0].id))

    return NextResponse.json({
      success: true,
      unlocked: true,
      remainingConnections: membership[0].contactViewsRemaining - 1,
    })
  } catch (error) {
    console.error("Error viewing biodata:", error)
    return NextResponse.json({ error: "বায়োডাটা দেখতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// GET - Check if user can view biodata
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    const biodataId = request.nextUrl.searchParams.get("biodataId")

    if (!biodataId) {
      return NextResponse.json({ error: "বায়োডাটা আইডি আবশ্যক" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({
        canView: false,
        reason: "not_logged_in",
        unlocked: false,
      })
    }

    // Get biodata to check ownership
    const biodata = await db
      .select()
      .from(biodatas)
      .where(eq(biodatas.id, Number.parseInt(biodataId)))
      .limit(1)

    if (biodata.length === 0) {
      return NextResponse.json({ error: "বায়োডাটা পাওয়া যায়নি" }, { status: 404 })
    }

    // If user is viewing their own biodata
    if (biodata[0].userId === userId) {
      return NextResponse.json({
        canView: true,
        isOwnBiodata: true,
        unlocked: true,
        remainingConnections: 0,
      })
    }

    // Check if already viewed
    const existingView = await db
      .select()
      .from(contactViews)
      .where(and(eq(contactViews.viewerUserId, userId), eq(contactViews.biodataId, Number.parseInt(biodataId))))
      .limit(1)

    if (existingView.length > 0) {
      return NextResponse.json({
        canView: true,
        alreadyViewed: true,
        unlocked: true,
      })
    }

    // Check membership
    const membership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0 || membership[0].type === "free") {
      return NextResponse.json({
        canView: false,
        reason: "free_user",
        unlocked: false,
        remainingConnections: 0,
      })
    }

    if (membership[0].contactViewsRemaining <= 0) {
      return NextResponse.json({
        canView: false,
        reason: "no_connections_remaining",
        unlocked: false,
        remainingConnections: 0,
      })
    }

    return NextResponse.json({
      canView: true,
      unlocked: false,
      remainingConnections: membership[0].contactViewsRemaining,
      membershipType: membership[0].type,
    })
  } catch (error) {
    console.error("Error checking biodata view:", error)
    return NextResponse.json({ error: "চেক করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
