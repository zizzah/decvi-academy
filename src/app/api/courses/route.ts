

// app/api/courses/route.ts
export const dynamic = 'force-dynamic';
// app/api/courses/route.ts
// Create this file: app/api/courses/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const studentId = searchParams.get('studentId')

    // Build where clause
    const where: any = {
      isPublished: true
    }

    if (level) {
      where.level = level
    }

    // Get all published courses
    const courses = await prisma.course.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        durationWeeks: true,
        level: true,
        thumbnailUrl: true,
        tags: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })
       console.log('Fetched courses:', courses)
    // Format response
    const formattedCourses = courses.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      durationWeeks: course.durationWeeks,
      level: course.level,
      thumbnailUrl: course.thumbnailUrl,
      tags: course.tags,
      enrollmentCount: course._count.enrollments,
      createdAt: course.createdAt
    }))

    return NextResponse.json({
      courses: formattedCourses,
      total: courses.length
    })

  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}