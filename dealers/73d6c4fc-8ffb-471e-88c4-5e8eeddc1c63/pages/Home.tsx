import HeroSection from "../components/HeroSection"
import StatsBar from "../components/StatsBar"
import BrandsSection from "../components/BrandsSection"
import ServingSection from "../components/ServingSection"
import ReviewsSection from "../components/ReviewsSection"
import Tonkin2USection from "../components/Tonkin2USection"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <StatsBar />
        <BrandsSection />
        <ServingSection />
        <ReviewsSection />
        <Tonkin2USection />
      </main>
    </div>
  )
}
