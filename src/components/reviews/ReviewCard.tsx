'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ThumbsUp, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn, formatRelativeTime, formatPlaytime, getRatingColor } from '@/lib/utils'

interface ReviewCardProps {
  review: {
    id: string
    game: {
      title: string
      slug: string
      coverUrl?: string
    }
    user: {
      username: string
      avatarUrl?: string
    }
    rating: number
    title: string
    excerpt: string
    pros: string[]
    cons: string[]
    playtimeHours: number
    upvotesCount: number
    commentCount: number
    createdAt: string
  }
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div className={cn(
      'bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow',
      'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
      className
    )}>
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        {/* Game Cover */}
        <Link href={`/games/${review.game.slug}`} className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
            {review.game.coverUrl ? (
              <Image
                src={review.game.coverUrl}
                alt={review.game.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>
        </Link>

        {/* Game Info & Rating */}
        <div className="flex-1 min-w-0">
          <Link href={`/games/${review.game.slug}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
              {review.game.title}
            </h3>
          </Link>
          
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className={cn(
                'text-sm font-semibold',
                getRatingColor(review.rating)
              )}>
                {review.rating.toFixed(1)}
              </span>
            </div>
            
            <span className="text-xs text-muted-foreground">•</span>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatPlaytime(review.playtimeHours)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Title */}
      <Link href={`/reviews/${review.id}`}>
        <h4 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
          {review.title}
        </h4>
      </Link>

      {/* Review Excerpt */}
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
        {review.excerpt}
      </p>

      {/* Pros & Cons */}
      <div className="space-y-2 mb-4">
        {/* Pros */}
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-green-600">Pros:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {review.pros.slice(0, 2).map((pro, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full border border-green-200"
                >
                  {pro}
                </span>
              ))}
              {review.pros.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                  +{review.pros.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cons */}
        <div className="flex items-start space-x-2">
          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-red-600">Cons:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {review.cons.slice(0, 2).map((con, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full border border-red-200"
                >
                  {con}
                </span>
              ))}
              {review.cons.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                  +{review.cons.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        {/* User Info */}
        <Link href={`/u/${review.user.username}`} className="flex items-center space-x-2 group">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
            {review.user.avatarUrl ? (
              <Image
                src={review.user.avatarUrl}
                alt={review.user.username}
                fill
                className="object-cover"
                sizes="24px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-xs">{review.user.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            {review.user.username}
          </span>
        </Link>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{review.upvotesCount}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>{review.commentCount}</span>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground mt-3 text-center">
        {formatRelativeTime(review.createdAt)}
      </div>
    </div>
  )
}
