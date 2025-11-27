import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Bengali } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// <CHANGE> Added Noto Sans Bengali font for Bengali text
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
})


export const metadata: Metadata = {
  title: "হালাল ম্যাট্রিমনি - সঠিক জীবনসঙ্গী খুঁজুন",
  description: "ইসলামী মূল্যবোধে গড়া নিরাপদ ও বিশ্বস্ত ম্যাট্রিমনি প্ল্যাটফর্ম",
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
    <html lang="bn">
      <body className={`${notoSansBengali.className} font-sans antialiased`}>
        <Navbar />
        <div className="px-2 md:px-20 md:pt-4 pt-2">
          {children}
          <Analytics />
        </div>
        <Footer />
      </body>
    </html>
  )
}
