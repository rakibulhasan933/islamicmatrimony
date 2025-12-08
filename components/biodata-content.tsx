"use client"

import { useState } from "react"
import type React from "react"
import Image from "next/image"
import {
  Lock,
  Crown,
  Eye,
  Loader2,
  Unlock,
  AlertCircle,
  User,
  Phone,
  ShieldAlert,
  Sparkles,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Biodata } from "@/lib/db/schema"

interface BiodataContentProps {
  biodata: Biodata
  isLoggedIn: boolean
  isOwnBiodata: boolean
  hasViewedBiodata: boolean
  canViewBiodata: boolean
  remainingConnections: number
  membershipType: string
  initialUnlocked: boolean
  onUnlock?: () => void
}

function SectionCard({
  title,
  children,
  delay = 0,
  isLocked = false,
}: {
  title: string
  children: React.ReactNode
  delay?: number
  isLocked?: boolean
}) {
  return (
    <div
      className={`bg-pink-50/80 rounded-xl overflow-hidden border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300 ${isLocked ? "relative" : ""}`}
      style={{
        animation: `fadeInUp 0.5s ease-out ${delay}ms both`,
      }}
    >
      <div className="bg-linear-to-r from-pink-600 to-pink-500 px-5 py-3 flex items-center justify-between">
        <h3 className="font-bold text-white text-base tracking-wide">{title}</h3>
        {isLocked && (
          <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full animate-pulse">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span className="text-xs text-white font-medium">গোপনীয়</span>
          </div>
        )}
      </div>
      <div className="p-1 relative">
        {children}
        {isLocked && (
          <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/90 to-white backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-14 h-14 bg-linear-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
                <Lock className="w-7 h-7 text-pink-500" />
              </div>
              <p className="text-gray-700 text-sm font-semibold">এই তথ্য দেখতে আনলক করুন</p>
              <p className="text-gray-500 text-xs mt-1">১টি কানেকশন খরচ হবে</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  isHidden = false,
  highlight = false,
}: {
  label: string
  value: string | number | null | undefined
  isHidden?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex border-b border-pink-100 last:border-b-0 hover:bg-pink-100/50 transition-colors duration-200">
      <span className="text-gray-700 text-sm py-3 px-4 w-[45%] shrink-0 font-medium bg-pink-50/50">{label}</span>
      <span
        className={`text-sm py-3 px-4 flex-1 ${isHidden ? "text-gray-400 italic" : highlight ? "text-pink-600 font-bold" : "text-gray-900"}`}
      >
        {isHidden ? (
          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
            <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 text-xs font-medium">গোপনীয়</span>
          </span>
        ) : (
          value || "—"
        )}
      </span>
    </div>
  )
}

function LockedPhotoPreview({ photo }: { photo: string | null }) {
  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 shadow-lg">
      {photo ? (
        <Image src={photo || "/placeholder.svg"} alt="Profile" fill className="object-cover blur-xl scale-110" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-20 h-20 text-slate-400" />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-b from-slate-800/40 via-slate-800/70 to-slate-900/90 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border-2 border-white/20">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">ছবি লক করা আছে</span>
        <span className="text-white/70 text-xs mt-1">আনলক করলে দেখতে পারবেন</span>
      </div>
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

export function BiodataContent({
  biodata: bio,
  isLoggedIn,
  isOwnBiodata,
  hasViewedBiodata,
  canViewBiodata,
  remainingConnections,
  membershipType,
  initialUnlocked,
  onUnlock,
}: BiodataContentProps) {
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [connections, setConnections] = useState(remainingConnections)
  const [error, setError] = useState("");

  console.log("[v0] Starting unlock process for biodata:", bio.id)
  console.log(
    "Current state - isLoggedIn:",
    isLoggedIn,
    "canViewBiodata:",
    canViewBiodata,
    "connections:",
    connections,
  )

  const handleUnlock = async () => {

    setIsUnlocking(true)
    setError("")

    try {
      const response = await fetch("/api/biodata/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biodataId: bio.id }),
      })

      const data = await response.json()
      console.log(" API Response:", data)

      if (!response.ok) {
        console.log(" Unlock failed:", data.error)
        setError(data.error || "বায়োডাটা আনলক করতে সমস্যা হয়েছে")
        return
      }

      console.log(" Unlock successful! Remaining connections:", data.remainingConnections)
      setIsUnlocked(true)
      if (data.remainingConnections !== undefined) {
        setConnections(data.remainingConnections)
      }

      if (onUnlock) {
        onUnlock()
      }
      // Reload the page to update the sidebar with unlocked photo and name
      window.location.reload()
    } catch (err) {
      console.log(" Unlock error:", err)
      setError("বায়োডাটা আনলক করতে সমস্যা হয়েছে")
    } finally {
      setIsUnlocking(false)
    }
  }

  if (!isUnlocked && !isOwnBiodata) {
    return (
      <div className="flex-1 space-y-5">
        {/* Unlock Banner - Improved design */}
        <div
          className="bg-linear-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-2xl border border-slate-700 relative overflow-hidden"
          style={{ animation: "fadeInUp 0.5s ease-out" }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Locked photo preview */}
              <div className="lg:w-48 shrink-0">
                <LockedPhotoPreview photo={bio.photo} />
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <ShieldAlert className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold">সম্পূর্ণ বায়োডাটা দেখতে আনলক করুন</h2>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-slate-300 text-sm flex items-center justify-center lg:justify-start gap-2">
                    <Lock className="w-4 h-4 text-pink-400" />
                    ছবি, নাম, পারিবারিক তথ্য গোপন রাখা হয়েছে
                  </p>
                  <p className="text-slate-300 text-sm flex items-center justify-center lg:justify-start gap-2">
                    <Phone className="w-4 h-4 text-pink-400" />
                    যোগাযোগের তথ্য লক করা আছে
                  </p>
                </div>

                {isLoggedIn && membershipType !== "free" && (
                  <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">
                      বাকি কানেকশন: <span className="font-bold text-pink-400">{connections}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                {!isLoggedIn ? (
                  <Link href="/login" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 shadow-lg border-0"
                    >
                      <User className="w-5 h-5 mr-2" />
                      লগইন করুন
                    </Button>
                  </Link>
                ) : canViewBiodata ? (
                  <Button
                    size="lg"
                    onClick={handleUnlock}
                    disabled={isUnlocking}
                    className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 shadow-lg border-0 disabled:opacity-70"
                  >
                    {isUnlocking ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        আনলক হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-5 h-5 mr-2" />
                        আনলক করুন (১ কানেকশন)
                      </>
                    )}
                  </Button>
                ) : (
                  <Link href="/pricing" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-linear-to-r from-yellow-400 to-amber-500 text-yellow-900 hover:from-yellow-500 hover:to-amber-600 font-bold px-8 shadow-lg border-0"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      {membershipType === "free" ? "প্যাকেজ কিনুন" : "কানেকশন শেষ - রিনিউ করুন"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Limited Preview - Show basic info but hide sensitive data */}
        <SectionCard title="ঠিকানা" delay={100}>
          <InfoRow label="স্থায়ী জেলা" value={bio.permanentDistrict} />
          <InfoRow label="স্থায়ী ঠিকানা" value={null} isHidden />
          <InfoRow label="বর্তমান জেলা" value={bio.currentDistrict} />
          <InfoRow label="বর্তমান ঠিকানা" value={null} isHidden />
        </SectionCard>

        <SectionCard title="শিক্ষাগত যোগ্যতা" delay={200}>
          <InfoRow label="শিক্ষাগত যোগ্যতা" value={bio.education} />
          <InfoRow label="শিক্ষা প্রতিষ্ঠানের নাম" value={null} isHidden />
          <InfoRow label="পাশের সন" value="—" />
        </SectionCard>

        <SectionCard title="পারিবারিক তথ্য" delay={300} isLocked>
          <InfoRow label="পিতার নাম" value={null} isHidden />
          <InfoRow label="পিতার পেশা" value={null} isHidden />
          <InfoRow label="মাতার নাম" value={null} isHidden />
          <InfoRow label="মাতার পেশা" value={null} isHidden />
          <InfoRow label="ভাই/বোন কয়জন" value={null} isHidden />
          <InfoRow label="পরিবারের ধর্মীয় পরিবেশ" value={null} isHidden />
        </SectionCard>

        <SectionCard title={bio.type === "bride" ? "পাত্রীর তথ্য" : "পাত্রের তথ্য"} delay={400}>
          <InfoRow label="পুরো নাম" value={null} isHidden />
          <InfoRow label="বয়স" value={bio.age ? `${bio.age} বছর` : null} />
          <InfoRow label="উচ্চতা" value={bio.height} />
          <InfoRow label="ওজন" value={bio.weight} />
          <InfoRow label="গাত্রবর্ণ" value={bio.complexion} />
          <InfoRow label="রক্তের গ্রুপ" value={bio.bloodGroup} />
          <InfoRow label="বৈবাহিক অবস্থা" value={getMaritalStatusDisplay(bio.maritalStatus)} />
          <InfoRow label="পেশা" value={bio.occupation} />
          <InfoRow label="মাসিক আয়" value={null} isHidden />
        </SectionCard>

        <SectionCard title="যেমন জীবনসঙ্গী আশা করেন" delay={500}>
          <InfoRow label="প্রত্যাশিত বয়স" value={bio.expectedAge} />
          <InfoRow label="প্রত্যাশিত উচ্চতা" value={bio.expectedHeight} />
          <InfoRow label="প্রত্যাশিত শিক্ষাগত যোগ্যতা" value={bio.expectedEducation} />
          <InfoRow label="প্রত্যাশিত জেলা" value={bio.expectedDistrict} />
        </SectionCard>

        <SectionCard title="যোগাযোগ" delay={600} isLocked>
          <InfoRow label="অভিভাবকের সম্পর্ক" value={null} isHidden />
          <InfoRow label="অভিভাবকের ফোন" value={null} isHidden />
          <InfoRow label="ইমেইল" value={null} isHidden />
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-5">
      {/* Unlocked Success Badge */}
      {!isOwnBiodata && (
        <div
          className="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg flex items-center gap-4 relative overflow-hidden"
          style={{ animation: "fadeInUp 0.3s ease-out" }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative z-10">
            <Eye className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg">বায়োডাটা আনলক করা হয়েছে</h3>
            <p className="text-green-100 text-sm">আপনি এই বায়োডাটার সম্পূর্ণ তথ্য দেখতে পারবেন</p>
          </div>
        </div>
      )}

      {/* ঠিকানা - Address */}
      <SectionCard title="ঠিকানা" delay={100}>
        <InfoRow label="স্থায়ী ঠিকানা" value={bio.permanentAddress} />
        <InfoRow label="স্থায়ী জেলা" value={bio.permanentDistrict} />
        <InfoRow label="বর্তমান ঠিকানা" value={bio.currentAddress} />
        <InfoRow label="বর্তমান জেলা" value={bio.currentDistrict} />
      </SectionCard>

      {/* শিক্ষাগত যোগ্যতা - Education */}
      <SectionCard title="শিক্ষাগত যোগ্যতা" delay={200}>
        <InfoRow label="শিক্ষাগত যোগ্যতা" value={bio.education} />
        <InfoRow label="পাশের সন" value="—" />
        <InfoRow label="শিক্ষা প্রতিষ্ঠানের নাম" value={bio.educationDetails} />
        <InfoRow label="অন্যান্য শিক্ষাগত যোগ্যতা" value="—" />
      </SectionCard>

      {/* পারিবারিক তথ্য - Family Information */}
      <SectionCard title="পারিবারিক তথ্য" delay={300}>
        <InfoRow label="পরিবারের অর্থনৈতিক অবস্থা" value="—" />
        <InfoRow label="পিতার নাম" value={bio.fatherName} />
        <InfoRow label="পিতার পেশা" value={bio.fatherOccupation} />
        <InfoRow label="মাতার নাম" value={bio.motherName} />
        <InfoRow label="মাতার পেশা" value={bio.motherOccupation} />
        <InfoRow label="ভাই/বোন কয়জন" value={bio.siblings} />
        <InfoRow label="চাচা/মামা কি করেন" value="—" />
        <InfoRow label="পরিবারের ধর্মীয় পরিবেশ" value={bio.religiousPractice} />
        <InfoRow label="পরিবার সম্পর্কে বিস্তারিত" value="—" />
      </SectionCard>

      {/* পাত্রী/পাত্রের তথ্য - Personal Information */}
      <SectionCard title={bio.type === "bride" ? "পাত্রীর তথ্য" : "পাত্রের তথ্য"} delay={400}>
        <InfoRow label="পুরো নাম" value={bio.fullName} />
        <InfoRow
          label="জন্ম তারিখ"
          value={bio.dateOfBirth ? new Date(bio.dateOfBirth).toLocaleDateString("bn-BD") : null}
        />
        <InfoRow label="বয়স" value={bio.age ? `${bio.age} বছর` : null} />
        <InfoRow label="উচ্চতা" value={bio.height} />
        <InfoRow label="ওজন" value={bio.weight} />
        <InfoRow label="গাত্রবর্ণ" value={bio.complexion} />
        <InfoRow label="রক্তের গ্রুপ" value={bio.bloodGroup} />
        <InfoRow label="জাতীয়তা" value="বাংলাদেশী" />
        <InfoRow label="বৈবাহিক অবস্থা" value={getMaritalStatusDisplay(bio.maritalStatus)} />
        <InfoRow label="পেশা" value={bio.occupation} />
        <InfoRow label="মাসিক আয়" value={bio.monthlyIncome} />
        <InfoRow label="পেশা সম্পর্কে বিস্তারিত" value={bio.occupationDetails} />
        {bio.type === "bride" && (
          <InfoRow label="পর্দা করেন কিনা" value={bio.wearsHijab ? "হ্যাঁ" : bio.wearsHijab === false ? "না" : null} />
        )}
        {bio.type === "groom" && (
          <InfoRow label="দাড়ি আছে কিনা" value={bio.hasBeard ? "হ্যাঁ" : bio.hasBeard === false ? "না" : null} />
        )}
        <InfoRow label="নামাজ" value={bio.prayerHabit} />
      </SectionCard>

      {/* যেমন জীবনসঙ্গী আশা করেন - Partner Preferences */}
      <SectionCard title="যেমন জীবনসঙ্গী আশা করেন" delay={500}>
        <InfoRow label="প্রত্যাশিত বয়স" value={bio.expectedAge} />
        <InfoRow label="প্রত্যাশিত উচ্চতা" value={bio.expectedHeight} />
        <InfoRow label="প্রত্যাশিত শিক্ষাগত যোগ্যতা" value={bio.expectedEducation} />
        <InfoRow label="প্রত্যাশিত জেলা" value={bio.expectedDistrict} />
        <InfoRow label="প্রত্যাশিত বৈবাহিক অবস্থা" value={bio.expectedMaritalStatus} />
        <InfoRow label="জীবনসঙ্গীর কাছে যা প্রত্যাশা" value={bio.partnerQualities} />
      </SectionCard>

      {/* যোগাযোগ - Contact Information */}
      <SectionCard title="যোগাযোগ" delay={600}>
        <InfoRow label="অভিভাবকের সম্পর্ক" value={bio.guardianRelation} />
        <InfoRow label="অভিভাবকের ফোন" value={bio.guardianPhone} highlight />
      </SectionCard>
    </div>
  )
}
