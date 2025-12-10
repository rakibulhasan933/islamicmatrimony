import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { memberships, contactViews, biodatas } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/clerk-auth"

// POST - View contact (deduct from membership)
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

    const biodata = await db.select().from(biodatas).where(eq(biodatas.id, biodataId)).limit(1)

    if (biodata.length === 0) {
      return NextResponse.json({ error: "বায়োডাটা পাওয়া যায়নি" }, { status: 404 })
    }

    // If user is viewing their own biodata, allow free access
    if (biodata[0].userId === user.clerkId) {
      return NextResponse.json({
        success: true,
        isOwnBiodata: true,
        contact: {
          guardianPhone: biodata[0].guardianPhone,
          guardianRelation: biodata[0].guardianRelation,
        },
      })
    }

    // Check if already viewed
    const existingView = await db
      .select()
      .from(contactViews)
      .where(and(eq(contactViews.viewerUserId, user.clerkId), eq(contactViews.biodataId, biodataId)))
      .limit(1)

    if (existingView.length > 0) {
      // Already viewed, return contact info
      return NextResponse.json({
        success: true,
        alreadyViewed: true,
        contact: {
          guardianPhone: biodata[0].guardianPhone,
          guardianRelation: biodata[0].guardianRelation,
        },
      })
    }

    const membership = await db.select().from(memberships).where(eq(memberships.userId, user.clerkId)).limit(1)

    if (membership.length === 0) {
      return NextResponse.json(
        {
          error: "আপনার কোনো সদস্যতা নেই। অনুগ্রহ করে সদস্যতা কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    const currentMembership = membership[0]

    if (currentMembership.status !== "active") {
      return NextResponse.json(
        {
          error: "আপনার সদস্যতা সক্রিয় নেই। অনুগ্রহ করে নতুন সদস্যতা কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    if (
      currentMembership.type !== "free" &&
      currentMembership.expiresAt &&
      new Date(currentMembership.expiresAt) < new Date()
    ) {
      await db.update(memberships).set({ status: "expired" }).where(eq(memberships.id, currentMembership.id))

      return NextResponse.json(
        {
          error: "আপনার সদস্যতার মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন সদস্যতা কিনুন।",
          needsMembership: true,
        },
        { status: 403 },
      )
    }

    const viewsRemaining = currentMembership.contactViewsRemaining ?? 0

    if (viewsRemaining <= 0) {
      return NextResponse.json(
        {
          error:
            currentMembership.type === "free"
              ? "আপনার ফ্রি কন্টাক্ট ভিউ শেষ। অনুগ্রহ করে সদস্যতা কিনুন।"
              : "আপনার কোনো কন্টাক্ট ভিউ বাকি নেই। অনুগ্রহ করে সদস্যতা আপগ্রেড করুন।",
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

    // Deduct from membership
    await db
      .update(memberships)
      .set({
        contactViewsRemaining: viewsRemaining - 1,
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, currentMembership.id))

    return NextResponse.json({
      success: true,
      contact: {
        guardianPhone: biodata[0].guardianPhone,
        guardianRelation: biodata[0].guardianRelation,
      },
      remainingViews: viewsRemaining - 1,
      membershipType: currentMembership.type,
    })
  } catch (error) {
    console.error("Error viewing contact:", error)
    return NextResponse.json({ error: "যোগাযোগ তথ্য দেখতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// GET - Check if user can view contact
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const biodataId = request.nextUrl.searchParams.get("biodataId")

    if (!user) {
      return NextResponse.json({ canView: false, reason: "not_logged_in" })
    }

    if (!biodataId) {
      return NextResponse.json({ error: "বায়োডাটা আইডি আবশ্যক" }, { status: 400 })
    }

    const biodata = await db
      .select()
      .from(biodatas)
      .where(eq(biodatas.id, Number.parseInt(biodataId)))
      .limit(1)

    if (biodata.length === 0) {
      return NextResponse.json({ error: "বায়োডাটা পাওয়া যায়নি" }, { status: 404 })
    }

    // If user is viewing their own biodata, allow free access
    if (biodata[0].userId === user.clerkId) {
      return NextResponse.json({
        canView: true,
        isOwnBiodata: true,
        contact: {
          guardianPhone: biodata[0].guardianPhone,
          guardianRelation: biodata[0].guardianRelation,
        },
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
        contact: {
          guardianPhone: biodata[0].guardianPhone,
          guardianRelation: biodata[0].guardianRelation,
        },
      })
    }

    const membership = await db.select().from(memberships).where(eq(memberships.userId, user.clerkId)).limit(1)

    if (membership.length === 0) {
      return NextResponse.json({
        canView: false,
        reason: "no_membership",
        remainingViews: 0,
      })
    }

    const currentMembership = membership[0]

    if (currentMembership.status !== "active") {
      return NextResponse.json({
        canView: false,
        reason: "membership_inactive",
        remainingViews: 0,
      })
    }

    if (
      currentMembership.type !== "free" &&
      currentMembership.expiresAt &&
      new Date(currentMembership.expiresAt) < new Date()
    ) {
      return NextResponse.json({
        canView: false,
        reason: "membership_expired",
        remainingViews: 0,
      })
    }

    const viewsRemaining = currentMembership.contactViewsRemaining ?? 0

    if (viewsRemaining <= 0) {
      return NextResponse.json({
        canView: false,
        reason: "no_views_remaining",
        remainingViews: 0,
        membershipType: currentMembership.type,
      })
    }

    return NextResponse.json({
      canView: true,
      alreadyViewed: false,
      remainingViews: viewsRemaining,
      membershipType: currentMembership.type,
    })
  } catch (error) {
    console.error("Error checking contact view:", error)
    return NextResponse.json({ error: "চেক করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
