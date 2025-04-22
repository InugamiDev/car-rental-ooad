import { NextResponse } from 'next/server'
import { getAuthClearCookieOptions } from '@/lib/auth'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    
    // Clear auth cookie
    response.cookies.set(getAuthClearCookieOptions())
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}