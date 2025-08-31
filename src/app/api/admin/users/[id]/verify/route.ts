import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/users/[id]/verify - Verify or unverify a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { isVerified } = body

    if (typeof isVerified !== 'boolean') {
      return NextResponse.json(
        { error: 'isVerified must be a boolean value' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update the user's verification status
    const user = await prisma.user.update({
      where: { id },
      data: { isVerified },
    })

    return NextResponse.json({
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user,
    })
  } catch (error) {
    console.error('Error updating user verification status:', error)
    return NextResponse.json(
      { error: 'Failed to update user verification status' },
      { status: 500 }
    )
  }
}
