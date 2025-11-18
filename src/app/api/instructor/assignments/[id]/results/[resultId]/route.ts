import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireInstructor } from '@/lib/instructor-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; resultId: string }> }
) {
  const instructorCheck = await requireInstructor()
  if (instructorCheck) {
    return instructorCheck
  }

  try {
    const { id: assignmentId, resultId } = await params
    const body = await request.json()
    const { score, feedback } = body as {
      score?: number | null
      feedback?: string | null
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { id: true, maxScore: true }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    const existingResult = await prisma.assessmentResult.findUnique({
      where: { id: resultId },
      select: { assignmentId: true }
    })

    if (!existingResult || existingResult.assignmentId !== assignmentId) {
      return NextResponse.json(
        { error: 'Submission not found for this assignment' },
        { status: 404 }
      )
    }

    let parsedScore: number | null | undefined = score
    if (parsedScore !== undefined && parsedScore !== null) {
      parsedScore = Number(parsedScore)
      if (
        Number.isNaN(parsedScore) ||
        parsedScore < 0 ||
        parsedScore > assignment.maxScore
      ) {
        return NextResponse.json(
          { error: `Score must be between 0 and ${assignment.maxScore}` },
          { status: 400 }
        )
      }
    }

    const updateData: Record<string, unknown> = {}

    if (parsedScore === null) {
      updateData.score = null
      updateData.percentage = null
    } else if (parsedScore !== undefined) {
      const percentage = Number(
        ((parsedScore / assignment.maxScore) * 100).toFixed(2)
      )
      updateData.score = parsedScore
      updateData.percentage = percentage
    }

    if (typeof feedback === 'string') {
      updateData.feedback = feedback.trim()
    } else if (feedback === null) {
      updateData.feedback = null
    }

    const updatedResult = await prisma.assessmentResult.update({
      where: { id: resultId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: {
              select: { email: true }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedResult)
  } catch (error) {
    console.error('Error grading submission:', error)
    return NextResponse.json(
      { error: 'Failed to grade submission' },
      { status: 500 }
    )
  }
}

