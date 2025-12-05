"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, CheckCircle, Heart, Moon, Lock, Gem } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "গোপনীয়তা নিশ্চিত",
    description: "আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত এবং গোপনীয় রাখা হয়",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: CheckCircle,
    title: "যাচাইকৃত প্রোফাইল",
    description: "প্রতিটি প্রোফাইল সতর্কতার সাথে যাচাই করা হয় বিশ্বস্ততার জন্য",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Heart,
    title: "পরিবারিক মানের মিল",
    description: "পারিবারিক মূল্যবোধ ও সংস্কৃতির সাথে সামঞ্জস্যপূর্ণ সঙ্গী",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Moon,
    title: "ইসলামী দৃষ্টিকোণ",
    description: "শরীয়াহ সম্মত উপায়ে জীবনসঙ্গী খোঁজার সুযোগ",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Lock,
    title: "নিরাপদ যোগাযোগ",
    description: "পরিবারের তত্ত্বাবধানে নিরাপদ যোগাযোগ ব্যবস্থা",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Gem,
    title: "প্রিমিয়াম সেবা",
    description: "উচ্চমানের সেবা এবং ব্যক্তিগত সহায়তা প্রদান",
    color: "from-teal-500 to-cyan-500",
  },
]

export function FeaturesSection() {
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
    <section ref={sectionRef} id="features" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-soft" />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 bg-pink-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-soft"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="inline-flex items-center gap-2 text-pink-500 font-semibold text-sm tracking-wide uppercase bg-pink-50 px-4 py-2 rounded-full">
            বৈশিষ্ট্য
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-6">
            কেন আমাদের <span className="gradient-text-animated">বেছে নেবেন</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            আমরা আপনার জীবনসঙ্গী খোঁজার যাত্রাকে সহজ, নিরাপদ ও সম্মানজনক করতে প্রতিশ্রুতিবদ্ধ
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-pink-200 transition-all duration-500 hover-lift overflow-hidden ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pink-200/50">
                  <feature.icon className="w-7 h-7 text-pink-500 group-hover:animate-pulse" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-pink-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
