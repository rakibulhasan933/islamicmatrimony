"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Crown, Check, Loader2, Star, User, BadgeCheck, X } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

const packages = [
  {
    id: "free",
    name: "ফ্রি মেম্বারশিপ",
    price: "০",
    duration: "আজীবন",
    icon: User,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    features: [
      { text: "বায়োডাটা তৈরি করুন", included: true },
      { text: "অন্যদের বায়োডাটা দেখুন", included: true },
      { text: "অভিভাবকের মোবাইল নাম্বার", included: false },
      { text: "প্রিমিয়াম ভেরিফাইড ব্যাজ", included: false },
    ],
    buttonText: "ফ্রিতে শুরু করুন",
    disabled: false,
    popular: false,
  },
  {
    id: "silver",
    name: "সিলভার প্যাকেজ",
    price: "২০০",
    duration: "৩০ দিন",
    icon: Star,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    features: [
      { text: "বায়োডাটা তৈরি করুন", included: true },
      { text: "১০টি বায়োডাটার যোগাযোগ তথ্য", included: true },
      { text: "অভিভাবকের মোবাইল নাম্বার", included: true },
      { text: "প্রিমিয়াম ভেরিফাইড ব্যাজ", included: false },
    ],
    buttonText: "প্যাকেজটি কিনুন",
    disabled: false,
    popular: true,
  },
  {
    id: "gold",
    name: "গোল্ড প্যাকেজ",
    price: "৫০০",
    duration: "৯০ দিন",
    icon: Crown,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    features: [
      { text: "বায়োডাটা তৈরি করুন", included: true },
      { text: "৩০টি বায়োডাটার যোগাযোগ তথ্য", included: true },
      { text: "অভিভাবকের মোবাইল নাম্বার", included: true },
      { text: "প্রিমিয়াম ভেরিফাইড ব্যাজ", included: true },
    ],
    buttonText: "প্যাকেজটি কিনুন",
    disabled: false,
    popular: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handlePurchase = async (packageId: string) => {
    if (packageId === "free") {
      router.push("/register")
      return
    }

    if (!user) {
      router.push("/login")
      return
    }

    setPurchasing(packageId)
    setError("")

    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: packageId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "সদস্যতা কিনতে সমস্যা হয়েছে")
        return
      }

      router.push("/dashboard/membership")
    } catch (err) {
      setError("সদস্যতা কিনতে সমস্যা হয়েছে")
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-100 px-4 py-1 rounded-full text-pink-700 text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              মেম্বারশিপ প্যাকেজ
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">আপনার জন্য সঠিক প্যাকেজ বেছে নিন</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              যোগাযোগের তথ্য দেখতে এবং আপনার জীবনসঙ্গী খুঁজে পেতে আমাদের প্রিমিয়াম প্যাকেজ ব্যবহার করুন
            </p>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-8 bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => {
              const Icon = pkg.icon
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                    pkg.popular ? "border-pink-500 shadow-lg shadow-pink-100 md:scale-105 z-10" : "border-gray-100"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">জনপ্রিয়</span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    {/* Icon */}
                    <div
                      className={`${pkg.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-8 h-8 ${pkg.iconColor}`} />
                    </div>

                    <h3
                      className={`text-xl font-bold mb-2 ${pkg.id === "gold" ? "text-yellow-600" : pkg.id === "silver" ? "text-pink-600" : "text-gray-900"}`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${pkg.popular ? "text-pink-600" : "text-gray-900"}`}>
                        ৳{pkg.price}
                      </span>
                      <span className="text-gray-500">/ {pkg.duration}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-2 ${feature.included ? "text-gray-700" : "text-gray-400 line-through"}`}
                      >
                        {feature.included ? (
                          feature.text.includes("ভেরিফাইড") ? (
                            <BadgeCheck className="w-5 h-5 text-yellow-500 shrink-0" />
                          ) : (
                            <Check className={`w-5 h-5 ${pkg.popular ? "text-pink-600" : "text-green-500"} shrink-0`} />
                          )
                        ) : (
                          <X className="w-5 h-5 text-gray-300 shrink-0" />
                        )}
                        {feature.text}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing === pkg.id}
                    className={`w-full ${
                      pkg.popular
                        ? "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-200"
                        : pkg.id === "gold"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                          : "border-2 border-gray-200 text-gray-700 hover:border-pink-600 hover:text-pink-600 bg-transparent"
                    }`}
                  >
                    {purchasing === pkg.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        প্রসেসিং...
                      </>
                    ) : (
                      pkg.buttonText
                    )}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Note */}
          <p className="text-center text-gray-500 text-sm mt-8">
            * পেমেন্ট সম্পন্ন হলে সাথে সাথে আপনার অ্যাকাউন্ট আপগ্রেড হয়ে যাবে
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
