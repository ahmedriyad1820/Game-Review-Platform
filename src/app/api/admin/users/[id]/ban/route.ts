import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/users/[id]/ban - Ban or unban a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { isBanned } = body

    if (typeof isBanned !== 'boolean') {
      return NextResponse.json(
        { error: 'isBanned must be a boolean value' },
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

    // Update the user's ban status
    const user = await prisma.user.update({
      where: { id },
      data: { isBanned },
    })

    return NextResponse.json({
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      user,
    })
  } catch (error) {
    console.error('Error updating user ban status:', error)
    return NextResponse.json(
      { error: 'Failed to update user ban status' },
      { status: 500 }
    )
  }
}
