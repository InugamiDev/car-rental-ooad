import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'
import { hashPassword, verifyPassword } from '@/lib/auth'

interface UpdateProfileRequest {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  licenseNumber?: string
  businessName?: string // For merchants
}

export async function GET(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        licenseNumber: true,
        licenseVerified: true,
        pointsBalance: true,
        merchantProfile: {
          select: {
            businessName: true,
            verified: true
          }
        },
        rentals: {
          select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            pointsEarned: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        pointsHistory: {
          select: {
            points: true,
            type: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!profile) {
      throw new ApiError('Profile not found', 404)
    }

    return NextResponse.json(profile)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const body: UpdateProfileRequest = await request.json()

    // Validate password change
    if (body.newPassword) {
      if (!body.currentPassword) {
        throw new ApiError('Current password is required', 400)
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId }
      })

      if (!currentUser) {
        throw new ApiError('User not found', 404)
      }

      const validPassword = await verifyPassword(
        body.currentPassword,
        currentUser.password
      )

      if (!validPassword) {
        throw new ApiError('Current password is incorrect', 400)
      }

      if (body.newPassword.length < 8) {
        throw new ApiError('New password must be at least 8 characters long', 400)
      }

      body.newPassword = await hashPassword(body.newPassword)
    }

    // Build update data
    const updateData: any = {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
      ...(body.newPassword && { password: body.newPassword }),
      ...(body.licenseNumber && { licenseNumber: body.licenseNumber })
    }

    // Handle merchant profile update
    if (user.role === 'MERCHANT' && body.businessName) {
      await prisma.merchant.upsert({
        where: {
          userId: user.userId
        },
        create: {
          userId: user.userId,
          businessName: body.businessName,
          verified: false
        },
        update: {
          businessName: body.businessName
        }
      })
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        licenseNumber: true,
        licenseVerified: true,
        pointsBalance: true,
        merchantProfile: {
          select: {
            businessName: true,
            verified: true
          }
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return handleApiError(error)
  }
}