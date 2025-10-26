
// ============================================
// 8. app/api/auth/login/route.ts - Login API
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

/**
 * Login API.
 * 
 * This API logs a user in and returns a JWT token if the login is successful.
 * The token is set as a HTTP-only cookie with a max age of 7 days.
 * 
 * @param {NextRequest} request - The request object from Next.js
 * @returns {NextResponse} - The response object from Next.js
 * 
 * @throws {Error} If there is an error logging the user in.
 * @throws {ZodError} If there is a validation error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        student: true,
        instructor: true,
        admin: true,
      },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.passwordHash
    )
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      )
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    
    // Create response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.student || user.instructor || user.admin,
      },
    })
    
    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return response
  } catch (error: unknown) {
    console.error('Login error:', error)
    
    // Safely handle ZodError type check
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as Record<string, unknown>)['name'] === 'ZodError' &&
      Array.isArray((error as Record<string, unknown>)['errors'])
    ) {
      const zodError = error as unknown as { errors: unknown[] }
      return NextResponse.json(
        { error: 'Validation error', details: zodError.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

