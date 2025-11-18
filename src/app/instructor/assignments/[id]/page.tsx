'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

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
    score: number | null
    percentage: number | null
    submittedAt: string | null
    submissionText: string | null
    fileUrl: string | null
    githubUrl: string | null
    liveUrl: string | null
    videoUrl: string | null
    feedback: string | null
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
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null)
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' })
  const [grading, setGrading] = useState(false)

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await fetch(`/api/instructor/assignments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAssignment(data)
        setExpandedResultId(prev =>
          prev && data.results.every((result: Assignment['results'][number]) => result.id !== prev)
            ? null
            : prev
        )
      }
    } catch (error) {
      console.error('Error fetching assignment:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const handleToggleResult = (result: Assignment['results'][number]) => {
    if (expandedResultId === result.id) {
      setExpandedResultId(null)
      return
    }

    setExpandedResultId(result.id)
    setGradeForm({
      score: result.score != null ? String(result.score) : '',
      feedback: result.feedback ?? ''
    })
  }

  const handleGradeSubmit = async (resultId: string) => {
    if (!assignment) return

    const numericScore =
      gradeForm.score.trim() === '' ? null : Number(gradeForm.score)

    if (
      numericScore != null &&
      (Number.isNaN(numericScore) ||
        numericScore < 0 ||
        numericScore > assignment.maxScore)
    ) {
      alert(`Score must be between 0 and ${assignment.maxScore}`)
      return
    }

    setGrading(true)
    const toastId = toast.loading('Saving grade...')
    try {
      const response = await fetch(
        `/api/instructor/assignments/${assignment.id}/results/${resultId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            score: numericScore,
            feedback: gradeForm.feedback
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save grade')
      }

      const updatedResult = await response.json()
      setAssignment(prev => {
        if (!prev) return prev
        return {
          ...prev,
          results: prev.results.map(result =>
            result.id === resultId ? { ...result, ...updatedResult } : result
          )
        }
      })
      toast.success('Grade saved successfully', { id: toastId })
    } catch (error) {
      console.error('Error saving grade:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save grade. Please try again.',
        { id: toastId }
      )
    } finally {
      setGrading(false)
    }
  }

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
                    <div key={result.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">
                            {result.student.firstName} {result.student.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.student.user.email}
                          </div>
                          <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                            <span>
                              Submitted:{' '}
                              {result.submittedAt
                                ? new Date(result.submittedAt).toLocaleDateString()
                                : 'Not submitted'}
                            </span>
                            {result.isLate && result.submittedAt && (
                              <Badge variant="destructive">Late</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {result.score != null
                              ? `${result.score}/${assignment.maxScore}`
                              : `-/${assignment.maxScore}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.percentage != null
                              ? `${result.percentage.toFixed(1)}%`
                              : 'N/A'}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleToggleResult(result)}
                          >
                            {expandedResultId === result.id
                              ? 'Hide details'
                              : 'Review submission'}
                          </Button>
                        </div>
                      </div>

                      {expandedResultId === result.id && (
                        <div className="border-t pt-4 space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              Submission Text
                            </h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 border rounded-md p-3">
                              {result.submissionText || 'No submission text provided.'}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              Provided Links
                            </h4>
                            {[
                              { label: 'File', url: result.fileUrl },
                              { label: 'GitHub', url: result.githubUrl },
                              { label: 'Live Demo', url: result.liveUrl },
                              { label: 'Video', url: result.videoUrl }
                            ]
                              .filter(link => !!link.url)
                              .map(link => (
                                <a
                                  key={link.label}
                                  href={link.url as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline block"
                                >
                                  {link.label}: {link.url}
                                </a>
                              ))}
                            {![result.fileUrl, result.githubUrl, result.liveUrl, result.videoUrl].some(Boolean) && (
                              <p className="text-sm text-gray-500">No links provided.</p>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Grade & Feedback
                            </h4>
                            {result.feedback && gradeForm.feedback === '' && (
                              <p className="text-sm text-gray-500 mb-2">
                                Existing feedback: {result.feedback}
                              </p>
                            )}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                handleGradeSubmit(result.id)
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor={`score-${result.id}`}>
                                  Score (0 - {assignment.maxScore})
                                </Label>
                                <Input
                                  id={`score-${result.id}`}
                                  type="number"
                                  min={0}
                                  max={assignment.maxScore}
                                  value={gradeForm.score}
                                  onChange={(e) =>
                                    setGradeForm(prev => ({
                                      ...prev,
                                      score: e.target.value
                                    }))
                                  }
                                  placeholder="Enter score"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {gradeForm.score
                                    ? `≈ ${(
                                        (Number(gradeForm.score) /
                                          assignment.maxScore) *
                                        100
                                      ).toFixed(1)}%`
                                    : 'Enter a score to calculate percentage automatically.'}
                                </p>
                              </div>
                              <div>
                                <Label htmlFor={`feedback-${result.id}`}>Feedback</Label>
                                <Textarea
                                  id={`feedback-${result.id}`}
                                  rows={4}
                                  placeholder="Share actionable feedback with the student..."
                                  value={gradeForm.feedback}
                                  onChange={(e) =>
                                    setGradeForm(prev => ({
                                      ...prev,
                                      feedback: e.target.value
                                    }))
                                  }
                                />
                              </div>
                              <div className="flex gap-3">
                                <Button type="submit" disabled={grading}>
                                  {grading ? 'Saving...' : 'Save Grade'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setExpandedResultId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
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
                      {(() => {
                        const scored = assignment.results.filter(r => r.score != null)
                        if (scored.length === 0) return 'N/A'
                        const avg = scored.reduce((sum, r) => sum + (r.score as number), 0) / scored.length
                        return avg.toFixed(1)
                      })()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Percentage</span>
                    <span className="font-medium">
                      {(() => {
                        const withPercent = assignment.results.filter(r => r.percentage != null)
                        if (withPercent.length === 0) return 'N/A'
                        const avg =
                          withPercent.reduce((sum, r) => sum + (r.percentage as number), 0) /
                          withPercent.length
                        return `${avg.toFixed(1)}%`
                      })()}
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
