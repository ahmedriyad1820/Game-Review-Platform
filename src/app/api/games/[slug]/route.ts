import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    const game = await prisma.game.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        descriptionMd: true,
        releaseDate: true,
        developer: true,
        publisher: true,
        genres: true,
        tags: true,
        platforms: true,
        coverUrl: true,
        screenshots: true,
        trailerUrl: true,
        systemRequirements: true,
        esrbRating: true,
        metacriticUrl: true,
        criticScore: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
