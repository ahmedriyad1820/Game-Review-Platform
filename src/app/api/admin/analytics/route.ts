import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/analytics - Get platform analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get overview statistics
    const [totalUsers, totalGames, totalReviews, totalLists, totalComments, totalVotes] = await Promise.all([
      prisma.user.count(),
      prisma.game.count(),
      prisma.review.count(),
      prisma.list.count(),
      prisma.comment.count(),
      prisma.vote.count(),
    ])

    // Get top games by review count
    const topGames = await prisma.game.findMany({
      take: 10,
      orderBy: {
        reviews: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    // Get top users by review count
    const topUsers = await prisma.user.findMany({
      take: 10,
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

    // Get top genres
    const allGames = await prisma.game.findMany({
      select: {
        genres: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    const genreStats = new Map<string, { gameCount: number; reviewCount: number }>()
    
    allGames.forEach(game => {
      game.genres.forEach(genre => {
        if (!genreStats.has(genre)) {
          genreStats.set(genre, { gameCount: 0, reviewCount: 0 })
        }
        const stats = genreStats.get(genre)!
        stats.gameCount++
        stats.reviewCount += game._count.reviews
      })
    })

    const topGenres = Array.from(genreStats.entries())
      .map(([genre, stats]) => ({
        genre,
        gameCount: stats.gameCount,
        reviewCount: stats.reviewCount,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 9)

    // Get recent activity
    const recentActivity = await Promise.all([
      // New users in time range
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      // New reviews in time range
      prisma.review.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      // New games in time range
      prisma.game.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      // New lists in time range
      prisma.list.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ])

    const activityData = [
      {
        type: 'USERS',
        description: 'New users joined',
        timestamp: now.toISOString(),
        count: recentActivity[0],
      },
      {
        type: 'REVIEWS',
        description: 'New reviews posted',
        timestamp: now.toISOString(),
        count: recentActivity[1],
      },
      {
        type: 'GAMES',
        description: 'New games added',
        timestamp: now.toISOString(),
        count: recentActivity[2],
      },
      {
        type: 'LISTS',
        description: 'New lists created',
        timestamp: now.toISOString(),
        count: recentActivity[3],
      },
    ]

    // Process top games data
    const processedTopGames = topGames.map(game => ({
      title: game.title,
      reviewCount: game._count.reviews,
      averageRating: game.reviews.length > 0
        ? game.reviews.reduce((acc, review) => acc + review.rating, 0) / game.reviews.length
        : 0,
    }))

    // Process top users data
    const processedTopUsers = topUsers.map(user => ({
      username: user.username,
      reviewCount: user._count.reviews,
      followerCount: user._count.followers,
    }))

    const analytics = {
      overview: {
        totalUsers,
        totalGames,
        totalReviews,
        totalLists,
        totalComments,
        totalVotes,
      },
      contentMetrics: {
        topGames: processedTopGames,
        topUsers: processedTopUsers,
        topGenres,
      },
      performance: {
        recentActivity: activityData,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
