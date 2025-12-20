// app/api/courses/[slug]/enroll/route.ts
export const dynamic = 'force-dynamic';
// app/api/courses/[slug]/enroll/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { slug } = await params
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID required' },
        { status: 400 }
      )
    }

    // Get course
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        weeks: {
          include: {
            lessons: {
              include: {
                tasks: true
              }
            },
            assignment: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: course.id
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Calculate totals
    const totalLessons = course.weeks.reduce((sum, week) => sum + week.lessons.length, 0)
    const totalTasks = course.weeks.reduce(
      (sum, week) => sum + week.lessons.reduce((s, l) => s + l.tasks.length, 0),
      0
    )
    const totalAssignments = course.weeks.filter(w => w.assignment).length

    // Create enrollment and progress records
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        studentId,
        courseId: course.id,
        currentWeekNumber: 1,
        progressPercent: 0,
        isActive: true
      }
    })

    const progress = await prisma.studentCourseProgress.create({
      data: {
        studentId,
        courseId: course.id,
        lessonsCompleted: 0,
        totalLessons,
        tasksCompleted: 0,
        totalTasks,
        assignmentsCompleted: 0,
        totalAssignments
      }
    })

    return NextResponse.json({
      success: true,
      enrollment,
      progress
    })

  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Get enrollment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID required' },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { slug }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: course.id
        }
      }
    })

    return NextResponse.json({
      isEnrolled: !!enrollment,
      enrollment
    })

  } catch (error) {
    console.error('Error checking enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to check enrollment' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}