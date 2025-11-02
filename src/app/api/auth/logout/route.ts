// ============================================
// app/api/auth/logout/route.ts - Logout API
// ============================================

import { NextRequest, NextResponse } from 'next/server'

/**
 * Logout API.
 * 
 * This API logs a user out by clearing the auth token cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
    })
    
    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}