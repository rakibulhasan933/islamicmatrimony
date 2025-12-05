import { CheckCircle, Laptop, Users, Shield, Heart } from "lucide-react"

const stats = [
  { value: "৫০০+", label: "ফ্রিল্যান্সার প্রোফাইল" },
  { value: "২০০+", label: "সফল বিবাহ" },
  { value: "৬৪+", label: "জেলায় সদস্য" },
]

const highlights = [
  "শুধুমাত্র ফ্রিল্যান্সারদের জন্য",
  "সম্পূর্ণ গোপনীয়তা বজায় রাখা হয়",
  "প্রতিটি প্রোফাইল যাচাই করা হয়",
  "পারিবারিক মূল্যবোধ রক্ষা করা হয়",
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="about-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-pink-600" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#about-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-pink-600 font-semibold text-sm tracking-wide uppercase bg-pink-50 px-4 py-2 rounded-full">
                আমাদের সম্পর্কে
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              ফ্রিল্যান্সারদের জন্য <span className="text-pink-600">বিশেষায়িত</span> ম্যাট্রিমনি
            </h2>

            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>ফ্রিল্যান্সিং একটি অনন্য পেশা - যেখানে সময়, স্বাধীনতা এবং দক্ষতা একসাথে মিলিত হয়।</p>
              <p>
                আমরা বুঝি যে একজন ফ্রিল্যান্সারের জীবনসঙ্গী এমন কাউকে হওয়া উচিত যিনি এই পেশার চ্যালেঞ্জ এবং সুবিধাগুলো বোঝেন। তাই আমরা
                শুধুমাত্র ফ্রিল্যান্সারদের জন্য এই প্ল্যাটফর্ম তৈরি করেছি।
              </p>
            </div>

            <div className="space-y-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <span className="text-gray-800">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-5 border border-pink-100"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-pink-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200/50 rounded-full blur-3xl scale-110" />

              <div className="relative bg-gradient-to-br from-white to-pink-50 rounded-3xl p-10 border border-pink-100 shadow-2xl">
                {/* Freelancer Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
                    <Laptop className="w-16 h-16 text-pink-600" />
                  </div>
                </div>

                {/* Features Icons */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-pink-600" />
                    </div>
                    <p className="text-xs text-gray-600">ভেরিফাইড সদস্য</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-pink-600" />
                    </div>
                    <p className="text-xs text-gray-600">নিরাপদ প্ল্যাটফর্ম</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <p className="text-xs text-gray-600">সফল ম্যাচিং</p>
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-pink-300" />
                  <div className="w-2 h-2 rounded-full bg-pink-200" />
                  <div className="w-2 h-2 rounded-full bg-pink-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
