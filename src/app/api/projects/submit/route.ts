
// ============================================
// 2. app/api/projects/submit/route.ts (UPDATED)
// ============================================
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectStatus } from '@prisma/client'
import { projectSubmissionSchema } from '@/lib/validations'
import { getCurrentStudent } from '@/lib/auth-helpers'

export async function POST(request: NextRequest) {
  try {
    const student = await getCurrentStudent()
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = projectSubmissionSchema.parse(body)

    const existingProject = await prisma.project.findFirst({
      where: {
        studentId: student.id,
        monthNumber: validatedData.monthNumber,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (existingProject && existingProject.overallScore !== null) {
      return NextResponse.json(
        { error: 'This project has already been reviewed and cannot be updated.' },
        { status: 400 }
      )
    }

    const projectData = {
      title: validatedData.title,
      description: validatedData.description,
      githubUrl: validatedData.githubUrl ?? null,
      liveUrl: validatedData.liveUrl ?? null,
      videoUrl: validatedData.videoUrl ?? null,
      technologies: validatedData.technologies,
      monthNumber: validatedData.monthNumber,
      status: ProjectStatus.SUBMITTED,
      submittedAt: new Date(),
      reviewedAt: null,
      overallScore: null,
      codeQuality: null,
      functionality: null,
      design: null,
      documentation: null,
      innovation: null,
      feedback: null,
    }

    let project
    let isNewProject = false

    if (existingProject) {
      project = await prisma.project.update({
        where: { id: existingProject.id },
        data: projectData,
      })
    } else {
      isNewProject = true
      project = await prisma.project.create({
        data: {
          studentId: student.id,
          ...projectData,
        },
      })

      await prisma.student.update({
        where: { id: student.id },
        data: {
          totalPoints: { increment: 50 },
        },
      })

      await prisma.activity.create({
        data: {
          studentId: student.id,
          type: 'PROJECT_SUBMITTED',
          description: `Submitted project: ${validatedData.title}`,
          points: 50,
        },
      })
    }

    return NextResponse.json(
      {
        message: 'Project submitted successfully',
        project,
      },
      { status: isNewProject ? 201 : 200 }
    )
  } catch (error: unknown) {
    console.error('Project submission error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as unknown as { name: string; errors: unknown[] }
      return NextResponse.json(
        { error: 'Validation error', details: zodError.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit project' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const student = await getCurrentStudent()
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('monthNumber')
    let monthNumber: number | undefined

    if (monthParam !== null) {
      const parsed = Number(monthParam)
      if (!Number.isFinite(parsed) || parsed < 1) {
        return NextResponse.json(
          { error: 'Invalid monthNumber parameter' },
          { status: 400 }
        )
      }
      monthNumber = parsed
    }

    const project = await prisma.project.findFirst({
      where: {
        studentId: student.id,
        ...(monthNumber ? { monthNumber } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Project submission fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project submission' },
      { status: 500 }
    )
  }
}
