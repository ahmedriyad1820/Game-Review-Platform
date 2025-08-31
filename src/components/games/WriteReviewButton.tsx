'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PenSquare, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface WriteReviewButtonProps {
  gameSlug: string
  gameTitle: string
}

export function WriteReviewButton({ gameSlug, gameTitle }: WriteReviewButtonProps) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="text-center">
        <div className="bg-muted/50 border rounded-lg p-6">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Want to share your thoughts?
          </h3>
          <p className="text-muted-foreground mb-4">
            Sign in to write a review for {gameTitle} and help other gamers discover great games.
          </p>
          <Link href={`/login?callbackUrl=/games/${gameSlug}/review`}>
            <Button size="lg">
              <PenSquare className="h-5 w-5 mr-2" />
              Sign In to Write Review
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <Link href={`/games/${gameSlug}/review`}>
        <Button size="lg" className="h-12 px-8">
          <PenSquare className="h-5 w-5 mr-2" />
          Write a Review for {gameTitle}
        </Button>
      </Link>
      <p className="text-sm text-muted-foreground mt-2">
        Share your experience and help other gamers make informed decisions
      </p>
    </div>
  )
}
