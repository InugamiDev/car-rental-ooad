import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from './prisma'

export interface AuthUser {
  userId: string
  email: string
  role: string
  name: string
  licenseVerified: boolean
  pointsBalance: number
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const headersList = await headers()
    const userId = headersList.get('user-id')
    const role = headersList.get('user-role')

    if (!userId || !role) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return null
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      licenseVerified: user.licenseVerified,
      pointsBalance: user.pointsBalance
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

export function requireAuth(
  handler: (user: AuthUser, ...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]) => {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(user, ...args)
  }
}

export function requireRole(
  handler: (user: AuthUser, ...args: any[]) => Promise<NextResponse>,
  allowedRoles: string[]
) {
  return async (...args: any[]) => {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }

    return handler(user, ...args)
  }
}

export function isMerchant(user: AuthUser): boolean {
  return user.role === 'MERCHANT'
}

export function isAdmin(user: AuthUser): boolean {
  return user.role === 'ADMIN'
}

// Helper to create a protected route handler
export function createProtectedRouter(config: {
  handler: (user: AuthUser, ...args: any[]) => Promise<NextResponse>
  roles?: string[]
}) {
  if (config.roles) {
    return requireRole(config.handler, config.roles)
  }
  return requireAuth(config.handler)
}