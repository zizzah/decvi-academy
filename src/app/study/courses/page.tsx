// app/study/courses/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  Target,
  CheckCircle2,
  Users,
  TrendingUp 
} from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  durationWeeks: number
  level: string
  thumbnailUrl: string | null
  tags: string[]
  isEnrolled: boolean
  enrollmentCount?: number
}

export default function BrowseCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [studentId, setStudentId] = useState('')
  const [enrolling, setEnrolling] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const userResponse = await fetch('/api/auth/me')
      if (!userResponse.ok) {
        router.push('/auth/login')
        return
      }

      const userData = await userResponse.json()
      const currentStudentId = userData.profile.id
      setStudentId(currentStudentId)

      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Failed to fetch courses')

      const data = await response.json()
      
      // Check enrollment status for each course
      const coursesWithEnrollment = await Promise.all(
        data.courses.map(async (course: Course) => {
          const enrollResponse = await fetch(
            `/api/courses/${course.slug}/enroll?studentId=${currentStudentId}`
          )
          const enrollData = await enrollResponse.json()
          
          return {
            ...course,
            isEnrolled: enrollData.isEnrolled
          }
        })
      )

      setCourses(coursesWithEnrollment)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseSlug: string) => {
    if (!studentId) return

    setEnrolling(prev => ({ ...prev, [courseSlug]: true }))

    try {
      const response = await fetch(`/api/courses/${courseSlug}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to enroll')
        return
      }

      alert('Successfully enrolled!')
      router.push('/study')
    } catch (error) {
      console.error('Failed to enroll:', error)
      alert('Failed to enroll in course')
    } finally {
      setEnrolling(prev => ({ ...prev, [courseSlug]: false }))
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800'
      case 'ADVANCED':
        return 'bg-purple-100 text-purple-800'
      case 'EXPERT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/study')}
            className="mb-4"
          >
            ← Back to Study
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Courses</h1>
          <p className="text-gray-600 text-lg">
            Explore our curriculum and start your learning journey
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className={`hover:shadow-lg transition ${
                course.isEnrolled ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  {course.isEnrolled && (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Enrolled
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.durationWeeks} weeks</span>
                  </div>
                  {course.enrollmentCount !== undefined && course.enrollmentCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount} students</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {course.isEnrolled ? (
                    <Button
                      onClick={() => router.push('/study')}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEnroll(course.slug)}
                      disabled={enrolling[course.slug]}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {enrolling[course.slug] ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Courses Available
              </h3>
              <p className="text-gray-600">
                Check back soon for new courses!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}