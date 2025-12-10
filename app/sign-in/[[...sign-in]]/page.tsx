import { SignIn } from "@clerk/nextjs"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-pink-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pink-600 leading-none">FreelancerMarriage</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide" style={{ fontSize: "0.7rem" }}>
                ফ্রিল্যান্সারদের বিশ্বস্ত মাধ্যম
              </p>
            </div>
          </Link>
        </div>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl border border-pink-100 rounded-2xl",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton:
                  "border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all",
                socialButtonsBlockButtonText: "font-medium text-gray-700",
                formFieldLabel: "text-gray-700 font-medium",
                formFieldInput: "border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-lg h-12",
                formButtonPrimary:
                  "bg-pink-600 hover:bg-pink-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-pink-200",
                footerActionLink: "text-pink-600 hover:text-pink-700 font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/sign-up" className="text-pink-600 hover:text-pink-700 font-semibold hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </main>
  )
}
