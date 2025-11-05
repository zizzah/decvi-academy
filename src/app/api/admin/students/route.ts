// src/app/api/admin/students/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const cohortId = searchParams.get('cohortId')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: Prisma.StudentWhereInput = {}
  
  if (cohortId) where.cohortId = cohortId
  if (status) where.enrollmentStatus = status as any // Cast based on your enum
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } }
    ]
  }

  const students = await prisma.student.findMany({
    where,
    include: {
      user: { select: { email: true } },
      cohort: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(students)
}