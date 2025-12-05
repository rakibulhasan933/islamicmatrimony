"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Code2, Palette, Megaphone, PenTool, Video, Layout, SearchCheck, Cpu } from "lucide-react"

const categories = [
  {
    icon: Code2,
    title: "ওয়েব ডেভেলপার",
    count: "১২০+",
    href: "/search?profession=ওয়েব%20ডেভেলপার",
  },
  {
    icon: Palette,
    title: "গ্রাফিক ডিজাইনার",
    count: "৮৫+",
    href: "/search?profession=গ্রাফিক%20ডিজাইনার",
  },
  {
    icon: Megaphone,
    title: "ডিজিটাল মার্কেটার",
    count: "৯৫+",
    href: "/search?profession=ডিজিটাল%20মার্কেটার",
  },
  {
    icon: PenTool,
    title: "কন্টেন্ট রাইটার",
    count: "৬০+",
    href: "/search?profession=কন্টেন্ট%20রাইটার",
  },
  {
    icon: Video,
    title: "ভিডিও এডিটর",
    count: "৪০+",
    href: "/search?profession=ভিডিও%20এডিটর",
  },
  {
    icon: Layout,
    title: "UI/UX ডিজাইনার",
    count: "৫৫+",
    href: "/search?profession=UI/UX%20ডিজাইনার",
  },
  {
    icon: SearchCheck,
    title: "SEO এক্সপার্ট",
    count: "৭০+",
    href: "/search?profession=SEO%20এক্সপার্ট",
  },
  {
    icon: Cpu,
    title: "সফটওয়্যার ইঞ্জিনিয়ার",
    count: "১০০+",
    href: "/search?profession=সফটওয়্যার%20ইঞ্জিনিয়ার",
  },
]

export function CategoriesSection() {
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
    <section ref={sectionRef} id="categories" className="py-16 bg-white container mx-auto px-4">
      {/* Section Header */}
      <div
        className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          ফ্রিল্যান্সিং পেশা অনুযায়ী <span className="text-pink-600">পাত্র-পাত্রী</span> খুঁজুন
        </h3>
        <p className="text-gray-500">আপনার পছন্দের ফ্রিল্যান্সিং পেশার জীবনসঙ্গী খুঁজে পেতে ক্যাটাগরি নির্বাচন করুন</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className={`group bg-pink-50 hover:bg-pink-600 rounded-xl p-6 text-center transition-all duration-300 border border-pink-100 hover:shadow-lg hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: `${index * 75}ms` }}
          >
            <div className="bg-white group-hover:bg-white/20 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 shadow-sm transition">
              <category.icon className="w-7 h-7 text-pink-600 group-hover:text-white transition" />
            </div>
            <h4 className="font-bold text-gray-800  mb-1">{category.title}</h4>
            <p className="text-xs text-gray-500 ">{category.count} প্রোফাইল</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
