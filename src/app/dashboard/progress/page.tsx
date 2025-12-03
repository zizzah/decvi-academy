'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  BookOpen,
  BarChart3,
  Flame,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Skill {
  skillName: string
  proficiencyScore: number
  level: string
}

interface WeeklyProgress {
  monthNumber: number
  weekNumber: number
  attendanceRate: number
}

interface Project {
  id: string
  title: string
  status: string
  createdAt: string
  grade?: number
}

interface Achievement {
  name: string
  type: string
  earnedAt: string
}

interface ProgressData {
  student: {
    firstName: string
    lastName: string
  }
  stats: {
    attendanceRate: number
    projectsCompleted: number
    totalProjects: number
    averageScore: number
    totalPoints: number
    currentStreak: number
  }
  skills: Skill[]
  projects: Project[]
  weeklyProgress: WeeklyProgress[]
  achievements: Achievement[]
}

export default function ProgressPage() {
  const router = useRouter()
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      try {
        // First get the current user
        const userResponse = await fetch('/api/auth/me')
        if (!userResponse.ok) {
          router.push('/auth/login')
          return
        }

        const userData = await userResponse.json()
        if (!userData.profile?.id) {
          console.error('No student profile found')
          setLoading(false)
          return
        }

        const studentId = userData.profile.id

        // Fetch progress data
        const response = await fetch(`/api/students/${studentId}/progress`)
        if (!response.ok) {
          throw new Error('Failed to fetch progress')
        }

        const progressData = await response.json()
        setData(progressData)
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [router])

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'text-purple-600 bg-purple-100'
      case 'advanced':
        return 'text-blue-600 bg-blue-100'
      case 'intermediate':
        return 'text-green-600 bg-green-100'
      case 'beginner':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'submitted':
        return 'text-blue-600 bg-blue-100'
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Failed to load progress data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Report</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data.stats.attendanceRate}%</div>
              <Progress value={data.stats.attendanceRate} className="mt-3 h-2" />
              <p className="text-xs text-gray-600 mt-2">
                {data.stats.attendanceRate >= 80 ? 'Excellent' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {data.stats.projectsCompleted}/{data.stats.totalProjects}
              </div>
              <Progress
                value={(data.stats.projectsCompleted / data.stats.totalProjects) * 100}
                className="mt-3 h-2"
              />
              <p className="text-xs text-gray-600 mt-2">Projects completed</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data.stats.averageScore}%</div>
              <Progress value={data.stats.averageScore} className="mt-3 h-2" />
              <p className="text-xs text-gray-600 mt-2">
                Grade: <span className="font-semibold">{calculateGrade(data.stats.averageScore)}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data.stats.totalPoints}</div>
              <div className="flex items-center gap-2 mt-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">{data.stats.currentStreak} day streak</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills and Weekly Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Section */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Skill Proficiency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.skills.length > 0 ? (
                    data.skills.map((skill, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {skill.skillName}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getSkillLevelColor(skill.level)}`}>
                              {skill.level}
                            </Badge>
                            <span className="text-sm font-semibold text-blue-600">
                              {skill.proficiencyScore}%
                            </span>
                          </div>
                        </div>
                        <Progress value={skill.proficiencyScore} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No skill data available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Weekly Attendance Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.weeklyProgress.length > 0 ? (
                  <div className="space-y-4">
                    {data.weeklyProgress.slice(-8).map((week, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900 min-w-[80px]">
                            M{week.monthNumber} W{week.weekNumber}
                          </div>
                          <div className="flex-1 max-w-xs">
                            <Progress value={week.attendanceRate} className="h-2" />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600 min-w-[40px]">
                          {week.attendanceRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No weekly progress data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Projects and Achievements */}
          <div className="space-y-8">
            {/* Recent Projects */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Recent Projects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.projects.length > 0 ? (
                    data.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {project.status === 'APPROVED' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {project.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getProjectStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            {project.grade && (
                              <span className="text-xs text-gray-600">
                                Grade: {project.grade}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No projects yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.achievements.length > 0 ? (
                    data.achievements.map((achievement, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {achievement.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No achievements yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
