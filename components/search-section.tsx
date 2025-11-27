"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"

export function SearchSection() {
  const router = useRouter()
  const [lookingFor, setLookingFor] = useState("all")
  const [maritalStatus, setMaritalStatus] = useState("all")
  const [location, setLocation] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (lookingFor !== "all") params.set("type", lookingFor)
    if (maritalStatus !== "all") params.set("status", maritalStatus)
    if (location) params.set("location", location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative py-6 md:py-8 -mt-16 md:-mt-20 z-20 px-4">
      <div className="container mx-auto">
        <div className="bg-card rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
            {/* Looking For */}
            <div className="space-y-2">
              <label className="text-sm md:text-lg font-semibold text-primary">আমি খুঁজছি</label>
              <div className="relative">
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full appearance-none bg-muted/50 border border-border rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-3.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer text-sm md:text-base"
                >
                  <option value="all">সকল</option>
                  <option value="bride">পাত্রী</option>
                  <option value="groom">পাত্র</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="text-sm md:text-lg font-semibold text-primary">বৈবাহিক অবস্থা</label>
              <div className="relative">
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full appearance-none bg-muted/50 border border-border rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-3.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer text-sm md:text-base"
                >
                  <option value="all">সকল</option>
                  <option value="unmarried">অবিবাহিত</option>
                  <option value="divorced">ডিভোর্সড</option>
                  <option value="widow">বিধবা/বিপত্নীক</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm md:text-lg font-semibold text-primary">বর্তমান ঠিকানা</label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none bg-muted/50 border border-border rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-3.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer text-sm md:text-base"
                >
                  <option value="">ঠিকানা নির্বাচন করুন</option>
                  <option value="dhaka">ঢাকা</option>
                  <option value="chittagong">চট্টগ্রাম</option>
                  <option value="sylhet">সিলেট</option>
                  <option value="rajshahi">রাজশাহী</option>
                  <option value="khulna">খুলনা</option>
                  <option value="barishal">বরিশাল</option>
                  <option value="rangpur">রংপুর</option>
                  <option value="mymensingh">ময়মনসিংহ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Search Button - Full width on mobile, auto on larger screens */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 md:py-3.5 px-6 rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] sm:col-span-2 lg:col-span-1 text-sm md:text-base"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
              <span>বায়োডাটা খুঁজুন</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
