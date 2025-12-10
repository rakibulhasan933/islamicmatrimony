import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { memberships, contactViews, biodatas } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/clerk-auth"

// POST - View biodata (deduct 1 connection)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
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
    if (biodata[0].userId === user.clerkId) {
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
      .where(and(eq(contactViews.viewerUserId, user.clerkId), eq(contactViews.biodataId, biodataId)))
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
      .where(and(eq(memberships.userId, user.clerkId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0) {
      return NextResponse.json(
        {
          error: "বায়োডাটা দেখতে সদস্যতা প্রয়োজন। অনুগ্রহ করে প্যাকেজ কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    if (membership[0].type !== "free" && membership[0].expiresAt && new Date(membership[0].expiresAt) < new Date()) {
      await db.update(memberships).set({ status: "expired" }).where(eq(memberships.id, membership[0].id))

      return NextResponse.json(
        {
          error: "আপনার সদস্যতার মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন প্যাকেজ কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    const viewsRemaining = membership[0].contactViewsRemaining ?? 0

    if (viewsRemaining <= 0) {
      return NextResponse.json(
        {
          error: "আপনার কাছে বায়োডাটা দেখার জন্য পর্যাপ্ত সংযোগ নেই। অনুগ্রহ করে নতুন প্যাকেজ কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    // Record the view
    await db.insert(contactViews).values({
      viewerUserId: user.clerkId,
      biodataId,
    })

    // Deduct 1 connection from membership
    await db
      .update(memberships)
      .set({
        contactViewsRemaining: viewsRemaining - 1,
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membership[0].id))

    return NextResponse.json({
      success: true,
      unlocked: true,
      remainingConnections: viewsRemaining - 1,
    })
  } catch (error) {
    console.error("Error viewing biodata:", error)
    return NextResponse.json({ error: "বায়োডাটা দেখতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// GET - Check if user can view biodata
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const biodataId = request.nextUrl.searchParams.get("biodataId")

    if (!biodataId) {
      return NextResponse.json({ error: "বায়োডাটা আইডি আবশ্যক" }, { status: 400 })
    }

    if (!user) {
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
    if (biodata[0].userId === user.clerkId) {
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
      .where(and(eq(contactViews.viewerUserId, user.clerkId), eq(contactViews.biodataId, Number.parseInt(biodataId))))
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
      .where(and(eq(memberships.userId, user.clerkId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0) {
      return NextResponse.json({
        canView: false,
        reason: "no_membership",
        unlocked: false,
        remainingConnections: 0,
      })
    }

    if (membership[0].type !== "free" && membership[0].expiresAt && new Date(membership[0].expiresAt) < new Date()) {
      return NextResponse.json({
        canView: false,
        reason: "membership_expired",
        unlocked: false,
        remainingConnections: 0,
      })
    }

    const viewsRemaining = membership[0].contactViewsRemaining ?? 0

    if (viewsRemaining <= 0) {
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
      remainingConnections: viewsRemaining,
      membershipType: membership[0].type,
    })
  } catch (error) {
    console.error("Error checking biodata view:", error)
    return NextResponse.json({ error: "চেক করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
