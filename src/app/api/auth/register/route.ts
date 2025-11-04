import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateVerificationToken } from '@/lib/auth'
import { studentRegistrationSchema } from '@/lib/validations'
import { sendVerificationEmail } from '@/lib/email'

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
    
    // Create verification token in database
    try {
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      })
      
      console.log('✅ Verification token created successfully')
    } catch (tokenError) {
      console.error('❌ Error creating verification token:', tokenError)
      // Don't fail the registration, but log the error
    }
    
    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(user.email, verificationToken)
      
      if (!emailResult.success) {
        console.error('❌ Failed to send verification email:', emailResult.error)
      } else {
        console.log('✅ Verification email sent successfully')
      }
    } catch (emailError) {
      console.error('❌ Error sending verification email:', emailError)
    }
    
    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('❌ Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as unknown as { name: string; errors: unknown[] }
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