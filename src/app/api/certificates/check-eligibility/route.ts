// ============================================
// 3. app/api/certificates/check-eligibility/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isEligibleForCertificate, generateCertificateNumber,calculateGrade } from '@/lib/utils'

/**
 * Checks if a student is eligible for a certificate based on their attendance rate, number of projects completed,
 * average score, capstone pass status, and feedback submission status.
 *
 * @param {NextRequest} request - The request object from Next.js
 * @returns {NextResponse} - The response object from Next.js
 * @throws {Error} If there is an error checking eligibility.
 * @throws {ZodError} If there is a validation error.
 */
export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json()

    // Get student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        projects: true,
        assessments: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Calculate attendance rate
    const attendanceCount = await prisma.attendance.count({
      where: { studentId, status: { in: ['PRESENT', 'LATE'] } },
    })

    const totalClasses = await prisma.class.count({
      where: { cohortId: student.cohortId || undefined },
    })

    const attendanceRate = totalClasses > 0
      ? (attendanceCount / totalClasses) * 100
      : 0

    // Count approved projects
    const approvedProjects = student.projects.filter(
      p => p.status === 'APPROVED'
    ).length

    // Calculate average score
    const averageScore = student.assessments.length > 0
      ? student.assessments.reduce((sum, a) => sum + (a.score || 0), 0) / student.assessments.length
      : 0

    // Check capstone
    const capstoneProject = student.projects.find(
      p => p.isCapstone && p.status === 'APPROVED'
    )

    // Check feedback
    const feedbackSubmitted = await prisma.feedback.count({
      where: { studentId, feedbackType: 'course' },
    }) > 0

    const eligible = isEligibleForCertificate(
      attendanceRate,
      approvedProjects,
      averageScore,
      !!capstoneProject,
      feedbackSubmitted
    )

    const requirements = {
      attendanceRate: {
        current: Math.round(attendanceRate),
        required: 80,
        met: attendanceRate >= 80,
      },
      projectsCompleted: {
        current: approvedProjects,
        required: 10,
        met: approvedProjects >= 10,
      },
      averageScore: {
        current: Math.round(averageScore),
        required: 70,
        met: averageScore >= 70,
      },
      capstonePassed: {
        current: !!capstoneProject,
        required: true,
        met: !!capstoneProject,
      },
      feedbackSubmitted: {
        current: feedbackSubmitted,
        required: true,
        met: feedbackSubmitted,
      },
    }

    // If eligible and no certificate exists, generate it
    let certificate = null
    if (eligible) {
      certificate = await prisma.certificate.findFirst({
        where: { studentId, status: { not: 'REVOKED' } },
      })

      if (!certificate) {
        // Get all skills
        const skills = await prisma.skillProficiency.findMany({
          where: { studentId },
          orderBy: { proficiencyScore: 'desc' },
        })

        certificate = await prisma.certificate.create({
          data: {
            studentId,
            certificateNumber: generateCertificateNumber(),
            attendanceRate,
            projectsCompleted: approvedProjects,
            averageScore,
            capstonePassed: true,
            feedbackSubmitted,
            skillsList: skills.map(s => s.skillName),
            finalGrade: calculateGrade(averageScore),
            gradePercentage: averageScore,
            status: 'ISSUED',
            issueDate: new Date(),
          },
        })

        // Award achievement
        await prisma.achievement.create({
          data: {
            studentId,
            type: 'MILESTONE',
            name: 'Course Completion',
            description: 'Successfully completed DC VI Tech Academy program',
            criteria: 'Met all graduation requirements',
            points: 500,
          },
        })
      }
    }

    return NextResponse.json({
      eligible,
      requirements,
      certificate,
    })
  } catch (error) {
    console.error('Certificate eligibility error:', error)
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    )
  }
}