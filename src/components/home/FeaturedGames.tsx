'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GameCard } from '@/components/games/GameCard'

// Mock data for featured games - in a real app this would come from an API
const featuredGames = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    genres: ['RPG', 'Action', 'Sci-Fi'],
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    rating: 8.5,
    reviewCount: 1247,
    releaseDate: '2020-12-10',
  },
  {
    id: '2',
    title: 'Elden Ring',
    slug: 'elden-ring',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    genres: ['Action RPG', 'Soulslike', 'Open World'],
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    rating: 9.2,
    reviewCount: 2156,
    releaseDate: '2022-02-25',
  },
  {
    id: '3',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    slug: 'zelda-tears-kingdom',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    genres: ['Action Adventure', 'Open World', 'Puzzle'],
    platforms: ['Nintendo Switch'],
    rating: 9.4,
    reviewCount: 1893,
    releaseDate: '2023-05-12',
  },
  {
    id: '4',
    title: 'Baldur\'s Gate 3',
    slug: 'baldurs-gate-3',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    genres: ['RPG', 'Turn-Based', 'Fantasy'],
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    rating: 9.6,
    reviewCount: 3421,
    releaseDate: '2023-08-03',
  },
  {
    id: '5',
    title: 'Spider-Man 2',
    slug: 'spider-man-2',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    genres: ['Action Adventure', 'Open World', 'Superhero'],
    platforms: ['PS5'],
    rating: 8.8,
    reviewCount: 987,
    releaseDate: '2023-10-20',
  },
  {
    id: '6',
    title: 'Alan Wake 2',
    slug: 'alan-wake-2',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    genres: ['Survival Horror', 'Psychological', 'Thriller'],
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    rating: 8.9,
    reviewCount: 654,
    releaseDate: '2023-10-27',
  },
]

export function FeaturedGames() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Games
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover the most popular and highly-rated games from our community
            </p>
          </div>
          
          <Link href="/games">
            <Button variant="outline" className="mt-4 sm:mt-0">
              View All Games
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/games">
            <Button size="lg">
              Explore More Games
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
