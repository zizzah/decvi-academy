'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { projectSubmissionSchema } from '@/lib/validations'
import { toast } from 'sonner'

interface ProjectSubmission {
  id: string
  title: string
  description: string
  githubUrl: string | null
  liveUrl: string | null
  videoUrl: string | null
  technologies: string[]
  monthNumber: number
  status: string
  submittedAt: string | null
  reviewedAt: string | null
  overallScore: number | null
  feedback: string | null
}

interface ProjectFormState {
  title: string
  description: string
  githubUrl: string
  liveUrl: string
  videoUrl: string
  technologies: string[]
  monthNumber: number
}

const createInitialForm = (monthNumber: number): ProjectFormState => ({
  title: '',
  description: '',
  githubUrl: '',
  liveUrl: '',
  videoUrl: '',
  technologies: [],
  monthNumber,
})

export default function ProjectSubmissionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormState>(() => createInitialForm(1))
  const [techInput, setTechInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fetchingSubmission, setFetchingSubmission] = useState(true)
  const [existingProject, setExistingProject] = useState<ProjectSubmission | null>(null)

  const isProjectLocked = !!existingProject && existingProject.overallScore !== null
  const hasSubmission = !!existingProject

  const fetchProject = useCallback(
    async (month: number) => {
      try {
        setFetchingSubmission(true)
        const response = await fetch(`/api/projects/submit?monthNumber=${month}`)

        if (response.status === 401) {
          router.push('/auth/login')
          return
        }

        if (!response.ok) {
          console.error('Failed to fetch project submission')
          setExistingProject(null)
          setFormData(createInitialForm(month))
          return
        }

        const data = await response.json()
        setExistingProject(data.project ?? null)

        if (data.project) {
          setFormData({
            title: data.project.title ?? '',
            description: data.project.description ?? '',
            githubUrl: data.project.githubUrl ?? '',
            liveUrl: data.project.liveUrl ?? '',
            videoUrl: data.project.videoUrl ?? '',
            technologies: data.project.technologies ?? [],
            monthNumber: data.project.monthNumber ?? month,
          })
        } else {
          setFormData(createInitialForm(month))
        }
      } catch (error) {
        console.error('Error fetching project submission:', error)
        setExistingProject(null)
        setFormData(createInitialForm(month))
      } finally {
        setFetchingSubmission(false)
      }
    },
    [router]
  )

  useEffect(() => {
    fetchProject(formData.monthNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.monthNumber])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isProjectLocked) {
      toast.error('This project has already been reviewed and cannot be updated.')
      return
    }

    setSubmitting(true)

    try {
      const payload = projectSubmissionSchema.parse(formData)

      const response = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      if (response.ok) {
        const data = await response.json()
        setExistingProject(data.project)
        toast.success('Project submitted successfully!')
        fetchProject(formData.monthNumber)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit project')
      }
    } catch (error) {
      console.error('Validation error:', error)
      toast.error('Please check your input and try again')
    } finally {
      setSubmitting(false)
    }
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech),
    }))
  }

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
  }

  if (fetchingSubmission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading your project submission...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit New Project</h1>
        <p className="text-gray-600 mt-2">Share your work and get feedback from instructors</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the details about your project. Make sure to provide clear descriptions and links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProjectLocked && existingProject && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="text-sm text-green-900 space-y-1">
                <p className="font-semibold">This project has been reviewed.</p>
                <p>
                  Score:{' '}
                  <span className="font-semibold">{existingProject.overallScore}%</span>
                </p>
                {existingProject.feedback && (
                  <p>
                    Feedback: <span className="italic">{existingProject.feedback}</span>
                  </p>
                )}
                <p className="text-xs text-green-700">
                  Further edits are disabled. Contact your instructor if you need help.
                </p>
              </div>
            </div>
          )}

          {!isProjectLocked && hasSubmission && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Submission pending review</p>
              <p>Feel free to update your project until it has been reviewed.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your project title"
                required
                disabled={isProjectLocked}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project, what it does, and the technologies used..."
                rows={4}
                required
                disabled={isProjectLocked}
              />
            </div>

            <div>
              <Label htmlFor="monthNumber">Month Number *</Label>
              <Select
                value={formData.monthNumber.toString()}
                onValueChange={(value) => {
                  const month = parseInt(value, 10)
                  setFormData(prev => ({ ...prev, monthNumber: month }))
                }}
                disabled={isProjectLocked}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Month 1</SelectItem>
                  <SelectItem value="2">Month 2</SelectItem>
                  <SelectItem value="3">Month 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="technologies">Technologies Used *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="technologies"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={handleTechKeyPress}
                  placeholder="Add technology (e.g., React, Node.js)"
                  disabled={isProjectLocked}
                />
                <Button type="button" onClick={addTechnology} variant="outline" disabled={isProjectLocked}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    {!isProjectLocked && (
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="githubUrl">GitHub Repository URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/project"
                disabled={isProjectLocked}
              />
            </div>

            <div>
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://myproject.com"
                disabled={isProjectLocked}
              />
            </div>

            <div>
              <Label htmlFor="videoUrl">Demo Video URL</Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                disabled={isProjectLocked}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || isProjectLocked}>
                {isProjectLocked
                  ? 'Submission Locked'
                  : submitting
                    ? 'Submitting...'
                    : 'Submit Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
