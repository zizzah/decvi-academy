
// ============================================
// 13. app/api/students/[id]/progress/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /students/:id/progress
 *
 * Fetch a student's progress report.
 *
 * @param {NextRequest} request - The request object from Next.js
 * @param {params} params - The route params object from Next.js
 * @param {string} params.id - The student ID
 *
 * @returns {NextResponse} - The response object from Next.js
 *
 * @throws {Error} If there is an error fetching the student's progress report.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id

    // Get student
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        cohort: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get attendance stats
    const attendanceStats = await prisma.attendance.aggregate({
      where: { studentId },
      _count: { id: true },
      _avg: { participationScore: true },
    })

    const totalClasses = await prisma.class.count({
      where: { cohortId: student.cohortId || undefined },
    })

    const attendanceRate = totalClasses > 0
      ? (attendanceStats._count.id / totalClasses) * 100
      : 0

    // Get projects
    const projects = await prisma.project.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    })

    // Get assessment results
    const assessments = await prisma.assessmentResult.findMany({
      where: { studentId },
      include: { assignment: true },
      orderBy: { createdAt: 'desc' },
    })

    const averageScore = assessments.length > 0
      ? assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length
      : 0

    // Get skill proficiency
    const skills = await prisma.skillProficiency.findMany({
      where: { studentId },
      orderBy: { proficiencyScore: 'desc' },
    })

    // Get progress by week
    const weeklyProgress = await prisma.progress.findMany({
      where: { studentId },
      orderBy: [{ monthNumber: 'asc' }, { weekNumber: 'asc' }],
    })

    // Get achievements
    const achievements = await prisma.achievement.findMany({
      where: { studentId },
      orderBy: { earnedAt: 'desc' },
    })

    return NextResponse.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.user.email,
        enrollmentStatus: student.enrollmentStatus,
      },
      stats: {
        attendanceRate: Math.round(attendanceRate),
        projectsCompleted: projects.filter(p => p.status === 'APPROVED').length,
        totalProjects: projects.length,
        averageScore: Math.round(averageScore),
        totalPoints: student.totalPoints,
        currentStreak: student.currentStreak,
      },
      skills,
      projects: projects.slice(0, 5),
      weeklyProgress,
      achievements: achievements.slice(0, 5),
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}