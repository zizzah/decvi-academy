// app/api/ai-teacher/chat/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Groq from 'groq-sdk'

const prisma = new PrismaClient()
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Helper function to safely parse JSON
function safeJsonParse(value: any, fallback: any = []) {
  if (!value) return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return fallback
    }
  }
  return value
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, studentId, message, conversationHistory } = body

    if (!lessonId || !studentId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch lesson details with full context
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        week: {
          include: {
            course: true
          }
        },
        tasks: {
          include: {
            submissions: {
              where: { studentId },
              orderBy: { submittedAt: 'desc' },
              take: 1
            }
          }
        },
        studentProgress: {
          where: { studentId }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get student's previous lessons for broader context
    const previousLessons = await prisma.studentLessonProgress.findMany({
      where: {
        studentId,
        lesson: {
          week: {
            courseId: lesson.week.courseId
          }
        },
        isCompleted: true
      },
      include: {
        lesson: {
          select: {
            title: true,
            objectives: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 3
    })

    // Safely parse JSON fields
    const objectives = safeJsonParse(lesson.objectives, [])
    const codeExamples = safeJsonParse(lesson.codeExamples, [])
    const commonMistakes = safeJsonParse(lesson.commonMistakes, [])

    // Build comprehensive context
    const systemPrompt = `You are an expert programming teacher helping a student learn ${lesson.week.course.title}.

CURRENT LESSON CONTEXT:
- Lesson: ${lesson.title}
- Week ${lesson.week.weekNumber}: ${lesson.week.title}
- Duration: ${lesson.durationMins} minutes
${objectives.length > 0 ? `- Objectives: ${objectives.join(', ')}` : ''}

LESSON CONTENT:
${lesson.content || 'No content available'}

${codeExamples.length > 0 ? `
CODE EXAMPLES:
${JSON.stringify(codeExamples, null, 2)}
` : ''}

${commonMistakes.length > 0 ? `
COMMON MISTAKES TO WATCH FOR:
${JSON.stringify(commonMistakes, null, 2)}
` : ''}

STUDENT'S PROGRESS:
- Completed ${previousLessons.length} previous lessons
${previousLessons.length > 0 ? `- Recent topics: ${previousLessons.map(p => p.lesson.title).join(', ')}` : ''}

TASKS FOR THIS LESSON:
${lesson.tasks.map(task => `
- ${task.title} (${task.difficulty})
  Description: ${task.description}
  ${task.submissions?.[0] ? `Student's latest attempt status: ${task.submissions[0].status}` : 'Not yet attempted'}
`).join('\n')}

YOUR ROLE:
1. Answer questions about the current lesson content clearly and concisely
2. Provide hints and guidance without giving away complete solutions
3. Explain concepts using examples relevant to the lesson
4. Help debug code issues by asking clarifying questions
5. Encourage best practices and good coding habits
6. Be supportive and patient - this is a learning environment
7. Reference the lesson content and examples when explaining
8. If a student is stuck on a task, guide them step-by-step

TEACHING STYLE:
- Be encouraging and positive
- Use analogies and real-world examples
- Break down complex concepts into simpler parts
- Ask guiding questions to help students think critically
- Celebrate small wins and progress
- When reviewing code, be constructive and specific

Remember: You're not just answering questions - you're teaching and mentoring!`

    // Build conversation messages
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ]

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory)
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Get AI response from Groq
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile', // Updated to current model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    })

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'

    return NextResponse.json({
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Teacher Chat Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}