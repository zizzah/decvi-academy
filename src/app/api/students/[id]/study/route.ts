// app/api/students/[id]/study/route.ts - Fix today's tasks to include lessonId
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { 
        studentId,
        isActive: true 
      },
      include: {
        course: {
          include: {
            weeks: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  include: {
                    tasks: {
                      orderBy: { order: 'asc' }
                    },
                    studentProgress: {
                      where: { studentId }
                    }
                  }
                },
                assignment: true
              }
            }
          }
        }
      }
    })

    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await prisma.studentCourseProgress.findUnique({
          where: {
            studentId_courseId: {
              studentId,
              courseId: enrollment.courseId
            }
          }
        })

        let nextLesson = null
        for (const week of enrollment.course.weeks) {
          for (const lesson of week.lessons) {
            const isCompleted = lesson.studentProgress.length > 0 && 
                               lesson.studentProgress[0].isCompleted
            if (!isCompleted) {
              nextLesson = {
                lessonId: lesson.id,
                weekNumber: week.weekNumber,
                dayNumber: lesson.dayNumber,
                title: lesson.title,
                weekTitle: week.title
              }
              break
            }
          }
          if (nextLesson) break
        }

        return {
          courseId: enrollment.course.id,
          courseSlug: enrollment.course.slug,
          courseTitle: enrollment.course.title,
          courseDescription: enrollment.course.description,
          level: enrollment.course.level,
          thumbnailUrl: enrollment.course.thumbnailUrl,
          currentWeek: enrollment.currentWeekNumber,
          totalWeeks: enrollment.course.durationWeeks,
          enrolledAt: enrollment.enrolledAt,
          progress: progress ? {
            lessonsCompleted: progress.lessonsCompleted,
            totalLessons: progress.totalLessons,
            tasksCompleted: progress.tasksCompleted,
            totalTasks: progress.totalTasks,
            assignmentsCompleted: progress.assignmentsCompleted,
            totalAssignments: progress.totalAssignments,
            overallScore: progress.overallScore,
            progressPercent: progress.totalLessons > 0 
              ? (progress.lessonsCompleted / progress.totalLessons) * 100 
              : 0
          } : null,
          nextLesson,
          totalTimeSpent: enrollment.totalTimeSpent
        }
      })
    )

    const recentProgress = await prisma.studentLessonProgress.findMany({
      where: { studentId },
      orderBy: { completedAt: 'desc' },
      take: 30,
      select: { completedAt: true }
    })

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < recentProgress.length; i++) {
      const progressDate = new Date(recentProgress[i].completedAt || '')
      progressDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - streak)
      
      if (progressDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    // FIXED: Get today's tasks with lessonId included
    const todaysTasks = []
    for (const course of coursesWithProgress) {
      if (course.nextLesson) {
        const lesson = await prisma.courseLesson.findUnique({
          where: { id: course.nextLesson.lessonId },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
              include: {
                submissions: {
                  where: { studentId },
                  orderBy: { submittedAt: 'desc' },
                  take: 1
                }
              }
            }
          }
        })

        if (lesson) {
          for (const task of lesson.tasks) {
            const isCompleted = task.submissions.length > 0 && 
                               task.submissions[0].status === 'PASSED'
            if (!isCompleted) {
              todaysTasks.push({
                taskId: task.id,
                lessonId: lesson.id, // ADD THIS!
                courseTitle: course.courseTitle,
                lessonTitle: lesson.title,
                taskTitle: task.title,
                difficulty: task.difficulty,
                estimatedTime: task.estimatedTime,
                hasSubmission: task.submissions.length > 0
              })
            }
          }
        }
      }
    }

    return NextResponse.json({
      courses: coursesWithProgress,
      studyStreak: streak,
      todaysTasks: todaysTasks.slice(0, 5),
      totalTimeSpent: enrollments.reduce((sum, e) => sum + e.totalTimeSpent, 0)
    })

  } catch (error) {
    console.error('Error fetching study data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study data' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}