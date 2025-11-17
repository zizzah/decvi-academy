'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

interface Assignment {
  id: string
  title: string
  description: string
  type: string
  topic: string
  instructions: string
  dueDate: string
  monthNumber: number
  weekNumber: number
  maxScore: number
  passingScore: number
  createdAt: string
  _count: {
    results: number
  }
  results: Array<{
    id: string
    score: number
    percentage: number
    submittedAt: string
    isLate: boolean
    student: {
      id: string
      firstName: string
      lastName: string
      user: {
        email: string
      }
    }
  }>
}

export default function AssignmentDetailsPage() {
  const params = useParams()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await fetch(`/api/instructor/assignments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAssignment(data)
      }
    } catch (error) {
      console.error('Error fetching assignment:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchAssignment()
    }
  }, [params.id, fetchAssignment])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assignment Not Found</h1>
          <p className="text-gray-600 mb-8">The assignment you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/instructor/assignments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const dueDate = new Date(assignment.dueDate)
  const isOverdue = dueDate < new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/instructor/assignments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Month {assignment.monthNumber}, Week {assignment.weekNumber}
              </span>
              <Badge variant={assignment.type === 'QUIZ' ? 'default' : 'secondary'}>
                {assignment.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {assignment._count.results}
            </div>
            <div className="text-sm text-gray-600">Submissions</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{assignment.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Topic</h3>
                <p className="text-gray-600">{assignment.topic}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{assignment.instructions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                Student submissions and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignment.results.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignment.results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {result.student.firstName} {result.student.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.student.user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                          {result.isLate && (
                            <Badge variant="destructive" className="ml-2">Late</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {result.score}/{assignment.maxScore}
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Due Date</span>
                <div className="text-right">
                  <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {dueDate.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dueDate.toLocaleTimeString()}
                  </div>
                  {isOverdue && (
                    <Badge variant="destructive" className="mt-1">Overdue</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Max Score</span>
                <span className="font-medium">{assignment.maxScore}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Passing Score</span>
                <span className="font-medium">{assignment.passingScore}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(assignment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Submissions</span>
                <span className="font-medium">{assignment._count.results}</span>
              </div>

              {assignment.results.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-medium">
                      {(assignment.results.reduce((sum, r) => sum + r.score, 0) / assignment.results.length).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Percentage</span>
                    <span className="font-medium">
                      {(assignment.results.reduce((sum, r) => sum + r.percentage, 0) / assignment.results.length).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Late Submissions</span>
                    <span className="font-medium">
                      {assignment.results.filter(r => r.isLate).length}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
