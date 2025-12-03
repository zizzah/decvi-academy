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

    // Check if it's a regular class first
    let classSession = await prisma.class.findUnique({
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

    let isLiveClass = false
    let liveClassSession = null

    // If not found in regular classes, check live classes
    if (!classSession) {
      liveClassSession = await prisma.liveClass.findUnique({
        where: { id: classId },
        include: {
          cohort: {
            select: {
              id: true,
              name: true,
            },
          },
          enrollments: {
            where: { studentId: studentId },
            select: { id: true, attended: true, joinedAt: true }
          }
        },
      })

      if (liveClassSession) {
        isLiveClass = true
        classSession = {
          id: liveClassSession.id,
          cohortId: liveClassSession.cohortId || '',
          scheduledAt: liveClassSession.scheduledAt,
          duration: liveClassSession.duration,
          title: liveClassSession.title,
          topic: liveClassSession.title,
          cohort: liveClassSession.cohort || { id: '', name: 'General' }
        } as {
          id: string;
          cohortId: string;
          scheduledAt: Date;
          duration: number;
          title: string;
          topic: string;
          cohort: { id: string; name: string };
        }
      }
    }

    if (!classSession) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Validate student is in the same cohort as the class (for regular classes)
    if (!isLiveClass && student.cohortId !== classSession.cohortId) {
      return NextResponse.json(
        { error: 'You are not enrolled in this class cohort' },
        { status: 403 }
      )
    }

    // For live classes, allow check-in for any student - create enrollment if not exists
    if (isLiveClass && liveClassSession) {
      const isEnrolled = liveClassSession.enrollments.length > 0

      if (!isEnrolled) {
        await prisma.liveClassEnrollment.create({
          data: {
            liveClassId: classId,
            studentId: studentId,
            enrolledAt: new Date()
          }
        })
        // Refresh the liveClassSession to include the new enrollment
        liveClassSession = await prisma.liveClass.findUnique({
          where: { id: classId },
          include: {
            cohort: { select: { id: true, name: true } },
            enrollments: { where: { studentId: studentId }, select: { id: true, attended: true, joinedAt: true } }
          }
        })
      }
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
    let existingAttendance = null
    let existingLiveEnrollment = null

    if (isLiveClass && liveClassSession) {
      // For live classes, check enrollment attendance
      existingLiveEnrollment = liveClassSession.enrollments[0]
      if (existingLiveEnrollment && existingLiveEnrollment.attended) {
        return NextResponse.json(
          {
            error: 'Already checked in',
            attendance: {
              status: 'PRESENT',
              checkInTime: existingLiveEnrollment.joinedAt,
              lateMinutes: 0,
            }
          },
          { status: 400 }
        )
      }
    } else {
      // For regular classes, check attendance table
      existingAttendance = await prisma.attendance.findUnique({
        where: {
          studentId_classId: { studentId, classId },
        },
      })

      if (existingAttendance) {
        return NextResponse.json(
          {
            error: 'Already checked in',
            attendance: {
              status: existingAttendance.status,
              checkInTime: existingAttendance.checkInTime,
              lateMinutes: existingAttendance.lateMinutes,
            }
          },
          { status: 400 }
        )
      }
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

    let attendanceRecord

    if (isLiveClass) {
      // For live classes, update the enrollment record
      attendanceRecord = await prisma.liveClassEnrollment.update({
        where: {
          liveClassId_studentId: {
            liveClassId: classId,
            studentId: studentId
          }
        },
        data: {
          attended: true,
          joinedAt: checkInTime,
          durationMins: Math.floor((new Date().getTime() - checkInTime.getTime()) / (1000 * 60))
        },
      })
    } else {
      // For regular classes, create attendance record
      attendanceRecord = await prisma.attendance.create({
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
    }

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
        id: isLiveClass ? attendanceRecord.id : attendanceRecord.id,
        status: status,
        checkInTime: checkInTime,
        lateMinutes: lateMinutes,
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

    // Check if already checked in (for regular classes)
    let attendance = await prisma.attendance.findUnique({
      where: {
        studentId_classId: { studentId, classId },
      },
    })

    // If no attendance found and it might be a live class, check live class enrollment
    if (!attendance) {
      const liveClass = await prisma.liveClass.findUnique({
        where: { id: classId },
        include: {
          enrollments: {
            where: { studentId: studentId },
            select: { attended: true, joinedAt: true }
          }
        },
      })

      if (liveClass && liveClass.enrollments.length > 0) {
        const enrollment = liveClass.enrollments[0]
        return NextResponse.json({
          hasCheckedIn: enrollment.attended,
          attendance: enrollment.attended ? {
            status: 'PRESENT',
            checkInTime: enrollment.joinedAt,
            lateMinutes: 0,
          } : null,
        })
      }
    }

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
