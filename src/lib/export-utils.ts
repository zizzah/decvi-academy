
// ============================================
// 7. lib/export-utils.ts - Data Export Functions
// ============================================

import { prisma } from './prisma'

export async function exportStudentData(studentId: string): Promise<any> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      cohort: true,
      attendance: {
        include: { class: true },
        orderBy: { createdAt: 'desc' },
      },
      projects: {
        orderBy: { createdAt: 'desc' },
      },
      assessments: {
        include: { assignment: true },
        orderBy: { createdAt: 'desc' },
      },
      skillProficiency: {
        orderBy: { proficiencyScore: 'desc' },
      },
      achievements: {
        orderBy: { earnedAt: 'desc' },
      },
      certificates: true,
    },
  })

  if (!student) throw new Error('Student not found')

  return {
    personalInfo: {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.user.email,
      phone: student.phone,
      enrollmentDate: student.enrollmentDate,
      enrollmentStatus: student.enrollmentStatus,
      cohort: student.cohort?.name,
    },
    performance: {
      totalPoints: student.totalPoints,
      currentStreak: student.currentStreak,
      longestStreak: student.longestStreak,
      attendanceRate: calculateAttendanceRate(student),
      averageScore: calculateAverageScore(student),
    },
    attendance: student.attendance.map(a => ({
      date: a.class.scheduledAt,
      className: a.class.title,
      status: a.status,
      lateMinutes: a.lateMinutes,
    })),
    projects: student.projects.map(p => ({
      title: p.title,
      status: p.status,
      monthNumber: p.monthNumber,
      technologies: p.technologies,
      score: p.overallScore,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      submittedAt: p.submittedAt,
    })),
    assessments: student.assessments.map(a => ({
      assignment: a.assignment.title,
      type: a.assignment.type,
      score: a.score,
      percentage: a.percentage,
      submittedAt: a.submittedAt,
      isLate: a.isLate,
    })),
    skills: student.skillProficiency.map(s => ({
      name: s.skillName,
      category: s.category,
      level: s.level,
      score: s.proficiencyScore,
    })),
    achievements: student.achievements.map(a => ({
      name: a.name,
      type: a.type,
      description: a.description,
      points: a.points,
      earnedAt: a.earnedAt,
    })),
    certificates: student.certificates.map(c => ({
      certificateNumber: c.certificateNumber,
      issueDate: c.issueDate,
      status: c.status,
      finalGrade: c.finalGrade,
      pdfUrl: c.pdfUrl,
    })),
  }
}

function calculateAttendanceRate(student: any): number {
  const attended = student.attendance.filter(
    (a: any) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length
  return student.attendance.length > 0 
    ? Math.round((attended / student.attendance.length) * 100) 
    : 0
}

function calculateAverageScore(student: any): number {
  if (student.assessments.length === 0) return 0
  const sum = student.assessments.reduce((acc: number, a: any) => acc + (a.score || 0), 0)
  return Math.round(sum / student.assessments.length)
}

export async function exportCohortReport(cohortId: string): Promise<any> {
  const cohort = await prisma.cohort.findUnique({
    where: { id: cohortId },
    include: {
      students: {
        include: {
          user: true,
          attendance: true,
          projects: true,
          assessments: true,
        },
      },
      classes: true,
    },
  })

  if (!cohort) throw new Error('Cohort not found')

  return {
    cohortInfo: {
      name: cohort.name,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      totalStudents: cohort.students.length,
      activeStudents: cohort.students.filter(s => s.enrollmentStatus === 'ACTIVE').length,
    },
    students: cohort.students.map(student => ({
      name: `${student.firstName} ${student.lastName}`,
      email: student.user.email,
      status: student.enrollmentStatus,
      attendanceRate: calculateAttendanceRate(student),
      projectsCompleted: student.projects.filter(p => p.status === 'APPROVED').length,
      averageScore: calculateAverageScore(student),
      totalPoints: student.totalPoints,
    })),
    classesScheduled: cohort.classes.length,
    classesCompleted: cohort.classes.filter(c => new Date(c.scheduledAt) < new Date()).length,
  }
}