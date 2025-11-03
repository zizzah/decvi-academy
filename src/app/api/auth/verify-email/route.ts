import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired (24 hours)
    const now = new Date()
    if (now > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })

      return NextResponse.json(
        { success: false, error: 'Verification link has expired. Please register again.' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.isVerified) {
      // Delete the token
      await prisma.verificationToken.delete({
        where: { token },
      })

      return NextResponse.json(
        { success: true, message: 'Email already verified' }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Send welcome email
    await sendWelcomeEmail(user.email,  'Student')

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during verification' },
      { status: 500 }
    )
  }
}