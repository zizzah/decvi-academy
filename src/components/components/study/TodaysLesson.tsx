'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Play, BookOpen } from 'lucide-react'

interface TodaysLessonProps {
  lesson: {
    courseTitle: string
    weekNumber: number
    dayNumber: number
    lessonTitle: string
    lessonId: string
  } | null
  onStartLesson?: (lessonId: string) => void
}

export function TodaysLesson({ lesson, onStartLesson }: TodaysLessonProps) {
  if (!lesson) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lesson Today</h3>
            <p className="text-gray-600 text-sm">
              Complete your current lessons to unlock the next one, or enroll in a new course to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <BookOpen className="w-5 h-5" />
          Today's Lesson
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Course:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {lesson.courseTitle}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Week:</span>
            <span className="text-sm text-gray-600">{lesson.weekNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Day:</span>
            <span className="text-sm text-gray-600">{lesson.dayNumber}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">{lesson.lessonTitle}</h4>
          <p className="text-sm text-gray-600">
            Ready to continue your learning journey? Start this lesson to build your skills.
          </p>
        </div>

        <Button
          onClick={() => onStartLesson?.(lesson.lessonId)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Lesson
        </Button>
      </CardContent>
    </Card>
  )
}
