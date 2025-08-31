import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
  rating: z.number().min(1).max(10).multipleOf(0.5, 'Rating must be in 0.5 increments'),
  bodyMd: z.string().min(50, 'Review must be at least 50 characters long').max(2000, 'Review cannot exceed 2000 characters'),
  pros: z.array(z.string().min(1, 'Pro cannot be empty')).min(1, 'At least one pro is required'),
  cons: z.array(z.string().min(1, 'Con cannot be empty')).min(1, 'At least one con is required'),
  playtimeHours: z.number().min(0, 'Playtime cannot be negative').optional(),
  containsSpoilers: z.boolean().default(false)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createReviewSchema.parse(body)
    
    // Check if user already has a review for this game
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        gameId: validatedData.gameId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You already have a review for this game. You can edit your existing review instead.' },
        { status: 400 }
      )
    }

    // Verify the game exists
    const game = await prisma.game.findUnique({
      where: { id: validatedData.gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        gameId: validatedData.gameId,
        rating: validatedData.rating,
        bodyMd: validatedData.bodyMd,
        pros: validatedData.pros,
        cons: validatedData.cons,
        playtimeHours: validatedData.playtimeHours || null,
        containsSpoilers: validatedData.containsSpoilers
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverUrl: true
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const gameId = searchParams.get('gameId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || 'PUBLISHED'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (gameId) {
      where.gameId = gameId
    }
    
    if (userId) {
      where.userId = userId
    }
    
    if (status) {
      where.status = status
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          game: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverUrl: true
            }
          }
        }
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
