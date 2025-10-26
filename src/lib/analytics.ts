// ============================================
// 1. lib/analytics.ts - Analytics Helper Functions
// ============================================

import { prisma } from './prisma'

/**
 * Calculates a student's metrics based on their attendance, projects, assessments, and skill proficiency.
 * Returns an object containing the student's metrics, including attendance rate, project status, assessment scores, and skill proficiency.
 * @param {string} studentId - The ID of the student to calculate metrics for.
 * @throws {Error} If the student is not found.
 */
export async function calculateStudentMetrics(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      attendance: true,
      projects: true,
      assessments: true,
      skillProficiency: true,
    },
  })

  if (!student) throw new Error('Student not found')

  // Attendance metrics
  const totalClasses = await prisma.class.count({
    where: { cohortId: student.cohortId || undefined },
  })

  const attendedClasses = student.attendance.filter(
    a => a.status === 'PRESENT' || a.status === 'LATE'
  ).length

  const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

  // Project metrics
  const approvedProjects = student.projects.filter(p => p.status === 'APPROVED').length
  const pendingProjects = student.projects.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length

  // Assessment metrics
  const completedAssessments = student.assessments.filter(a => a.score !== null).length
  const averageScore = student.assessments.length > 0
    ? student.assessments.reduce((sum, a) => sum + (a.score || 0), 0) / student.assessments.length
    : 0

  // Skill metrics
  const skillsByCategory = student.skillProficiency.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push({
      name: skill.skillName,
      score: skill.proficiencyScore,
      level: skill.level,
    })
    return acc
  }, {} as Record<string, Array<{ name: string; score: number; level: string }>>)

  return {
    attendance: {
      rate: Math.round(attendanceRate),
      attended: attendedClasses,
      total: totalClasses,
      lateCount: student.attendance.filter(a => a.status === 'LATE').length,
    },
    projects: {
      total: student.projects.length,
      approved: approvedProjects,
      pending: pendingProjects,
      capstoneCompleted: student.projects.some(p => p.isCapstone && p.status === 'APPROVED'),
    },
    assessments: {
      completed: completedAssessments,
      averageScore: Math.round(averageScore),
      grade: calculateGrade(averageScore),
    },
    skills: skillsByCategory,
    points: student.totalPoints,
    streak: student.currentStreak,
  }
}

export async function getCohortAnalytics(cohortId: string) {
  const cohort = await prisma.cohort.findUnique({
    where: { id: cohortId },
    include: {
      students: {
        include: {
          attendance: true,
          projects: true,
          assessments: true,
        },
      },
      classes: true,
    },
  })

  if (!cohort) throw new Error('Cohort not found')

  const activeStudents = cohort.students.filter(s => s.enrollmentStatus === 'ACTIVE').length
  const totalStudents = cohort.students.length

  // Calculate average attendance
  const avgAttendance = cohort.students.reduce((sum, student) => {
    const attended = student.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length
    const rate = cohort.classes.length > 0 ? (attended / cohort.classes.length) * 100 : 0
    return sum + rate
  }, 0) / (totalStudents || 1)

  // Calculate average score
  const allScores = cohort.students.flatMap(s => s.assessments.map(a => a.score || 0))
  const avgScore = allScores.length > 0
    ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    : 0

  // Projects statistics
  const totalProjects = cohort.students.reduce((sum, s) => sum + s.projects.length, 0)
  const approvedProjects = cohort.students.reduce(
    (sum, s) => sum + s.projects.filter(p => p.status === 'APPROVED').length,
    0
  )

  // At-risk students
  const atRiskStudents = cohort.students.filter(student => {
    const attended = student.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length
    const attendanceRate = cohort.classes.length > 0 ? (attended / cohort.classes.length) * 100 : 100
    const avgStudentScore = student.assessments.length > 0
      ? student.assessments.reduce((sum, a) => sum + (a.score || 0), 0) / student.assessments.length
      : 100

    return attendanceRate < 80 || avgStudentScore < 70
  })

  return {
    cohortInfo: {
      name: cohort.name,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      isActive: cohort.isActive,
    },
    students: {
      total: totalStudents,
      active: activeStudents,
      atRisk: atRiskStudents.length,
    },
    performance: {
      avgAttendance: Math.round(avgAttendance),
      avgScore: Math.round(avgScore),
      projectsSubmitted: totalProjects,
      projectsApproved: approvedProjects,
    },
    classes: {
      total: cohort.classes.length,
      completed: cohort.classes.filter(c => new Date(c.scheduledAt) < new Date()).length,
    },
  }
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}