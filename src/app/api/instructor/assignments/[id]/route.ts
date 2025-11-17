import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireInstructor } from '@/lib/instructor-auth'

// GET /api/instructor/assignments/[id] - Get single assignment with results (instructor only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const instructorCheck = await requireInstructor()
    if (instructorCheck) {
      return instructorCheck
    }

    const { id } = await params

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        results: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                user: {
                  select: {
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            submittedAt: 'desc'
          }
        },
        _count: {
          select: {
            results: true
          }
        }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}

// PUT /api/instructor/assignments/[id] - Update assignment (instructor only)
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

    const assignment = await prisma.assignment.update({
      where: { id },
      data: body
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

// DELETE /api/instructor/assignments/[id] - Delete assignment (instructor only)
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
