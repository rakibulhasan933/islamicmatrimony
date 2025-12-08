"use client"

import { useState } from "react"
import { Lock, Crown, Eye, Loader2 } from "lucide-react"
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
    <div className="bg-pink-50/80 rounded-xl overflow-hidden border border-pink-200 shadow-sm">
      <div className="bg-gradient-to-r from-pink-600 to-pink-500 px-5 py-3">
        <h3 className="font-bold text-white text-base tracking-wide">যোগাযোগ</h3>
      </div>
      <div className="p-4">
        {!isLoggedIn ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-inner">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-pink-500" />
            </div>
            <p className="text-gray-600 mb-5">যোগাযোগের তথ্য দেখতে অনুগ্রহ করে লগইন করুন</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white px-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                লগইন করুন
              </Button>
            </Link>
          </div>
        ) : contactData ? (
          <div className="space-y-0">
            <div className="flex border-b border-pink-100 hover:bg-pink-100/50 transition-colors duration-200">
              <span className="text-gray-700 text-sm py-3 px-4 w-[45%] shrink-0 font-medium bg-pink-50/50">
                অভিভাবকের সম্পর্ক
              </span>
              <span className="text-gray-900 text-sm py-3 px-4 flex-1">{contactData.guardianRelation || "—"}</span>
            </div>
            <div className="flex hover:bg-pink-100/50 transition-colors duration-200">
              <span className="text-gray-700 text-sm py-3 px-4 w-[45%] shrink-0 font-medium bg-pink-50/50">
                অভিভাবকের ফোন
              </span>
              <span className="text-pink-600 text-sm py-3 px-4 flex-1 font-bold">
                {contactData.guardianPhone || "—"}
              </span>
            </div>
          </div>
        ) : canViewContact ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-inner">
            <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-2 rounded-full mb-4">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">{membershipType === "gold" ? "গোল্ড" : "সিলভার"} সদস্য</span>
            </div>
            <p className="text-gray-600 mb-2 text-sm">
              আপনার বাকি কন্টাক্ট ভিউ: <span className="font-bold text-pink-600 text-lg">{views}</span>
            </p>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <Button
              onClick={handleViewContact}
              disabled={isViewing}
              className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white px-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
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
          <div className="bg-white rounded-xl p-8 text-center shadow-inner">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-gray-700 font-semibold mb-2">যোগাযোগের তথ্য দেখতে সদস্যতা প্রয়োজন</p>
            <p className="text-gray-500 text-sm mb-5">সিলভার বা গোল্ড প্যাকেজ কিনে যোগাযোগের তথ্য দেখুন</p>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <Crown className="w-4 h-4 mr-2" />
                প্যাকেজ দেখুন
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
