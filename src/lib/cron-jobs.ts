
import { prisma } from './prisma'
import { sendAttendanceWarning } from './email'

// Run this daily to check attendance and send warnings
export async function checkAttendanceWarnings() {
  try {
    const students = await prisma.student.findMany({
      where: { enrollmentStatus: 'ACTIVE' },
      include: {
        user: true,
        cohort: true,
        attendance: true,
      },
    })

    for (const student of students) {
      // Count traditional classes
      const totalTraditionalClasses = await prisma.class.count({
        where: { cohortId: student.cohortId || undefined },
      })

      // Count live classes
      const totalLiveClasses = await prisma.liveClass.count({
        where: { cohortId: student.cohortId || undefined },
      })

      const totalClasses = totalTraditionalClasses + totalLiveClasses

      if (totalClasses === 0) continue

      // Count attended traditional classes
      const attendedTraditionalClasses = student.attendance.filter(
        a => a.status === 'PRESENT' || a.status === 'LATE'
      ).length

      // Count attended live classes
      const attendedLiveClasses = await prisma.liveClassEnrollment.count({
        where: {
          studentId: student.id,
          attended: true,
        },
      })

      const attendedClasses = attendedTraditionalClasses + attendedLiveClasses
      const attendanceRate = (attendedClasses / totalClasses) * 100

      // Send warning if below 80%
      if (attendanceRate < 80) {
        await sendAttendanceWarning(
          student.user.email,
          student.firstName,
          Math.round(attendanceRate)
        )

        // Create notification
        await prisma.notification.create({
          data: {
            userId: student.userId,
            type: 'ATTENDANCE_WARNING',
            title: 'Attendance Warning',
            message: `Your attendance rate is ${Math.round(attendanceRate)}%. Please attend upcoming classes.`,
            actionUrl: '/dashboard/attendance',
          },
        })
      }
    }

    console.log('Attendance warnings checked')
  } catch (error) {
    console.error('Attendance warning job error:', error)
  }
}

// Check certificate eligibility for students nearing completion
export async function checkCertificateEligibility() {
  try {
    const students = await prisma.student.findMany({
      where: {
        enrollmentStatus: 'ACTIVE',
        certificates: { none: {} },
      },
      include: {
        user: true,
        projects: true,
        assessments: true,
      },
    })

    for (const student of students) {
      // Check if student is in month 3, week 4
      const latestProgress = await prisma.progress.findFirst({
        where: { studentId: student.id },
        orderBy: [{ monthNumber: 'desc' }, { weekNumber: 'desc' }],
      })

      if (latestProgress && latestProgress.monthNumber === 3 && latestProgress.weekNumber >= 4) {
        // Trigger certificate eligibility check
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/certificates/check-eligibility`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: student.id }),
        })
      }
    }

    console.log('Certificate eligibility checked')
  } catch (error) {
    console.error('Certificate eligibility job error:', error)
  }
}

// Generate AI recommendations weekly
export async function generateWeeklyRecommendations() {
  try {
    const students = await prisma.student.findMany({
      where: { enrollmentStatus: 'ACTIVE' },
    })

    for (const student of students) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recommendations/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id }),
      })
    }

    console.log('Weekly recommendations generated')
  } catch (error) {
    console.error('Recommendations job error:', error)
  }
}