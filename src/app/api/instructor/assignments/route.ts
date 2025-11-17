import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireInstructor } from '@/lib/instructor-auth'

// GET /api/instructor/assignments - Get all assignments with results (instructor only)
export async function GET(request: NextRequest) {
  try {
    const instructorCheck = await requireInstructor()
    if (instructorCheck) {
      return instructorCheck
    }

    const assignments = await prisma.assignment.findMany({
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
          }
        },
        _count: {
          select: {
            results: true
          }
        }
      },
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
