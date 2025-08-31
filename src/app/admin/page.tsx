import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import AuthWrapper from '@/components/admin/AuthWrapper'
import Link from 'next/link'
import { 
  Gamepad2, 
  Users, 
  Star, 
  List, 
  Settings, 
  BarChart3, 
  Shield,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

async function getAdminStats() {
  try {
    const [userCount, reviewCount, gameCount, listCount, pendingReports] = await Promise.all([
      prisma.user.count(),
      prisma.review.count(),
      prisma.game.count(),
      prisma.list.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ])

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        isVerified: true,
        isBanned: true,
      },
    })

    const recentGames = await prisma.game.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        _count: { select: { reviews: true } },
      },
    })

    return {
      userCount,
      reviewCount,
      gameCount,
      listCount,
      pendingReports,
      recentUsers,
      recentGames,
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      userCount: 0,
      reviewCount: 0,
      gameCount: 0,
      listCount: 0,
      pendingReports: 0,
      recentUsers: [],
      recentGames: [],
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your gaming platform, users, content, and settings
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.userCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.gameCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.reviewCount}</p>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingReports}</p>
                  <p className="text-sm text-muted-foreground">Pending Reports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/games" className="group">
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group-hover:border-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Gamepad2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Manage Games
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, and delete games
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/users" className="group">
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group-hover:border-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Manage Users
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      User management and moderation
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/reviews" className="group">
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group-hover:border-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Manage Reviews
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Review moderation and management
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/reports" className="group">
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group-hover:border-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Handle Reports
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Review and resolve user reports
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/analytics" className="group">
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group-hover:border-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Platform statistics and insights
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/settings" className="group">
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group-hover:border-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Platform Settings
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Configure platform options
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Users</h3>
                <Link href="/admin/users" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.isVerified && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Verified
                        </span>
                      )}
                      {user.isBanned && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Banned
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Games */}
            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Games</h3>
                <Link href="/admin/games" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentGames.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Gamepad2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{game.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {game._count.reviews} reviews
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
