import type React from "react"
import type { Metadata } from "next"
import { Hind_Siliguri } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
})

export const metadata: Metadata = {
  title: "Freelancer Marriage - ফ্রিল্যান্সারদের বিয়ের এক বিশ্বস্ত মাধ্যম",
  description: "বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট",
  generator: "rakibul hassan",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn" className="scroll-smooth hydrated">
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
  )
}
