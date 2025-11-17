'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload, FileText, Calendar, Clock } from 'lucide-react'
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
  allowLate: boolean
  latePenalty: number
}

export default function SubmitAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    submissionText: '',
    fileUrl: '',
    githubUrl: '',
    liveUrl: '',
    videoUrl: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchAssignment()
    }
  }, [params.id])

  const fetchAssignment = async () => {
    try {
      const response = await fetch(`/api/assignments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAssignment(data)
      } else if (response.status === 404) {
        router.push('/dashboard/assignments')
      }
    } catch (error) {
      console.error('Error fetching assignment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        assignmentId: params.id,
        ...formData
      }

      const response = await fetch(`/api/assignments/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/dashboard/assignments')
      } else {
        const errorData = await response.json()
        console.error('Error submitting assignment:', errorData)
        alert(`Error: ${errorData.error || 'Failed to submit assignment'}`)
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      alert('Failed to submit assignment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
          <p className="text-gray-600 mb-8">The assignment you are looking for do not exist.</p>
          <Button asChild>
            <Link href="/dashboard/assignments">
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
  const isLate = isOverdue && assignment.allowLate

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/dashboard/assignments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Assignment</h1>
            <p className="text-gray-600">{assignment.title}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Due: {dueDate.toLocaleDateString()}</span>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-2 text-red-600 mt-1">
                <Clock className="h-4 w-4" />
                <span>{isLate ? 'Late Submission' : 'Overdue'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submission Form</CardTitle>
              <CardDescription>
                Fill out the form below to submit your assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="submissionText">Submission Text *</Label>
                  <Textarea
                    id="submissionText"
                    value={formData.submissionText}
                    onChange={(e) => setFormData(prev => ({ ...prev, submissionText: e.target.value }))}
                    placeholder="Write your submission here..."
                    rows={6}
                    required
                    minLength={10}
                  />
                </div>

                <div>
                  <Label htmlFor="fileUrl">File URL (Optional)</Label>
                  <Input
                    id="fileUrl"
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/..."
                  />
                </div>

                <div>
                  <Label htmlFor="githubUrl">GitHub Repository URL (Optional)</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <Label htmlFor="liveUrl">Live Demo URL (Optional)</Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://your-app.vercel.app"
                  />
                </div>

                <div>
                  <Label htmlFor="videoUrl">Video Demo URL (Optional)</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/assignments">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={submitting || (!assignment.allowLate && isOverdue)}>
                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                  </Button>
                </div>
              </form>
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
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{assignment.type.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Month/Week</span>
                <span className="font-medium">Month {assignment.monthNumber}, Week {assignment.weekNumber}</span>
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
                <span className="text-gray-600">Due Date</span>
                <div className="text-right">
                  <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {dueDate.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dueDate.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {assignment.allowLate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Late Penalty</span>
                  <span className="font-medium">{assignment.latePenalty}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          {isOverdue && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Assignment is Overdue</span>
                </div>
                <p className="text-sm text-red-600">
                  {assignment.allowLate
                    ? `Late submissions are allowed with a ${assignment.latePenalty}% penalty.`
                    : 'Late submissions are not allowed.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
