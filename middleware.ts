// middleware.ts - Updated with instructor route protection
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Verifies a JWT token and decodes its payload if valid.
 * Returns the payload if the token is valid, otherwise returns null.
 * @param {string} token - The JWT token to verify and decode.
 * @returns {Promise<{ userId: string, email: string, role: string } | null>}
 * @throws {Error} If there is an error verifying the token.
 */
async function verifyAndDecodeToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    )
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string; email: string; role: string }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Middleware to protect routes based on authentication and role.
 * Verifies a JWT token and decodes its payload if valid.
 * Redirects users to login if no token or invalid token.
 * Redirects authenticated users to their respective dashboard based on role.
 * Protects admin and instructor routes from unauthorized access.
 * @param {NextRequest} request - The request object from Next.js.
 * @returns {Promise<NextResponse>} - The response object from Next.js.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  const publicRoutes = ['auth/login', 'auth/register', 'auth/forgot-password', '/verify-email']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If no token and trying to access protected routes
  if (!token && !isPublicRoute) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/instructor')) {
      return NextResponse.redirect(new URL('auth/login', request.url))
    }
  }

  // If token exists, verify and check role
  if (token) {
    const payload = await verifyAndDecodeToken(token)
    
    // Invalid token - clear cookie and redirect to login
    if (!payload) {
      const response = NextResponse.redirect(new URL('auth/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Prevent authenticated users from accessing public routes
    if (isPublicRoute) {
      // Redirect based on role
      if (payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (payload.role === 'INSTRUCTOR') {
        return NextResponse.redirect(new URL('/instructor', request.url))
      } else if (payload.role === 'STUDENT') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Default to dashboard for other roles
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protect admin routes - only ADMIN role can access
    if (pathname.startsWith('/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // Protect instructor routes - only INSTRUCTOR role can access
    if (pathname.startsWith('/instructor')) {
      if (payload.role !== 'INSTRUCTOR') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // Protect student dashboard - ADMIN and INSTRUCTOR should not access student dashboard
    if (pathname.startsWith('/dashboard')) {
      if (payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (payload.role === 'INSTRUCTOR') {
        return NextResponse.redirect(new URL('/instructor', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/instructor/:path*',
    '/auth/login', 
    '/auth/register', 
    '/auth/forgot-password', 
    '/verify-email'
  ],
}