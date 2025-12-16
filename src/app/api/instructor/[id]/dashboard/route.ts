// src/app/api/instructor/[id]/dashboard/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/instructor/:id/dashboard
 *
 * Fetches the dashboard data for an instructor including:
 * - Instructor profile
 * - Statistics (total classes, students, attendance, etc.)
 * - Upcoming classes
 * - Recent classes
 * - Pending project reviews
 *
 * @param {NextRequest} request - The request object from Next.js
 * @param {params} params - The route params object from Next.js
 * @param {string} params.id - The instructor ID
 *
 * @returns {NextResponse} - The response object from Next.js
 *
 * @throws {Error} If there is an error fetching the instructor's dashboard data.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: instructorId } = await params

    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
      include: {
        user: true,
      },
    })

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }

    // Get all classes taught by this instructor
    const allClasses = await prisma.class.findMany({
      where: { instructorId },
      include: {
        cohort: {
          select: {
            id: true,
            name: true,
            students: {
              select: { id: true }
            }
          }
        },
        attendance: true,
      },
      orderBy: { scheduledAt: 'desc' }
    })

    const now = new Date()

    // Separate upcoming and recent classes
    const upcomingClasses = allClasses
      .filter(c => new Date(c.scheduledAt) > now)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        classType: c.classType,
        deliveryMode: c.deliveryMode,
        scheduledAt: c.scheduledAt,
        duration: c.duration,
        cohort: {
          name: c.cohort.name
        },
        attendanceCount: c.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length,
        totalStudents: c.cohort.students.length,
        zoomLink: c.zoomLink,
        recordingUrl: c.recordingUrl,
      }))

    const recentClasses = allClasses
      .filter(c => new Date(c.scheduledAt) <= now)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        classType: c.classType,
        deliveryMode: c.deliveryMode,
        scheduledAt: c.scheduledAt,
        duration: c.duration,
        cohort: {
          name: c.cohort.name
        },
        attendanceCount: c.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length,
        totalStudents: c.cohort.students.length,
        recordingUrl: c.recordingUrl,
      }))

    // Calculate total unique students across all cohorts
    const cohortIds = [...new Set(allClasses.map(c => c.cohort.id))]
    const totalStudentsCount = await prisma.student.count({
      where: {
        cohortId: { in: cohortIds },
        enrollmentStatus: 'ACTIVE'
      }
    })

    // Calculate average attendance
    const totalAttendance = allClasses.reduce((sum, c) => {
      const attended = c.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length
      const total = c.cohort.students.length
      return sum + (total > 0 ? (attended / total) * 100 : 0)
    }, 0)
    const averageAttendance = allClasses.length > 0 
      ? Math.round(totalAttendance / allClasses.length) 
      : 0

    // Get pending projects for review
    const pendingProjects = await prisma.project.findMany({
      where: {
        status: { in: ['SUBMITTED', 'UNDER_REVIEW'] },
        student: {
          cohortId: { in: cohortIds }
        }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { submittedAt: 'asc' },
      take: 10
    })

    // Get feedback received
    const feedbackCount = await prisma.feedback.count({
      where: {
        instructorId,
        feedbackType: 'instructor'
      }
    })

    return NextResponse.json({
      instructor: {
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.user.email,
        expertise: instructor.expertise,
        bio: instructor.bio,
      },
      stats: {
        totalClasses: allClasses.length,
        upcomingClasses: upcomingClasses.length,
        totalStudents: totalStudentsCount,
        averageAttendance,
        projectsToReview: pendingProjects.length,
        feedbackReceived: feedbackCount,
      },
      upcomingClasses,
      recentClasses,
      pendingProjects: pendingProjects.map(p => ({
        id: p.id,
        title: p.title,
        student: {
          firstName: p.student.firstName,
          lastName: p.student.lastName,
        },
        submittedAt: p.submittedAt,
        monthNumber: p.monthNumber,
      })),
    })
  } catch (error) {
    console.error('Instructor dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}