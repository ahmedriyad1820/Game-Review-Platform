import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        passwordHash: hashedPassword,
        roles: ['USER'],
        isVerified: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        isVerified: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
