// src/app/api/instructor/students/route.ts

import { requireInstructor } from "@/lib/instructor-auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';
/**
 * GET /api/instructor/students
 * Fetches all students in instructor's cohorts
 */
export async function GET(request: NextRequest) {
  const authError = await requireInstructor()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const instructorId = searchParams.get('instructorId')
  const cohortId = searchParams.get('cohortId')

  if (!instructorId) {
    return NextResponse.json(
      { error: 'Instructor ID required' },
      { status: 400 }
    )
  }

  try {
    // Get cohorts taught by instructor
    const cohortIds = cohortId 
      ? [cohortId]
      : (await prisma.class.findMany({
          where: { instructorId },
          select: { cohortId: true },
          distinct: ['cohortId']
        })).map(c => c.cohortId)

    // Get students in these cohorts
    const students = await prisma.student.findMany({
      where: {
        cohortId: { in: cohortIds },
        enrollmentStatus: 'ACTIVE'
      },
      include: {
        user: { 
          select: { email: true } 
        },
        cohort: { 
          select: { name: true } 
        },
        attendance: {
          where: {
            class: {
              instructorId
            }
          },
          select: {
            id: true,
            status: true,
            classId: true
          }
        },
        projects: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: { firstName: 'asc' }
    })

    const formattedStudents = students.map(student => {
      const instructorClasses = student.attendance.length
      const attendedClasses = student.attendance.filter(
        a => a.status === 'PRESENT' || a.status === 'LATE'
      ).length

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.user.email,
        cohort: student.cohort?.name || 'No Cohort',
        enrollmentStatus: student.enrollmentStatus,
        totalPoints: student.totalPoints,
        currentStreak: student.currentStreak,
        attendanceRate: instructorClasses > 0 
          ? Math.round((attendedClasses / instructorClasses) * 100)
          : 0,
        projectsCompleted: student.projects.filter(p => p.status === 'APPROVED').length,
        totalProjects: student.projects.length
      }
    })

    return NextResponse.json(formattedStudents)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}