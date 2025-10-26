
// ============================================
// 5. app/api/admin/analytics/dashboard/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /admin/analytics/dashboard
 *
 * Fetches the analytics data for the dashboard.
 *
 * @returns {NextResponse} - The response object from Next.js
 *
 * @throws {Error} If there is an error fetching the analytics data.
 */
export async function GET() {
  try {
    // Total students
    const totalStudents = await prisma.student.count()

    // Active students
    const activeStudents = await prisma.student.count({
      where: { enrollmentStatus: 'ACTIVE' },
    })

    // Total classes
    const totalClasses = await prisma.class.count()

    // Average attendance
    const attendanceData = await prisma.attendance.aggregate({
      where: { status: { in: ['PRESENT', 'LATE'] } },
      _count: { id: true },
    })

    const totalClassSessions = await prisma.class.count({
      where: { scheduledAt: { lte: new Date() } },
    })

    const averageAttendance = totalClassSessions > 0
      ? (attendanceData._count.id / (totalClassSessions * activeStudents)) * 100
      : 0

    // Completion rate
    const completedStudents = await prisma.student.count({
      where: { enrollmentStatus: 'COMPLETED' },
    })

    const completionRate = totalStudents > 0
      ? (completedStudents / totalStudents) * 100
      : 0

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentEnrollments = await prisma.student.count({
      where: {
        enrollmentDate: { gte: thirtyDaysAgo },
      },
    })

    // Students by cohort
    const studentsByCohort = await prisma.cohort.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
      orderBy: { startDate: 'desc' },
      take: 5,
    })

    // Top performers (by points)
    const topPerformers = await prisma.student.findMany({
      include: {
        user: { select: { email: true } },
      },
      orderBy: { totalPoints: 'desc' },
      take: 10,
    })

    // Projects by status
    const projectStats = await prisma.project.groupBy({
      by: ['status'],
      _count: { id: true },
    })

    // At-risk students (attendance < 80% or average score < 70%)
    const atRiskStudents = await prisma.student.findMany({
      where: {
        enrollmentStatus: 'ACTIVE',
        progress: {
          some: {
            OR: [
              { attendanceRate: { lt: 80 } },
              { averageScore: { lt: 70 } },
            ],
          },
        },
      },
      include: {
        user: { select: { email: true } },
        cohort: true,
      },
    })

    return NextResponse.json({
      overview: {
        totalStudents,
        activeStudents,
        totalClasses,
        averageAttendance: Math.round(averageAttendance),
        completionRate: Math.round(completionRate),
        recentEnrollments,
      },
      studentsByCohort: studentsByCohort.map(c => ({
        cohortName: c.name,
        studentCount: c._count.students,
        startDate: c.startDate,
      })),
      topPerformers: topPerformers.map(s => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.user.email,
        points: s.totalPoints,
        streak: s.currentStreak,
      })),
      projectStats: projectStats.map(p => ({
        status: p.status,
        count: p._count.id,
      })),
      atRiskStudents: atRiskStudents.map(s => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.user.email,
        cohort: s.cohort?.name,
      })),
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
