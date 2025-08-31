import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { ReviewCard } from '@/components/reviews/ReviewCard'

async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        game: {
          select: {
            title: true,
            coverUrl: true,
            slug: true,
          },
        },
      },
    })

    return reviews.map(review => ({
      id: review.id,
      game: {
        title: review.game.title,
        slug: review.game.slug,
        coverUrl: review.game.coverUrl || undefined,
      },
      user: {
        id: review.user.id,
        username: review.user.username,
        avatarUrl: review.user.avatarUrl || undefined,
      },
      rating: review.rating,
      title: review.bodyMd.substring(0, 100) + (review.bodyMd.length > 100 ? '...' : ''), // Create title from body
      excerpt: review.bodyMd.substring(0, 200) + (review.bodyMd.length > 200 ? '...' : ''), // Create excerpt from body
      pros: review.pros,
      cons: review.cons,
      playtimeHours: review.playtimeHours || 0,
      upvotesCount: review.upvotesCount,
      commentCount: 0, // TODO: Add comment count when comments are implemented
      createdAt: review.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Game Reviews
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read honest reviews from our community of gamers and discover what others think about the latest titles
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <Suspense fallback={<div>Loading reviews...</div>}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Suspense>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
