// src/app/api/instructor/classes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireInstructor } from '@/lib/instructor-auth'
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';

/**
 * GET /api/instructor/classes
 * Fetches all classes for the authenticated instructor
 */
export async function GET(request: NextRequest) {
  const authError = await requireInstructor()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // 'upcoming', 'completed', 'all'
  const instructorId = searchParams.get('instructorId')

  if (!instructorId) {
    return NextResponse.json(
      { error: 'Instructor ID required' },
      { status: 400 }
    )
  }

  try {
    const now = new Date()
    const where = {
      instructorId,
      ...(status === 'upcoming' && { scheduledAt: { gte: now } }),
      ...(status === 'completed' && { scheduledAt: { lt: now } })
    }

    const classes = await prisma.class.findMany({
      where,
      include: {
        cohort: {
          select: {
            name: true,
            students: { select: { id: true } }
          }
        },
        attendance: {
          select: {
            status: true,
            student: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { scheduledAt: status === 'upcoming' ? 'asc' : 'desc' }
    })

    const formattedClasses = classes.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      classType: c.classType,
      deliveryMode: c.deliveryMode,
      topic: c.topic,
      monthNumber: c.monthNumber,
      weekNumber: c.weekNumber,
      scheduledAt: c.scheduledAt,
      duration: c.duration,
      zoomLink: c.zoomLink,
      recordingUrl: c.recordingUrl,
      materialsUrl: c.materialsUrl,
      cohort: {
        name: c.cohort.name,
        totalStudents: c.cohort.students.length
      },
      attendance: {
        total: c.attendance.length,
        present: c.attendance.filter(a => a.status === 'PRESENT').length,
        late: c.attendance.filter(a => a.status === 'LATE').length,
        absent: c.attendance.filter(a => a.status === 'ABSENT').length,
        rate: c.cohort.students.length > 0
          ? Math.round((c.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length / c.cohort.students.length) * 100)
          : 0
      }
    }))

    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}