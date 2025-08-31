import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(10).multipleOf(0.5, 'Rating must be in 0.5 increments').optional(),
  bodyMd: z.string().min(50, 'Review must be at least 50 characters long').max(2000, 'Review cannot exceed 2000 characters').optional(),
  pros: z.array(z.string().min(1, 'Pro cannot be empty')).min(1, 'At least one pro is required').optional(),
  cons: z.array(z.string().min(1, 'Con cannot be empty')).min(1, 'At least one con is required').optional(),
  playtimeHours: z.number().min(0, 'Playtime cannot be negative').optional(),
  containsSpoilers: z.boolean().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
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

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reviewId = params.id
    const body = await request.json()
    
    // Validate input
    const validatedData = updateReviewSchema.parse(body)
    
    // Get the existing review
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check if user owns the review or is admin
    if (existingReview.userId !== session.user.id && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...validatedData,
        updatedAt: new Date()
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

    return NextResponse.json(updatedReview)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reviewId = params.id
    
    // Get the existing review
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check if user owns the review or is admin
    if (existingReview.userId !== session.user.id && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    })

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
