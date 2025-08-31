'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Gamepad2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  rating: number
  bodyMd: string
  pros: string[]
  cons: string[]
  playtimeHours: number
  containsSpoilers: boolean
  game: {
    id: string
    title: string
    slug: string
  }
  user: {
    id: string
    username: string
  }
}

export default function EditReviewPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/login?callbackUrl=/reviews/${params.id}/edit`)
      return
    }

    // Fetch review data
    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/reviews/${params.id}`)
        if (response.ok) {
          const reviewData = await response.json()
          
          // Check if user owns this review or is admin
          if (reviewData.user.id !== session.user.id && !session.user.roles.includes('ADMIN')) {
            setError('You do not have permission to edit this review')
            return
          }
          
          setReview(reviewData)
        } else {
          setError('Review not found')
        }
      } catch (error) {
        setError('Failed to load review')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [session, status, router, params.id])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-foreground text-lg mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/reviews">
            <Button>Browse Reviews</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!review) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/reviews/${review.id}`}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Review</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Edit Review
          </h1>
          <p className="text-muted-foreground">
            Update your review for <span className="font-semibold text-foreground">{review.game.title}</span>
          </p>
        </div>

        {/* Review Form */}
        <div className="max-w-4xl mx-auto">
          <ReviewForm
            gameId={review.game.id}
            gameTitle={review.game.title}
            initialData={{
              rating: review.rating,
              bodyMd: review.bodyMd,
              pros: review.pros,
              cons: review.cons,
              playtimeHours: review.playtimeHours,
              containsSpoilers: review.containsSpoilers
            }}
            isEditing={true}
            onCancel={() => router.push(`/reviews/${review.id}`)}
            onSuccess={() => {
              // Review was updated successfully
              router.push(`/reviews/${review.id}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}
