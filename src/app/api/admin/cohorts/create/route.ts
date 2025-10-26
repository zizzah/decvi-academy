// ============================================
// 4. app/api/admin/cohorts/create/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const cohortSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxStudents: z.number().min(1).max(100),
})

/**
 * Creates a new cohort.
 *
 * @param {NextRequest} request - The request object from Next.js
 *
 * @returns {NextResponse} - The response object from Next.js
 *
 * @throws {Error} If there is an error creating the cohort.
 * @throws {ZodError} If there is a validation error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = cohortSchema.parse(body)

    const cohort = await prisma.cohort.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        maxStudents: validatedData.maxStudents,
        isActive: true,
      },
    })

    return NextResponse.json({
      message: 'Cohort created successfully',
      cohort,
    })
  } catch (error: string | any) {
    console.error('Cohort creation error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create cohort' },
      { status: 500 }
    )
  }
}