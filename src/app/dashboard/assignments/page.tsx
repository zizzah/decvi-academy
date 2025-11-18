'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, FileText } from 'lucide-react'

interface AssignmentResult {
  id: string
  score: number | null
  percentage: number | null
  submittedAt: string | null
  isLate: boolean | null
  feedback: string | null
}

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
  allowLate: boolean
  latePenalty: number
  results?: AssignmentResult[]
}

export default function StudentAssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const response = await fetch('/api/assignments')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login')
            return
          }
          throw new Error('Failed to load assignments')
        }
        const data = await response.json()
        setAssignments(data)
      } catch (error) {
        console.error('Error fetching assignments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            View and submit your assignments. Stay on top of your coursework.
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No assignments yet
          </h2>
          <p className="text-gray-600 mb-4">
            Your instructor hasn&apos;t published any assignments for you.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map(assignment => {
            const dueDate = new Date(assignment.dueDate)
            const isOverdue = dueDate < new Date()
            const latestResult = assignment.results?.[0] ?? null
            const isSubmitted = !!latestResult?.submittedAt

            return (
              <Card
                key={assignment.id}
                className="border-blue-50 hover:shadow-md transition-shadow flex flex-col"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {assignment.title}
                    </CardTitle>
                    <Badge variant="outline" className="uppercase text-xs">
                      {assignment.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {assignment.description}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Topic</span>
                      <span className="font-medium text-gray-900">
                        {assignment.topic}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due
                      </span>
                      <span className="font-medium text-gray-900">
                        {dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Month / Week</span>
                      <span className="font-medium text-gray-900">
                        M{assignment.monthNumber} · W{assignment.weekNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    {isSubmitted ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                          Submitted
                        </Badge>
                        {latestResult?.percentage != null && (
                          <div className="text-gray-700">
                            Score:{' '}
                            <span className="font-semibold">
                              {latestResult.percentage.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className={
                            isOverdue && !assignment.allowLate
                              ? 'border-red-200 text-red-700 bg-red-50'
                              : 'border-amber-200 text-amber-700 bg-amber-50'
                          }
                        >
                          {isOverdue
                            ? assignment.allowLate
                              ? 'Overdue (late allowed)'
                              : 'Overdue'
                            : 'Pending'}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Max {assignment.maxScore} pts</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/dashboard/assignments/${assignment.id}/submit`}>
                        {isSubmitted ? 'View / Resubmit' : 'Submit'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}