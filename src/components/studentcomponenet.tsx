
// ============================================
// 6. components/StudentDashboard.tsx
// ============================================

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calendar, Award, TrendingUp, BookOpen } from 'lucide-react'

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

export function StudentDashboard({ studentId }: { studentId: string }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/students/${studentId}/progress`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!data) {
    return <div>Failed to load dashboard</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {data.student.firstName}!
          </h1>
          <p className="text-gray-600">Here is your learning progress</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">
            {data.stats.totalPoints} pts
          </div>
          <div className="text-sm text-gray-600">
            🔥 {data.stats.currentStreak} day streak
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.attendanceRate}%</div>
            <Progress value={data.stats.attendanceRate} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {data.stats.attendanceRate >= 80 ? '✅ On track' : '⚠️ Below target'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.projectsCompleted}/{data.stats.totalProjects}
            </div>
            <Progress
              value={(data.stats.projectsCompleted / data.stats.totalProjects) * 100}
              className="mt-2"
            />
            <p className="text-xs text-gray-600 mt-1">Projects completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.averageScore}%</div>
            <Progress value={data.stats.averageScore} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              Grade: {calculateGrade(data.stats.averageScore)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.achievements.length}</div>
            <p className="text-xs text-gray-600 mt-1">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Proficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.skills.slice(0, 6).map((skill) => (
              <div key={skill.skillName}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{skill.skillName}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{skill.level}</Badge>
                    <span className="text-sm text-gray-600">
                      {skill.proficiencyScore}%
                    </span>
                  </div>
                </div>
                <Progress value={skill.proficiencyScore} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Award className="h-8 w-8 text-indigo-600" />
                <div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

// ============================================
// 7. components/AttendanceQRScanner.tsx
// ============================================
// ============================================
// 8. lib/cron-jobs.ts - Background Jobs
// ============================================
