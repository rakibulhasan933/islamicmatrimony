import type React from "react"

import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    User,
    Calendar,
    Ruler,
    MapPin,
    GraduationCap,
    Briefcase,
    Heart,
    Users,
    BookOpen,
    Phone,
    Share2,
    AlertCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Biodata } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { biodatas } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

function InfoCard({
    title,
    icon: Icon,
    children,
}: {
    title: string
    icon: React.ElementType
    children: React.ReactNode
}) {
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-muted-foreground text-sm min-w-[140px]">{label}:</span>
            <span className="font-medium">{value || "N/A"}</span>
        </div>
    )
}

function getMaritalStatusDisplay(status: string | null) {
    const statusMap: Record<string, string> = {
        unmarried: "অবিবাহিত",
        divorced: "ডিভোর্সড",
        widow: "বিধবা",
        widower: "বিপত্নীক",
    }
    return status ? statusMap[status] || status : "N/A"
}

function getTypeDisplay(type: string) {
    return type === "bride" ? "পাত্রী" : "পাত্র"
}

export default async function BiodataDetailPage({
    params,
}: {
    params: Promise<{ biodata: string }>
}) {
    const bioDataParams = await params;
    const { biodata } = bioDataParams;

    // Fetch biodata server-side
    const biodataList = await db.select().from(biodatas).where(eq(biodatas.biodataNo, biodata)).limit(1)

    if (biodataList.length === 0) {
        notFound()
    }

    const bio = biodataList[0];

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-linear-to-b from-background to-muted/20 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        বায়োডাটা খুঁজুনে ফিরে যান
                    </Link>

                    {/* Biodata Content */}
                    <div className="max-w-5xl mx-auto">
                        {/* Header Card */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
                            <div className="bg-linear-to-r from-primary/10 to-secondary/10 p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    {/* Profile Photo */}
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-background border-4 border-background shadow-lg overflow-hidden shrink-0">
                                        {bio.photo ? (
                                            <Image
                                                src={bio.photo}
                                                alt="Profile"
                                                width={160}
                                                height={160}
                                                priority
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                <User className="w-16 h-16 text-primary/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Basic Info */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                            <h1 className="text-2xl md:text-3xl font-bold">{bio.fullName}</h1>
                                            <Badge
                                                className={
                                                    bio.type === "bride"
                                                        ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                }
                                            >
                                                {getTypeDisplay(bio.type)}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-4">
                                            বায়োডাটা নং: <span className="font-semibold text-foreground">{bio.biodataNo}</span>
                                        </p>

                                        {/* Quick Stats */}
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                                            {bio.age && (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    {bio.age} বছর
                                                </span>
                                            )}
                                            {bio.height && (
                                                <span className="flex items-center gap-1.5">
                                                    <Ruler className="w-4 h-4 text-primary" />
                                                    {bio.height}
                                                </span>
                                            )}
                                            {bio.currentDistrict && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {bio.currentDistrict}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5">
                                                <Heart className="w-4 h-4 text-primary" />
                                                {getMaritalStatusDisplay(bio.maritalStatus)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="icon">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Heart className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <InfoCard title="ব্যক্তিগত তথ্য" icon={User}>
                                <InfoRow label="পুরো নাম" value={bio.fullName} />
                                <InfoRow
                                    label="জন্ম তারিখ"
                                    value={
                                        bio.dateOfBirth ? new Date(bio.dateOfBirth).toLocaleDateString("bn-BD") : null
                                    }
                                />
                                <InfoRow label="বয়স" value={bio.age ? `${bio.age} বছর` : null} />
                                <InfoRow label="উচ্চতা" value={bio.height} />
                                <InfoRow label="ওজন" value={bio.weight} />
                                <InfoRow label="রক্তের গ্রুপ" value={bio.bloodGroup} />
                                <InfoRow label="গাত্রবর্ণ" value={bio.complexion} />
                                <InfoRow label="বৈবাহিক অবস্থা" value={getMaritalStatusDisplay(bio.maritalStatus)} />
                            </InfoCard>
                            {/* Location Information */}
                            <InfoCard title="ঠিকানা" icon={MapPin}>
                                <InfoRow label="স্থায়ী জেলা" value={bio.permanentDistrict} />
                                <InfoRow label="স্থায়ী ঠিকানা" value={bio.permanentAddress} />
                                <InfoRow label="বর্তমান জেলা" value={bio.currentDistrict} />
                                <InfoRow label="বর্তমান ঠিকানা" value={bio.currentAddress} />
                            </InfoCard>

                            {/* Education Information */}
                            <InfoCard title="শিক্ষাগত যোগ্যতা" icon={GraduationCap}>
                                <InfoRow label="শিক্ষাগত যোগ্যতা" value={bio.education} />
                                {bio.educationDetails && (
                                    <p className="text-sm text-muted-foreground mt-2">{bio.educationDetails}</p>
                                )}
                            </InfoCard>

                            {/* Occupation Information */}
                            <InfoCard title="পেশা" icon={Briefcase}>
                                <InfoRow label="পেশা" value={bio.occupation} />
                                <InfoRow label="মাসিক আয়" value={bio.monthlyIncome} />
                                {bio.occupationDetails && (
                                    <p className="text-sm text-muted-foreground mt-2">{bio.occupationDetails}</p>
                                )}
                            </InfoCard>

                            {/* Family Information */}
                            <InfoCard title="পারিবারিক তথ্য" icon={Users}>
                                <InfoRow label="পিতার নাম" value={bio.fatherName} />
                                <InfoRow label="পিতার পেশা" value={bio.fatherOccupation} />
                                <InfoRow label="মাতার নাম" value={bio.motherName} />
                                <InfoRow label="মাতার পেশা" value={bio.motherOccupation} />
                                {bio.siblings && (
                                    <div className="mt-2">
                                        <span className="text-muted-foreground text-sm">ভাই/বোন:</span>
                                        <p className="text-sm mt-1">{bio.siblings}</p>
                                    </div>
                                )}
                            </InfoCard>


                            {/* Religious Information */}
                            <InfoCard title="ধর্মীয় তথ্য" icon={BookOpen}>
                                <InfoRow label="ধর্মীয় অনুশীলন" value={bio.religiousPractice} />
                                <InfoRow label="নামাজের অভ্যাস" value={bio.prayerHabit} />
                                {bio.type === "bride" && (
                                    <InfoRow
                                        label="পর্দা করেন"
                                        value={bio.wearsHijab ? "হ্যাঁ" : bio.wearsHijab === false ? "না" : null}
                                    />
                                )}
                                {bio.type === "groom" && (
                                    <InfoRow
                                        label="দাড়ি রাখেন"
                                        value={bio.hasBeard ? "হ্যাঁ" : bio.hasBeard === false ? "না" : null}
                                    />
                                )}
                            </InfoCard>



                            {/* Partner Preferences - Full Width */}
                            <div className="md:col-span-2">
                                <InfoCard title="যেমন জীবনসঙ্গী আশা করেন" icon={Heart}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoRow label="বয়স" value={bio.expectedAge} />
                                        <InfoRow label="উচ্চতা" value={bio.expectedHeight} />
                                        <InfoRow label="শিক্ষাগত যোগ্যতা" value={bio.expectedEducation} />
                                        <InfoRow label="জেলা" value={bio.expectedDistrict} />
                                        <InfoRow label="বৈবাহিক অবস্থা" value={bio.expectedMaritalStatus} />
                                    </div>
                                    {bio.partnerQualities && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <span className="text-muted-foreground text-sm block mb-2">জীবনসঙ্গীর কাছে যা প্রত্যাশা:</span>
                                            <p className="text-sm">{bio.partnerQualities}</p>
                                        </div>
                                    )}
                                </InfoCard>
                            </div>

                            {/* Contact Information - Full Width */}
                            <div className="md:col-span-2">
                                <InfoCard title="যোগাযোগ" icon={Phone}>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            যোগাযোগের তথ্য দেখতে আপনাকে লগইন করতে হবে এবং বায়োডাটাটি শর্টলিস্টে যোগ করতে হবে।
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <InfoRow label="অভিভাবকের সম্পর্ক" value={bio.guardianRelation} />
                                            <InfoRow label="অভিভাবকের ফোন" value={bio.guardianPhone} />
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                            <Button size="lg" className="gap-2">
                                <Heart className="w-5 h-5" />
                                শর্টলিস্টে যোগ করুন
                            </Button>
                            <Link href="/search">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 bg-transparent">
                                    <ArrowLeft className="w-5 h-5" />
                                    আরো বায়োডাটা দেখুন
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}