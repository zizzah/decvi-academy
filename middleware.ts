
// ============================================
// 6. middleware.ts - Next.js Middleware
// ============================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * This middleware function checks if the user has a valid auth token.
 * If the user doesn't have a valid token and is trying to access a protected route,
 * it will redirect the user to the login page.
 * If the user has a valid token and is trying to access an auth page,
 * it will redirect the user to the dashboard page.
 * @param {NextRequest} request - The request object from Next.js
 * @returns {NextResponse} - The response object from Next.js
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/verify-email']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If no token and trying to access protected route
  if (!token && !isPublicRoute && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If has token and trying to access auth pages
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password'],
}