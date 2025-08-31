'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Gamepad2, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  List
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalGames: number
    totalReviews: number
    totalLists: number
    totalComments: number
    totalVotes: number
  }
  userGrowth: {
    date: string
    newUsers: number
    activeUsers: number
  }[]
  contentMetrics: {
    topGames: {
      title: string
      reviewCount: number
      averageRating: number
    }[]
    topUsers: {
      username: string
      reviewCount: number
      followerCount: number
    }[]
    topGenres: {
      genre: string
      gameCount: number
      reviewCount: number
    }[]
  }
  performance: {
    recentActivity: {
      type: string
      description: string
      timestamp: string
      count: number
    }[]
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load analytics data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Platform Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your gaming platform's performance
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.overview.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.overview.totalGames.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Games</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.overview.totalReviews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <List className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.overview.totalLists.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Lists</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.overview.totalComments.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Comments</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.overview.totalVotes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Votes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Games */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Games by Reviews</h3>
            <div className="space-y-3">
              {analytics.contentMetrics.topGames.map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{game.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {game.reviewCount} reviews • {game.averageRating.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {analytics.contentMetrics.topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.reviewCount} reviews • {user.followerCount} followers
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Genres */}
        <div className="bg-background border rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Popular Genres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.contentMetrics.topGenres.map((genre, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{genre.genre}</h4>
                  <span className="text-sm text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Games:</span>
                    <span className="text-foreground">{genre.gameCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reviews:</span>
                    <span className="text-foreground">{genre.reviewCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Platform Activity</h3>
          <div className="space-y-3">
            {analytics.performance.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{activity.count}</span>
                  <span className="text-xs text-muted-foreground">{activity.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
