import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { GameCard } from '@/components/games/GameCard'
import { SearchBar } from '@/components/ui/SearchBar'

async function getGames() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    return games.map(game => ({
      ...game,
      rating: game.reviews.length > 0 
        ? game.reviews.reduce((acc, review) => acc + review.rating, 0) / game.reviews.length
        : 0,
      reviewCount: game.reviews.length,
      releaseDate: game.releaseDate ? game.releaseDate.toISOString() : '',
    }))
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

export default async function GamesPage() {
  const games = await getGames()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Discover Games
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our extensive collection of games, read reviews, and find your next favorite title
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <SearchBar placeholder="Search games..." />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Suspense fallback={<div>Loading games...</div>}>
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Suspense>
        </div>

        {games.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No games found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
