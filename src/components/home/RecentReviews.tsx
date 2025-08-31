'use client'

import Link from 'next/link'
import { ArrowRight, Star, ThumbsUp, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ReviewCard } from '@/components/reviews/ReviewCard'

// Mock data for recent reviews - in a real app this would come from an API
const recentReviews = [
  {
    id: '1',
    game: {
      title: 'Baldur\'s Gate 3',
      slug: 'baldurs-gate-3',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
    },
    user: {
      id: 'user1',
      username: 'RPGMaster',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    rating: 9.5,
    title: 'A Masterpiece of Modern RPG Design',
    excerpt: 'Larian Studios has delivered what might be the most impressive RPG I\'ve ever played. The depth of choice, the quality of writing, and the sheer amount of content is staggering...',
    pros: ['Exceptional writing', 'Meaningful choices', 'Beautiful graphics'],
    cons: ['Steep learning curve', 'Long playtime'],
    playtimeHours: 120,
    upvotesCount: 89,
    commentCount: 23,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    game: {
      title: 'Spider-Man 2',
      slug: 'spider-man-2',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop',
    },
    user: {
      id: 'user2',
      username: 'WebSlinger',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    rating: 8.8,
    title: 'Swinging Through New York Never Gets Old',
    excerpt: 'Insomniac has once again captured the essence of being Spider-Man. The web-swinging mechanics are refined, the story is compelling, and the open world feels alive...',
    pros: ['Amazing web-swinging', 'Great story', 'Beautiful graphics'],
    cons: ['Some repetitive side content', 'Short main story'],
    playtimeHours: 45,
    upvotesCount: 67,
    commentCount: 18,
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    game: {
      title: 'Alan Wake 2',
      slug: 'alan-wake-2',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
    },
    user: {
      id: 'user3',
      username: 'HorrorFan',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    },
    rating: 8.9,
    title: 'A Psychological Horror Masterpiece',
    excerpt: 'Remedy has crafted one of the most atmospheric and psychologically unsettling horror games in recent memory. The narrative is complex, the atmosphere is thick...',
    pros: ['Atmospheric horror', 'Complex narrative', 'Unique gameplay'],
    cons: ['Pacing issues', 'Some technical problems'],
    playtimeHours: 35,
    upvotesCount: 54,
    commentCount: 12,
    createdAt: '2024-01-13T20:15:00Z',
  },
]

export function RecentReviews() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Recent Reviews
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              See what the community is saying about the latest games
            </p>
          </div>
          
          <Link href="/reviews">
            <Button variant="outline" className="mt-4 sm:mt-0">
              View All Reviews
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/reviews">
            <Button size="lg">
              Read More Reviews
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
