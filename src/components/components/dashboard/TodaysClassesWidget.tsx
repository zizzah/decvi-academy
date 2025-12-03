import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

interface ClassItem {
  id: string
  title: string
  topic: string
  instructor: string
  scheduledAt: string
  deliveryMode: string
  duration: number
  zoomLink?: string
  hasCheckedIn: boolean
  checkInTime?: string
  attendanceStatus?: string
  isLiveClass?: boolean
  status?: string
}

interface TodaysClassesWidgetProps {
  studentId: string
  onCheckIn: () => void
}

export function TodaysClassesWidget({ studentId, onCheckIn }: TodaysClassesWidgetProps) {
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
            <span>{"Today's Classes"}</span>
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