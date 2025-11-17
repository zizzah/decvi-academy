'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, FileText, Users, Calendar, Eye } from 'lucide-react'
import Link from 'next/link'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  monthNumber: number
  weekNumber: number
  maxScore: number
  createdAt: string
  _count: {
    results: number
  }
}

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'QUIZ',
    topic: '',
    instructions: '',
    dueDate: '',
    monthNumber: 1,
    weekNumber: 1,
    maxScore: 100
  })

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/instructor/assignments')
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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      // Convert datetime-local to ISO string
      const isoDueDate = new Date(formData.dueDate).toISOString()

      const payload = {
        ...formData,
        dueDate: isoDueDate
      }

      const response = await fetch('/api/instructor/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchAssignments()
        setShowCreateDialog(false)
        setFormData({
          title: '',
          description: '',
          type: 'QUIZ',
          topic: '',
          instructions: '',
          dueDate: '',
          monthNumber: 1,
          weekNumber: 1,
          maxScore: 100
        })
      } else {
        const errorData = await response.json()
        console.error('Error creating assignment:', errorData)
        alert(`Error: ${errorData.error || 'Failed to create assignment'}`)
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Failed to create assignment. Please try again.')
    } finally {
      setCreating(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-2">Create and manage assignments for your students</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for your students
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Assignment title (minimum 5 characters)"
                  required
                  minLength={5}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Assignment description and requirements..."
                  rows={4}
                  required
                  minLength={10}
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="CODING_CHALLENGE">Coding Challenge</SelectItem>
                    <SelectItem value="PRACTICAL_EXAM">Practical Exam</SelectItem>
                    <SelectItem value="PEER_REVIEW">Peer Review</SelectItem>
                    <SelectItem value="ESSAY">Essay</SelectItem>
                    <SelectItem value="VIDEO_SUBMISSION">Video Submission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Assignment topic"
                  required
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instructions *</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Detailed instructions for the assignment..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthNumber">Month Number *</Label>
                  <Select
                    value={formData.monthNumber.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, monthNumber: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Month 1</SelectItem>
                      <SelectItem value="2">Month 2</SelectItem>
                      <SelectItem value="3">Month 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weekNumber">Week Number *</Label>
                  <Select
                    value={formData.weekNumber.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, weekNumber: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Week 1</SelectItem>
                      <SelectItem value="2">Week 2</SelectItem>
                      <SelectItem value="3">Week 3</SelectItem>
                      <SelectItem value="4">Week 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxScore">Max Score *</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
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
                <span>{assignment._count.results} submissions</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild className="flex-1">
                  <Link href={`/instructor/assignments/${assignment.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600 mb-4">Create your first assignment to get started</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Assignment
          </Button>
        </div>
      )}
    </div>
  )
}
