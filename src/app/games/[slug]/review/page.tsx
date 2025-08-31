'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

interface Game {
  id: string
  title: string
  slug: string
  coverUrl?: string
  descriptionMd?: string
}

export default function WriteReviewPage({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/login?callbackUrl=/games/${params.slug}/review`)
      return
    }

    // Fetch game data
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${params.slug}`)
        if (response.ok) {
          const gameData = await response.json()
          setGame(gameData)
        } else {
          setError('Game not found')
        }
      } catch (error) {
        setError('Failed to load game')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGame()
  }, [session, status, router, params.slug])

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
          <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground text-lg mb-2">Game Not Found</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/games">
            <Button>Browse Games</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!game) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/games/${game.slug}`}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {game.title}</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Write a Review
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts and help other gamers discover great games
          </p>
        </div>

        {/* Review Form */}
        <div className="max-w-4xl mx-auto">
          <ReviewForm
            gameId={game.id}
            gameTitle={game.title}
            onCancel={() => router.push(`/games/${game.slug}`)}
            onSuccess={() => {
              // Review was created successfully
              router.push(`/games/${game.slug}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}
