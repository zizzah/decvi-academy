'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  monthNumber: number
  weekNumber: number
  maxScore: number
  results?: {
    id: string
    score: number
    percentage: number
    submittedAt: string
    isLate: boolean
    feedback?: string
  }[]
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments')
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubmissionStatus = (assignment: Assignment) => {
    if (!assignment.results || assignment.results.length === 0) {
      return { status: 'not_submitted', text: 'Not Submitted' }
    }

    const latestResult = assignment.results[0]
    if (latestResult) {
      return {
        status: 'submitted',
        text: `Submitted (${latestResult.percentage}%)`,
        score: latestResult.score,
        percentage: latestResult.percentage,
        isLate: latestResult.isLate
      }
    }

    return { status: 'not_submitted', text: 'Not Submitted' }
  }

  const isOverdue = (dueDate: string) => {
    return new Date() > new Date(dueDate)
  }

  const getStatusColor = (assignment: Assignment) => {
    const submission = getSubmissionStatus(assignment)

    if (submission.status === 'submitted') {
      if (submission.isLate) {
        return 'bg-orange-100 text-orange-800'
      }
      return 'bg-green-100 text-green-800'
    }

    if (isOverdue(assignment.dueDate)) {
      return 'bg-red-100 text-red-800'
    }

    return 'bg-blue-100 text-blue-800'
  }

  const getStatusIcon = (assignment: Assignment) => {
    const submission = getSubmissionStatus(assignment)

    if (submission.status === 'submitted') {
      return <CheckCircle className="h-4 w-4" />
    }

    if (isOverdue(assignment.dueDate)) {
      return <AlertCircle className="h-4 w-4" />
    }

    return <Clock className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">View and submit your assignments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => {
          const submission = getSubmissionStatus(assignment)
          const overdue = isOverdue(assignment.dueDate)

          return (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <Badge className={getStatusColor(assignment)}>
                    {getStatusIcon(assignment)}
                    <span className="ml-1">{submission.text}</span>
                  </Badge>
                </div>
                <CardDescription>
                  Month {assignment.monthNumber}, Week {assignment.weekNumber} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {assignment.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Max Score: {assignment.maxScore}</span>
                  {submission.status === 'submitted' && (
                    <span>Score: {submission.score}/{assignment.maxScore}</span>
                  )}
                </div>

                {submission.status === 'submitted' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{submission.percentage}%</span>
                    </div>
                    <Progress value={submission.percentage} className="h-2" />
                  </div>
                )}

                {submission.status === 'submitted' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                    <p className="text-sm text-gray-600">{submission.status}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {submission.status === 'not_submitted' && !overdue && (
                    <Button asChild className="flex-1">
                      <Link href={`/dashboard/assignments/${assignment.id}/submit`}>
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </Link>
                    </Button>
                  )}

                  {submission.status === 'submitted' && (
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/dashboard/assignments/${assignment.id}`}>
                        View Details
                      </Link>
                    </Button>
                  )}

                  {overdue && submission.status === 'not_submitted' && (
                    <Button disabled className="flex-1">
                      Overdue
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments available</h3>
          <p className="text-gray-600">Assignments will be posted here when available</p>
        </div>
      )}
    </div>
  )
}
