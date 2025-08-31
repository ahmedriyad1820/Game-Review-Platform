import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/reviews/[id]/status - Update review status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validate status
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED, REJECTED, or PENDING' },
        { status: 400 }
      )
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Update the review status
    const review = await prisma.review.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      message: `Review status updated to ${status}`,
      review,
    })
  } catch (error) {
    console.error('Error updating review status:', error)
    return NextResponse.json(
      { error: 'Failed to update review status' },
      { status: 500 }
    )
  }
}
