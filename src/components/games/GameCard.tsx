'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Calendar, Users } from 'lucide-react'
import { cn, formatDate, getRatingColor, getRatingLabel } from '@/lib/utils'

interface GameCardProps {
  game: {
    id: string
    title: string
    slug: string
    coverUrl?: string
    genres: string[]
    platforms: string[]
    rating: number
    reviewCount: number
    releaseDate: string
  }
  className?: string
}

export function GameCard({ game, className }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className={cn(
        'group bg-background border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        className
      )}>
        {/* Game Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-foreground">
              {game.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {game.title}
          </h3>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {game.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {genre}
              </span>
            ))}
            {game.genres.length > 2 && (
              <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                +{game.genres.length - 2}
              </span>
            )}
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1 mb-3">
            {game.platforms.slice(0, 3).map((platform) => (
              <span
                key={platform}
                className="inline-block px-2 py-1 text-xs bg-secondary/10 text-secondary-foreground rounded-full border border-secondary/20"
              >
                {platform}
              </span>
            ))}
            {game.platforms.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                +{game.platforms.length - 3}
              </span>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(game.releaseDate, 'yyyy')}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{game.reviewCount.toLocaleString()} reviews</span>
            </div>
          </div>

          {/* Rating Label */}
          <div className="mt-2">
            <span className={cn(
              'text-xs font-medium',
              getRatingColor(game.rating)
            )}>
              {getRatingLabel(game.rating)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
