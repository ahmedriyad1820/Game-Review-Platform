'use client'

import { useState } from 'react'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Star, Users } from 'lucide-react'
import { cn, getRatingColor, getRatingLabel } from '@/lib/utils'

interface GameReviewsProps {
  gameId: string
  gameSlug: string
  reviews: Array<{
    id: string
    rating: number
    title: string
    excerpt: string
    pros: string[]
    cons: string[]
    playtimeHours: number
    upvotesCount: number
    commentCount: number
    createdAt: string
    user: {
      id: string
      username: string
      avatarUrl?: string
    }
    game: {
      title: string
      slug: string
      coverUrl?: string
    }
  }>
  totalReviews: number
  averageRating: number
}

export function GameReviews({ gameId, gameSlug, reviews, totalReviews, averageRating }: GameReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5
  const totalPages = Math.ceil(totalReviews / reviewsPerPage)

  const startIndex = (currentPage - 1) * reviewsPerPage
  const endIndex = startIndex + reviewsPerPage
  const currentReviews = reviews.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Reviews</h2>
          <div className="flex items-center space-x-4">
            {/* Average Rating */}
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className={cn(
                'text-lg font-semibold',
                getRatingColor(averageRating)
              )}>
                {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
              </span>
            </div>
            
            <span className="text-muted-foreground">•</span>
            
            {/* Total Reviews */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>{totalReviews} reviews</span>
            </div>
            
            {/* Rating Label */}
            {averageRating > 0 && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className={cn(
                  'text-sm font-medium px-2 py-1 rounded-full',
                  getRatingColor(averageRating)
                )}>
                  {getRatingLabel(averageRating)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {currentReviews.length > 0 ? (
        <div className="space-y-6">
          {currentReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={() => {
                // Handle edit - redirect to edit page
                window.location.href = `/reviews/${review.id}/edit`
              }}
              onDelete={() => {
                // Handle delete - refresh the page to show updated reviews
                window.location.reload()
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No reviews yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Be the first to share your thoughts about this game!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Reviews Summary */}
      {totalReviews > 0 && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalReviews)} of {totalReviews} reviews
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-muted-foreground mt-1">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
