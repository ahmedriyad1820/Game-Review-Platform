'use client'

import Image from 'next/image'
import { Star, Calendar, Users, Gamepad2, Clock } from 'lucide-react'
import { cn, formatDate, getRatingColor, getRatingLabel } from '@/lib/utils'

interface GameHeaderProps {
  game: {
    title: string
    coverUrl?: string
    averageRating: number
    totalReviews: number
    releaseDate: Date
    developer?: string
    publisher?: string
    genres: string[]
    platforms: string[]
  }
}

export function GameHeader({ game }: GameHeaderProps) {
  return (
    <div className="bg-background border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Game Cover */}
        <div className="flex-shrink-0">
          <div className="relative w-48 h-64 rounded-lg overflow-hidden bg-muted">
            {game.coverUrl ? (
              <Image
                src={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Gamepad2 className="h-16 w-16" />
              </div>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {game.title}
          </h1>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className={cn(
                'text-2xl font-bold',
                getRatingColor(game.averageRating)
              )}>
                {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'N/A'}
              </span>
            </div>
            
            <span className="text-muted-foreground">•</span>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>{game.totalReviews} reviews</span>
            </div>
          </div>

          {/* Rating Label */}
          {game.averageRating > 0 && (
            <div className="mb-4">
              <span className={cn(
                'text-lg font-medium px-3 py-1 rounded-full',
                getRatingColor(game.averageRating)
              )}>
                {getRatingLabel(game.averageRating)}
              </span>
            </div>
          )}

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {game.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-2 mb-4">
            {game.platforms.map((platform) => (
              <span
                key={platform}
                className="px-3 py-1 text-sm bg-secondary/10 text-secondary-foreground rounded-full border border-secondary/20"
              >
                {platform}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {game.releaseDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(game.releaseDate, 'MMMM yyyy')}</span>
              </div>
            )}
            
            {game.developer && (
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-4 w-4" />
                <span>{game.developer}</span>
              </div>
            )}
            
            {game.publisher && game.publisher !== game.developer && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{game.publisher}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
