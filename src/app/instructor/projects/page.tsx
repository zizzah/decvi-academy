'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Eye, MessageSquare, ExternalLink, Github, Globe, Play } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED'
  submittedAt: string
  reviewedAt?: string
  feedback?: string
  monthNumber: number
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  videoUrl?: string
  student: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export default function InstructorProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [feedback, setFeedback] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/instructor/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (projectId: string, status: 'REVIEWED' | 'APPROVED') => {
    setReviewing(true)
    try {
      const response = await fetch(`/api/instructor/projects/${projectId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          feedback: feedback.trim()
        })
      })

      if (response.ok) {
        await fetchProjects()
        setSelectedProject(null)
        setFeedback('')
      }
    } catch (error) {
      console.error('Error reviewing project:', error)
    } finally {
      setReviewing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800'
      case 'REVIEWED':
        return 'bg-purple-100 text-purple-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Student Projects</h1>
        <p className="text-gray-600 mt-2">Review and provide feedback on student project submissions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>
                {project.student.firstName} {project.student.lastName} • Month {project.monthNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-1" />
                      Live
                    </a>
                  </Button>
                )}
                {project.videoUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 mr-1" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Submitted: {new Date(project.submittedAt).toLocaleDateString()}</span>
                {project.reviewedAt && (
                  <span>Reviewed: {new Date(project.reviewedAt).toLocaleDateString()}</span>
                )}
              </div>

              {project.status === 'SUBMITTED' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => setSelectedProject(project)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Review Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Review Project: {project.title}</DialogTitle>
                      <DialogDescription>
                        Provide feedback and update the project status
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="feedback">Feedback</Label>
                        <Textarea
                          id="feedback"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Provide constructive feedback..."
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReview(project.id, 'REVIEWED')}
                          disabled={reviewing}
                          variant="outline"
                        >
                          {reviewing ? 'Processing...' : 'Request Changes'}
                        </Button>
                        <Button
                          onClick={() => handleReview(project.id, 'APPROVED')}
                          disabled={reviewing}
                        >
                          {reviewing ? 'Processing...' : 'Approve Project'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {project.status === 'REVIEWED' && project.feedback && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-700 mb-1">Feedback Provided:</p>
                  <p className="text-sm text-blue-600">{project.feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects submitted yet</h3>
          <p className="text-gray-600">Student projects will appear here once they submit their work</p>
        </div>
      )}
    </div>
  )
}
