"use client"

import { useEffect, useRef, useState } from "react"
import { User, Star, Crown, CheckCircle2, XCircle, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const packages = [
  {
    name: "ফ্রি মেম্বারশিপ",
    price: "৳০",
    duration: "আজীবন",
    icon: User,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    popular: false,
    features: [
      { text: "বায়োডাটা তৈরি করুন", included: true },
      { text: "অন্যদের বায়োডাটা দেখুন", included: true },
      { text: "অভিভাবকের মোবাইল নাম্বার", included: false },
      { text: "প্রিমিয়াম ভেরিফাইড ব্যাজ", included: false },
    ],
    buttonText: "ফ্রিতে শুরু করুন",
    buttonStyle: "outline",
    contactViews: 0,
    type: "free",
  },
  {
    name: "সিলভার প্যাকেজ",
    price: "৳২০০",
    duration: "৩০ দিন",
    icon: Star,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    popular: true,
    features: [
      { text: "বায়োডাটা তৈরি করুন", included: true },
      { text: "১০টি বায়োডাটার যোগাযোগ তথ্য", included: true },
      { text: "অভিভাবকের মোবাইল নাম্বার", included: true },
      { text: "প্রিমিয়াম ভেরিফাইড ব্যাজ", included: false },
    ],
    buttonText: "প্যাকেজটি কিনুন",
    buttonStyle: "primary",
    contactViews: 10,
    type: "silver",
  },
  {
    name: "গোল্ড প্যাকেজ",
    price: "৳৫০০",
    duration: "৯০ দিন",
    icon: Crown,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    popular: false,
    features: [
      { text: "বায়োডাটা তৈরি করুন", included: true },
      { text: "৩০টি বায়োডাটার যোগাযোগ তথ্য", included: true },
      { text: "অভিভাবকের মোবাইল নাম্বার", included: true },
      { text: "প্রিমিয়াম ভেরিফাইড ব্যাজ", included: true },
    ],
    buttonText: "প্যাকেজটি কিনুন",
    buttonStyle: "outline",
    contactViews: 30,
    type: "gold",
  },
]

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-16 md:py-24 bg-gradient-to-b from-pink-50/50 to-white relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="inline-flex items-center gap-2 text-pink-500 font-semibold text-sm tracking-wide uppercase bg-pink-50 px-4 py-2 rounded-full mb-4">
            মেম্বারশিপ
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            আমাদের <span className="gradient-text">মেম্বারশিপ</span> প্যাকেজ
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">বিয়ে সহজ করতে আমাদের নামমাত্র মূল্যের প্যাকেজগুলো দেখুন</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                pkg.popular ? "border-2 border-pink-500 md:scale-105 z-10" : "border border-gray-100"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-pink-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl">
                  জনপ্রিয়
                </div>
              )}

              {/* Icon & Name */}
              <div className="text-center mb-6">
                <div
                  className={`${pkg.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${pkg.iconColor} group-hover:scale-110 transition-transform`}
                >
                  <pkg.icon className={`w-8 h-8 ${pkg.popular ? "fill-current" : ""}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                <div className="mt-4">
                  <span className={`text-4xl font-bold ${pkg.popular ? "text-pink-600" : "text-foreground"}`}>
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground">/ {pkg.duration}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    className={`flex items-center gap-3 ${feature.included ? (pkg.popular ? "text-foreground font-medium" : "text-muted-foreground") : "text-gray-400 line-through"}`}
                  >
                    {feature.included ? (
                      feature.text.includes("ভেরিফাইড") ? (
                        <BadgeCheck className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className={`w-5 h-5 ${pkg.popular ? "text-pink-600" : "text-green-500"}`} />
                      )
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Link href={pkg.type === "free" ? "/register" : "/pricing"}>
                <Button
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    pkg.buttonStyle === "primary"
                      ? "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-200"
                      : "border-2 border-gray-200 text-muted-foreground hover:border-pink-600 hover:text-pink-600 bg-transparent"
                  }`}
                >
                  {pkg.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
