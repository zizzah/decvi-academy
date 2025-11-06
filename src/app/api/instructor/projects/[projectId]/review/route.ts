
// src/app/api/instructor/projects/[projectId]/review/route.ts

import { requireInstructor } from "@/lib/instructor-auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/instructor/projects/:projectId/review
 * Submit a project review
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authError = await requireInstructor()
  if (authError) return authError

  try {
    const { projectId } = await params
    const body = await request.json()
    const {
      status,
      feedback,
      overallScore,
      codeQuality,
      functionality,
      design,
      documentation,
      innovation
    } = body

    // Validate scores
    if (overallScore < 0 || overallScore > 100) {
      return NextResponse.json(
        { error: 'Overall score must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Update project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        status,
        feedback,
        overallScore,
        codeQuality,
        functionality,
        design,
        documentation,
        innovation,
        reviewedAt: new Date()
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    })

    // Award points if approved
    if (status === 'APPROVED') {
      await prisma.student.update({
        where: { id: project.studentId },
        data: {
          totalPoints: { increment: 50 }
        }
      })

      // Create notification
      await prisma.notification.create({
        data: {
          userId: project.student.userId,
          type: 'PROJECT_REVIEWED',
          title: 'Project Approved! 🎉',
          message: `Your project "${project.title}" has been approved with a score of ${overallScore}%`,
          actionUrl: `/dashboard/projects/${project.id}`
        }
      })
    } else if (status === 'NEEDS_REVISION') {
      // Create notification for revision needed
      await prisma.notification.create({
        data: {
          userId: project.student.userId,
          type: 'PROJECT_REVIEWED',
          title: 'Project Needs Revision',
          message: `Your project "${project.title}" requires some improvements. Check the feedback.`,
          actionUrl: `/dashboard/projects/${project.id}`
        }
      })
    }

    return NextResponse.json({
      message: 'Project reviewed successfully',
      project
    })
  } catch (error) {
    console.error('Project review error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}