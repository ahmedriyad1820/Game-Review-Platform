'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Gamepad2, Star, Users, TrendingUp } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Gamepad2 className="h-16 w-16 text-primary" />
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Ready to Join the
                <span className="block text-primary">Gaming Community?</span>
              </h2>
            </div>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Start reviewing games, building your collection, and connecting with fellow gamers. 
              Your next favorite game is waiting to be discovered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Join GameReview
                </Button>
              </Link>
              
              <Link href="/games">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Explore Games
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Write Reviews
              </h3>
              <p className="text-muted-foreground">
                Share your thoughts and help other gamers discover great titles
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Build Community
              </h3>
              <p className="text-muted-foreground">
                Connect with like-minded gamers and share your passion
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Track Progress
              </h3>
              <p className="text-muted-foreground">
                Keep track of your gaming journey and discover new experiences
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 p-6 bg-background/50 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by thousands of gamers worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground">
              <span className="text-xs">⭐ 4.8/5 from 10K+ reviews</span>
              <span className="text-xs">👥 50K+ active members</span>
              <span className="text-xs">🎮 5K+ games reviewed</span>
              <span className="text-xs">🚀 25% monthly growth</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
