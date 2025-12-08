"use client"

import type React from "react"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  BadgeCheck,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { FREELANCER_PROFESSIONS } from "@/components/hero-section"

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
  createdAt: string
  photo: string | null
  isPremium?: boolean
}

interface BiodataResponse {
  biodatas: BiodataItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-foreground hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="pb-4 space-y-2">{children}</div>}
    </div>
  )
}

function CheckboxFilter({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <Checkbox
        checked={checked}
        onCheckedChange={() => onChange()}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </label>
  )
}

function BiodataCardSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex bg-card border border-border rounded-xl overflow-hidden">
        <Skeleton className="w-32 h-32 shrink-0" />
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-5 h-5 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-28 h-4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-5 h-5 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-28 h-4" />
        </div>
      </div>
    </div>
  )
}

function FilterSidebarSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-border pb-4">
          <Skeleton className="w-32 h-5 mb-3" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Filter states
  const [openFilters, setOpenFilters] = useState({
    type: true,
    maritalStatus: true,
    age: true,
    location: true,
    education: false,
    profession: true,
  })

  const [filters, setFilters] = useState({
    type: "all",
    maritalStatus: [] as string[],
    ageMin: 18,
    ageMax: 60,
    locations: [] as string[],
    education: [] as string[],
    profession: [] as string[],
  })

  useEffect(() => {
    setMounted(true)
    const typeParam = searchParams.get("type")
    if (typeParam) {
      setFilters((prev) => ({ ...prev, type: typeParam }))
    }
  }, [searchParams])

  const buildApiUrl = () => {
    const params = new URLSearchParams()
    if (filters.type !== "all") params.set("type", filters.type)
    if (filters.maritalStatus.length === 1) params.set("status", filters.maritalStatus[0])
    if (filters.locations.length === 1) params.set("location", filters.locations[0])
    if (filters.ageMin > 18) params.set("ageMin", filters.ageMin.toString())
    if (filters.ageMax < 60) params.set("ageMax", filters.ageMax.toString())
    if (filters.education.length === 1) params.set("education", filters.education[0])
    if (filters.profession.length === 1) params.set("profession", filters.profession[0])
    params.set("page", currentPage.toString())
    params.set("limit", "12")
    return `/api/biodatas?${params.toString()}`
  }

  const { data, error, isLoading } = useSWR<BiodataResponse>(mounted ? buildApiUrl() : null, fetcher, {
    revalidateOnFocus: false,
  })

  const toggleFilter = (key: keyof typeof openFilters) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleArrayFilter = (key: "maritalStatus" | "locations" | "education" | "profession", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      type: "all",
      maritalStatus: [],
      ageMin: 18,
      ageMax: 60,
      locations: [],
      education: [],
      profession: [],
    })
    setCurrentPage(1)
  }

  const activeFilterCount =
    (filters.type !== "all" ? 1 : 0) +
    filters.maritalStatus.length +
    filters.locations.length +
    filters.education.length +
    filters.profession.length

  const biodatas = data?.biodatas || []
  const pagination = data?.pagination

  const getMaritalStatusDisplay = (status: string | null) => {
    const statusMap: Record<string, string> = {
      unmarried: "অবিবাহিত",
      divorced: "ডিভোর্সড",
      widow: "বিধবা",
      widower: "বিপত্নীক",
    }
    return status ? statusMap[status] || status : "N/A"
  }

  const FiltersPanel = () => (
    <div className="space-y-1">
      {/* Type Filter */}
      <FilterSection title="বায়োডাটার ধরন" isOpen={openFilters.type} onToggle={() => toggleFilter("type")}>
        <div className="space-y-2">
          <CheckboxFilter
            label="সকল বায়োডাটা"
            checked={filters.type === "all"}
            onChange={() => {
              setFilters((prev) => ({ ...prev, type: "all" }))
              setCurrentPage(1)
            }}
          />
          <CheckboxFilter
            label="পাত্রী (বোন)"
            checked={filters.type === "bride"}
            onChange={() => {
              setFilters((prev) => ({ ...prev, type: "bride" }))
              setCurrentPage(1)
            }}
          />
          <CheckboxFilter
            label="পাত্র (ভাই)"
            checked={filters.type === "groom"}
            onChange={() => {
              setFilters((prev) => ({ ...prev, type: "groom" }))
              setCurrentPage(1)
            }}
          />
        </div>
      </FilterSection>

      {/* Marital Status Filter */}
      <FilterSection
        title="বৈবাহিক অবস্থা"
        isOpen={openFilters.maritalStatus}
        onToggle={() => toggleFilter("maritalStatus")}
      >
        <div className="space-y-2">
          <CheckboxFilter
            label="অবিবাহিত"
            checked={filters.maritalStatus.includes("unmarried")}
            onChange={() => toggleArrayFilter("maritalStatus", "unmarried")}
          />
          <CheckboxFilter
            label="ডিভোর্সড"
            checked={filters.maritalStatus.includes("divorced")}
            onChange={() => toggleArrayFilter("maritalStatus", "divorced")}
          />
          <CheckboxFilter
            label="বিধবা"
            checked={filters.maritalStatus.includes("widow")}
            onChange={() => toggleArrayFilter("maritalStatus", "widow")}
          />
          <CheckboxFilter
            label="বিপত্নীক"
            checked={filters.maritalStatus.includes("widower")}
            onChange={() => toggleArrayFilter("maritalStatus", "widower")}
          />
        </div>
      </FilterSection>

      {/* Age Filter */}
      <FilterSection title="বয়স" isOpen={openFilters.age} onToggle={() => toggleFilter("age")}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">সর্বনিম্ন</label>
              <input
                type="number"
                value={filters.ageMin}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, ageMin: Number.parseInt(e.target.value) || 18 }))
                  setCurrentPage(1)
                }}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                min={18}
                max={60}
              />
            </div>
            <span className="text-muted-foreground mt-5">-</span>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">সর্বোচ্চ</label>
              <input
                type="number"
                value={filters.ageMax}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, ageMax: Number.parseInt(e.target.value) || 60 }))
                  setCurrentPage(1)
                }}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                min={18}
                max={60}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Location Filter */}
      <FilterSection title="জেলা" isOpen={openFilters.location} onToggle={() => toggleFilter("location")}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[
            "ঢাকা",
            "চট্টগ্রাম",
            "রাজশাহী",
            "খুলনা",
            "সিলেট",
            "বরিশাল",
            "রংপুর",
            "ময়মনসিংহ",
            "কুমিল্লা",
            "গাজীপুর",
            "নারায়ণগঞ্জ",
            "ফরিদপুর",
          ].map((loc) => (
            <CheckboxFilter
              key={loc}
              label={loc}
              checked={filters.locations.includes(loc)}
              onChange={() => toggleArrayFilter("locations", loc)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Education Filter */}
      <FilterSection title="শিক্ষাগত যোগ্যতা" isOpen={openFilters.education} onToggle={() => toggleFilter("education")}>
        <div className="space-y-2">
          {["এসএসসি", "এইচএসসি", "ডিপ্লোমা", "অনার্স", "মাস্টার্স", "পিএইচডি"].map((edu) => (
            <CheckboxFilter
              key={edu}
              label={edu}
              checked={filters.education.includes(edu)}
              onChange={() => toggleArrayFilter("education", edu)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Profession Filter */}
      <FilterSection title="ফ্রিল্যান্সিং পেশা" isOpen={openFilters.profession} onToggle={() => toggleFilter("profession")}>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {FREELANCER_PROFESSIONS.map((prof) => (
            <CheckboxFilter
              key={prof}
              label={prof}
              checked={filters.profession.includes(prof)}
              onChange={() => toggleArrayFilter("profession", prof)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      <main className="min-h-screen bg-linear-to-b from-background to-muted/20 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">ফ্রিল্যান্সার বায়োডাটা খুঁজুন</h1>
            <p className="text-muted-foreground">আপনার পছন্দের ফ্রিল্যান্সার জীবনসঙ্গী খুঁজে নিন</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-80 shrink-0">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    ফিল্টার
                  </h2>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters} className="text-sm text-primary hover:underline">
                      সব মুছুন
                    </button>
                  )}
                </div>
                <FiltersPanel />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button and View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  ফিল্টার
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {!mounted || isLoading ? (
                      <Skeleton className="w-32 h-4 inline-block" />
                    ) : (
                      `${pagination?.total || 0} টি বায়োডাটা পাওয়া গেছে`
                    )}
                  </span>
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {(!mounted || isLoading) && (
                <div
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"
                  }
                >
                  {[...Array(6)].map((_, i) => (
                    <BiodataCardSkeleton key={i} viewMode={viewMode} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {mounted && error && (
                <div className="text-center py-20">
                  <p className="text-destructive mb-4">বায়োডাটা লোড করতে সমস্যা হয়েছে</p>
                  <button onClick={() => window.location.reload()} className="text-primary hover:underline">
                    আবার চেষ্টা করুন
                  </button>
                </div>
              )}

              {/* Empty State */}
              {mounted && !isLoading && !error && biodatas.length === 0 && (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">কোনো বায়োডাটা পাওয়া যায়নি</h3>
                  <p className="text-muted-foreground mb-4">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                  <button onClick={clearAllFilters} className="text-primary hover:underline">
                    সব ফিল্টার মুছুন
                  </button>
                </div>
              )}

              {/* Results Grid/List */}
              {mounted && !isLoading && !error && biodatas.length > 0 && (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }
                  >
                    {biodatas.map((biodata, index) => (
                      <Link
                        key={biodata.id}
                        href={`/biodata/${biodata.biodataNo}`}
                        className={`group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${viewMode === "list" ? "flex" : ""}`}
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                      >
                        {/* Photo */}
                        <div className={`relative bg-muted ${viewMode === "list" ? "w-32 shrink-0" : "aspect-4/3"}`}>
                          {biodata.photo ? (
                            <Image
                              src={"/placeholder.svg"}
                              alt={`বায়োডাটা ${biodata.biodataNo}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">
                                  {biodata.type === "bride" ? "👩" : "👨"}
                                </span>
                              </div>
                            </div>
                          )}
                          {/* Premium Badge */}
                          {biodata.isPremium && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3" />
                              ভেরিফাইড
                            </div>
                          )}
                          {/* Type Badge */}
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            {biodata.type === "bride" ? "পাত্রী" : "পাত্র"}
                          </div>
                        </div>

                        {/* Info */}
                        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-foreground">বায়োডাটা #{biodata.biodataNo}</h3>
                            <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>

                          <div className="space-y-1.5 text-sm text-muted-foreground">
                            {biodata.age && (
                              <p className="flex items-center gap-2">
                                <span className="text-primary">বয়স:</span> {biodata.age} বছর
                              </p>
                            )}
                            {biodata.height && (
                              <p className="flex items-center gap-2">
                                <span className="text-primary">উচ্চতা:</span> {biodata.height}
                              </p>
                            )}
                            {biodata.occupation && (
                              <p className="flex items-center gap-2">
                                <Briefcase className="w-3.5 h-3.5 text-primary" />
                                {biodata.occupation}
                              </p>
                            )}
                            {biodata.education && (
                              <p className="flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                                {biodata.education}
                              </p>
                            )}
                            {biodata.currentDistrict && (
                              <p className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {biodata.currentDistrict}
                              </p>
                            )}
                          </div>

                          {biodata.maritalStatus && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {getMaritalStatusDisplay(biodata.maritalStatus)}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        পূর্ববর্তী
                      </button>

                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                          const pageNum = i + 1
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg transition-colors ${currentPage === pageNum
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted border border-border"
                                }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={currentPage === pagination.totalPages}
                        className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        পরবর্তী
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
            <div
              className="absolute right-0 top-0 h-full w-80 max-w-full bg-card overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                <h2 className="font-bold text-lg">ফিল্টার</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FiltersPanel />
              </div>
              <div className="sticky bottom-0 bg-card border-t border-border p-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors"
                >
                  ফলাফল দেখুন
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-linear-to-b from-background to-muted/20 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Skeleton className="w-64 h-10 mb-2" />
              <Skeleton className="w-48 h-5" />
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block w-80 shrink-0">
                <div className="bg-card border border-border rounded-xl p-6">
                  <FilterSidebarSkeleton />
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BiodataCardSkeleton key={i} viewMode="grid" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
