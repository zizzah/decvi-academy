import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectStatus } from '@prisma/client'
import { getCurrentInstructor } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const instructor = await getCurrentInstructor()
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: [
            ProjectStatus.SUBMITTED,
            ProjectStatus.UNDER_REVIEW,
            ProjectStatus.NEEDS_REVISION,
            ProjectStatus.APPROVED,
            ProjectStatus.REJECTED
          ]
        }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { submittedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Instructor projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}