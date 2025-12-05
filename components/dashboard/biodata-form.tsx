"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  User,
  FileText,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Save,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import type { User as UserType, Biodata } from "@/lib/db/schema"
import { FREELANCER_PROFESSIONS } from "@/components/hero-section"

interface BiodataFormProps {
  user: UserType
  existingBiodata: Biodata | null
}

type FormStep = "personal" | "family" | "education" | "freelancing" | "religious" | "partner" | "contact"

const steps: { id: FormStep; title: string; icon: React.ReactNode }[] = [
  { id: "personal", title: "ব্যক্তিগত তথ্য", icon: <User className="w-4 h-4" /> },
  { id: "family", title: "পারিবারিক তথ্য", icon: <Heart className="w-4 h-4" /> },
  { id: "education", title: "শিক্ষা", icon: <FileText className="w-4 h-4" /> },
  { id: "freelancing", title: "ফ্রিল্যান্সিং", icon: <Settings className="w-4 h-4" /> },
  { id: "religious", title: "ধর্মীয় তথ্য", icon: <Bell className="w-4 h-4" /> },
  { id: "partner", title: "প্রত্যাশিত জীবনসঙ্গী", icon: <Heart className="w-4 h-4" /> },
  { id: "contact", title: "যোগাযোগ", icon: <Settings className="w-4 h-4" /> },
]

