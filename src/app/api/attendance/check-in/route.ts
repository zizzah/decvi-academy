// ============================================
// app/api/attendance/check-in/route.ts (IMPROVED)
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getCurrentUser()
    if (!session?.userId || session.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get authenticated student
    const authStudent = await prisma.student.findUnique({
      where: { userId: session.userId },
      select: { id: true, cohortId: true, firstName: true, lastName: true },
    })

    if (!authStudent) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { classId, method, qrCode, latitude, longitude } = body
    const studentId = authStudent.id // Use authenticated student's ID

    // Validate required fields
    if (!classId || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get student with cohort info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        cohortId: true,
        firstName: true,
        lastName: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Validate class exists and get full details
    const classSession = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        cohort: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!classSession) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Validate student is in the same cohort as the class
    if (student.cohortId !== classSession.cohortId) {
      return NextResponse.json(
        { error: 'You are not enrolled in this class cohort' },
        { status: 403 }
      )
    }

    // Check if class is happening now (within reasonable timeframe)
    const now = new Date()
    const scheduledTime = new Date(classSession.scheduledAt)
    const classEndTime = new Date(scheduledTime.getTime() + classSession.duration * 60 * 1000)
    const thirtyMinutesBefore = new Date(scheduledTime.getTime() - 30 * 60 * 1000)
    const fourHoursAfterStart = new Date(scheduledTime.getTime() + 4 * 60 * 60 * 1000)

    if (now < thirtyMinutesBefore) {
      return NextResponse.json(
        { error: 'Check-in opens 30 minutes before class starts' },
        { status: 400 }
      )
    }

    if (now > fourHoursAfterStart) {
      return NextResponse.json(
        { error: 'Check-in period has ended for this class' },
        { status: 400 }
      )
    }

    // Check if QR code method
    if (method === 'QR_CODE') {
      if (!qrCode) {
        return NextResponse.json(
          { error: 'QR code is required for QR_CODE method' },
          { status: 400 }
        )
      }

      const validQR = await prisma.attendanceQRCode.findFirst({
        where: {
          classId,
          code: qrCode,
          isActive: true,
          expiresAt: { gte: new Date() },
        },
      })

      if (!validQR) {
        return NextResponse.json(
          { error: 'Invalid or expired QR code' },
          { status: 400 }
        )
      }
    }

    // Check if already checked in
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_classId: { studentId, classId },
      },
    })

    if (existing) {
      return NextResponse.json(
        { 
          error: 'Already checked in',
          attendance: {
            status: existing.status,
            checkInTime: existing.checkInTime,
            lateMinutes: existing.lateMinutes,
          }
        },
        { status: 400 }
      )
    }

    // Calculate if late
    const checkInTime = new Date()
    const lateMinutes = Math.max(
      0,
      Math.floor((checkInTime.getTime() - scheduledTime.getTime()) / (1000 * 60))
    )

    // Determine status
    let status: 'PRESENT' | 'LATE' | 'ABSENT'
    if (lateMinutes > 15) {
      status = 'LATE'
    } else {
      status = 'PRESENT'
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        classId,
        status,
        method,
        checkInTime,
        lateMinutes,
        latitude,
        longitude,
      },
    })

    // Award points for attendance
    const pointsAwarded = status === 'PRESENT' ? 10 : status === 'LATE' ? 5 : 0
    
    if (pointsAwarded > 0) {
      await prisma.student.update({
        where: { id: studentId },
        data: {
          totalPoints: { increment: pointsAwarded },
          lastActivityDate: new Date(),
        },
      })
    }

    // Return success response with details
    return NextResponse.json({
      message: `Checked in successfully as ${status}`,
      attendance: {
        id: attendance.id,
        status: attendance.status,
        checkInTime: attendance.checkInTime,
        lateMinutes: attendance.lateMinutes,
        pointsAwarded,
      },
      class: {
        title: classSession.title,
        topic: classSession.topic,
        cohort: classSession.cohort.name,
      },
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to check in. Please try again.' },
      { status: 500 }
    )
  }
}

// ============================================
// GET endpoint to check if student can check in
// ============================================
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getCurrentUser()
    if (!session?.userId || session.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get authenticated student
    const authStudent = await prisma.student.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    })

    if (!authStudent) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const studentId = authStudent.id // Use authenticated student's ID

    if (!classId) {
      return NextResponse.json(
        { error: 'Missing classId' },
        { status: 400 }
      )
    }

    // Check if already checked in
    const attendance = await prisma.attendance.findUnique({
      where: {
        studentId_classId: { studentId, classId },
      },
    })

    return NextResponse.json({
      hasCheckedIn: !!attendance,
      attendance: attendance || null,
    })
  } catch (error) {
    console.error('Check-in status error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
