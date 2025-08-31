import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      }
    })
    
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json(
        { error: 'Account has been banned' },
        { status: 403 }
      )
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        isVerified: user.isVerified,
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
