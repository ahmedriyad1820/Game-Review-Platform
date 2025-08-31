'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Gamepad2, Star, Users, TrendingUp } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Gamepad2 className="h-12 w-12 text-primary" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Discover Your Next
                <span className="block text-primary">Favorite Game</span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of gamers in the ultimate community-driven platform. Read and write 
              honest reviews, track your gaming journey, and discover hidden gems recommended by 
              real players like you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/games">
              <Button size="lg" className="w-full sm:w-auto">
                <Star className="mr-2 h-5 w-5" />
                Explore Games
              </Button>
            </Link>
            
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">10K+ Reviews</h3>
              <p className="text-sm text-muted-foreground">Trusted by gamers</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">50K+ Members</h3>
              <p className="text-sm text-muted-foreground">Active community</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">5K+ Games</h3>
              <p className="text-sm text-muted-foreground">Extensive catalog</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
