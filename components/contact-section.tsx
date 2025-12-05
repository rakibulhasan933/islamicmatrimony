"use client"

import { useState } from "react"
import { Phone, Lock, Crown, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ContactSectionProps {
  biodataId: number
  guardianPhone: string | null
  guardianRelation: string | null
  isLoggedIn: boolean
  hasViewedContact: boolean
  canViewContact: boolean
  remainingViews: number
  membershipType: string
}

export function ContactSection({
  biodataId,
  guardianPhone,
  guardianRelation,
  isLoggedIn,
  hasViewedContact,
  canViewContact,
  remainingViews,
  membershipType,
}: ContactSectionProps) {
  const [isViewing, setIsViewing] = useState(false)
  const [contactData, setContactData] = useState<{
    guardianPhone: string | null
    guardianRelation: string | null
  } | null>(hasViewedContact ? { guardianPhone, guardianRelation } : null)
  const [error, setError] = useState("")
  const [views, setViews] = useState(remainingViews)

  const handleViewContact = async () => {
    setIsViewing(true)
    setError("")

    try {
      const response = await fetch("/api/contact/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biodataId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.needsMembership) {
          setError(data.error)
        } else {
          setError(data.error || "যোগাযোগ তথ্য দেখতে সমস্যা হয়েছে")
        }
        return
      }

      setContactData(data.contact)
      if (data.remainingViews !== undefined) {
        setViews(data.remainingViews)
      }
    } catch (err) {
      setError("যোগাযোগ তথ্য দেখতে সমস্যা হয়েছে")
    } finally {
      setIsViewing(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-pink-50 rounded-lg">
          <Phone className="w-5 h-5 text-pink-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">যোগাযোগ</h3>
      </div>

      {!isLoggedIn ? (
        // Not logged in
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">যোগাযোগের তথ্য দেখতে অনুগ্রহ করে লগইন করুন</p>
          <Link href="/login">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">লগইন করুন</Button>
          </Link>
        </div>
      ) : contactData ? (
        // Contact is visible
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 text-green-700 mb-4">
            <Eye className="w-5 h-5" />
            <span className="font-medium">যোগাযোগের তথ্য</span>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 text-sm min-w-[140px]">অভিভাবকের সম্পর্ক:</span>
              <span className="font-medium text-gray-900">{contactData.guardianRelation || "N/A"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 text-sm min-w-[140px]">অভিভাবকের ফোন:</span>
              <span className="font-bold text-lg text-pink-600">{contactData.guardianPhone || "N/A"}</span>
            </div>
          </div>
        </div>
      ) : canViewContact ? (
        // Can view contact (has membership)
        <div className="bg-pink-50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-pink-700 mb-4">
            <Crown className="w-5 h-5" />
            <span className="font-medium">{membershipType === "gold" ? "গোল্ড" : "সিলভার"} সদস্য</span>
          </div>
          <p className="text-gray-600 mb-2">
            আপনার বাকি কন্টাক্ট ভিউ: <span className="font-bold text-pink-600">{views}</span>
          </p>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <Button onClick={handleViewContact} disabled={isViewing} className="bg-pink-600 hover:bg-pink-700 text-white">
            {isViewing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                লোড হচ্ছে...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                যোগাযোগ নম্বর দেখুন
              </>
            )}
          </Button>
        </div>
      ) : (
        // No membership or no views remaining
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">যোগাযোগের তথ্য দেখতে সদস্যতা প্রয়োজন</p>
          <p className="text-gray-600 text-sm mb-4">সিলভার বা গোল্ড প্যাকেজ কিনে যোগাযোগের তথ্য দেখুন</p>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
              <Crown className="w-4 h-4 mr-2" />
              প্যাকেজ দেখুন
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
