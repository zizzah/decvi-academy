// app/study/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Clock,
  Flame,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Target,
  Award,
  Calendar
} from 'lucide-react'
import { Sidebar } from '@/components/components/dashboard/Sidebar'
import { Navbar } from '@/components/components/dashboard/Navbar'

interface Course {
  courseId: string
  courseSlug: string
  courseTitle: string
  courseDescription: string
  level: string
  thumbnailUrl: string | null
  currentWeek: number
  totalWeeks: number
  enrolledAt: string
  progress: {
    lessonsCompleted: number
    totalLessons: number
    tasksCompleted: number
    totalTasks: number
    progressPercent: number
    overallScore: number | null
  } | null
  nextLesson: {
    lessonId: string
    weekNumber: number
    dayNumber: number
    title: string
    weekTitle: string
  } | null
  totalTimeSpent: number
}

interface TodayTask {
  taskId: string
  lessonId: string
  courseTitle: string
  lessonTitle: string
  taskTitle: string
  difficulty: string
  estimatedTime: number
  hasSubmission: boolean
}

interface StudyData {
  courses: Course[]
  studyStreak: number
  todaysTasks: TodayTask[]
  totalTimeSpent: number
}

export default function StudyPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState<StudyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [studentId, setStudentId] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('/api/auth/me')
        if (!userResponse.ok) {
          router.push('/auth/login')
          return
        }

        const userData = await userResponse.json()
        if (!userData.profile?.id) {
          console.error('No student profile found')
          setLoading(false)
          return
        }

        const currentStudentId = userData.profile.id
        setStudentId(currentStudentId)

        const response = await fetch(`/api/students/${currentStudentId}/study`)
        if (!response.ok) {
          throw new Error('Failed to fetch study data')
        }

        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch study data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading your study dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Failed to load study data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          studentName="Student"
          studentId={studentId}
        />

        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Study Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your progress and continue learning</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-white border border-blue-200 rounded-xl px-6 py-3 flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.studyStreak}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
              <div className="bg-white border border-blue-200 rounded-xl px-6 py-3 flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{formatTime(data.totalTimeSpent)}</div>
                  <div className="text-xs text-gray-600">Total Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          {data.todaysTasks.length > 0 && (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Target className="w-5 h-5" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.todaysTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="bg-white rounded-lg p-4 border border-green-200 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {task.courseTitle}
                          </Badge>
                          <Badge 
                            variant={task.difficulty === 'EASY' ? 'secondary' : task.difficulty === 'MEDIUM' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {task.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900">{task.taskTitle}</h4>
                        <p className="text-sm text-gray-600">{task.lessonTitle}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedTime} mins</span>
                        </div>
                      </div>

{data.todaysTasks.map((task) => (
  <div
    key={task.taskId}
    className="bg-white rounded-lg p-4 border border-green-200 flex items-center justify-between"
  >
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className="text-xs">
          {task.courseTitle}
        </Badge>
        <Badge 
          variant={task.difficulty === 'EASY' ? 'secondary' : task.difficulty === 'MEDIUM' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {task.difficulty}
        </Badge>
      </div>
      <h4 className="font-semibold text-gray-900">{task.taskTitle}</h4>
      <p className="text-sm text-gray-600">{task.lessonTitle}</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{task.estimatedTime} mins</span>
      </div>
    </div>
    <Button
      onClick={() => router.push(`/study/lesson/${task.lessonId}`)}  // FIXED: Use lessonId
      className="bg-green-600 hover:bg-green-700"
    >
      {task.hasSubmission ? 'Continue' : 'Start'}
    </Button>
  </div>
))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Courses */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
            
            {data.courses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                  <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
                  <Link href="/study/courses">
                  <Button >
                    Browse Courses
                  </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.courses.map((course) => (
                  <Card key={course.courseId} className="border-blue-100 hover:shadow-lg transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">{course.level}</Badge>
                          <CardTitle className="text-xl mb-2">{course.courseTitle}</CardTitle>
                          <p className="text-sm text-gray-600 line-clamp-2">{course.courseDescription}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      {course.progress && (
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Overall Progress</span>
                              <span className="font-semibold text-blue-600">
                                {Math.round(course.progress.progressPercent)}%
                              </span>
                            </div>
                            <Progress value={course.progress.progressPercent} className="h-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-gray-600 mb-1">Lessons</div>
                              <div className="font-semibold text-gray-900">
                                {course.progress.lessonsCompleted}/{course.progress.totalLessons}
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-gray-600 mb-1">Tasks</div>
                              <div className="font-semibold text-gray-900">
                                {course.progress.tasksCompleted}/{course.progress.totalTasks}
                              </div>
                            </div>
                          </div>

                          {course.progress.overallScore && (
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="w-4 h-4 text-yellow-500" />
                              <span className="text-gray-600">Average Score:</span>
                              <span className="font-semibold text-gray-900">
                                {Math.round(course.progress.overallScore)}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Next Lesson */}
                      {course.nextLesson && (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Next Lesson</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {course.nextLesson.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Week {course.nextLesson.weekNumber}, Day {course.nextLesson.dayNumber}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {course.nextLesson ? (
                          <Button
                            onClick={() => router.push(`/study/lesson/${course.nextLesson!.lessonId}`)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="flex-1 border-green-600 text-green-600"
                            disabled
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Course Completed
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/study/course/${course.courseSlug}`)}
                        >
                          View Details
                        </Button>
                      </div>

                      {/* Time Spent */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <Clock className="w-3 h-3" />
                        <span>Time spent: {formatTime(course.totalTimeSpent)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}