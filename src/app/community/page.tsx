import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getCommunityStats() {
  try {
    const [userCount, reviewCount, gameCount, listCount] = await Promise.all([
      prisma.user.count(),
      prisma.review.count(),
      prisma.game.count(),
      prisma.list.count(),
    ])

    const topUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        reviews: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            reviews: true,
            followers: true,
          },
        },
      },
    })

    return {
      userCount,
      reviewCount,
      gameCount,
      listCount,
      topUsers,
    }
  } catch (error) {
    console.error('Error fetching community stats:', error)
    return {
      userCount: 0,
      reviewCount: 0,
      gameCount: 0,
      listCount: 0,
      topUsers: [],
    }
  }
}

export default async function CommunityPage() {
  const stats = await getCommunityStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Gaming Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow gamers, discover new friends, and be part of our growing community
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-background border rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary mb-2">{stats.userCount}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="bg-background border rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.reviewCount}</div>
            <div className="text-sm text-muted-foreground">Reviews Written</div>
          </div>
          <div className="bg-background border rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.gameCount}</div>
            <div className="text-sm text-muted-foreground">Games Reviewed</div>
          </div>
          <div className="bg-background border rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.listCount}</div>
            <div className="text-sm text-muted-foreground">Lists Created</div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Top Contributors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.topUsers.map((user, index) => (
              <div key={user.id} className="bg-background border rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.username}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-xl">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-yellow-500">#{index + 1}</span>
                      <h3 className="font-semibold text-foreground text-lg">{user.username}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user._count.reviews} reviews • {user._count.followers} followers
                    </p>
                  </div>
                </div>
                <Link 
                  href={`/u/${user.username}`}
                  className="block w-full text-center bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">Get Involved</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Write game reviews and share your thoughts</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Create and share game lists</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Follow other gamers and discover new games</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Participate in community discussions</span>
              </li>
            </ul>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">Community Guidelines</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Be respectful and constructive in reviews</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Share honest opinions and experiences</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Help other gamers discover great titles</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Report inappropriate content when needed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
