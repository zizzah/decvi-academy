'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  FolderKanban,
  BookOpen,
  BarChart3,
  Award,
  Flame,
  Video,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react'

// Import components
import { CheckInModal } from '@/components/components/dashboard/CheckInModal'
import { Sidebar } from '@/components/components/dashboard/Sidebar'
import { Navbar } from '@/components/components/dashboard/Navbar'
import { TodaysClassesWidget } from '@/components/components/dashboard/TodaysClassesWidget'

// Types
interface DashboardData {
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
  skills: Array<{
    skillName: string
    proficiencyScore: number
    level: string
  }>
  weeklyProgress: Array<{
    monthNumber: number
    weekNumber: number
    attendanceRate: number
  }>
  achievements: Array<{
    name: string
    type: string
    earnedAt: string
  }>
}

// Helper function
function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export default function StudentDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [studentId, setStudentId] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('/api/auth/me')
        
        if (!userResponse.ok) {
          router.push('/auth/login')
          return
        }

        const userData = await userResponse.json()
        
        if (userData.role === 'ADMIN') {
          router.push('/admin')
          return
        }
        
        if (!userData.profile?.id) {
          console.error('No student profile found')
          setLoading(false)
          return
        }

        const currentStudentId = userData.profile.id
        setStudentId(currentStudentId)

        const response = await fetch(`/api/students/${currentStudentId}/progress`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch progress')
        }
        
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const studentName = `${data.student.firstName} ${data.student.lastName}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          studentName={studentName} 
          studentId={studentId} 
        />

        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {data.student.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Here's your learning progress</p>
            </div>
            <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">{data.stats.totalPoints}</div>
                <div className="text-sm text-blue-100">Total Points</div>
              </div>
              <div className="w-px h-12 bg-blue-400" />
              <div className="text-center flex items-center space-x-2">
                <Flame className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold">{data.stats.currentStreak}</div>
                  <div className="text-sm text-blue-100">Day Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap gap-4">
            <Link href="/live-classes">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Video className="w-4 h-4 mr-2" />
                Join Live Class
              </Button>
            </Link>
            <Link href="/message">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-100 hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {data.stats.attendanceRate}%
                    </div>
                    <Progress value={data.stats.attendanceRate} className="mt-3 h-2" />
                    <p className="text-xs text-gray-600 mt-2">
                      {data.stats.attendanceRate >= 80 ? (
                        <span className="text-green-600 font-semibold">✓ On track</span>
                      ) : (
                        <span className="text-red-600 font-semibold">⚠ Below target</span>
                      )}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projects</CardTitle>
                    <FolderKanban className="h-5 w-5 text-blue-600" />
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

                <Card className="border-blue-100 hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {data.stats.averageScore}%
                    </div>
                    <Progress value={data.stats.averageScore} className="mt-3 h-2" />
                    <p className="text-xs text-gray-600 mt-2">
                      Grade: <span className="font-semibold">{calculateGrade(data.stats.averageScore)}</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                    <Award className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {data.achievements.length}
                    </div>
                    <p className="text-xs text-gray-600 mt-4">Badges earned</p>
                  </CardContent>
                </Card>
              </div>

              {/* Skills Section */}
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Skill Proficiency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.skills.slice(0, 6).map((skill, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {skill.skillName}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {skill.level}
                            </Badge>
                            <span className="text-sm font-semibold text-blue-600">
                              {skill.proficiencyScore}%
                            </span>
                          </div>
                        </div>
                        <Progress value={skill.proficiencyScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Section */}
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
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {achievement.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No achievements yet</p>
                        <p className="text-sm">Keep learning to earn badges!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto py-4">
                      <div className="text-center">
                        <FolderKanban className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Submit Project</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={() => setCheckInModalOpen(true)} 
                      variant="outline" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-4"
                    >
                      <div className="text-center">
                        <Calendar className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Check-In</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-4">
                      <div className="text-center">
                        <BookOpen className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Resources</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-4">
                      <div className="text-center">
                        <Award className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Certificate</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Today's Classes */}
            <div className="lg:col-span-1">
              <TodaysClassesWidget 
                studentId={studentId}
                onCheckIn={() => setCheckInModalOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        studentId={studentId}
      />
    </div>
  )
}