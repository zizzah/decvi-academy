import React, { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

interface ClassItem {
  id: string
  title: string
  topic: string
  instructor: string
  scheduledAt: string
  deliveryMode: string
  duration: number
  hasCheckedIn: boolean
}

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
}

export function CheckInModal({ isOpen, onClose, studentId }: CheckInModalProps) {
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
        const data = await response.json()
        const availableClasses = data.classes.filter((cls: ClassItem) => !cls.hasCheckedIn)
        setClasses(availableClasses)
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

          <div className="text-xs text-gray-500">
            {location ? (
              <span className="text-green-600">✓ Location captured</span>
            ) : (
              <span className="text-gray-400">📍 Location not available</span>
            )}
          </div>

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