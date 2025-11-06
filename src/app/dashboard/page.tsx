// app/dashboard/page.tsx - Complete Student Dashboard
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Target,
  Flame,
  Menu,
  Bell,
  User,
  LogOut,
  Home,
  FolderKanban,
  BarChart3,
  Settings
} from 'lucide-react'

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

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: true },
    { icon: <FolderKanban className="w-5 h-5" />, label: 'Projects' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Assignments' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress' },
    { icon: <Award className="w-5 h-5" />, label: 'Achievements' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect even if logout fails
      router.push('auth/login')
    }
  }

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DC VI Academy</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

function Navbar({ onMenuClick, studentName }: { onMenuClick: () => void; studentName: string }) {
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </Button>

        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900">
              {studentName}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function StudentDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // First get the current user
        const userResponse = await fetch('/api/auth/me')
        
        if (!userResponse.ok) {
          // Redirect to login if not authenticated
          router.push('/login')
          return
        }

        const userData = await userResponse.json()
        
        // Check if user is admin (should not be on student dashboard)
        if (userData.role === 'ADMIN') {
          router.push('/admin')
          return
        }
        
        // Check if user has a student profile
        if (!userData.profile?.id) {
          console.error('No student profile found')
          setLoading(false)
          return
        }

        // Fetch progress data with actual student ID
        const studentId = userData.profile.id
        const response = await fetch(`/api/students/${studentId}/progress`)
        
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
        <Navbar onMenuClick={() => setSidebarOpen(true)} studentName={studentName} />

        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {data.student.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Here is your learning progress</p>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Skills and Achievements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>

          {/* Quick Actions */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto py-4">
                  <div className="text-center">
                    <FolderKanban className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">Submit Project</div>
                  </div>
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-4">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">Check-In</div>
                  </div>
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-4">
                  <div className="text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">View Resources</div>
                  </div>
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-4">
                  <div className="text-center">
                    <Award className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">My Certificate</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}