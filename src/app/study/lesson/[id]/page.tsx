// app/study/lesson/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Target,
  Lightbulb,
  Code,
  ExternalLink,
  Play,
  Save,
  Sparkles
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import AITeacherChat from '@/components/AITeacherChat'

interface Task {
  id: string
  title: string
  description: string
  instructions: string
  starterCode: string | null
  hints: any[]
  difficulty: string
  estimatedTime: number
  order: number
  latestSubmission: any | null
}

interface CodeExample {
  title: string
  code: string
  explanation?: string
}

interface CommonMistake {
  mistake: string
  why: string
  fix: string
}

interface Resource {
  title: string
  url: string
}

interface Lesson {
  id: string
  title: string
  type: string
  objectives: any[]
  content: string
  codeExamples: { create: CodeExample[] } | CodeExample[]
  videoUrl: string | null
  durationMins: number
  commonMistakes: { create: CommonMistake[] } | CommonMistake[]
  resources: { create: Resource[] } | Resource[]
  week: {
    weekNumber: number
    title: string
    courseTitle: string
    courseSlug: string
  }
  tasks: Task[]
  progress: any | null
}

// Helper function to safely parse feedback
function parseFeedback(feedback: any) {
  if (!feedback) return null
  
  // If it's already an object, return it
  if (typeof feedback === 'object' && feedback.summary) {
    return feedback
  }
  
  // If it's a string, try to parse it
  if (typeof feedback === 'string') {
    try {
      const parsed = JSON.parse(feedback)
      return parsed
    } catch {
      // If parsing fails, return a simple object
      return { summary: feedback, strengths: [], improvements: [], nextSteps: '' }
    }
  }
  
  return null
}

