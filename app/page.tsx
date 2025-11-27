import { HeroSection } from "@/components/hero-section"
import { SearchSection } from "@/components/search-section"
import { AboutSection } from "@/components/about-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection />
      <SearchSection />
      <AboutSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
