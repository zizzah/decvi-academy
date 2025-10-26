
// ============================================
// 7. app/api/auth/register/route.ts - Registration API
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateVerificationToken } from '@/lib/auth'
import { studentRegistrationSchema } from '@/lib/validations'

/**
 * Registers a new user.
 *
 * @param {NextRequest} request - The request object from Next.js
 *
 * @returns {NextResponse} - The response object from Next.js
 *
 * @throws {Error} If there is an error registering the user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = studentRegistrationSchema.parse(body)
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Generate verification token
    const verificationToken = generateVerificationToken()
    
    // Create user and student profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash: hashedPassword,
        role: 'STUDENT',
        verificationToken,
        student: {
          create: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            phone: validatedData.phone,
            dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
            gender: validatedData.gender,
            educationLevel: validatedData.educationLevel,
            techInterests: validatedData.techInterests,
            priorExperience: validatedData.priorExperience,
            enrollmentStatus: 'PENDING',
          },
        },
      },
      include: {
        student: true,
      },
    })
    
    // TODO: Send verification email
    
    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
