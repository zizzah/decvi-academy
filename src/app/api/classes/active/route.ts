// ============================================
// app/api/classes/active/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers' // or your auth method

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user's student profile
    // Adjust this based on your auth implementation
    const session = await getCurrentUser()  
    
    if (!session?.userId || session.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get student with their cohort
    const student = await prisma.student.findUnique({
      where: { userId: session.userId },
      select: {
        id: true,
        cohortId: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }
    
    // Removed early return if no cohort assigned

    // Get classes for the student's cohort scheduled for today
    const now = new Date()

    // Calculate start and end of current day (local time)
    const startOfDay = new Date(now);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23,59,59,999);

    // Get regular classes
    const regularClasses = student.cohortId ? await prisma.class.findMany({
      where: {
        AND: [
          { cohortId: student.cohortId }
        ],
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        cohort: {
          select: {
            name: true,
          },
        },
        // Check if student already checked in
        attendance: {
          where: {
            studentId: student.id,
          },
          select: {
            id: true,
            status: true,
            checkInTime: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    }) : []

    // Get live classes for the student's cohort if cohortId exists,
    // else get all live classes today with status scheduled or live
    const liveClasses = await prisma.liveClass.findMany({
      where: {
        AND: [
          student.cohortId ? {
            OR: [
              { cohortId: student.cohortId },
              { cohortId: null }
            ],
          } : {},
          {
            status: { in: ['SCHEDULED', 'LIVE'] }
          }
        ],
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        cohort: {
          select: {
            name: true,
          },
        },
        // Check if student is enrolled
        enrollments: {
          where: {
            studentId: student.id,
          },
          select: {
            id: true,
            attended: true,
            joinedAt: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    })

    // Format regular classes
    const formattedRegularClasses = regularClasses.map(cls => ({
      id: cls.id,
      title: cls.title,
      description: cls.description,
      classType: cls.classType,
      deliveryMode: cls.deliveryMode,
      scheduledAt: cls.scheduledAt,
      duration: cls.duration,
      topic: cls.topic,
      monthNumber: cls.monthNumber,
      weekNumber: cls.weekNumber,
      instructor: `${cls.instructor.firstName} ${cls.instructor.lastName}`,
      cohort: cls.cohort.name,
      zoomLink: cls.zoomLink,
      hasCheckedIn: cls.attendance.length > 0,
      attendanceStatus: cls.attendance[0]?.status,
      checkInTime: cls.attendance[0]?.checkInTime,
      isLiveClass: false,
    }))

    // Format live classes
    const formattedLiveClasses = liveClasses.map(cls => ({
      id: cls.id,
      title: cls.title,
      description: cls.description,
      classType: 'LIVE_CLASS',
      deliveryMode: 'ZOOM', // Assuming live classes are online
      scheduledAt: cls.scheduledAt,
      duration: cls.duration,
      topic: cls.title, // Use title as topic
      monthNumber: null,
      weekNumber: null,
      instructor: `${cls.instructor.firstName} ${cls.instructor.lastName}`,
      cohort: cls.cohort?.name || 'General',
      zoomLink: cls.meetingLink,
      hasCheckedIn: cls.enrollments.length > 0 && cls.enrollments[0].attended,
      attendanceStatus: cls.enrollments.length > 0 && cls.enrollments[0].attended ? 'PRESENT' : null,
      checkInTime: cls.enrollments[0]?.joinedAt,
      isLiveClass: true,
      status: cls.status,
    }))

    // Combine and sort all classes
    const allClasses = [...formattedRegularClasses, ...formattedLiveClasses]
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

    return NextResponse.json({
      classes: allClasses,
      studentId: student.id
    })
  } catch (error) {
    console.error('Failed to fetch active classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}