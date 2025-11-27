import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { biodatas } from "@/lib/db/schema"
import { eq, and, gte, lte, ilike, or, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const type = searchParams.get("type")
    const maritalStatus = searchParams.get("status")
    const location = searchParams.get("location")
    const ageMin = searchParams.get("ageMin")
    const ageMax = searchParams.get("ageMax")
    const education = searchParams.get("education")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    // Build conditions array
    const conditions = [eq(biodatas.isPublished, true)]

    if (type && type !== "all") {
      conditions.push(eq(biodatas.type, type as "bride" | "groom"))
    }

    if (maritalStatus && maritalStatus !== "all") {
      conditions.push(eq(biodatas.maritalStatus, maritalStatus as any))
    }

    if (location) {
      conditions.push(
        or(ilike(biodatas.currentDistrict, `%${location}%`), ilike(biodatas.permanentDistrict, `%${location}%`)) as any,
      )
    }

    if (ageMin) {
      conditions.push(gte(biodatas.age, Number.parseInt(ageMin)))
    }

    if (ageMax) {
      conditions.push(lte(biodatas.age, Number.parseInt(ageMax)))
    }

    if (education) {
      conditions.push(ilike(biodatas.education, `%${education}%`))
    }

    const results = await db
      .select({
        id: biodatas.id,
        biodataNo: biodatas.biodataNo,
        type: biodatas.type,
        age: biodatas.age,
        height: biodatas.height,
        education: biodatas.education,
        occupation: biodatas.occupation,
        currentDistrict: biodatas.currentDistrict,
        maritalStatus: biodatas.maritalStatus,
        createdAt: biodatas.createdAt,
        photo: biodatas.photo,
      })
      .from(biodatas)
      .where(and(...conditions))
      .orderBy(sql`${biodatas.createdAt} DESC`)
      .limit(limit)
      .offset(offset)

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(biodatas)
      .where(and(...conditions))

    const total = countResult[0]?.count || 0

    return NextResponse.json({
      biodatas: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching biodatas:", error)
    return NextResponse.json({ error: "বায়োডাটা লোড করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
