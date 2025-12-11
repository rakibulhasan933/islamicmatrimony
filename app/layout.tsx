import type React from "react"
import type { Metadata, Viewport } from "next"
import { Hind_Siliguri } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
})

export const metadata: Metadata = {
  title: {
    default: "Freelancer Marriage - ফ্রিল্যান্সারদের বিয়ের এক বিশ্বস্ত মাধ্যম",
    template: "%s | Freelancer Marriage",
  },
  description:
    "বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট। নিরাপদ, বিশ্বস্ত এবং ইসলামিক মূল্যবোধ ভিত্তিক বৈবাহিক সম্পর্ক গড়ুন।",
  generator: "rakibul hassan",
  applicationName: "Freelancer Marriage",
  referrer: "origin-when-cross-origin",
  keywords: [
    "ফ্রিল্যান্সার বিয়ে",
    "বাংলাদেশী ম্যাট্রিমনি",
    "ইসলামিক বিয়ে",
    "মুসলিম ম্যাট্রিমনি",
    "ফ্রিল্যান্সার ম্যাট্রিমনি",
    "বায়োডাটা",
    "পাত্র পাত্রী",
    "freelancer marriage",
    "bangladeshi matrimony",
    "muslim matrimony",
    "islamic marriage",
  ],
  authors: [{ name: "Rakibul Hassan" }],
  creator: "Rakibul Hassan",
  publisher: "Freelancer Marriage",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://freelancermarriage.com"),
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
    },
  },
  openGraph: {
    title: "Freelancer Marriage - ফ্রিল্যান্সারদের বিয়ের এক বিশ্বস্ত মাধ্যম",
    description:
      "বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট। নিরাপদ, বিশ্বস্ত এবং ইসলামিক মূল্যবোধ ভিত্তিক বৈবাহিক সম্পর্ক গড়ুন।",
    url: "https://freelancermarriage.com",
    siteName: "Freelancer Marriage",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Freelancer Marriage - ফ্রিল্যান্সারদের বিয়ের এক বিশ্বস্ত মাধ্যম",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelancer Marriage - ফ্রিল্যান্সারদের বিয়ের এক বিশ্বস্ত মাধ্যম",
    description: "বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
  category: "matrimony",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec4899" },
    { media: "(prefers-color-scheme: dark)", color: "#db2777" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="bn" className="scroll-smooth hydrated">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Freelancer Marriage",
                alternateName: "ফ্রিল্যান্সার ম্যারেজ",
                url: "https://freelancermarriage.com",
                description: "বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://freelancermarriage.com/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
                inLanguage: "bn-BD",
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Freelancer Marriage",
                url: "https://freelancermarriage.com",
                logo: "https://freelancermarriage.com/icon.svg",
                sameAs: [],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  availableLanguage: ["Bengali", "English"],
                },
              }),
            }}
          />
        </head>
        <body
          className={`${hindSiliguri.className} font-sans antialiased bg-pink-50 text-gray-800 min-h-screen flex flex-col`}
        >
          <Navbar />
          <div className="flex-1">
            {children}
            <Analytics />
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
