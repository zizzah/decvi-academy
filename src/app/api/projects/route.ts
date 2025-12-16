import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudent } from '@/lib/auth-helpers'
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const student = await getCurrentStudent()
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: [
        { monthNumber: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}