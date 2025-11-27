import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { biodatas } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null
  }

  const { payload } = await jwtVerify(token, JWT_SECRET)
  const { userId } = payload as { userId: number; }

  return userId
}

function generateBiodataNo(): string {
  const prefix = "NB"
  const random = Math.floor(10000 + Math.random() * 90000)
  return `${prefix}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUser()

    if (!userId) {
      return NextResponse.json({ error: "অনুগ্রহ করে লগইন করুন" }, { status: 401 })
    }

    const data = await request.json()

    // Check if user already has a biodata
    const existingBiodata = await db.select().from(biodatas).where(eq(biodatas.userId, userId)).limit(1)

    const biodataData = {
      type: data.type as "bride" | "groom",
      fullName: data.fullName,
      gender: data.type === "groom" ? ("male" as const) : ("female" as const),
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      age: data.age ? Number.parseInt(data.age) : null,
      height: data.height || null,
      weight: data.weight || null,
      bloodGroup: data.bloodGroup || null,
      complexion: data.complexion || null,
      maritalStatus: data.maritalStatus as "unmarried" | "divorced" | "widow" | "widower",
      permanentDistrict: data.permanentDistrict || null,
      permanentAddress: data.permanentAddress || null,
      currentDistrict: data.currentDistrict || null,
      currentAddress: data.currentAddress || null,
      education: data.education || null,
      educationDetails: data.educationDetails || null,
      occupation: data.occupation || null,
      occupationDetails: data.occupationDetails || null,
      monthlyIncome: data.monthlyIncome || null,
      fatherName: data.fatherName || null,
      fatherOccupation: data.fatherOccupation || null,
      motherName: data.motherName || null,
      motherOccupation: data.motherOccupation || null,
      siblings: data.siblings || null,
      religiousPractice: data.religiousPractice || null,
      prayerHabit: data.prayerHabit || null,
      wearsHijab: data.wearsHijab || false,
      hasBeard: data.hasBeard || false,
      expectedAge: data.expectedAge || null,
      expectedHeight: data.expectedHeight || null,
      expectedEducation: data.expectedEducation || null,
      expectedDistrict: data.expectedDistrict || null,
      expectedMaritalStatus: data.expectedMaritalStatus || null,
      partnerQualities: data.partnerQualities || null,
      guardianPhone: data.guardianPhone || null,
      guardianRelation: data.guardianRelation || null,
      updatedAt: new Date(),
      photo: data.photo || null,
    }

    if (existingBiodata.length > 0) {
      // Update existing biodata
      await db.update(biodatas).set(biodataData).where(eq(biodatas.id, existingBiodata[0].id))

      return NextResponse.json({
        success: true,
        message: "বায়োডাটা সফলভাবে আপডেট হয়েছে",
        biodataNo: existingBiodata[0].biodataNo,
      })
    } else {
      // Create new biodata
      const biodataNo = generateBiodataNo()

      await db.insert(biodatas).values({
        ...biodataData,
        biodataNo,
        userId,
        isApproved: true,
        isPublished: true,
        createdAt: new Date(),
      })

      return NextResponse.json({
        success: true,
        message: "বায়োডাটা সফলভাবে তৈরি হয়েছে",
        biodataNo,
      })
    }
  } catch (error) {
    console.error("Error saving biodata:", error)
    return NextResponse.json({ error: "বায়োডাটা সংরক্ষণ করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