export default function LessonViewerPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [navigation, setNavigation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [studentId, setStudentId] = useState('')
  const [taskSubmissions, setTaskSubmissions] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({})
  const [startTime] = useState(Date.now())
  const [aiGrading, setAiGrading] = useState<{ [key: string]: boolean }>({})

  // Helper functions to normalize data structure
  const getCodeExamples = (lesson: Lesson): CodeExample[] => {
    if (!lesson.codeExamples) return []
    if (Array.isArray(lesson.codeExamples)) return lesson.codeExamples
    if ('create' in lesson.codeExamples) return lesson.codeExamples.create
    return []
  }

  const getCommonMistakes = (lesson: Lesson): CommonMistake[] => {
    if (!lesson.commonMistakes) return []
    if (Array.isArray(lesson.commonMistakes)) return lesson.commonMistakes
    if ('create' in lesson.commonMistakes) return lesson.commonMistakes.create
    return []
  }

  const getResources = (lesson: Lesson): Resource[] => {
    if (!lesson.resources) return []
    if (Array.isArray(lesson.resources)) return lesson.resources
    if ('create' in lesson.resources) return lesson.resources.create
    return []
  }

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const userResponse = await fetch('/api/auth/me')
      if (!userResponse.ok) {
        router.push('/auth/login')
        return
      }

      const userData = await userResponse.json()
      const currentStudentId = userData.profile.id
      setStudentId(currentStudentId)

      // Mark lesson as started
      await fetch(`/api/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudentId,
          action: 'start'
        })
      })

      const response = await fetch(`/api/lessons/${lessonId}?studentId=${currentStudentId}`)
      if (!response.ok) throw new Error('Failed to fetch lesson')

      const data = await response.json()
      setLesson(data.lesson)
      setNavigation(data.navigation)
      console.log(data.lesson)

      // Initialize task submissions with starter code or previous submissions
      const submissions: { [key: string]: string } = {}
      data.lesson.tasks.forEach((task: Task) => {
        submissions[task.id] = task.latestSubmission?.code || task.starterCode || ''
      })
      setTaskSubmissions(submissions)

    } catch (error) {
      console.error('Failed to fetch lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteLesson = async () => {
    if (!studentId || !lesson) return

    const timeSpent = Math.floor((Date.now() - startTime) / 60000)

    try {
      await fetch(`/api/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          action: 'complete',
          timeSpent
        })
      })

      if (navigation?.next) {
        router.push(`/study/lesson/${navigation.next.id}`)
      } else {
        router.push('/study')
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    }
  }

  const handleAIGradeTask = async (taskId: string) => {
    if (!studentId) return

    setAiGrading(prev => ({ ...prev, [taskId]: true }))

    try {
      const response = await fetch('/api/ai-teacher/grade-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          studentId,
          code: taskSubmissions[taskId]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to grade task')
      }

      const result = await response.json()
      
      // Parse feedback properly
      const feedback = parseFeedback(result.submission.feedback)
      
      if (feedback) {
        // Build a nice feedback message
        let message = `✅ AI Grading Complete!\n\n`
        message += `📊 Score: ${result.submission.score}%\n`
        message += `📝 Status: ${result.submission.status}\n\n`
        
        if (feedback.summary) {
          message += `📋 Summary:\n${feedback.summary}\n\n`
        }
        
        if (feedback.strengths && feedback.strengths.length > 0) {
          message += `💪 Strengths:\n${feedback.strengths.map((s: string) => `• ${s}`).join('\n')}\n\n`
        }
        
        if (feedback.improvements && feedback.improvements.length > 0) {
          message += `🔧 Areas for Improvement:\n${feedback.improvements.map((i: string) => `• ${i}`).join('\n')}\n\n`
        }
        
        if (feedback.codeQuality) {
          message += `💎 Code Quality:\n${feedback.codeQuality}\n\n`
        }
        
        if (feedback.correctness) {
          message += `✓ Correctness:\n${feedback.correctness}\n\n`
        }
        
        if (feedback.nextSteps) {
          message += `🎯 Next Steps:\n${feedback.nextSteps}`
        }
        
        alert(message)
      } else {
        alert(`AI Grading Complete!\n\nScore: ${result.submission.score}%\nStatus: ${result.submission.status}`)
      }
      
      // Refresh lesson to update submission status
      fetchLesson()
    } catch (error) {
      console.error('Failed to grade task:', error)
      alert(`Failed to grade task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setAiGrading(prev => ({ ...prev, [taskId]: false }))
    }
  }

  const handleSubmitTask = async (taskId: string, isDraft = false) => {
    if (!studentId) return

    setSubmitting(prev => ({ ...prev, [taskId]: true }))

    try {
      const response = await fetch(`/api/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          code: taskSubmissions[taskId],
          isDraft
        })
      })

      if (!response.ok) throw new Error('Failed to submit task')

      const result = await response.json()
      
      alert(isDraft ? 'Draft saved!' : `Task submitted! Score: ${result.submission.score}%`)
      
      if (!isDraft) {
        fetchLesson()
      }
    } catch (error) {
      console.error('Failed to submit task:', error)
      alert('Failed to submit task. Please try again.')
    } finally {
      setSubmitting(prev => ({ ...prev, [taskId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Lesson not found</p>
          <Button onClick={() => router.push('/study')}>Back to Study</Button>
        </div>
      </div>
    )
  }

  const codeExamples = getCodeExamples(lesson)
  const commonMistakes = getCommonMistakes(lesson)
  const resources = getResources(lesson)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/study')}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Study
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{lesson.week.courseTitle}</Badge>
                  <span className="text-sm text-gray-600">
                    Week {lesson.week.weekNumber}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigation?.previous && router.push(`/study/lesson/${navigation.previous.id}`)}
                disabled={!navigation?.previous}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCompleteLesson}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Lesson
              </Button>
              <Button
                variant="outline"
                onClick={() => navigation?.next && router.push(`/study/lesson/${navigation.next.id}`)}
                disabled={!navigation?.next}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Lesson Content
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.durationMins} mins</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Objectives */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {lesson.objectives.map((obj: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video */}
                {lesson.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <Button variant="outline" className="text-white border-white">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose max-w-none">
                  <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>

                {/* Code Examples */}
                {codeExamples.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      Code Examples
                    </h3>
                    {codeExamples.map((example, idx) => (
                      <div key={idx} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 border-b">
                          <h4 className="font-medium text-sm text-gray-900">{example.title}</h4>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                        {example.explanation && (
                          <div className="bg-blue-50 px-4 py-3 text-sm text-gray-700">
                            {example.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tasks */}
            {lesson.tasks && lesson.tasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={lesson.tasks[0]?.id}>
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                      {lesson.tasks.map((task, idx) => (
                        <TabsTrigger key={task.id} value={task.id} className="flex-shrink-0">
                          Task {idx + 1}
                          {task.latestSubmission?.status === 'PASSED' && (
                            <CheckCircle2 className="w-3 h-3 ml-1 text-green-600" />
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {lesson.tasks.map((task) => (
                      <TabsContent key={task.id} value={task.id} className="space-y-4 mt-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                task.difficulty === 'EASY' ? 'secondary' :
                                task.difficulty === 'MEDIUM' ? 'default' : 'destructive'
                              }>
                                {task.difficulty}
                              </Badge>
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.estimatedTime}m
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{task.description}</p>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown>{task.instructions}</ReactMarkdown>
                            </div>
                          </div>

                          {/* Hints */}
                          {task.hints && task.hints.length > 0 && (
                            <details className="mb-4">
                              <summary className="cursor-pointer text-sm font-medium text-blue-600 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Show Hints ({task.hints.length})
                              </summary>
                              <div className="mt-2 space-y-2">
                                {task.hints.map((hint: string, idx: number) => (
                                  <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                                    <strong>Hint {idx + 1}:</strong> {hint}
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}

                          {/* Code Editor */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Your Solution:</label>
                            <Textarea
                              value={taskSubmissions[task.id] || ''}
                              onChange={(e) => setTaskSubmissions(prev => ({
                                ...prev,
                                [task.id]: e.target.value
                              }))}
                              placeholder="Write your code here..."
                              className="font-mono text-sm min-h-[300px]"
                            />
                          </div>

                          {/* Submission Status */}
                          {task.latestSubmission && (
                            <div className={`mt-4 p-4 rounded-lg border ${
                              task.latestSubmission.status === 'PASSED' 
                                ? 'bg-green-50 border-green-200' 
                                : task.latestSubmission.status === 'FAILED'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-yellow-50 border-yellow-200'
                            }`}>
                              <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                      {task.latestSubmission.status === 'PASSED' && (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      )}
                                      Status: {task.latestSubmission.status}
                                    </div>
                                    {task.latestSubmission.score !== null && (
                                      <div className="text-sm text-gray-600 mt-1">
                                        Score: {task.latestSubmission.score}%
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Feedback Display */}
                                {task.latestSubmission.feedback && (() => {
                                  const feedback = parseFeedback(task.latestSubmission.feedback)
                                  
                                  if (!feedback) {
                                    return (
                                      <div className="text-sm text-gray-700 mt-2">
                                        {typeof task.latestSubmission.feedback === 'string' 
                                          ? task.latestSubmission.feedback 
                                          : 'Feedback available'}
                                      </div>
                                    )
                                  }

                                  return (
                                    <div className="space-y-3 mt-3">
                                      {/* Summary */}
                                      {feedback.summary && (
                                        <div className="bg-white p-3 rounded border">
                                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                            Summary
                                          </div>
                                          <div className="text-sm text-gray-700">
                                            {feedback.summary}
                                          </div>
                                        </div>
                                      )}

                                      {/* Strengths */}
                                      {feedback.strengths && feedback.strengths.length > 0 && (
                                        <div className="bg-white p-3 rounded border">
                                          <div className="text-xs font-semibold text-green-600 uppercase mb-2 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            Strengths
                                          </div>
                                          <ul className="space-y-1">
                                            {feedback.strengths.map((strength: string, idx: number) => (
                                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">•</span>
                                                <span>{strength}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Improvements */}
                                      {feedback.improvements && feedback.improvements.length > 0 && (
                                        <div className="bg-white p-3 rounded border">
                                          <div className="text-xs font-semibold text-orange-600 uppercase mb-2 flex items-center gap-1">
                                            <Lightbulb className="w-3 h-3" />
                                            Areas for Improvement
                                          </div>
                                          <ul className="space-y-1">
                                            {feedback.improvements.map((improvement: string, idx: number) => (
                                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-orange-600 mt-0.5">•</span>
                                                <span>{improvement}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Code Quality */}
                                      {feedback.codeQuality && (
                                        <div className="bg-white p-3 rounded border">
                                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                            Code Quality
                                          </div>
                                          <div className="text-sm text-gray-700">
                                            {feedback.codeQuality}
                                          </div>
                                        </div>
                                      )}

                                      {/* Next Steps */}
                                      {feedback.nextSteps && (
                                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                          <div className="text-xs font-semibold text-blue-600 uppercase mb-1 flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            Next Steps
                                          </div>
                                          <div className="text-sm text-gray-700">
                                            {feedback.nextSteps}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })()}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => handleSubmitTask(task.id, true)}
                              variant="outline"
                              disabled={submitting[task.id]}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Draft
                            </Button>
                            <Button
                              onClick={() => handleAIGradeTask(task.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={aiGrading[task.id] || !taskSubmissions[task.id]?.trim()}
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {aiGrading[task.id] ? 'AI Grading...' : 'AI Grade & Submit'}
                            </Button>
                            <Button
                              onClick={() => handleSubmitTask(task.id, false)}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={submitting[task.id]}
                            >
                              {submitting[task.id] ? 'Submitting...' : 'Submit Task'}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Common Mistakes */}
            {commonMistakes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Common Mistakes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {commonMistakes.map((mistake, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium text-red-600 mb-1">❌ {mistake.mistake}</div>
                        <div className="text-gray-600 mb-1">{mistake.why}</div>
                        <div className="font-medium text-green-600">✅ {mistake.fix}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Teacher Chat */}
            {studentId && (
              <AITeacherChat
                lessonId={lessonId}
                studentId={studentId}
                lessonTitle={lesson.title}
              />
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-sm"
                      >
                        <span className="text-blue-600 font-medium">{resource.title}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}