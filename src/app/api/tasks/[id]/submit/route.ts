// app/api/tasks/[id]/submit/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed to Promise
) {
  try {
    // IMPORTANT: Await params in Next.js 15+
    const { id: taskId } = await params  // ← Add await here
    
    const body = await request.json()
    const { studentId, code, isDraft = false } = body

    if (!studentId || !code) {
      return NextResponse.json(
        { error: 'Student ID and code required' },
        { status: 400 }
      )
    }

    // Verify task exists
    const taskExists = await prisma.lessonTask.findUnique({
      where: { id: taskId },
      select: { id: true, solutionCode: true }
    })

    if (!taskExists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Get previous submissions count
    const previousSubmissions = await prisma.taskSubmission.count({
      where: { studentId, taskId }
    })

    const attemptNumber = previousSubmissions + 1

    // Create submission
    const submission = await prisma.taskSubmission.create({
      data: {
        studentId,
        taskId,
        code,
        status: isDraft ? 'DRAFT' : 'SUBMITTED',
        attemptNumber,
        submittedAt: new Date()
      }
    })

    // Auto-grade (simple check - you can make this more sophisticated)
    if (!isDraft) {
      // Basic auto-grading logic
      let score = 50 // Base score for submission
      let status = 'SUBMITTED'

      if (taskExists.solutionCode) {
        // Simple comparison (you can use more advanced code comparison)
        const codeWithoutWhitespace = code.replace(/\s+/g, '')
        const solutionWithoutWhitespace = taskExists.solutionCode.replace(/\s+/g, '')
        
        if (codeWithoutWhitespace === solutionWithoutWhitespace) {
          score = 100
          status = 'PASSED'
        } else if (code.length > 20) {
          // Give partial credit for effort
          score = 70
          status = 'IN_REVIEW'
        }
      }

      // Update submission with score
      const updatedSubmission = await prisma.taskSubmission.update({
        where: { id: submission.id },
        data: {
          score,
          status: status as any,
          feedback: status === 'PASSED' 
            ? 'Great work! Your solution is correct.' 
            : 'Your submission has been received and will be reviewed.'
        }
      })

      // Update course progress if passed
      if (status === 'PASSED') {
        const task = await prisma.lessonTask.findUnique({
          where: { id: taskId },
          include: {
            lesson: {
              include: {
                week: true
              }
            }
          }
        })

        if (task) {
          await updateCourseProgress(studentId, task.lesson.week.courseId)
        }
      }

      return NextResponse.json({
        success: true,
        submission: updatedSubmission
      })
    }

    return NextResponse.json({
      success: true,
      submission
    })

  } catch (error) {
    console.error('Error submitting task:', error)
    return NextResponse.json(
      { error: 'Failed to submit task' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

async function updateCourseProgress(studentId: string, courseId: string) {
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

  await prisma.studentCourseProgress.upsert({
    where: {
      studentId_courseId: {
        studentId,
        courseId
      }
    },
    update: {
      tasksCompleted: completedTasks,
      totalTasks,
      lastAccessedAt: new Date()
    },
    create: {
      studentId,
      courseId,
      tasksCompleted: completedTasks,
      totalTasks,
      lessonsCompleted: 0,
      totalLessons: 0,
      assignmentsCompleted: 0,
      totalAssignments: 0,
      lastAccessedAt: new Date()
    }
  })
}