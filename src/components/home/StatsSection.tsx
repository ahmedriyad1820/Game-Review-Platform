'use client'

import { Users, Gamepad2, Star, TrendingUp } from 'lucide-react'

const stats = [
  {
    name: 'Active Users',
    value: '50K+',
    description: 'Gamers actively using the platform',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Games Catalog',
    value: '5K+',
    description: 'Games available for review',
    icon: Gamepad2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Reviews Written',
    value: '10K+',
    description: 'Community reviews and ratings',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    name: 'Monthly Growth',
    value: '25%',
    description: 'Platform growth rate',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Platform Statistics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our community is growing and contributing to the ultimate game discovery experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-background rounded-lg p-6 text-center border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {stat.value}
              </h3>
              
              <h4 className="font-semibold text-foreground mb-2">
                {stat.name}
              </h4>
              
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
