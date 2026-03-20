import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { UpcomingTournaments } from "@/components/upcoming-tournaments"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturedWinners } from "@/components/featured-winners"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <UpcomingTournaments />
        <HowItWorks />
        <FeaturedWinners />
      </main>
      <Footer />
    </div>
  )
}
