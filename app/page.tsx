import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { StatsSection } from "@/components/stats-section"
import { PricingSection } from "@/components/pricing-section"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <StatsSection />
      <PricingSection />
    </main>
  )
}
