// app/api/ai-teacher/grade-task/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Groq from 'groq-sdk'

const prisma = new PrismaClient()
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, studentId, code } = body

    console.log('AI Grading request:', { taskId, studentId, codeLength: code?.length })

    if (!taskId || !studentId || !code) {
      return NextResponse.json(
        { error: 'Task ID, student ID, and code are required' },
        { status: 400 }
      )
    }

    // Fetch task details with lesson context
    const task = await prisma.lessonTask.findUnique({
      where: { id: taskId },
      include: {
        lesson: {
          include: {
            week: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    console.log('Task found:', task.title)

    // Get previous submissions count for attempt number
    const previousSubmissions = await prisma.taskSubmission.count({
      where: { studentId, taskId }
    })
    const attemptNumber = previousSubmissions + 1

    console.log('Attempt number:', attemptNumber)

    // Build AI grading prompt
    const gradingPrompt = `You are an expert programming instructor grading a student's code submission.

COURSE: ${task.lesson.week.course.title}
LESSON: ${task.lesson.title}
TASK: ${task.title}

TASK DESCRIPTION:
${task.description}

TASK INSTRUCTIONS:
${task.instructions}

${task.solutionCode ? `REFERENCE SOLUTION (for comparison):
${task.solutionCode}
` : ''}

STUDENT'S CODE:
\`\`\`
${code}
\`\`\`

GRADING CRITERIA:
1. Correctness: Does the code solve the problem correctly?
2. Code Quality: Is the code clean, readable, and well-structured?
3. Best Practices: Does it follow coding conventions and best practices?
4. Efficiency: Is the solution reasonably efficient?
5. Completeness: Are all requirements met?

Please provide a detailed assessment in JSON format with the following structure:
{
  "score": <number 0-100>,
  "status": "PASSED" or "FAILED" or "NEEDS_IMPROVEMENT",
  "feedback": {
    "summary": "<brief overall assessment>",
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "improvements": ["<improvement 1>", "<improvement 2>", ...],
    "codeQuality": "<assessment of code quality>",
    "correctness": "<assessment of correctness>",
    "nextSteps": "<what the student should do next>"
  }
}

GRADING GUIDELINES:
- 90-100: Excellent solution, meets all criteria
- 80-89: Good solution, minor improvements possible
- 70-79: Acceptable solution, some issues to address
- 60-69: Needs improvement, several issues
- Below 60: Does not meet requirements

Be encouraging but honest. Provide specific, actionable feedback.`

    console.log('Calling Groq API...')

    // Get AI grading
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert programming instructor. Respond ONLY with valid JSON.'
        },
        {
          role: 'user',
          content: gradingPrompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const aiResponseText = response.choices[0]?.message?.content
    if (!aiResponseText) {
      throw new Error('No response from AI')
    }

    console.log('AI Response received:', aiResponseText.substring(0, 100) + '...')

    // Parse AI response
    let gradingResult
    try {
      gradingResult = JSON.parse(aiResponseText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponseText)
      throw new Error('Invalid AI response format')
    }

    // Validate grading result
    if (!gradingResult.score || !gradingResult.status || !gradingResult.feedback) {
      console.error('Incomplete grading result:', gradingResult)
      throw new Error('Incomplete grading result from AI')
    }

    console.log('Grading result:', { score: gradingResult.score, status: gradingResult.status })

    // Determine final status - make sure it matches your Prisma enum exactly
    let finalStatus: 'DRAFT' | 'SUBMITTED' | 'PASSED' | 'FAILED' | 'IN_REVIEW' = 'SUBMITTED'
    if (gradingResult.score >= 70) {
      finalStatus = 'PASSED'
    } else if (gradingResult.score < 60 || gradingResult.status === 'FAILED') {
      finalStatus = 'FAILED'
    }

    console.log('Final status:', finalStatus, 'Score:', Math.round(gradingResult.score))

    // Prepare the submission data
    const submissionData = {
      studentId,
      taskId,
      code,
      status: finalStatus,
      score: Math.round(gradingResult.score),
      feedback: JSON.stringify(gradingResult.feedback),
      attemptNumber,
      submittedAt: new Date()
    }

    console.log('Creating submission with data:', {
      ...submissionData,
      codeLength: code.length,
      feedbackLength: submissionData.feedback.length
    })
    
    // Create submission with detailed error catching
    let submission
    try {
      submission = await prisma.taskSubmission.create({
        data: submissionData
      })
      console.log('Submission created successfully:', submission.id)
    } catch (prismaError: any) {
      console.error('Prisma error details:', {
        message: prismaError.message,
        code: prismaError.code,
        meta: prismaError.meta,
        clientVersion: prismaError.clientVersion
      })
      throw new Error(`Prisma validation error: ${prismaError.message}`)
    }

    console.log('Submission created:', submission.id)

    // Update course progress if passed
    if (finalStatus === 'PASSED') {
      console.log('Updating course progress...')
      await updateCourseProgress(studentId, task.lesson.week.courseId)
    }

    return NextResponse.json({
      success: true,
      submission,
      grading: gradingResult
    })

  } catch (error) {
    console.error('AI Grading Error:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : undefined
    
    console.error('Error details:', errorDetails)
    
    return NextResponse.json(
      { 
        error: 'Failed to grade task',
        details: errorMessage,
        fullError: errorDetails
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

async function updateCourseProgress(studentId: string, courseId: string) {
  try {
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
  } catch (error) {
    console.error('Error updating course progress:', error)
    // Don't throw - we still want the submission to succeed even if progress update fails
  }
}