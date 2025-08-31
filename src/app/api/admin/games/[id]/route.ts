import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/games/[id] - Update a game
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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

    // Check if slug already exists for a different game
    const existingGame = await prisma.game.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'A game with this slug already exists' },
        { status: 409 }
      )
    }

    // Update the game
    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        slug,
        descriptionMd: descriptionMd || '',
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        developer: developer || '',
        publisher: publisher || '',
        genres: genres || [],
        platforms: platforms || [],
        coverUrl: coverUrl || '',
        criticScore: criticScore ? parseFloat(criticScore) : null,
      },
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error updating game:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/games/[id] - Delete a game
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reviews: true,
            lists: true,
          },
        },
      },
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Check if game has associated content
    if (game._count.reviews > 0 || game._count.lists > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete game with associated reviews or lists. Please remove all associated content first.' 
        },
        { status: 400 }
      )
    }

    // Delete the game
    await prisma.game.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Game deleted successfully' })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}
