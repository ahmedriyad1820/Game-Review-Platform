import Link from 'next/link'
import { Gamepad2, Star, Users, TrendingUp, ArrowRight, Play, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GameCard } from '@/components/games/GameCard'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedGames } from '@/components/home/FeaturedGames'
import { RecentReviews } from '@/components/home/RecentReviews'
import { StatsSection } from '@/components/home/StatsSection'
import { CTASection } from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Games */}
      <FeaturedGames />

      {/* Recent Reviews */}
      <RecentReviews />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
