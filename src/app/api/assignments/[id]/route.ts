export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assignmentSchema } from '@/lib/validations'
import { requireInstructor } from '@/lib/instructor-auth'
// Add to TOP of each file (before imports):
// GET /api/assignments/[id] - Get specific assignment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getCurrentStudent } = await import('@/lib/auth-helpers')
    const currentStudent = await getCurrentStudent()

    if (!currentStudent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        results: {
          where: { studentId: currentStudent.id },
          orderBy: { submittedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    const [studentSubmission] = assignment.results
    const { results: _results, ...assignmentData } = assignment

    return NextResponse.json({
      assignment: assignmentData,
      submission: studentSubmission ?? null
    })
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}

// PUT /api/assignments/[id] - Update assignment (instructor only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const instructorCheck = await requireInstructor()
    if (instructorCheck) {
      return instructorCheck
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = assignmentSchema.parse(body)

    const assignment = await prisma.assignment.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

// DELETE /api/assignments/[id] - Delete assignment (instructor only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const instructorCheck = await requireInstructor()
    if (instructorCheck) {
      return instructorCheck
    }

    const { id } = await params
    await prisma.assignment.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}
