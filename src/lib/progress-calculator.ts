
// ============================================
// 6. lib/progress-calculator.ts - Progress Calculations
// ============================================

import { prisma } from './prisma'

/**
 * Calculate a student's weekly progress report.
 *
 * Fetches the student, classes, attendance, projects, and assessments for the given week.
 * Calculates the attendance rate, number of projects completed, number of assignments submitted, and average assessment score.
 * Upserts a progress record with the calculated values.
 *
 * @throws {Error} If the student is not found.
 *
 * @returns {Promise<void>} A promise that resolves when the progress record has been updated.
 */
export async function calculateWeeklyProgress(studentId: string, monthNumber: number, weekNumber: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      attendance: true,
      projects: true,
      assessments: true,
    },
  })

  if (!student) throw new Error('Student not found')

  // Get classes for this week (traditional classes)
  const weekClasses = await prisma.class.findMany({
    where: {
      cohortId: student.cohortId || undefined,
      monthNumber,
      weekNumber,
    },
  })

  // Get live classes for this week
  const weekLiveClasses = await prisma.liveClass.findMany({
    where: {
      cohortId: student.cohortId || undefined,
      scheduledAt: {
        gte: new Date(2024, monthNumber - 1, (weekNumber - 1) * 7 + 1), // Start of week
        lt: new Date(2024, monthNumber - 1, weekNumber * 7 + 1), // Start of next week
      },
    },
  })

  // Get attendance for this week (traditional classes)
  const weekAttendance = student.attendance.filter(a =>
    weekClasses.some(c => c.id === a.classId)
  )

  // Get live class attendance for this week
  const weekLiveAttendance = await prisma.liveClassEnrollment.findMany({
    where: {
      studentId: student.id,
      attended: true,
      liveClass: {
        id: { in: weekLiveClasses.map(lc => lc.id) },
      },
    },
  })

  const totalWeekClasses = weekClasses.length + weekLiveClasses.length
  const totalWeekAttended = weekAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length + weekLiveAttendance.length

  const attendanceRate = totalWeekClasses > 0
    ? (totalWeekAttended / totalWeekClasses) * 100
    : 0

  // Get projects for this month
  const monthProjects = student.projects.filter(p => p.monthNumber === monthNumber)

  // Get assignments for this week
  const weekAssignments = await prisma.assignment.findMany({
    where: { monthNumber, weekNumber },
  })

  const weekAssessments = student.assessments.filter(a =>
    weekAssignments.some(wa => wa.id === a.assignmentId)
  )

  const averageScore = weekAssessments.length > 0
    ? weekAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / weekAssessments.length
    : 0

  // Upsert progress record
  return await prisma.progress.upsert({
    where: {
      studentId_monthNumber_weekNumber: {
        studentId,
        monthNumber,
        weekNumber,
      },
    },
    create: {
      studentId,
      monthNumber,
      weekNumber,
      classesAttended: weekAttendance.length,
      totalClasses: weekClasses.length,
      attendanceRate,
      projectsCompleted: monthProjects.filter(p => p.status === 'APPROVED').length,
      projectsRequired: monthNumber === 1 ? 4 : monthNumber === 2 ? 4 : 3,
      assignmentsSubmitted: weekAssessments.filter(a => a.submittedAt).length,
      totalAssignments: weekAssignments.length,
      averageScore,
    },
    update: {
      classesAttended: weekAttendance.length,
      totalClasses: weekClasses.length,
      attendanceRate,
      projectsCompleted: monthProjects.filter(p => p.status === 'APPROVED').length,
      assignmentsSubmitted: weekAssessments.filter(a => a.submittedAt).length,
      totalAssignments: weekAssignments.length,
      averageScore,
    },
  })
}

export async function identifyAtRiskStudents(cohortId: string) {
  const students = await prisma.student.findMany({
    where: {
      cohortId,
      enrollmentStatus: 'ACTIVE',
    },
    include: {
      attendance: true,
      assessments: true,
      progress: {
        orderBy: [{ monthNumber: 'desc' }, { weekNumber: 'desc' }],
        take: 1,
      },
    },
  })

  return students.filter(student => {
    const latestProgress = student.progress[0]
    
    if (!latestProgress) return false

    const isAtRisk =
      latestProgress.attendanceRate < 80 ||
      latestProgress.averageScore < 70 ||
      (latestProgress.assignmentsSubmitted / latestProgress.totalAssignments) < 0.7

    return isAtRisk
  }).map(student => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    attendanceRate: student.progress[0]?.attendanceRate || 0,
    averageScore: student.progress[0]?.averageScore || 0,
    assignmentCompletion: student.progress[0]?.totalAssignments > 0
      ? (student.progress[0]?.assignmentsSubmitted / student.progress[0]?.totalAssignments) * 100
      : 0,
  }))
}