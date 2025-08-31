import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    // Check if user is updating their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const bio = formData.get('bio') as string
    const avatarFile = formData.get('avatar') as File | null

    // Validate bio length
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Handle avatar upload if provided
    let avatarUrl = undefined
    
    if (avatarFile) {
      // Validate file type
      if (!avatarFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        )
      }

      // For now, we'll store the file as base64
      // In production, you'd want to upload to a cloud storage service
      const arrayBuffer = await avatarFile.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mimeType = avatarFile.type
      avatarUrl = `data:${mimeType};base64,${base64}`
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        bio: bio || null,
        ...(avatarUrl && { avatarUrl }),
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        lastLogin: true,
        roles: true,
        isVerified: true,
        _count: {
          select: {
            reviews: true,
            followers: true,
            following: true,
          }
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
