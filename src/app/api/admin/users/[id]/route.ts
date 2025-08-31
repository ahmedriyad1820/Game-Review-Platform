import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/users/[id] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      username,
      email,
      bio,
      roles,
      isVerified,
      isBanned,
    } = body

    // Basic validation
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      )
    }

    // Check if username already exists for a different user
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: { not: id },
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this username already exists' },
        { status: 409 }
      )
    }

    // Check if email already exists for a different user
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    // Update the user
    const user = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        bio: bio || '',
        roles: roles || ['USER'],
        isVerified: isVerified || false,
        isBanned: isBanned || false,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reviews: true,
            lists: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has associated content
    if (user._count.reviews > 0 || user._count.lists > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete user with associated reviews or lists. Please remove all associated content first.' 
        },
        { status: 400 }
      )
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
