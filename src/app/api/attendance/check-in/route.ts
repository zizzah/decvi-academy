// ============================================
// 14. app/api/attendance/check-in/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, classId, method, qrCode, latitude, longitude } = body

    // Validate class exists and is happening now
    const classSession = await prisma.class.findUnique({
      where: { id: classId },
    })

    if (!classSession) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Check if QR code method
    if (method === 'QR_CODE' && qrCode) {
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
        { error: 'Already checked in' },
        { status: 400 }
      )
    }

    // Calculate if late
    const checkInTime = new Date()
    const scheduledTime = new Date(classSession.scheduledAt)
    const lateMinutes = Math.max(
      0,
      Math.floor((checkInTime.getTime() - scheduledTime.getTime()) / (1000 * 60))
    )

    const status = lateMinutes > 15 ? 'LATE' : 'PRESENT'

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
    if (status === 'PRESENT') {
      await prisma.student.update({
        where: { id: studentId },
        data: {
          totalPoints: { increment: 10 },
          lastActivityDate: new Date(),
        },
      })
    }

    return NextResponse.json({
      message: 'Checked in successfully',
      attendance,
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}
