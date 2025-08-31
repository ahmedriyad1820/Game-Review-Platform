'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Shield, Gamepad2, Users, Star, BarChart3, Settings, AlertTriangle, TrendingUp } from 'lucide-react'

export function AdminStatsSection() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.roles?.includes('ADMIN')

  if (!isAdmin) return null

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Platform overview and quick access to management tools
          </p>
        </div>

        {/* Admin Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-background border border-primary/20 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">7 Games</h3>
            <p className="text-sm text-muted-foreground mb-4">Total in catalog</p>
            <Link href="/admin/games">
              <Button size="sm" variant="outline" className="w-full">
                Manage Games
              </Button>
            </Link>
          </div>

          <div className="bg-background border border-secondary/20 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">6 Users</h3>
            <p className="text-sm text-muted-foreground mb-4">Registered members</p>
            <Link href="/admin/users">
              <Button size="sm" variant="outline" className="w-full">
                Manage Users
              </Button>
            </Link>
          </div>

          <div className="bg-background border border-green-500/20 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">5 Reviews</h3>
            <p className="text-sm text-muted-foreground mb-4">Community reviews</p>
            <Link href="/admin/reviews">
              <Button size="sm" variant="outline" className="w-full">
                Manage Reviews
              </Button>
            </Link>
          </div>

          <div className="bg-background border border-orange-500/20 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">0 Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">Pending issues</p>
            <Link href="/admin/reports">
              <Button size="sm" variant="outline" className="w-full">
                View Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <Link href="/admin">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Settings className="mr-2 h-5 w-5" />
                Full Admin Panel
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button size="lg" variant="outline">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button size="lg" variant="outline">
                <Settings className="mr-2 h-5 w-5" />
                Platform Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