export function BiodataForm({ user, existingBiodata }: BiodataFormProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<FormStep>("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    type: existingBiodata?.type || "groom",
    photo: existingBiodata?.photo || "",
    fullName: existingBiodata?.fullName || "",
    gender: existingBiodata?.gender || "male",
    dateOfBirth: existingBiodata?.dateOfBirth ? new Date(existingBiodata.dateOfBirth).toISOString().split("T")[0] : "",
    age: existingBiodata?.age?.toString() || "",
    height: existingBiodata?.height || "",
    weight: existingBiodata?.weight || "",
    bloodGroup: existingBiodata?.bloodGroup || "",
    complexion: existingBiodata?.complexion || "",
    maritalStatus: existingBiodata?.maritalStatus || "unmarried",
    permanentDistrict: existingBiodata?.permanentDistrict || "",
    permanentAddress: existingBiodata?.permanentAddress || "",
    currentDistrict: existingBiodata?.currentDistrict || "",
    currentAddress: existingBiodata?.currentAddress || "",
    education: existingBiodata?.education || "",
    educationDetails: existingBiodata?.educationDetails || "",
    occupation: existingBiodata?.occupation || "",
    occupationDetails: existingBiodata?.occupationDetails || "",
    monthlyIncome: existingBiodata?.monthlyIncome || "",
    freelancingPlatform: (existingBiodata as any)?.freelancingPlatform || "",
    freelancingExperience: (existingBiodata as any)?.freelancingExperience || "",
    portfolioLink: (existingBiodata as any)?.portfolioLink || "",
    fatherName: existingBiodata?.fatherName || "",
    fatherOccupation: existingBiodata?.fatherOccupation || "",
    motherName: existingBiodata?.motherName || "",
    motherOccupation: existingBiodata?.motherOccupation || "",
    siblings: existingBiodata?.siblings || "",
    religiousPractice: existingBiodata?.religiousPractice || "",
    prayerHabit: existingBiodata?.prayerHabit || "",
    wearsHijab: existingBiodata?.wearsHijab || false,
    hasBeard: existingBiodata?.hasBeard || false,
    expectedAge: existingBiodata?.expectedAge || "",
    expectedHeight: existingBiodata?.expectedHeight || "",
    expectedEducation: existingBiodata?.expectedEducation || "",
    expectedDistrict: existingBiodata?.expectedDistrict || "",
    expectedMaritalStatus: existingBiodata?.expectedMaritalStatus || "",
    partnerQualities: existingBiodata?.partnerQualities || "",
    guardianPhone: existingBiodata?.guardianPhone || "",
    guardianRelation: existingBiodata?.guardianRelation || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep !== "contact") {
      return
    }
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/biodatas/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "বায়োডাটা সংরক্ষণ করতে সমস্যা হয়েছে")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const goToNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const goToPrevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const menuItems = [
    { icon: Home, label: "ড্যাশবোর্ড", href: "/dashboard", active: false },
    { icon: FileText, label: "আমার বায়োডাটা", href: "/dashboard/biodata", active: true },
    { icon: Search, label: "বায়োডাটা খুঁজুন", href: "/search", active: false },
    { icon: Heart, label: "শর্টলিস্ট", href: "/dashboard/shortlist", active: false },
    { icon: Bell, label: "নোটিফিকেশন", href: "/dashboard/notifications", active: false },
    { icon: Settings, label: "সেটিংস", href: "/dashboard/settings", active: false },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="text-xl font-bold text-primary">
          FreelancerMarriage
        </Link>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/" className="text-xl font-bold text-primary">
            FreelancerMarriage
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                <Image
                  src={user.profileImage || "/placeholder.svg"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {existingBiodata ? "বায়োডাটা সম্পাদনা" : "নতুন বায়োডাটা তৈরি"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">সঠিক তথ্য দিয়ে আপনার বায়োডাটা সম্পূর্ণ করুন</p>
          </div>

          {/* Step Progress */}
          <div className="mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex items-center gap-2 md:gap-0 min-w-max md:min-w-0">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : index < currentStepIndex
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="hidden sm:inline">{step.icon}</span>
                    <span className="whitespace-nowrap">{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden md:block w-6 lg:w-8 h-0.5 mx-1 ${
                        index < currentStepIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-card border border-border rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm">
              {/* Personal Info Step */}
              {currentStep === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    ব্যক্তিগত তথ্য
                  </h2>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 shrink-0">
                      <ImageUpload
                        value={formData.photo}
                        onChange={(url) => setFormData((prev) => ({ ...prev, photo: url }))}
                        label="প্রোফাইল ছবি"
                        description="JPG, PNG (সর্বোচ্চ ২MB)"
                        aspectRatio="portrait"
                        maxSizeMB={2}
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Biodata Type */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">বায়োডাটার ধরন *</Label>
                        <div className="flex flex-wrap gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="type"
                              value="groom"
                              checked={formData.type === "groom"}
                              onChange={handleChange}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm">পাত্রের বায়োডাটা</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="type"
                              value="bride"
                              checked={formData.type === "bride"}
                              onChange={handleChange}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm">পাত্রীর বায়োডাটা</span>
                          </label>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium">
                          পূর্ণ নাম *
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="আপনার পূর্ণ নাম লিখুন"
                          required
                          className="h-11"
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">লিঙ্গ *</Label>
                        <div className="flex flex-wrap gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formData.gender === "male"}
                              onChange={handleChange}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm">পুরুষ</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formData.gender === "female"}
                              onChange={handleChange}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm">মহিলা</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rest of personal info fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                        জন্ম তারিখ
                      </Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium">
                        বয়স
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="২৫"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm font-medium">
                        উচ্চতা
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder={"যেমন: 5'6\""}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm font-medium">
                        ওজন
                      </Label>
                      <Input
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="যেমন: ৬৫ কেজি"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup" className="text-sm font-medium">
                        রক্তের গ্রুপ
                      </Label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleSelectChange}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complexion" className="text-sm font-medium">
                        গাত্রবর্ণ
                      </Label>
                      <select
                        id="complexion"
                        name="complexion"
                        value={formData.complexion}
                        onChange={handleSelectChange}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="উজ্জ্বল ফর্সা">উজ্জ্বল ফর্সা</option>
                        <option value="ফর্সা">ফর্সা</option>
                        <option value="শ্যামলা">শ্যামলা</option>
                        <option value="কালো">কালো</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus" className="text-sm font-medium">
                        বৈবাহিক অবস্থা
                      </Label>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleSelectChange}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="unmarried">অবিবাহিত</option>
                        <option value="divorced">তালাকপ্রাপ্ত</option>
                        <option value="widowed">বিধবা/বিপত্নীক</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentDistrict" className="text-sm font-medium">
                        স্থায়ী জেলা
                      </Label>
                      <Input
                        id="permanentDistrict"
                        name="permanentDistrict"
                        value={formData.permanentDistrict}
                        onChange={handleChange}
                        placeholder="আপনার স্থায়ী জেলা"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentDistrict" className="text-sm font-medium">
                        বর্তমান জেলা
                      </Label>
                      <Input
                        id="currentDistrict"
                        name="currentDistrict"
                        value={formData.currentDistrict}
                        onChange={handleChange}
                        placeholder="আপনার বর্তমান জেলা"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress" className="text-sm font-medium">
                      স্থায়ী ঠিকানা
                    </Label>
                    <Textarea
                      id="permanentAddress"
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      placeholder="আপনার স্থায়ী ঠিকানা লিখুন"
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAddress" className="text-sm font-medium">
                      বর্তমান ঠিকানা
                    </Label>
                    <Textarea
                      id="currentAddress"
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleChange}
                      placeholder="আপনার বর্তমান ঠিকানা লিখুন"
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Family Info Step */}
              {currentStep === "family" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    পারিবারিক তথ্য
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fatherName" className="text-sm font-medium">
                        পিতার নাম
                      </Label>
                      <Input
                        id="fatherName"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        placeholder="পিতার পূর্ণ নাম"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherOccupation" className="text-sm font-medium">
                        পিতার পেশা
                      </Label>
                      <Input
                        id="fatherOccupation"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        placeholder="পিতার পেশা"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="motherName" className="text-sm font-medium">
                        মাতার নাম
                      </Label>
                      <Input
                        id="motherName"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        placeholder="মাতার পূর্ণ নাম"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherOccupation" className="text-sm font-medium">
                        মাতার পেশা
                      </Label>
                      <Input
                        id="motherOccupation"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        placeholder="মাতার পেশা"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siblings" className="text-sm font-medium">
                      ভাই-বোনের তথ্য
                    </Label>
                    <Textarea
                      id="siblings"
                      name="siblings"
                      value={formData.siblings}
                      onChange={handleChange}
                      placeholder="ভাই-বোনের সংখ্যা ও তাদের সম্পর্কে সংক্ষেপে লিখুন"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Education Step */}
              {currentStep === "education" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    শিক্ষাগত যোগ্যতা
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="education" className="text-sm font-medium">
                      সর্বোচ্চ শিক্ষাগত যোগ্যতা
                    </Label>
                    <select
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="এসএসসি">এসএসসি</option>
                      <option value="এইচএসসি">এইচএসসি</option>
                      <option value="ডিপ্লোমা">ডিপ্লোমা</option>
                      <option value="অনার্স">অনার্স</option>
                      <option value="মাস্টার্স">মাস্টার্স</option>
                      <option value="পিএইচডি">পিএইচডি</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educationDetails" className="text-sm font-medium">
                      শিক্ষার বিস্তারিত
                    </Label>
                    <Textarea
                      id="educationDetails"
                      name="educationDetails"
                      value={formData.educationDetails}
                      onChange={handleChange}
                      placeholder="আপনার শিক্ষা প্রতিষ্ঠান, বিষয়, পাসের সাল ইত্যাদি"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {currentStep === "freelancing" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    ফ্রিল্যান্সিং তথ্য
                  </h2>

                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-pink-700">
                      এই প্ল্যাটফর্মটি শুধুমাত্র ফ্রিল্যান্সারদের জন্য। অনুগ্রহ করে আপনার ফ্রিল্যান্সিং সম্পর্কিত সঠিক তথ্য দিন।
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="text-sm font-medium">
                      ফ্রিল্যান্সিং পেশা *
                    </Label>
                    <select
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">নির্বাচন করুন</option>
                      {FREELANCER_PROFESSIONS.map((prof) => (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="freelancingPlatform" className="text-sm font-medium">
                      কোন প্ল্যাটফর্মে কাজ করেন
                    </Label>
                    <select
                      id="freelancingPlatform"
                      name="freelancingPlatform"
                      value={formData.freelancingPlatform}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="Upwork">Upwork</option>
                      <option value="Fiverr">Fiverr</option>
                      <option value="Freelancer.com">Freelancer.com</option>
                      <option value="Toptal">Toptal</option>
                      <option value="99designs">99designs</option>
                      <option value="PeoplePerHour">PeoplePerHour</option>
                      <option value="Guru">Guru</option>
                      <option value="লোকাল ক্লায়েন্ট">লোকাল ক্লায়েন্ট</option>
                      <option value="একাধিক প্ল্যাটফর্ম">একাধিক প্ল্যাটফর্ম</option>
                      <option value="অন্যান্য">অন্যান্য</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="freelancingExperience" className="text-sm font-medium">
                      ফ্রিল্যান্সিং অভিজ্ঞতা
                    </Label>
                    <select
                      id="freelancingExperience"
                      name="freelancingExperience"
                      value={formData.freelancingExperience}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="১ বছরের কম">১ বছরের কম</option>
                      <option value="১-২ বছর">১-২ বছর</option>
                      <option value="২-৩ বছর">২-৩ বছর</option>
                      <option value="৩-৫ বছর">৩-৫ বছর</option>
                      <option value="৫+ বছর">৫+ বছর</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome" className="text-sm font-medium">
                      মাসিক আয় (গড়ে)
                    </Label>
                    <select
                      id="monthlyIncome"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="২০,০০০ এর কম">২০,০০০ এর কম</option>
                      <option value="২০,০০০ - ৫০,০০০">২০,০০০ - ৫০,০০০</option>
                      <option value="৫০,০০০ - ১,০০,০০০">৫০,০০০ - ১,০০,০০০</option>
                      <option value="১,০০,০০০ - ২,০০,০০০">১,০০,০০০ - ২,০০,০০০</option>
                      <option value="২,০০,০০০+">২,০০,০০০+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioLink" className="text-sm font-medium">
                      পোর্টফোলিও লিংক (ঐচ্ছিক)
                    </Label>
                    <Input
                      id="portfolioLink"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupationDetails" className="text-sm font-medium">
                      কাজের বিস্তারিত
                    </Label>
                    <Textarea
                      id="occupationDetails"
                      name="occupationDetails"
                      value={formData.occupationDetails}
                      onChange={handleChange}
                      placeholder="আপনার ফ্রিল্যান্সিং কাজ সম্পর্কে বিস্তারিত লিখুন - কি ধরনের প্রজেক্ট করেন, কোন টেকনোলজি/টুল ব্যবহার করেন ইত্যাদি"
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Religious Info Step */}
              {currentStep === "religious" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    ধর্মীয় তথ্য
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="religiousPractice" className="text-sm font-medium">
                      ধর্মীয় অনুশীলন
                    </Label>
                    <select
                      id="religiousPractice"
                      name="religiousPractice"
                      value={formData.religiousPractice}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="সম্পূর্ণ মেনে চলি">সম্পূর্ণ মেনে চলি</option>
                      <option value="মোটামুটি মেনে চলি">মোটামুটি মেনে চলি</option>
                      <option value="চেষ্টা করছি">চেষ্টা করছি</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prayerHabit" className="text-sm font-medium">
                      নামাজের অভ্যাস
                    </Label>
                    <select
                      id="prayerHabit"
                      name="prayerHabit"
                      value={formData.prayerHabit}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="পাঁচ ওয়াক্ত নিয়মিত">পাঁচ ওয়াক্ত নিয়মিত</option>
                      <option value="মাঝে মাঝে কাযা হয়">মাঝে মাঝে কাযা হয়</option>
                      <option value="অনিয়মিত">অনিয়মিত</option>
                      <option value="পড়ি না">পড়ি না</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {formData.gender === "female" && (
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={formData.wearsHijab}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, wearsHijab: Boolean(checked) }))
                          }
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          পর্দা/হিজাব করেন
                        </span>
                      </label>
                    )}
                    {formData.gender === "male" && (
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={formData.hasBeard}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, hasBeard: Boolean(checked) }))
                          }
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          দাড়ি রাখেন
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Partner Preferences Step */}
              {currentStep === "partner" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    প্রত্যাশিত জীবনসঙ্গী
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedAge" className="text-sm font-medium">
                        প্রত্যাশিত বয়স
                      </Label>
                      <Input
                        id="expectedAge"
                        name="expectedAge"
                        value={formData.expectedAge}
                        onChange={handleChange}
                        placeholder="যেমন: ২২-২৮"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedHeight" className="text-sm font-medium">
                        প্রত্যাশিত উচ্চতা
                      </Label>
                      <Input
                        id="expectedHeight"
                        name="expectedHeight"
                        value={formData.expectedHeight}
                        onChange={handleChange}
                        placeholder={"যেমন: 5'2\" - 5'6\""}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedEducation" className="text-sm font-medium">
                        প্রত্যাশিত শিক্ষাগত যোগ্যতা
                      </Label>
                      <Input
                        id="expectedEducation"
                        name="expectedEducation"
                        value={formData.expectedEducation}
                        onChange={handleChange}
                        placeholder="যেমন: স্নাতক বা তার উপরে"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedDistrict" className="text-sm font-medium">
                        প্রত্যাশিত এলাকা
                      </Label>
                      <Input
                        id="expectedDistrict"
                        name="expectedDistrict"
                        value={formData.expectedDistrict}
                        onChange={handleChange}
                        placeholder="যে কোন জেলা / নির্দিষ্ট জেলা"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedMaritalStatus" className="text-sm font-medium">
                      প্রত্যাশিত বৈবাহিক অবস্থা
                    </Label>
                    <select
                      id="expectedMaritalStatus"
                      name="expectedMaritalStatus"
                      value={formData.expectedMaritalStatus}
                      onChange={handleSelectChange}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="অবিবাহিত">অবিবাহিত</option>
                      <option value="ডিভোর্সড">ডিভোর্সড</option>
                      <option value="বিধবা/বিপত্নীক">বিধবা/বিপত্নীক</option>
                      <option value="যে কোন">যে কোন</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerQualities" className="text-sm font-medium">
                      জীবনসঙ্গীর কাছে প্রত্যাশা
                    </Label>
                    <Textarea
                      id="partnerQualities"
                      name="partnerQualities"
                      value={formData.partnerQualities}
                      onChange={handleChange}
                      placeholder="আপনার জীবনসঙ্গীর কাছ থেকে কী কী গুণাবলী প্রত্যাশা করেন"
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Contact Info Step */}
              {currentStep === "contact" && (
                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground border-b border-border pb-4">
                    যোগাযোগের তথ্য
                  </h2>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-700">অভিভাবকের ফোন নম্বরটি শুধুমাত্র প্রিমিয়াম সদস্যরা দেখতে পারবেন।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guardianPhone" className="text-sm font-medium">
                        অভিভাবকের ফোন নম্বর *
                      </Label>
                      <Input
                        id="guardianPhone"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleChange}
                        placeholder="০১৭XXXXXXXX"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianRelation" className="text-sm font-medium">
                        অভিভাবকের সাথে সম্পর্ক
                      </Label>
                      <select
                        id="guardianRelation"
                        name="guardianRelation"
                        value={formData.guardianRelation}
                        onChange={handleSelectChange}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="পিতা">পিতা</option>
                        <option value="মাতা">মাতা</option>
                        <option value="ভাই">ভাই</option>
                        <option value="বোন">বোন</option>
                        <option value="চাচা">চাচা</option>
                        <option value="মামা">মামা</option>
                        <option value="নিজে">নিজে</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={currentStepIndex === 0}
                  className="gap-2 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  পূর্ববর্তী
                </Button>

                {currentStep === "contact" ? (
                  <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary hover:bg-primary/90">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        বায়োডাটা সংরক্ষণ করুন
                      </>
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={goToNextStep} className="gap-2">
                    পরবর্তী
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
