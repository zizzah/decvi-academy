// app/api/lessons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to safely parse JSON fields
function parseJsonField(field: any): any {
  if (!field) return null
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return field
    }
  }
  return field
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        week: {
          include: {
            course: true,
            assignment: true
          }
        },
        tasks: {
          orderBy: { order: 'asc' },
          include: {
            submissions: studentId ? {
              where: { studentId },
              orderBy: { submittedAt: 'desc' },
              take: 1
            } : false
          }
        },
        studentProgress: studentId ? {
          where: { studentId }
        } : false
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get previous and next lessons
    const allLessons = await prisma.courseLesson.findMany({
      where: {
        week: {
          courseId: lesson.week.courseId
        }
      },
      orderBy: [
        { week: { weekNumber: 'asc' } },
        { dayNumber: 'asc' }
      ],
      select: {
        id: true,
        title: true,
        week: {
          select: { weekNumber: true }
        }
      }
    })

    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        objectives: parseJsonField(lesson.objectives) || [],
        content: lesson.content,
        codeExamples: parseJsonField(lesson.codeExamples) || [],
        videoUrl: lesson.videoUrl,
        durationMins: lesson.durationMins,
        commonMistakes: parseJsonField(lesson.commonMistakes) || [],
        resources: parseJsonField(lesson.resources) || [],
        week: {
          weekNumber: lesson.week.weekNumber,
          title: lesson.week.title,
          courseTitle: lesson.week.course.title,
          courseSlug: lesson.week.course.slug
        },
        tasks: lesson.tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          instructions: task.instructions,
          starterCode: task.starterCode,
          hints: parseJsonField(task.hints) || [],
          difficulty: task.difficulty,
          estimatedTime: task.estimatedTime,
          order: task.order,
          latestSubmission: task.submissions?.[0] || null
        })),
        progress: lesson.studentProgress?.[0] || null
      },
      navigation: {
        previous: previousLesson,
        next: nextLesson
      }
    })

  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
    const body = await request.json()
    const { studentId, action, timeSpent } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID required' },
        { status: 400 }
      )
    }

    // Verify lesson exists before trying to create progress
    const lessonExists = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      select: { id: true }
    })

    if (!lessonExists) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    if (action === 'start') {
      const progress = await prisma.studentLessonProgress.upsert({
        where: {
          studentId_lessonId: {
            studentId,
            lessonId
          }
        },
        create: {
          studentId,
          lessonId,
          startedAt: new Date(),
          timeSpent: 0
        },
        update: {
          startedAt: new Date()
        }
      })

      return NextResponse.json({ success: true, progress })
    }

    if (action === 'complete') {
      const progress = await prisma.studentLessonProgress.upsert({
        where: {
          studentId_lessonId: {
            studentId,
            lessonId
          }
        },
        create: {
          studentId,
          lessonId,
          startedAt: new Date(),
          completedAt: new Date(),
          isCompleted: true,
          timeSpent: timeSpent || 0
        },
        update: {
          completedAt: new Date(),
          isCompleted: true,
          timeSpent: {
            increment: timeSpent || 0
          }
        }
      })

      const lesson = await prisma.courseLesson.findUnique({
        where: { id: lessonId },
        include: { week: true }
      })

      if (lesson) {
        await updateCourseProgress(studentId, lesson.week.courseId)
      }

      return NextResponse.json({ success: true, progress })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

async function updateCourseProgress(studentId: string, courseId: string) {
  const totalLessons = await prisma.courseLesson.count({
    where: {
      week: { courseId }
    }
  })

  const completedLessons = await prisma.studentLessonProgress.count({
    where: {
      studentId,
      lesson: {
        week: { courseId }
      },
      isCompleted: true
    }
  })

  const totalTasks = await prisma.lessonTask.count({
    where: {
      lesson: {
        week: { courseId }
      }
    }
  })

  const completedTasks = await prisma.taskSubmission.count({
    where: {
      studentId,
      task: {
        lesson: {
          week: { courseId }
        }
      },
      status: 'PASSED'
    }
  })

  const totalAssignments = await prisma.courseAssignment.count({
    where: {
      week: { courseId }
    }
  })

  const completedAssignments = await prisma.assignmentSubmission.count({
    where: {
      studentId,
      assignment: {
        week: { courseId }
      },
      status: 'PASSED'
    }
  })

  const passedSubmissions = await prisma.taskSubmission.findMany({
    where: {
      studentId,
      task: {
        lesson: {
          week: { courseId }
        }
      },
      status: 'PASSED',
      score: { not: null }
    },
    select: { score: true }
  })

  const overallScore = passedSubmissions.length > 0
    ? passedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / passedSubmissions.length
    : null

  await prisma.studentCourseProgress.upsert({
    where: {
      studentId_courseId: {
        studentId,
        courseId
      }
    },
    create: {
      studentId,
      courseId,
      lessonsCompleted: completedLessons,
      totalLessons,
      tasksCompleted: completedTasks,
      totalTasks,
      assignmentsCompleted: completedAssignments,
      totalAssignments,
      overallScore,
      lastAccessedAt: new Date()
    },
    update: {
      lessonsCompleted: completedLessons,
      totalLessons,
      tasksCompleted: completedTasks,
      totalTasks,
      assignmentsCompleted: completedAssignments,
      totalAssignments,
      overallScore,
      lastAccessedAt: new Date()
    }
  })

  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  await prisma.courseEnrollment.updateMany({
    where: {
      studentId,
      courseId
    },
    data: {
      progressPercent
    }
  })
}