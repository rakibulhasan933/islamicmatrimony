"use client"

import { Heart, MapPin, Globe } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { label: "আমাদের সম্পর্কে", href: "#about" },
  { label: "সচরাচর জিজ্ঞাসা (FAQ)", href: "#faq" },
  { label: "গাইডলাইন", href: "#guideline" },
  { label: "শর্তাবলী", href: "#terms" },
]

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <h2 className="text-2xl font-bold">FreelancerMarriage</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট। দ্বীনদার এবং কর্মঠ জীবনসঙ্গী খুঁজে পেতে আমরা আছি আপনার
            পাশে।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-l-4 border-pink-500 pl-3">দ্রুত লিংক</h3>
          <ul className="space-y-2 text-gray-400">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:text-pink-500 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-l-4 border-pink-500 pl-3">যোগাযোগ</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-pink-500" />
              ঢাকা, বাংলাদেশ
            </li>
            <li className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-pink-500" />
              www.freelancermarriage.com
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>© ২০২৫ FreelancerMarriage.com | সর্বস্বত্ব সংরক্ষিত</p>
      </div>
    </footer>
  )
}
