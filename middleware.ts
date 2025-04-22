import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/cars', // GET only
]

// Routes that require merchant role
const merchantRoutes = [
  '/api/cars/create',
  '/api/cars/edit',
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // Special handling for /api/cars - only GET requests are public
  if (path === '/api/cars' && request.method === 'GET') {
    return NextResponse.next()
  }

  // Get token from cookie or Authorization header
  const token = request.cookies.get('auth_token')?.value ||
    request.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    )
  }

  try {
    // Verify token
    const decoded = verifyToken(token)

    // Check merchant routes
    if (merchantRoutes.includes(path) && decoded.role !== 'MERCHANT') {
      return NextResponse.json(
        { error: 'Forbidden - Merchant access required' },
        { status: 403 }
      )
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('user-id', decoded.userId)
    requestHeaders.set('user-role', decoded.role)

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: '/api/:path*',
}