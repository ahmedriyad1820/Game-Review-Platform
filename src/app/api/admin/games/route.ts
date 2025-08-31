import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/admin/games - List all games
export async function GET() {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session || !session.user.roles.includes('ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

// POST /api/admin/games - Create a new game
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session || !session.user.roles.includes('ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      descriptionMd,
      releaseDate,
      developer,
      publisher,
      genres,
      platforms,
      coverUrl,
      criticScore,
    } = body

    // Basic validation
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingGame = await prisma.game.findUnique({
      where: { slug },
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'A game with this slug already exists' },
        { status: 409 }
      )
    }

    // Validate and parse release date
    let parsedReleaseDate = null
    if (releaseDate && releaseDate.trim()) {
      const date = new Date(releaseDate)
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid release date format' },
          { status: 400 }
        )
      }
      parsedReleaseDate = date
    }

    // Create the game
    const game = await prisma.game.create({
      data: {
        title,
        slug,
        descriptionMd: descriptionMd || '',
        releaseDate: parsedReleaseDate,
        developer: developer || '',
        publisher: publisher || '',
        genres: genres || [],
        platforms: platforms || [],
        coverUrl: coverUrl || '',
        criticScore: criticScore ? parseFloat(criticScore) : null,
      },
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}
