export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectStatus, ActivityType } from '@prisma/client'
import { getCurrentInstructor } from '@/lib/auth-helpers'
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const instructor = await getCurrentInstructor()
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await the params
    const { projectId } = await context.params

    const body = await request.json()
    const { status, feedback, overallScore } = body

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: status === 'APPROVED' ? ProjectStatus.APPROVED : ProjectStatus.NEEDS_REVISION,
        feedback: feedback || null,
        reviewedAt: new Date(),
        overallScore: overallScore || null,
      },
      include: {
        student: true,
      },
    })

    if (status === 'APPROVED' && overallScore) {
      const pointsToAward = Math.floor(overallScore / 2)
      
      await prisma.student.update({
        where: { id: project.studentId },
        data: {
          totalPoints: { increment: pointsToAward },
        },
      })

      await prisma.activity.create({
        data: {
          studentId: project.studentId,
          type: ActivityType.PROJECT_SUBMITTED,
          description: `Project "${project.title}" approved with score: ${overallScore}%`,
          points: pointsToAward,
        },
      })
    }

    return NextResponse.json({ message: 'Project reviewed successfully', project })
  } catch (error) {
    console.error('Project review error:', error)
    return NextResponse.json(
      { error: 'Failed to review project' },
      { status: 500 }
    )
  }
}