import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { GameReviews } from '@/components/games/GameReviews'
import { GameHeader } from '@/components/games/GameHeader'
import { GameDetails } from '@/components/games/GameDetails'
import { WriteReviewButton } from '@/components/games/WriteReviewButton'

async function getGame(slug: string) {
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { status: 'PUBLISHED' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          reviews: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
  })

  if (!game) return null

  // Calculate average rating
  const publishedReviews = game.reviews.filter(review => review.status === 'PUBLISHED')
  const averageRating = publishedReviews.length > 0
    ? publishedReviews.reduce((acc: number, review: any) => acc + review.rating, 0) / publishedReviews.length
    : 0

  // Map reviews to match ReviewCard interface
  const mappedReviews = publishedReviews.map((review: any) => ({
    id: review.id,
    rating: review.rating,
    title: review.bodyMd.substring(0, 100) + (review.bodyMd.length > 100 ? '...' : ''),
    excerpt: review.bodyMd.substring(0, 200) + (review.bodyMd.length > 200 ? '...' : ''),
    pros: review.pros,
    cons: review.cons,
    playtimeHours: review.playtimeHours || 0,
    upvotesCount: review.upvotesCount,
    commentCount: 0, // TODO: Add comment count when comments are implemented
    createdAt: review.createdAt.toISOString(),
    user: {
      id: review.user.id,
      username: review.user.username,
      avatarUrl: review.user.avatarUrl || undefined,
    },
    game: {
      title: game.title,
      slug: game.slug,
      coverUrl: game.coverUrl || undefined,
    },
  }))

  return {
    ...game,
    totalReviews: game._count.reviews,
    averageRating,
    reviews: mappedReviews,
  }
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGame(params.slug)
  if (!game) notFound()

  // Map game data to match component interfaces
  const gameHeaderData = {
    title: game.title,
    coverUrl: game.coverUrl || undefined,
    averageRating: game.averageRating,
    totalReviews: game.totalReviews,
    releaseDate: game.releaseDate || new Date(), // Provide default date if null
    developer: game.developer || undefined,
    publisher: game.publisher || undefined,
    genres: game.genres,
    platforms: game.platforms,
  }

  const gameDetailsData = {
    descriptionMd: game.descriptionMd || undefined,
    systemRequirements: game.systemRequirements || undefined,
    esrbRating: game.esrbRating || undefined,
    metacriticUrl: game.metacriticUrl || undefined,
    criticScore: game.criticScore || undefined,
    trailerUrl: game.trailerUrl || undefined,
    screenshots: Array.isArray(game.screenshots) ? (game.screenshots as string[]) : undefined,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <GameHeader game={gameHeaderData} />
        <GameDetails game={gameDetailsData} />
        <div className="my-8">
          <WriteReviewButton gameSlug={game.slug} gameTitle={game.title} />
        </div>
        <div className="mt-12">
          <GameReviews 
            gameId={game.id} 
            gameSlug={game.slug} 
            reviews={game.reviews} 
            totalReviews={game.totalReviews} 
            averageRating={game.averageRating} 
          />
        </div>
      </div>
    </div>
  )
}
