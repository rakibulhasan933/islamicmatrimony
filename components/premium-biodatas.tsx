"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { BadgeCheck, MapPin, User, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface BiodataItem {
  id: number
  biodataNo: string
  type: "bride" | "groom"
  age: number | null
  height: string | null
  education: string | null
  occupation: string | null
  currentDistrict: string | null
  maritalStatus: string | null
  photo: string | null
  isPremium?: boolean
}

export function PremiumBiodatas() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const { data, isLoading } = useSWR<{ biodatas: BiodataItem[] }>("/api/biodatas?limit=8&page=1", fetcher, {
    revalidateOnFocus: false,
  })

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

  const getMaritalStatusDisplay = (status: string | null) => {
    const statusMap: Record<string, string> = {
      unmarried: "অবিবাহিত",
      divorced: "ডিভোর্সড",
      widow: "বিধবা",
      widower: "বিপত্নীক",
    }
    return status ? statusMap[status] || status : "N/A"
  }

  const biodatas = data?.biodatas || []

  return (
    <section ref={sectionRef} id="profiles-section" className="py-16 px-4 container mx-auto">
      {/* Section Header */}
      <div
        className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          কিছু <span className="text-pink-600">প্রিমিয়াম</span> বায়োডাটা !
        </h3>
        <p className="text-gray-500">আমাদের ভেরিফাইড এবং টপ-রেটেড প্রোফাইলগুলো দেখুন</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && biodatas.length === 0 && (
        <div className="text-center py-12 text-gray-500">এখনো কোনো বায়োডাটা নেই</div>
      )}

      {/* Biodatas Grid */}
      {!isLoading && biodatas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {biodatas.map((biodata, index) => (
            <div
              key={biodata.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header with Photo */}
              <div className="bg-pink-50 h-40 flex items-center justify-center relative overflow-hidden">
                {/* Premium Badge */}
                {biodata.isPremium && (
                  <div className="absolute top-3 left-3 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    ভেরিফাইড
                  </div>
                )}

                {/* Biodata Number */}
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-pink-600">
                  {biodata.biodataNo}
                </div>

                {/* Type Badge */}
                <div
                  className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-bold ${
                    biodata.type === "bride" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {biodata.type === "bride" ? "পাত্রী" : "পাত্র"}
                </div>

                {/* Photo or Placeholder */}
                {biodata.photo ? (
                  <Image
                    src={biodata.photo || "/placeholder.svg"}
                    alt={`বায়োডাটা ${biodata.biodataNo}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-all duration-300">
                    <User className="w-12 h-12 text-pink-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-800 mb-1 flex items-center gap-2">
                  {biodata.occupation || "পেশা উল্লেখ নেই"}
                  {biodata.isPremium && <BadgeCheck className="w-4 h-4 text-yellow-500" />}
                </h4>

                <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span>বয়স</span>
                    <span className="font-semibold">{biodata.age || "N/A"} বছর</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span>বৈবাহিক অবস্থা</span>
                    <span className="font-semibold">{getMaritalStatusDisplay(biodata.maritalStatus)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      বাসস্থান
                    </span>
                    <span className="font-semibold">{biodata.currentDistrict || "N/A"}</span>
                  </div>
                </div>

                <Link
                  href={`/biodata/${biodata.biodataNo}`}
                  className="block w-full mt-4 bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-600 font-bold py-3 rounded-xl transition-all duration-300 border border-pink-100 text-center"
                >
                  বায়োডাটা দেখুন
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Link
          href="/search"
          className="inline-block px-8 py-3 bg-white border-2 border-pink-600 text-pink-600 font-bold rounded-full hover:bg-pink-50 transition"
        >
          আরো দেখুন
        </Link>
      </div>
    </section>
  )
}
