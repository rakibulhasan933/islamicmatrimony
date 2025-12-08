"use client"

import { Button } from "@/components/ui/button"
import { Heart, Search, ChevronDown, Briefcase, GraduationCap, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const FREELANCER_PROFESSIONS = [
  "ওয়েব ডেভেলপার",
  "গ্রাফিক ডিজাইনার",
  "ডিজিটাল মার্কেটার",
  "কন্টেন্ট রাইটার",
  "ভিডিও এডিটর",
  "UI/UX ডিজাইনার",
  "মোবাইল অ্যাপ ডেভেলপার",
  "SEO এক্সপার্ট",
  "সোশ্যাল মিডিয়া ম্যানেজার",
  "ডাটা এন্ট্রি অপারেটর",
  "ভার্চুয়াল অ্যাসিস্ট্যান্ট",
  "ওয়ার্ডপ্রেস ডেভেলপার",
  "ই-কমার্স ম্যানেজার",
  "ভয়েস ওভার আর্টিস্ট",
  "ট্রান্সলেটর",
  "ফটোগ্রাফার",
  "মোশন গ্রাফিক্স ডিজাইনার",
  "থ্রিডি ডিজাইনার",
  "সফটওয়্যার ইঞ্জিনিয়ার",
  "ডাটা সায়েন্টিস্ট",
  "অন্যান্য ফ্রিল্যান্সার",
]

export { FREELANCER_PROFESSIONS }

export function HeroSection() {
  const router = useRouter()
  const [lookingFor, setLookingFor] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("")
  const [location, setLocation] = useState("")
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [profession, setProfession] = useState("")
  const [education, setEducation] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (lookingFor) params.set("type", lookingFor)
    if (maritalStatus) params.set("status", maritalStatus)
    if (location) params.set("location", location)
    if (ageMin) params.set("ageMin", ageMin)
    if (ageMax) params.set("ageMax", ageMax)
    if (profession) params.set("profession", profession)
    if (education) params.set("education", education)
    router.push(`/search?${params.toString()}`)
  }

  const educationLevels = ["এসএসসি", "এইচএসসি", "ডিপ্লোমা", "অনার্স", "মাস্টার্স", "পিএইচডি"]

  return (
    <section className="hero-bg py-16 md:py-24 px-4 text-center relative overflow-hidden">
      {/* Decorative Elements */}
      {mounted && (
        <>
          <div className="absolute top-10 left-10 text-pink-200 opacity-50 animate-bounce-slow hidden md:block">
            <Heart className="w-16 h-16 fill-current" />
          </div>
          <div className="absolute bottom-10 right-10 text-pink-200 opacity-50 animate-pulse hidden md:block">
            <Heart className="w-24 h-24 fill-current" />
          </div>
        </>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white px-4 py-1 rounded-full shadow-sm text-pink-600 text-sm font-bold mb-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <Heart className="w-3 h-3 fill-current" />
          <span>শুধুমাত্র ফ্রিল্যান্সারদের জন্য</span>
        </div>

        {/* Title */}
        <h2
          className={`text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          ফ্রিল্যান্সারদের <span className="text-pink-600">জীবনসঙ্গী</span> খুঁজুন
        </h2>

        {/* Subtitle */}
        <p
          className={`text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          ফ্রিল্যান্সারদের জীবনের ব্যস্ততা আমরা বুঝি। তাই আপনার অনন্তকালের জীবনসঙ্গীর জন্য আমাদের এই ক্ষুদ্র প্রচেষ্টা।
        </p>

        {/* Search Box */}
        <div
          className={`bg-white p-4 md:p-6 rounded-2xl shadow-xl shadow-pink-100 border border-pink-50 max-w-5xl mx-auto relative z-20 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
        >
          {/* Basic Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Biodata Type */}
            <div className="relative text-left w-full">
              <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                বায়োডাটার ধরণ
              </label>
              <div className="relative">
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="groom">পাত্রের বায়োডাটা</option>
                  <option value="bride">পাত্রীর বায়োডাটা</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Marital Status */}
            <div className="relative text-left w-full">
              <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                বৈবাহিক অবস্থা
              </label>
              <div className="relative">
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="unmarried">অবিবাহিত</option>
                  <option value="divorced">ডিভোর্সড</option>
                  <option value="widow">বিধবা</option>
                  <option value="widower">বিপত্নীক</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Division */}
            <div className="relative text-left w-full">
              <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                বিভাগ
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="ঢাকা">ঢাকা</option>
                  <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                  <option value="রাজশাহী">রাজশাহী</option>
                  <option value="খুলনা">খুলনা</option>
                  <option value="বরিশাল">বরিশাল</option>
                  <option value="সিলেট">সিলেট</option>
                  <option value="রংপুর">রংপুর</option>
                  <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-pink-600 hover:bg-pink-700 text-white h-[50px] rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg active:scale-95 w-full"
            >
              <Search className="w-5 h-5" />
              খুঁজুন
            </button>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-4 text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1 mx-auto transition"
          >
            {showAdvanced ? "সাধারণ সার্চ" : "বিস্তারিত সার্চ"}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
              {/* Age Range */}
              <div className="relative text-left w-full">
                <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  বয়স (সর্বনিম্ন)
                </label>
                <div className="relative">
                  <select
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                      <option key={age} value={age}>
                        {age} বছর
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Age Max */}
              <div className="relative text-left w-full">
                <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  বয়স (সর্বোচ্চ)
                </label>
                <div className="relative">
                  <select
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                      <option key={age} value={age}>
                        {age} বছর
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Profession - Updated to freelancer categories */}
              <div className="relative text-left w-full">
                <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  ফ্রিল্যান্সিং পেশা
                </label>
                <div className="relative">
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {FREELANCER_PROFESSIONS.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Education */}
              <div className="relative text-left w-full">
                <label className="block text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  শিক্ষাগত যোগ্যতা
                </label>
                <div className="relative">
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 hover:border-pink-300 cursor-pointer rounded-xl py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {educationLevels.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div
          className={`mt-8 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <Link href="/register">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold transition shadow-lg shadow-pink-200">
              প্রোফাইল তৈরি করুন
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
