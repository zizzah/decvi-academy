// middleware.ts - Fixed with proper role checking
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

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

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  const publicRoutes = ['/login', '/register', '/forgot-password', '/verify-email']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If no token and trying to access protected routes
  if (!token && !isPublicRoute) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If token exists, verify and check role
  if (token) {
    const payload = await verifyAndDecodeToken(token)
    
    // Invalid token - clear cookie and redirect to login
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Prevent authenticated users from accessing public routes
    if (isPublicRoute) {
      // Redirect based on role
      if (payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (payload.role === 'STUDENT') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Default to dashboard for other roles
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protect admin routes - only ADMIN role can access
    if (pathname.startsWith('/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Protect student dashboard - ADMIN should not access student dashboard
    if (pathname.startsWith('/dashboard')) {
      if (payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', 'auth/login', 'auth/register', 'auth/forgot-password', '/verify-email'],
}