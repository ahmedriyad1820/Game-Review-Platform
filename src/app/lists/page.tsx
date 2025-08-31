import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getLists() {
  try {
    const lists = await prisma.list.findMany({
      where: { visibility: 'PUBLIC' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        items: {
          include: {
            game: {
              select: {
                title: true,
                coverUrl: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    return lists
  } catch (error) {
    console.error('Error fetching lists:', error)
    return []
  }
}

export default async function ListsPage() {
  const lists = await getLists()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Game Lists
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover curated game collections created by our community members
          </p>
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div>Loading lists...</div>}>
            {lists.map((list) => (
              <div key={list.id} className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                    {list.user.avatarUrl ? (
                      <img 
                        src={list.user.avatarUrl} 
                        alt={list.user.username}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {list.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">by</p>
                    <p className="font-semibold text-foreground">{list.user.username}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-foreground text-lg mb-2">{list.title}</h3>
                {list.description && (
                  <p className="text-muted-foreground text-sm mb-4">{list.description}</p>
                )}

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {list.items.length} game{list.items.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {list.items.slice(0, 3).map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/games/${item.game.slug}`}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                      >
                        {item.game.title}
                      </Link>
                    ))}
                    {list.items.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{list.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </Suspense>
        </div>

        {lists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No public lists found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
