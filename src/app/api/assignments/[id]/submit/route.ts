import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

// POST /api/assignments/[id]/submit - Submit assignment result (student only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { score, percentage, feedback } = body

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: user.userId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Check if already submitted
    const existingResult = await prisma.assessmentResult.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: student.id,
          assignmentId: params.id
        }
      }
    })

    const isLate = new Date() > new Date(assignment.dueDate)

    if (existingResult) {
      // Update existing result
      const updatedResult = await prisma.assessmentResult.update({
        where: {
          studentId_assignmentId: {
            studentId: student.id,
            assignmentId: params.id
          }
        },
        data: {
          submittedAt: new Date(),
          score,
          percentage,
          feedback,
          isLate,
          attemptCount: existingResult.attemptCount + 1
        }
      })
      return NextResponse.json(updatedResult)
    } else {
      // Create new result
      const newResult = await prisma.assessmentResult.create({
        data: {
          studentId: student.id,
          assignmentId: params.id,
          submittedAt: new Date(),
          score,
          percentage,
          feedback,
          isLate
        }
      })
      return NextResponse.json(newResult, { status: 201 })
    }
  } catch (error) {
    console.error('Error submitting assignment:', error)
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    )
  }
}
