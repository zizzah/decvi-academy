'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Trophy, Star, Target, Flame, Calendar } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  type: string
  earnedAt: string
  points: number
  icon?: string
}

interface AchievementsData {
  achievements: Achievement[]
  totalPoints: number
  totalAchievements: number
  recentAchievements: Achievement[]
}

export default function AchievementsPage() {
  const router = useRouter()
  const [data, setData] = useState<AchievementsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAchievements() {
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

        // Fetch achievements
        const response = await fetch(`/api/students/${studentId}/achievements`)
        if (!response.ok) {
          throw new Error('Failed to fetch achievements')
        }

        const achievementsData = await response.json()
        setData(achievementsData)
      } catch (error) {
        console.error('Failed to fetch achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [router])

  const getAchievementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'attendance':
        return <Calendar className="w-6 h-6" />
      case 'project':
        return <Target className="w-6 h-6" />
      case 'streak':
        return <Flame className="w-6 h-6" />
      case 'grade':
        return <Star className="w-6 h-6" />
      default:
        return <Award className="w-6 h-6" />
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'attendance':
        return 'from-blue-500 to-blue-600'
      case 'project':
        return 'from-green-500 to-green-600'
      case 'streak':
        return 'from-orange-500 to-orange-600'
      case 'grade':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Failed to load achievements</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Track your progress and celebrate your accomplishments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
              <Trophy className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data.totalAchievements}</div>
              <p className="text-xs text-gray-600 mt-1">Badges earned</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data.totalPoints}</div>
              <p className="text-xs text-gray-600 mt-1">Achievement points</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Award className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{data.recentAchievements.length}</div>
              <p className="text-xs text-gray-600 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.achievements.length > 0 ? (
            data.achievements.map((achievement) => (
              <Card key={achievement.id} className="border-blue-100 hover:shadow-lg transition">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getAchievementColor(achievement.type)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">
                      {getAchievementIcon(achievement.type)}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {achievement.name}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {achievement.type}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{achievement.points} pts</span>
                    </div>
                    <div className="text-gray-500">
                      {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements yet</h3>
              <p className="text-gray-600 mb-4">
                Start completing assignments and attending classes to earn your first achievement!
              </p>
            </div>
          )}
        </div>

        {/* Recent Achievements Section */}
        {data.recentAchievements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              {data.recentAchievements.map((achievement) => (
                <Card key={achievement.id} className="border-green-100 bg-green-50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getAchievementColor(achievement.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <div className="text-white">
                        {getAchievementIcon(achievement.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <Star className="w-4 h-4" />
                        +{achievement.points} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
