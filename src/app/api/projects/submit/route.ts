// ============================================
// 1. app/api/projects/submit/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSubmissionSchema } from '@/lib/validations'

/**
 * Submits a project for a student.
 *
 * @param {NextRequest} request - The request object from Next.js
 *
 * @returns {NextResponse} - The response object from Next.js
 *
 * @throws {Error} If there is an error submitting the project.
 * @throws {ZodError} If there is a validation error.
 */

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Submits a project for a student.
 *
 * This API creates a new project in the database with the given data and
 * awards 50 points to the student for submitting the project.
 * It also creates a new activity in the database with the type
 * 'PROJECT_SUBMITTED' and the description of the submitted project.
 *
 * @returns {NextResponse} - The response object from Next.js
 * @throws {Error} If there is an error submitting the project.
 * @throws {ZodError} If there is a validation error.
/*******  b3b450d8-feff-412a-bc5d-cffcb3271816 *******/
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = projectSubmissionSchema.parse(body)
    const { studentId } = body

    const project = await prisma.project.create({
      data: {
        studentId,
        title: validatedData.title,
        description: validatedData.description,
        githubUrl: validatedData.githubUrl,
        liveUrl: validatedData.liveUrl,
        videoUrl: validatedData.videoUrl,
        technologies: validatedData.technologies,
        monthNumber: validatedData.monthNumber,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    })

    // Award points
    await prisma.student.update({
      where: { id: studentId },
      data: {
        totalPoints: { increment: 50 },
      },
    })

    // Create activity
    await prisma.activity.create({
      data: {
        studentId,
        type: 'PROJECT_SUBMITTED',
        description: `Submitted project: ${validatedData.title}`,
        points: 50,
      },
    })

    return NextResponse.json({
      message: 'Project submitted successfully',
      project,
    })
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
