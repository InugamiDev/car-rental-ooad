import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, getAuthCookieOptions } from '@/lib/auth'

interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: 'USER' | 'MERCHANT' | 'ADMIN'
  licenseNumber?: string
}

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, name, role = 'USER', licenseNumber } = body

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        ...(licenseNumber && { licenseNumber })
      }
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Create response with cookie
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      { status: 201 }
    )

    // Set auth cookie
    response.cookies.set(getAuthCookieOptions(token))

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}