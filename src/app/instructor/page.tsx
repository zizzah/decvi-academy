// src/app/instructor/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import {
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  MessageSquare,
  FileText,
  Bell,
  User,
  LogOut,
  Menu,
  CheckCircle,
  AlertCircle,
  Play,
  Video
} from 'lucide-react'

interface ClassSession {
  id: string
  title: string
  classType: string
  deliveryMode: string
  scheduledAt: string
  duration: number
  cohort: {
    name: string
  }
  attendanceCount: number
  totalStudents: number
  zoomLink?: string
  recordingUrl?: string
}

interface PendingProject {
  id: string
  title: string
  student: {
    firstName: string
    lastName: string
  }
  submittedAt: string
  monthNumber: number
}

interface InstructorStats {
  totalClasses: number
  upcomingClasses: number
  totalStudents: number
  averageAttendance: number
  projectsToReview: number
  feedbackReceived: number
}

interface DashboardData {
  instructor: {
    firstName: string
    lastName: string
    expertise: string[]
  }
  stats: InstructorStats
  upcomingClasses: ClassSession[]
  recentClasses: ClassSession[]
  pendingProjects: PendingProject[]
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  
  const menuItems = [
    { icon: <BookOpen className="w-5 h-5" />, label: 'Dashboard', active: true },
    { icon: <Calendar className="w-5 h-5" />, label: 'My Classes' },
    { icon: <Users className="w-5 h-5" />, label: 'Students' },
    { icon: <FileText className="w-5 h-5" />, label: 'Projects' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Feedback' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Performance' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/auth/login')
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Instructor Portal</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-purple-50 text-purple-600'
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

function Navbar({ onMenuClick, instructorName }: { onMenuClick: () => void; instructorName: string }) {
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
          <h1 className="text-xl font-bold text-gray-900">Instructor Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900">
              {instructorName}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function InstructorDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('/api/auth/me')
        
        if (!userResponse.ok) {
          router.push('/auth/login')
          return
        }

        const userData = await userResponse.json()
        
        if (userData.role !== 'INSTRUCTOR') {
          router.push('/unauthorized')
          return
        }
        
        if (!userData.profile?.id) {
          console.error('No instructor profile found')
          setLoading(false)
          return
        }

        const instructorId = userData.profile.id
        const response = await fetch(`/api/instructor/${instructorId}/dashboard`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
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

  const instructorName = `${data.instructor.firstName} ${data.instructor.lastName}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} instructorName={instructorName} />

        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {data.instructor.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">Here is your teaching overview</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Class
              </Button>
              <Button variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Join Meeting
              </Button>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2">
            {data.instructor.expertise.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-purple-600 border-purple-600">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-purple-100 hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data.stats.totalClasses}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {data.stats.upcomingClasses} upcoming
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data.stats.totalStudents}
                </div>
                <p className="text-xs text-gray-600 mt-2">Across all cohorts</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data.stats.averageAttendance}%
                </div>
                <Progress value={data.stats.averageAttendance} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects to Review</CardTitle>
                <FileText className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data.stats.projectsToReview}
                </div>
                <p className="text-xs text-red-600 mt-2">
                  {data.stats.projectsToReview > 0 ? 'Pending review' : 'All caught up!'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
                <Award className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data.stats.feedbackReceived}
                </div>
                <p className="text-xs text-gray-600 mt-2">Student reviews</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Clock className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data.upcomingClasses.length}
                </div>
                <p className="text-xs text-gray-600 mt-2">Classes scheduled</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Classes */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Upcoming Classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.upcomingClasses.length > 0 ? (
                  data.upcomingClasses.map((classSession) => (
                    <div
                      key={classSession.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{classSession.title}</h3>
                            <p className="text-sm text-gray-600">
                              {classSession.cohort.name} • {classSession.deliveryMode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(classSession.scheduledAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(classSession.scheduledAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {classSession.zoomLink && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No upcoming classes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Classes & Pending Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Classes */}
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Recent Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentClasses.length > 0 ? (
                    data.recentClasses.map((classSession) => (
                      <div
                        key={classSession.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{classSession.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(classSession.scheduledAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {classSession.attendanceCount}/{classSession.totalStudents}
                          </p>
                          <p className="text-xs text-gray-600">Attendance</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No recent classes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Projects */}
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span>Pending Project Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.pendingProjects.length > 0 ? (
                    data.pendingProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{project.title}</p>
                          <p className="text-sm text-gray-600">
                            {project.student.firstName} {project.student.lastName}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="border-orange-600 text-orange-600">
                          Review
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>All caught up!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}