'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED'
  submittedAt?: string
  reviewedAt?: string
  feedback?: string
  monthNumber: number
  technologies: string[]
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
    console.log('Projects:', projects)
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'SUBMITTED':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'REVIEWED':
        return <Eye className="h-4 w-4 text-purple-500" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">Track your project submissions and progress</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/submit">
            <Plus className="h-4 w-4 mr-2" />
            Submit New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </Badge>
              </div>
              <CardDescription>
                Month {project.monthNumber} • {project.technologies.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              {project.status === 'REVIEWED' && project.feedback && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                  <p className="text-sm text-gray-600">{project.feedback}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {project.submittedAt
                    ? `Submitted: ${new Date(project.submittedAt).toLocaleDateString()}`
                    : 'Not submitted'
                  }
                </span>
                {project.reviewedAt && (
                  <span>
                    Reviewed: {new Date(project.reviewedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Start your learning journey by submitting your first project</p>
          <Button asChild>
            <Link href="/dashboard/projects/submit">
              <Plus className="h-4 w-4 mr-2" />
              Submit Your First Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
