// ============================================
// app/dashboard/page.tsx - COMPLETE Student Dashboard
// ============================================
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
  Settings,
  Video,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

// ============================================
// TYPE DEFINITIONS
// ============================================
interface ClassItem {
  id: string
  title: string
  description?: string
  topic: string
  scheduledAt: string
  duration: number
  instructor: string
  deliveryMode: string
  cohort?: string
  zoomLink?: string
  hasCheckedIn: boolean
  attendanceStatus?: string
  checkInTime?: string
  isLiveClass?: boolean
  status?: string
  monthNumber?: number
  weekNumber?: number
  classType?: string
}

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

interface ClassesApiResponse {
  classes: ClassItem[]
  studentId: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

// ============================================
// CHECK-IN MODAL COMPONENT
// ============================================
function CheckInModal({
  isOpen,
  onClose,
  studentId
}: {
  isOpen: boolean
  onClose: () => void
  studentId: string
}) {
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'QR_CODE' | 'MANUAL'>('MANUAL')
  const [qrCode, setQrCode] = useState('')
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [success, setSuccess] = useState<{
    status: string
    lateMinutes: number
    pointsAwarded: number
  } | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchActiveClasses()
      getLocation()
    }
  }, [isOpen])

  const fetchActiveClasses = async () => {
    try {
      const response = await fetch('/api/classes/active')
      if (response.ok) {
        const data: ClassesApiResponse = await response.json()
        // Filter out classes already checked into
        const availableClasses = data.classes.filter(cls => !cls.hasCheckedIn)
        setClasses(availableClasses)
        console.log('Fetched active classes:', availableClasses)
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedClass) {
      alert('Please select a class')
      return
    }

    if (method === 'QR_CODE' && !qrCode) {
      alert('Please enter QR code')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          classId: selectedClass,
          method,
          qrCode: method === 'QR_CODE' ? qrCode : undefined,
          latitude: location?.latitude,
          longitude: location?.longitude,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess({
          status: data.attendance.status,
          lateMinutes: data.attendance.lateMinutes,
          pointsAwarded: data.attendance.pointsAwarded,
        })
        
        // Close modal and refresh after 2.5 seconds
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 2500)
      } else {
        alert(`❌ ${data.error || 'Check-in failed'}`)
      }
    } catch (error) {
      console.error('Check-in error:', error)
      alert('❌ An error occurred during check-in')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  console.log(classes)

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check-in Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Status: <span className={`font-semibold ${success.status === 'PRESENT' ? 'text-green-600' : 'text-orange-600'}`}>
              {success.status}
            </span>
          </p>
          {success.lateMinutes > 0 && (
            <p className="text-sm text-orange-600 mb-2">
              You were {success.lateMinutes} minute{success.lateMinutes !== 1 ? 's' : ''} late
            </p>
          )}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">Points Earned</p>
            <p className="text-3xl font-bold text-blue-600">+{success.pointsAwarded}</p>
          </div>
          <p className="text-xs text-gray-500">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Check-In to Class</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-In Method
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod('MANUAL')}
                className={`flex-1 py-2 px-4 rounded-lg border transition ${
                  method === 'MANUAL'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setMethod('QR_CODE')}
                className={`flex-1 py-2 px-4 rounded-lg border transition ${
                  method === 'QR_CODE'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                QR Code
              </button>
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            {classes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">No classes available</p>
                <p className="text-sm">Check back when a class is scheduled</p>
              </div>
            ) : (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} • {cls.topic} • {new Date(cls.scheduledAt).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Class Details */}
          {selectedClass && classes.find(c => c.id === selectedClass) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <div className="font-medium text-blue-900 mb-1">
                {classes.find(c => c.id === selectedClass)?.title}
              </div>
              <div className="text-blue-700 space-y-1">
                <div>📚 {classes.find(c => c.id === selectedClass)?.topic}</div>
                <div>👨‍🏫 {classes.find(c => c.id === selectedClass)?.instructor}</div>
                <div>📍 {classes.find(c => c.id === selectedClass)?.deliveryMode}</div>
                <div>⏰ {classes.find(c => c.id === selectedClass)?.duration} minutes</div>
              </div>
            </div>
          )}

          {/* QR Code Input */}
          {method === 'QR_CODE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code
              </label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Enter or scan QR code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Location Status */}
          <div className="text-xs text-gray-500">
            {location ? (
              <span className="text-green-600">✓ Location captured</span>
            ) : (
              <span className="text-gray-400">📍 Location not available</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || classes.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Checking In...' : 'Check In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// TODAY'S CLASSES WIDGET
// ============================================
function TodaysClassesWidget({
  studentId,
  onCheckIn
}: {
  studentId: string
  onCheckIn: () => void
}) {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodaysClasses()
  }, [])

  const fetchTodaysClasses = async () => {
    try {
      const response = await fetch('/api/classes/active', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched classes from API:', data)
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeUntilClass = (scheduledAt: string) => {
    const now = new Date()
    const classTime = new Date(scheduledAt)
    const diffMs = classTime.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 0) {
      return 'In Progress'
    } else if (diffMins < 60) {
      return `Starts in ${diffMins}m`
    } else {
      const hours = Math.floor(diffMins / 60)
      return `Starts in ${hours}h ${diffMins % 60}m`
    }
  }

  const getStatusBadge = (cls: ClassItem) => {
    if (cls.isLiveClass) {
      // Handle live class status
      if (cls.status === 'LIVE') {
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            🔴 Live Now
          </Badge>
        )
      } else if (cls.status === 'COMPLETED') {
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            ✓ Completed
          </Badge>
        )
      } else if (cls.hasCheckedIn) {
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            ✓ Joined
          </Badge>
        )
      } else {
        const now = new Date()
        const classTime = new Date(cls.scheduledAt)
        const diffMins = Math.floor((classTime.getTime() - now.getTime()) / 60000)

        if (diffMins <= 0) {
          return (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              Starting Soon
            </Badge>
          )
        } else if (diffMins <= 30) {
          return (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              Starting Soon
            </Badge>
          )
        } else {
          return (
            <Badge variant="outline" className="text-gray-600">
              Scheduled
            </Badge>
          )
        }
      }
    } else {
      // Handle regular class status
      if (cls.hasCheckedIn) {
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            ✓ Checked In
          </Badge>
        )
      }

      const now = new Date()
      const classTime = new Date(cls.scheduledAt)
      const diffMins = Math.floor((classTime.getTime() - now.getTime()) / 60000)

      if (diffMins <= 0) {
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            🔴 Live Now
          </Badge>
        )
      } else if (diffMins <= 30) {
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Starting Soon
          </Badge>
        )
      } else {
        return (
          <Badge variant="outline" className="text-gray-600">
            Upcoming
          </Badge>
        )
      }
    }
  }

  if (loading) {
    return (
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>{"Today's Classes"} </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>{"Today's Classes"}</span>
          </div>
          <Badge variant="outline">{classes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No classes scheduled</p>
            <p className="text-sm">Enjoy your day off!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                    <p className="text-sm text-gray-600">{cls.topic}</p>
                  </div>
                  {getStatusBadge(cls)}
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>
                      {new Date(cls.scheduledAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                      {getTimeUntilClass(cls.scheduledAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👨‍🏫</span>
                    <span>{cls.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{cls.deliveryMode}</span>
                    {cls.deliveryMode !== 'IN_PERSON' && cls.zoomLink && (
                      <a
                        href={cls.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Join Link
                      </a>
                    )}
                  </div>
                </div>

                {!cls.hasCheckedIn && !cls.isLiveClass && (
                  <Button
                    onClick={onCheckIn}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Check In Now
                  </Button>
                )}

                {cls.isLiveClass && cls.zoomLink && cls.status === 'LIVE' && (
                  <Button
                    onClick={() => window.open(cls.zoomLink, '_blank')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    🔴 Join Live Class
                  </Button>
                )}

                {cls.isLiveClass && cls.zoomLink && cls.status !== 'LIVE' && cls.status !== 'COMPLETED' && (
                  <Button
                    onClick={() => window.open(cls.zoomLink, '_blank')}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    size="sm"
                  >
                    Join Class
                  </Button>
                )}

                {cls.hasCheckedIn && !cls.isLiveClass && cls.checkInTime && (
                  <div className="text-center text-sm text-green-600 font-medium py-2 bg-green-50 rounded">
                    ✓ Checked in as {cls.attendanceStatus} at{' '}
                    {new Date(cls.checkInTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                )}

                {cls.isLiveClass && cls.hasCheckedIn && cls.checkInTime && (
                  <div className="text-center text-sm text-green-600 font-medium py-2 bg-green-50 rounded">
                    ✓ Joined at{' '}
                    {new Date(cls.checkInTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================
// SIDEBAR COMPONENT
// ============================================
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: true, href: '/dashboard' },
    { icon: <FolderKanban className="w-5 h-5" />, label: 'Projects', href: '/dashboard/projects' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Assignments', href: '/dashboard/assignments' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', href: '/dashboard/progress' },
    { icon: <Award className="w-5 h-5" />, label: 'Achievements', href: '/dashboard/achievements' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/dashboard/settings' },
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DC VI Academy</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href || '#'}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
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

// ============================================
// NAVBAR COMPONENT
// ============================================
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

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
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
        // First get the current user
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

        // Fetch progress data
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

  const handleCheckIn = () => {
    setCheckInModalOpen(true)
  }

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
              <p className="text-gray-600 mt-1">{"Here's your learning progress"}</p>
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

          {/* Main Content Grid - Stats and Today's Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats and Content */}
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

              {/* Skills and Achievements Grid */}
              <div className="grid grid-cols-1 gap-6">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto py-4">
                      <div className="text-center">
                        <FolderKanban className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Submit Project</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleCheckIn} 
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

            {/* Right Column - Today's Classes Widget */}
            <div className="lg:col-span-1">
              <TodaysClassesWidget 
                studentId={studentId}
                onCheckIn={handleCheckIn}
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