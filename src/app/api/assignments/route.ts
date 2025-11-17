import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assignmentSchema } from '@/lib/validations'
import { requireInstructor } from '@/lib/instructor-auth'

// GET /api/assignments - Get all assignments (for students)
export async function GET(request: NextRequest) {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: [
        { monthNumber: 'asc' },
        { weekNumber: 'asc' },
        { dueDate: 'asc' }
      ]
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

// POST /api/assignments - Create new assignment (instructor only)
export async function POST(request: NextRequest) {
  try {
    const instructorCheck = await requireInstructor()
    if (instructorCheck) {
      return instructorCheck
    }

    const body = await request.json()
    const validatedData = assignmentSchema.parse(body)

    const assignment = await prisma.assignment.create({
      data: validatedData
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}
